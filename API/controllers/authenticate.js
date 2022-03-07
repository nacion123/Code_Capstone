const mysql = require('mysql2')
const configDB = require('../config/configDB')
const connection = mysql.createConnection(configDB.connection)
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10
const { resetpassword } = require('../functions/resetpassword')
const { sendmail } = require('../functions/sendmail')
const generateUserId = require('../functions/generateUserId') 

module.exports = {

    getDoctorSignup: function(req, res, next){
        return res.render('../views/doctor/register')
    },

    getDoctorLogin: function(req, res, next){
        res.render('../views/admin/login')
    },

    getAdminRegister: function(req, res, next){
        res.render('../views/admin/register')
    },

    postAddNewDoctor: function(req, res, next){
        const data = req.body
    
        connection.query("SELECT * FROM DOCTOR WHERE EMAIL = ?",[data.email], function(error, rows, fields){
            if(error){
                req.flash('error', error)
                res.redirect('/authenticate/admin/login')  
            }
            if(rows.length){
                req.flash('error', 'That email is already taken.')
                res.redirect('/authenticate/admin/login')  
            }else{
                generateUserId()
                .then(function(id){
                    data.Doctor_id = id
                    const insertDrQuery = "INSERT INTO DOCTOR(DOCTOR_ID, FNAME, MNAME, LNAME, EMAIL, PASS ) VALUES ( ?, ?, ?, ?, ?, ?)"
                    bcrypt.hash(data.pass, saltRounds, function(err, hash) {
                        connection.query(
                            insertDrQuery,
                            [data.Doctor_id, req.body.fname,  req.body.mname,  req.body.lname,  req.body.email, hash],
                            function(Drerr, Drrows){
                                if(Drerr){
                                    console.log(Drerr)
                                }else{
                                    req.flash('success', 'Successfully Register Admin')
                                    res.redirect('/authenticate/admin/login')      
                                }
                            }
                        )
                    })	
                })
                .catch((err) => console.log(err))
            }	
        })
    },


    postDoctorLogin: passport.authenticate('local-login-doctor', {
        successRedirect : '/admin/equipment', 
        failureRedirect : 'login', 
        failureFlash : true 
    }),

    logout: function(req, res, next){ 
        req.logout()
        req.session.passport.user = null;
        res.redirect("/authenticate/admin/login")
    },

    getForget: function(req, res, next){
        return res.render('../views/basic/forget')
    },

    getHome: function(req, res, next){
        return res.render('../views/basic/home')
    },

    getForpass: function(req, res, next) {
        return res.render('../views/basic/postforget')
    },

    putForpass: function(req, res, next) {
        if(req.body.newpassword!=req.body.confirmpassword){
            req.flash('error', 'Password does not match with confirmatory password!')
            return res.redirect('/authenticate/Forpass/')
        }else{
            const email = decode.email
            const hash = bcrypt.hashSync(req.body.newpassword, saltRounds)
            if(resetpassword(email, hash)){
                req.flash('success', 'Password Changed!')
                return res.redirect('/authenticate/admin/login')
            }else{
                req.flash('error', 'User does not exist')
                return res.redirect('/authenticate/Forpass')
            }
        }
    },

    postForget: function(req, res, next){
        const reciever = req.body.email
        const subject = 'Reset Password'

        const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY, { expiresIn: '1h' }) 
        const url = `http://localhost:3030/authenticate/forget/${token}`;
        const message = `Please click this link to reset your password(link is only valid for an hour): <a href="${url}">Reset Password</a>`
        sendmail(reciever, subject, message)
        req.flash('success', `${url}`)
        return res.redirect('/authenticate/forpass')
    },

    getResetPassword: function(req, res, next){
        jwt.verify(req.params.token, process.env.SECRET_KEY, function(error, decode){
            if(error){
                console.log(error.name)
                console.log(error.message)
                console.log(error.expiredAt)
                req.flash('error', 'Invalid Token!')
                return res.redirect('/authenticate/forget')
            }else{
                return res.render('../views/basic/resetpassword',{ token: req.params.token })
            }
        })
    },

    putResetPassword: function(req, res, next){
        jwt.verify(req.params.token, process.env.SECRET_KEY, function(error, decode){
            if(error){
                console.log(error.name)
                console.log(error.message)
                console.log(error.expiredAt)
                req.flash('error', 'Invalid Token!')
                return res.redirect('/authenticate/forget')
            }else if(req.body.newpassword!=req.body.confirmpassword){
                req.flash('error', 'Password does not match with confirmatory password!')
                return res.redirect('/authenticate/forget/'+req.params.token)
            }else{
                const email = decode.email
                const hash = bcrypt.hashSync(req.body.newpassword, saltRounds)
                if(resetpassword(email, hash)){
                    req.flash('success', 'Password Changed!')
                    return res.redirect('/authenticate/admin/login')
                }else{
                    req.flash('error', 'User does not exist')
                    return res.redirect('/authenticate/forget')
                }
            }
        })
    },

    getVerifyAccount: function(req, res, next){
        jwt.verify(req.params.token, process.env.SECRET_KEY, function(error, decode){
            if(error){
                console.log(error.name)
                console.log(error.message)
                console.log(error.expiredAt)
                req.flash('error', 'Invalid Token!')
                return res.redirect('/authenticate/admin/login')
            }else{
                const email = decode.email
                connection.query("UPDATE DOCTOR SET VERIFIED=TRUE WHERE EMAIL = ?",
                    [email],
                    function(error, rows, fields){
                        if(error){
                            console.log(error)
                            req.flash('error', 'Some error occurred!')
                            return res.redirect('/authenticate/admin/login')
                        }else if(rows.changedRows){
                            req.flash('success', 'Account verified')
                            return res.redirect('/authenticate/admin/login')
                        }
                    })
            }
        })
    },

    getVerifyAccountAgain: function(req, res, next){
        return res.render('../views/basic/verifyaccount')
    },

    putVerifyAccountAgain: function(req, res, next){
        const reciever = req.body.email
        const subject = 'Verify Account'

        const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY) 
        const url = `http://localhost:1010/authenticate/verifyaccount/${token}`;
        const message = `Please click this link to verify your account: <a href="${url}">Verify Account</a>`
        
        sendmail(reciever, subject, message)
        req.flash('info', 'Email sent! Do not forget to check your spam')
        return res.redirect('/authenticate/admin/login')
    },
}