const express = require("express");
const router = express.Router();
const { ensureDoctor } = require("../middleware/checkauth");
const admin = require("../controllers/admin");
const { validate } = require("../functions/validate");
const validationResult = require("../controllers/validationResult");
const mysql = require("mysql2");
const configDB = require("../config/configDB");
const connection = mysql.createConnection(configDB.connection);
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//This will redirect to profile page
router.get("/profile", ensureDoctor, admin.getDoctorProfile);
//This will redirect to update profile page
router.get("/updateprofile", ensureDoctor, admin.getDoctorsProfile);

router.put(
  "/updateprofile",
  ensureDoctor,
  validate("Admin-Edit"),
  validationResult.doctorEdit,
  admin.putDoctorProfile
);

//This method will assign time and date to the patient
router.put("/equipment/assigntime/:id", admin.putAppointment);
router.put("/equipment/email/:id", ensureDoctor, admin.postEmail);
router.post("/addnewitem", ensureDoctor, admin.postNewitem);
router.post("/addnewroom", ensureDoctor, admin.postNewRoom);
//This will redirect to email change page
router.get("/emailchange", ensureDoctor, admin.getEmailChange);

router.get("/addroom", ensureDoctor, admin.getAddRoom);

//This method will redirect to dashboard page 
router.get("/dashboard/:id", ensureDoctor, (req, res) => {
  connection.query("SELECT ROOM_ID, ROOM_NUM, FLOOR, ROOM_TYPE, ROOM_PERSON FROM ROOM", [], function(error, rows, fields){
    if(error){
        console.log(error)
    }else{
        return res.render('../views/admin/dashboard', { rows3: rows})
    }
})
});

//This method will redirect to dashboard page 
router.post("/dashboard/:id", ensureDoctor, (req, res) => {
  const data = req.body
  const newID = uuidv4();
  let query="insert into item1 (ITEM1_ID, floor, COND, PRICE, ROOM_ID = ? ) values (?,?,?,?,?)"
  connection.query(query,
      [newID, req.body.roomtype, req.body.roomfloor, req.body.roomperson, req.user.room_id],
      (err, rows) =>{
          if(err){
              req.flash('error', 'Error in Room post')
              console.log('Err in appt post: '+err)
              res.redirect('/admin/equipment')
          }
          else{
              req.flash('success', 'Room Schedule Successfully Added')
              console.log("Room post: "+rows)
              res.redirect("/admin/equipment")
          }
      })
});


//This method will change doctors email
router.put(
  "/emailchange",
  ensureDoctor,
  validationResult.emailOrPasswordChange,
  admin.putEmailChange
);
//This will redirect to password change page
router.get("/passwordchange", ensureDoctor, admin.getPasswordChange);

//This method will change user password
router.put(
  "/passwordchange",
  ensureDoctor,
  validate("Password"),
  validationResult.emailOrPasswordChange,
  admin.putPasswordChange
);

//This method will redirect to all appointment made by user
router.get("/equipment", ensureDoctor, (req, res) => {
  connection.query(
    "SELECT ROOM_ID, ROOM_NUM, FLOOR, ROOM_TYPE, ROOM_PERSON FROM ROOM WHERE MAINTENANCE=FALSE",
    [],
    (err, rows) => {
      if (err) console.log(err);
      else if (rows.length >= 0) {
        connection.query(
          "SELECT ROOM_ID, ROOM_NUM, FLOOR, ROOM_TYPE, ROOM_PERSON FROM ROOM",
          [],
          (err2, row2) => {
          if(err2){
            console.log("err in presc id 2: "+err2)
            res.redirect("/admin/dashboard")
          }else if(row2.length >= 0){
            connection.query("SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE MAINTENANCE=TRUE", [], function(err3, row3, fields){
              if(err3){
                  console.log(err3)
              }else if(row3.length >= 0){
                const search = '%' + req.body.searchkeyword + '%';
                const sql = "SELECT ITEM_ID, NAME, BRAND FROM ITEM WHERE NAME like ?";
                const values = [search, search];
                connection.query(sql, values, function(err, result) {
                  if(err){
                    console.log(err)
                  }else{
                    return res.render("../views/admin/equipment", {
                      row: rows,
                      row2: row2,
                      row3: row3,
                      tracing: result,
                      id: "",
                    });
                  }
                });
              }
            })
          }
        })
      } else {
        console.log("no equipment");
        req.flash("alert", "No Item in list");
        res.render("../views/admin/equipment", {
          row: rows,
          id: "",
        });
        // res.redirect('/doctor/dashboard')
      }
    }
  );
});

