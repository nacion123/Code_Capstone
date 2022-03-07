const express = require('express')
const router = express.Router()
const { ensureGuest, ensureAuth } = require("../middleware/checkauth")
const authenticate = require('../controllers/authenticate')
const { validate } = require('../functions/validate')
const validationResult = require('../controllers/validationResult')
const  { checkEmailExist }  = require("../middleware/checkEmailExist")
const  { checkLicenseExist }  = require("../middleware/checkLicenseExist")
const  { verified }  = require("../middleware/verified")
const generateUserId = require('../functions/generateuserid')
const mysql = require('mysql2')
const configDB = require('../config/configDB')
const connection = mysql.createConnection(configDB.connection)
const bcrypt = require('bcrypt')
const saltRounds = 10
const {v4 : uuidv4} = require('uuid')

router.get('/admin/login', ensureGuest, authenticate.getDoctorLogin)

router.get('/admin/register', ensureGuest, authenticate.getAdminRegister)

router.post('/admin/register', ensureGuest, authenticate.postAddNewDoctor);

router.post('/admin/login', ensureGuest, authenticate.postDoctorLogin)

router.get('/logout', ensureAuth, authenticate.logout)

router.get('/forget', ensureGuest, authenticate.getForget)

router.post('/forget', ensureGuest, checkEmailExist, authenticate.postForget)

router.get('/forget/:token', ensureGuest, authenticate.getResetPassword)

router.put('/forget/:token', ensureGuest, validate('Password'), authenticate.putResetPassword)

router.get('/verifyaccount', ensureGuest, authenticate.getVerifyAccountAgain)

router.put('/verifyaccount', ensureGuest, checkEmailExist, authenticate.putVerifyAccountAgain)

router.get('/verifyaccount/:token', ensureGuest, authenticate.getVerifyAccount)

router.get('/forpass', ensureGuest, authenticate.getForpass)

module.exports = router