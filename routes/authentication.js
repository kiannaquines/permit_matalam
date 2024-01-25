import express from 'express'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose';
import User from '../models/User.js';
import { checkAuthenticated } from '../config/authentication-checker.js';
import passport from 'passport';
import initializePassport from '../config/passport-config.js';
import { dbconnection } from '../config/db.js';

var db = dbconnection();

initializePassport(passport,db)

const router = express.Router()


router.get('/',checkAuthenticated,(req, res) => {
    res.render('login')
});


router.post("/login", checkAuthenticated, (req, res, next) => {
    passport.authenticate('local', { 
      failureFlash: true 
    }, (err, user, info) => {
      if(info && info.message == 'logged_in'){
        req.logIn(user, (err) => {
          
            if (err) {
                return next(err);
            }

            if(user.userType == "1"){
              res.json({message:"success_login"})
              return;
            }else{
              res.json({message:"success_login_user"})
              return;
            }
        });
      }


      if(info && info.message == 'password_not_matched' || info.message == 'username_not_exists'){
        res.json({message:"Username or Password is incorrect, please try again"})
      }

      if(info && info.message == 'not_activated'){
        res.json({message:"Your account is not activated, please wait untill 24 hours."})
      }


      if(info && info.message == 'system_error'){
        res.json({message:"System error, please try again"})
      }
    })(req, res, next);
});

router.get('/register/',checkAuthenticated, (req, res) => {
    res.render('register')
});

router.post('/register/',checkAuthenticated, async (req,res) => {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userName = req.body.userName;
    const passwordConfirm = req.body.password2;
    const password = req.body.password;
    const municipality = req.body.municipality;
    const province = req.body.province;
    const barangay = req.body.barangay;
    const postalCode = req.body.postalCode;

   
    const hashedPassword = await bcrypt.hash(password,10)
   
    if(firstName == "" || lastName == "" || userName == "" || password == "" || passwordConfirm == "" || municipality == "" || province == "" || barangay == "" || postalCode == ""){
        res.json({empty_fields:'empty_fields'})

        return;
    }
    
    if(password != passwordConfirm){
        res.json({not_matched:'password_do_not_matched'})
        return;
    }


    User.findOne({ username: userName })
    .then((existingUser) => {
      if (existingUser) {
        res.json({used_username:'already_used_username'})
        return;
      } else {
        const newUser = new User({
          username: userName,
          firstName: firstName,
          lastName: lastName,
          password: hashedPassword,
          municipality: municipality,
          province: province,
          barangay: barangay,
          postalCode: postalCode,
        });
  
        newUser.save()
          .then(() => {
            res.json({ success: 'success_registration' });
          })
          .catch((saveError) => {
            console.error('Error saving new user:', saveError);
            res.status(500).json({ error: 'internal_server_error' });
          });
      }
    })
    .catch((error) => {
      console.error('Error checking username:', error);
      mongoose.disconnect();
    });

    
});


router.get('/logout',(req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

export default router;