router.get("/search", ensureDoctor, (req, res) => {

  connection.query(
    "SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE MAINTENANCE=FALSE ORDER BY LIFESPAN ASC",
    [],
    (err, rows) => {
      if (err) console.log(err);
      else if (rows.length >= 0) {
        connection.query(
          "SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE MAINTENANCE=TRUE AND NOT_PENDING=FALSE",
          [],
          (err2, row2) => {
          if(err2){
            console.log("err in presc id 2: "+err2)
            res.redirect("/admin/dashboard")
          }else if(row2.length >= 0){
            connection.query("SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE NOT_PENDING=TRUE", [], function(err3, row3, fields){
              if(err3){
                  console.log(err3)
              }else if(row3.length >= 0){
                let { term } = req.query;
                // Make lowercase
                term = term.toLowerCase();
                const search = '%' + term + '%';
                const sql = "SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE NAME like ? AND MAINTENANCE=FALSE";
                const values = [search, search];
                connection.query(sql, values, function(err, result) {
                  if(err){
                    console.log(err)
                  }else{
                    return res.render("../views/admin/results", {
                      row: rows,
                      row2: row2,
                      row3: row3,
                      tracing: result,
                      id: "",
                    });
                  }
                });
              }
            })
          }
        })
      } else {
        console.log("no equipment");
        req.flash("alert", "No Item in list");
        res.render("../views/admin/equipment", {
          row: rows,
          id: "",
        });
        // res.redirect('/doctor/dashboard')
      }
    }
  );
})

router.get("/hint", ensureDoctor, (req, res) => {
  connection.query(
    "SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE MAINTENANCE=FALSE ORDER BY LIFESPAN ASC",
    [],
    (err, rows) => {
      if (err) console.log(err);
      else if (rows.length >= 0) {
        connection.query(
          "SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE MAINTENANCE=TRUE AND NOT_PENDING=FALSE",
          [],
          (err2, row2) => {
          if(err2){
            console.log("err in presc id 2: "+err2)
            res.redirect("/admin/dashboard")
          }else if(row2.length >= 0){
            connection.query("SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE NOT_PENDING=TRUE", [], function(err3, row3, fields){
              if(err3){
                  console.log(err3)
              }else if(row3.length >= 0){
                let { term } = req.query;
                // Make lowercase
                term = term.toLowerCase();
                const search = '%' + term + '%';
                const sql = "SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION, NOT_PENDING=FALSE FROM ITEM WHERE NAME like ? AND MAINTENANCE=TRUE";
                const values = [search, search];
                connection.query(sql, values, function(err, result) {
                  if(err){
                    console.log(err)
                  }else{
                    return res.render("../views/admin/maintenance", {
                      row: rows,
                      row2: row2,
                      row3: row3,
                      tracing: result,
                      id: "",
                    });
                  }
                });
              }
            })
          }
        })
      } else {
        console.log("no equipment");
        req.flash("alert", "No Item in list");
        res.render("../views/admin/equipment", {
          row: rows,
          id: "",
        });
        // res.redirect('/doctor/dashboard')
      }
    }
  );
})

router.get("/find", ensureDoctor, (req, res) => {
  connection.query(
    "SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE MAINTENANCE=FALSE ORDER BY LIFESPAN ASC",
    [],
    (err, rows) => {
      if (err) console.log(err);
      else if (rows.length >= 0) {
        connection.query(
          "SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE MAINTENANCE=TRUE AND NOT_PENDING=FALSE",
          [],
          (err2, row2) => {
          if(err2){
            console.log("err in presc id 2: "+err2)
            res.redirect("/admin/dashboard")
          }else if(row2.length >= 0){
            connection.query("SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE NOT_PENDING=TRUE", [], function(err3, row3, fields){
              if(err3){
                  console.log(err3)
              }else if(row3.length >= 0){
                let { term } = req.query;
                // Make lowercase
                term = term.toLowerCase();
                const search = '%' + term + '%';
                const sql = "SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE NAME like ? AND NOT_PENDING=TRUE";
                const values = [search, search];
                connection.query(sql, values, function(err, result) {
                  if(err){
                    console.log(err)
                  }else{
                    return res.render("../views/admin/details", {
                      row: rows,
                      row2: row2,
                      row3: row3,
                      tracing: result,
                      id: "",
                    });
                  }
                });
              }
            })
          }
        })
      } else {
        console.log("no equipment");
        req.flash("alert", "No Item in list");
        res.render("../views/admin/equipment", {
          row: rows,
          id: "",
        });
        // res.redirect('/doctor/dashboard')
      }
    }
  );
})

