//load user model and mysql
const mysql = require('mysql2')
const configDB = require('../config/configDB')
const connection = mysql.createConnection(configDB.connection)

module.exports = {
    checkEmailExist: async function(req, res, next){
        let promise = new Promise((resolve, reject) => {
            const selectDQuery = "SELECT EMAIL FROM DOCTOR WHERE EMAIL = ?"
            const selectAQuery = "SELECT EMAIL FROM HADMIN WHERE EMAIL = ?"
    
                    connection.query(selectDQuery, [req.body.email], (err, drows)=>{
                        if(err){
                            reject(err)
                        }else if(!drows.length){
                            connection.query(selectAQuery, [req.body.email], (err, arows)=>{
                                if(err){
                                    reject(err)
                                }else if(!arows.length){
                                    req.flash('error', 'No Email exist')
                                    resolve(res.redirect('doctor/login'))
                                } else {
                                    resolve(next())
                                }
                            })
                        } else {
                            resolve(next())
                        }
                    })
        })
        let result = await promise
        return result
    },
}