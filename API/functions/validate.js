const { body } = require('express-validator')

module.exports.validate = function(method){
    switch(method){
        case 'Doctor-Signup': { //not signup actually, registeration of doctor by admin
            const time = new RegExp('^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$')
            return [
                body('fname', 'Name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                body('mname', 'Name can only contain letters and must be 3 characters long. ').optional({checkFalsy:true}).escape().trim().isAlpha(),
                body('lname', 'Name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                body('email', 'Must enter valid email. ').exists({checkFalsy:true}).escape().trim().isEmail().normalizeEmail(),
                body('password', 'Password must be 4 characters long. ').exists({checkFalsy:true}).isLength({min:4, max:100}),
            ]
        }
        case 'Admin-Edit': {
            const time = new RegExp('^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$')
            return [
                body('fname', 'Name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                body('mname', 'Name can only contain letters and must be 3 characters long. ').optional({checkFalsy:true}).escape().trim().isAlpha(),
                body('lname', 'Name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                // body('email', 'Must enter valid email. ').exists({checkFalsy:true}).escape().trim().isEmail().normalizeEmail(),
                body('fee', 'Fee must a number. ').optional({checkFalsy:true}).escape().trim().isInt(),
                // body('contact', 'Enter a valid phone number. ').exists({checkFalsy:true}).isInt().isLength({min:11, max:15}),
            ]
        }
        case 'Password': {
            return [
                body('newpassword', 'Password must be 4 characters long!').exists().isLength({min:4, max:100}),
            ]
        }
        case 'Appointment': {
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var d = new Date();
            var monthName=months[d.getMonth()]+'-'+d.getDate();
            return [
                body('date', 'Enter a valid date').exists({checkFalsy:true}).isBefore('date', monthName),
            ]
        }
        default:
            throw new Error('Nothing to Validate')
    }
}