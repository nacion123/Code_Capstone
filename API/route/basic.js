const express = require('express')
const router = express.Router()
const { ensureGuest } = require('../middleware/checkauth')
const basic = require('../controllers/basic')

router.get(['/', '../views/admin/login'], ensureGuest, basic.getHome)

module.exports = router