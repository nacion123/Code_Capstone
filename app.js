const express = require('express')
const session = require('express-session')
const expressMysqlSession = require('express-mysql-session')(session)
const bodyParser=require('body-parser')
const passport= require('passport')
const dotenv = require('dotenv')
const morgan = require('morgan')
const methodOverride = require('method-override')
const flash = require("connect-flash")
const fileUpload = require('express-fileupload')
const configDB = require('./API/config/configDB')

/*  initializing packages   */

//requiring routes
const basicRoutes = require('./API/route/basic')
const authRoutes = require('./API/route/authenticate')
const adminRoutes = require('./API/route/admin')
const errorRoutes = require('./API/route/error')

//initializing app
const app = express()

//body-parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//setting view engine
app.set('view engine', 'ejs');

//setting public directory
app.use(express.static(__dirname + '/public'));

// pass passport for configuration
require('./API/config/passport')(passport); 

//cookier parser
// app.use(cookieParser())
app.use(fileUpload());

// required for passport <must come before passport.session>
app.use(
    session({
        name: 'secret-session',
        secret: 'thisprojectisgonnatakeourlife',
        store: new expressMysqlSession(configDB.connection),
        // maxAge: 1*1*1*1*1*30*1000 ,
        resave: false,
        saveUninitialized: false,
        cookie:{
            // httponly: true, //put here some values
            originalMaxAge: 1*1*1*24*60*60*1000, 
            //originalMaxAge: YEARS*MONTHS*DAYS*HOURS*MINUTES*SECONDS*MILLISECONDS
            // secure: true
        }
    })
);

//passport configuration
app.use(passport.initialize())
app.use(passport.session())

//custom methodOverride
app.use(
    methodOverride(function (req, res) {
        if(req.body && typeof req.body === 'object' && '_method' in req.body){
            // look in urlencoded POST bodies and delete it
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)

//requiring env variables in process.env
dotenv.config({ path: './API/config/config.env' })

//declaring variables
const PORT = process.env.PORT || 3030
const NODE_ENV = process.env.NODE_ENV

//setting morgan dev if we are in development mode
if ( NODE_ENV === 'development' )
{
    app.use( morgan('dev') )
}

//initialize flash
app.use(flash())

//declaring global variables
app.use(function(req,res,next){
    res.locals.user=req.user || null;
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success');
    res.locals.info=req.flash('info');
    // const status = err.status || 500; 
    next();
});

//routing all request
app.use('/',basicRoutes)
app.use('/authenticate',authRoutes)
app.use('/admin',adminRoutes)
app.use('/error',errorRoutes)


//After the execution this will tell where the port started
app.listen(
    PORT,
    () => { console.log(`Server started at ${PORT} in ${NODE_ENV} mode.`) } // use tilde ` to parse ${variable}
)