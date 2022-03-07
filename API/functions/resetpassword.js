//load user model and mysql
const mysql = require('mysql2')
const configDB = require('../config/configDB')
const connection = mysql.createConnection(configDB.connection)

module.exports = {
    resetpassword: async function(email, hash, req){
        const queryArray = [hash, email]
        let promise = new Promise((resolve, reject) => {
            const selectDQuery = "UPDATE DOCTOR SET PASS = ? WHERE EMAIL = ?"
            const selectAQuery = "UPDATE HADMIN SET PASS = ? WHERE EMAIL = ?"
    
                    connection.query(selectDQuery, queryArray, (err, drows)=>{
                        if(err){
                            reject(err)
                        }else if(!drows.changedRows){
                            connection.query(selectAQuery, queryArray, (err, arows)=>{
                                if(err){
                                    reject(err)
                                }else if(!arows.changedRows){
                                    resolve(false)
                                }else{
                                    resolve(true)
                                }
                            })
                        }else{
                            resolve(true)
                        }
                    })
        })

        let result = await promise
        return result
    },
}