//This method will redirect to  set prescription page
router.get("/setprescription", ensureDoctor, (req, res) => {
  connection.query("SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE MAINTENANCE=FALSE AND NOT_PENDING=FALSE", [], function(error, rows, fields){
    if(error){
        console.log(error)
    }else{
        return res.render('../views/admin/setprescription', { rows3: rows})
    }
})
});

//This method will redirect to  room2 page
router.get("/room/:id", ensureDoctor, (req, res) => {
  connection.query("SELECT ROOM_ID, ROOM_NUM, FLOOR, ROOM_TYPE, ROOM_PERSON FROM ROOM", [], function(error, rows1, fields){
    if(error){
        console.log(error)
    }else{
      connection.query("SELECT ITEM1_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM1 WHERE MAINTENANCE=FALSE AND NOT_PENDING=FALSE", [], function(error, rows, fields){
        if(error){
            console.log(error)
        }else{
                return res.render('../views/admin/room2', { rows1: rows1, rows3: rows})
        }
      })
    }
})
});


//This method will redirect to  room2 page
router.get("/room3", ensureDoctor, (req, res) => {
  connection.query("SELECT ITEM2_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM2 WHERE MAINTENANCE=FALSE AND NOT_PENDING=FALSE", [], function(error, rows, fields){
    if(error){
        console.log(error)
    }else{
        return res.render('../views/admin/room3', { rows3: rows})
    }
})
});

//This method will redirect to dashboard page 
router.get("/dashboard", ensureDoctor, (req, res) => {
  connection.query(
    "SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE NOT_PENDING=FALSE;",
    [req.user.Specialization],
    (err, rows) => {
      if (err) console.log(err);
      else if (rows.length > 0) {
        return res.render("../views/admin/dashboard", {
          appointments: rows,
          id: "",
        });
      } else {
        console.log("no appointments");
        req.flash("alert", "No appointments in list");
        res.render("../views/admin/dashboard", {
          appointments: rows,
          id: "",
        });
        // res.redirect('/doctor/dashboard')
      }
    }
  );
});

//This method will redirect to the history page where a doctor can see all past patient
router.get("/prescribe/:id", ensureDoctor, (req, res) => {
  connection.query("SELECT ITEM_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE NOT_PENDING=FALSE", [], function(error, rows, fields){
    if(error){
        console.log(error)
    }else{
        return res.render('../views/admin/prescribe', { item: rows})
    }
})
});

//This method will add prescription to the specific patient
router.put("/prescribe/:id", ensureDoctor, (req, res) => {
  console.log("in PUT: " + req.params.id);
  connection.query(
    "update appointment set Appointment_Time=NOW(), Not_pending=true, Disease=?, Treatment=?, Day=?, Tue=?, Wed=?, Thu=?, Fri=?, Sat=?, Sun=?, Set_time=?, Medcount=?, Duration=?, DoctorName=?, DoctorLname=?, License=?, Doctor_id=? where Appointment_id=?",
    [
      req.body.Disease,
      req.body.Treatment,
      req.body.day,
      req.body.tue,
      req.body.wed,
      req.body.thu,
      req.body.fri,
      req.body.sat,
      req.body.sun,
      req.body.time,
      req.body.medcount,
      req.body.duration,
      req.user.Fname,
      req.user.Lname,
      req.user.Licensed,
      req.user.Doctor_id,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        req.flash("error", "Couldnt Prescribe");
        console.log(err);
        res.redirect("/admin/equipment");
      } else {
        req.flash("success", "Prescribed");
        console.log(result);
        res.redirect("/admin/equipment");
      }
    }
  );
});

