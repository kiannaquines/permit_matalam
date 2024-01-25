import express, { application } from 'express';
import session from 'express-session';
import passport from 'passport';
import { checkNotAuthenticated }  from './config/authentication-checker.js';
import authRouter from './routes/authentication.js'
import certRouter from './routes/certificate.js'
import reportRouter from './routes/generate_report.js'
import clearanceRouter from './routes/clerance.js'
import userRouter from './routes/users.js'
import generatePDFReport from './routes/generate_permit.js'
import generatePDFForm from './routes/generate_form.js';
import clientRouter from './routes/client.js';
import helmet from 'helmet';

import Clearance from './models/Clearance.js';
import Certificate from './models/Certificate.js';
import User from './models/User.js';

// app details
const app = express()
const port = 8080

// Middlewares
app.set('view engine','ejs')
app.use(express.static('node_modules'));
app.use(express.static("public"))
app.use(express.static("assets"))
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
    xFrameOptions: false,
}));
app.use((req, res, next) => {
    res.locals.page_route = req.path;
    next();
});
app.use(session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge:  7 * 24 * 60 * 60 * 1000 },
}));

app.use(passport.initialize())
app.use(passport.session())


// Routes
app.use(authRouter)
app.use(userRouter)
app.use(certRouter)
app.use(clearanceRouter)
app.use(generatePDFReport)
app.use(generatePDFForm)
app.use(reportRouter)
app.use('/client',clientRouter)

app.get('/dashboard',checkNotAuthenticated, async (req, res) => {
    var cert_data;
    var clear_data;

    await Certificate.find({}).then(applications => {
        cert_data = applications;
    });

    await Clearance.find({}).then(applications => {
        clear_data = applications
    });



    var count_cert = await Certificate.countDocuments({})
    var count_user = await User.countDocuments({})
    var count_clear = await Clearance.countDocuments({})
    var count_all = count_cert + count_clear


    res.render('index',{loggedin_user:req.user.firstName, certificates:cert_data, clearances: clear_data, type:req.user.userType, count_all: count_all,count_cert:count_cert,count_clear:count_clear,count_user:count_user})
});

// listen port
app.listen(port); 








