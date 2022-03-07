const { validationResult } = require('express-validator')

module.exports = {

    doctorEdit: function(req, res ,next){
        const errors = validationResult(req); 
        if(!errors.isEmpty()){
            const errlist = errors.array().map(error => error.msg)
            req.flash('error', errlist)
            return res.redirect('/admin/profile')
        }
        next()
    },

    emailOrPasswordChange: function(req, res, next){
        const errors = validationResult(req); 
        if(!errors.isEmpty()){
            const errlist = errors.array().map(error => error.msg)
            req.flash('error', errlist)
            return res.redirect('dashboard')
        }
        next()
    },
}