//This method will redirect to the prescription page 
router.get("/prescriptions", ensureDoctor, (req, res) => {
  connection.query("SELECT ROOM_ID, ROOM_NUM, FLOOR, ROOM_TYPE, ROOM_PERSON FROM ROOM WHERE MAINTENANCE=TRUE", [], function(error, rows, fields){
    if(error){
        console.log(error)
    }else{
        return res.render('../views/admin/prescriptions', { rows2: rows})
    }
})
})

//This method will redirect to the prescription page where a doctor prescribe a specific patient
router.get("/prescription/:id", ensureDoctor, (req, res) =>{
  connection.query("select *, CONCAT(name) as Pname from appointment a, patient p where a.appointment_id=? and a.patient_id=p.username;", [req.params.id], (err, row) =>{
    if(err){
      console.log("Err in details id: "+err)
      res.redirect("/doctor/dashboard")
    } else {
      connection.query("select * from inpatient where appointment_id=?", [req.params.id], (err2, row2) => {
        if(err2){
          console.log("err in presc id 2: "+err2)
          res.redirect("/admin/dashboard")
        }
        else{
          console.log("Showing all details: "+row +","+ row2)
          res.render("../views/admin/details", {row:row, row2:row2})
        }
      })
    }
  })
})

//This method will redirect to the assign time page where a doctor can assign time and date to a specific patient
router.get("/equipment/email/:id", ensureDoctor, (req, res) => {
  connection.query(
    "SELECT ITEM1_ID, NAME, BRAND, COND, PRICE, LOCATION FROM ITEM WHERE MAINTENANCE=FALSE",
    [req.params.id],
    (err, row1) => {
      if (err) {
        console.log(err);
        res.redirect("/admin/dashboard");
      } else {
              res.render("../views/admin/assigntime.ejs", {
                row1: row1,
              });
      }
    }
  );
});

//This method will redirect to the assign time page where a doctor can assign time and date to a specific patient
router.get("/assigntime/:id", ensureDoctor, (req, res) => {
  connection.query(
    "SELECT ITEM1_ID, BRAND, COND, PRICE, LOCATION FROM ITEM1 WHERE MAINTENANCE=FALSE",
    [req.params.id],
    (err, row1) => {
      if (err) {
        console.log(err);
        res.redirect("/admin/dashboard");
      } else {
              res.render("../views/admin/assigntime.ejs", {
                row1: row1,
              });
      }
    }
  );
});

//This method will delete patient information in history page
router.get("/delete/:id", ensureDoctor, (req, res) => {
  connection.query(
    "update room set MAINTENANCE=true where room_id=?",
    [
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        req.flash("error", "Couldnt Prescribe");
        console.log(err);
        res.redirect("/admin/equipment");
      } else {
        req.flash("success", "Disposed");
        console.log(result);
        res.redirect("/admin/prescriptions");
      }
    }
  );
})

router.get("/maintenance/:id", ensureDoctor, (req, res) => {
  connection.query("DELETE FROM ITEM1 WHERE ITEM1_ID=?; ", [req.params.id], (err ,result) => {
    if(err){
        console.log(err)
    } else {
        req.flash("success", "Deleted Item")
        res.redirect("/admin/room/:id")
    }
})
})

router.get("/inventory/:id", ensureDoctor, (req, res) => {
  connection.query(
    "update item set Appointment_Time=NOW(), Maintenance=false, Doctor_id=? where item_id=?",
    [
      req.user.Doctor_id,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        req.flash("error", "Couldnt Prescribe");
        console.log(err);
        res.redirect("/admin/equipment");
      } else {
        req.flash("success", "Successfully Repaired");
        console.log(result);
        res.redirect("/admin/equipment");
      }
    }
  );
})

//This method will delete patient appointment information
router.get("/remove/:id", ensureDoctor, (req, res) => {
  connection.query("delete from room where room_id=?; ", [req.params.id], (err ,result) => {
      if(err){
          console.log(err)
      } else {
          req.flash("success", "Deleted Item")
          res.redirect("/admin/prescriptions");
      }
  })
})

module.exports = router;
