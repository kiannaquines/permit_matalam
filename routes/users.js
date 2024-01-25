import express from 'express'
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { checkNotAuthenticated }  from '../config/authentication-checker.js';

const router = express.Router()

router.get('/users',checkNotAuthenticated,(req, res) => {
    User.find({userType:"2"}).then(users => {
        res.render('users',{loggedin_user:req.user.firstName,users_obj:users, type:req.user.userType})  
    }).catch(error => {
        console.log(error)
    })
});

router.get('/user-list',checkNotAuthenticated,(req, res) => {
    User.find({userType:"2"}).then(users => {
        res.render('user-list',{loggedin_user:req.user.firstName, userlist: users, type:req.user.userType})
    }).catch(error => {
        console.log(error)
    })
});

router.get('/add-user/',checkNotAuthenticated,(req, res) => {
    res.render('forms/add-member-form',{loggedin_user:req.user.firstName, type:req.user.userType})
});

router.post('/add-user/',checkNotAuthenticated, async (req, res) => {
    const {uname, fname, lname, pword, province,municipality,barangay,pcode} = req.body
    const hashed_password = await bcrypt.hash(pword,10)

    const user = new User({
        username: uname,
        firstName: fname,
        lastName: lname,
        password: hashed_password,
        municipality: municipality,
        province: province,
        barangay: barangay,
        postalCode: pcode,
    });

    User.findOne({username:uname}).then(existingUser => {

        if(existingUser){
            res.json({message:'user_existed'})
            return;
        }

        user.save().then(user => {
            res.json({message:'user_added'})
    
        }).catch((error) => {
            console.log(error)
            res.json({message:'error_adding_user'})
        });

    });
});


router.get('/edit-user/:id',checkNotAuthenticated,(req, res) => {

    User.findOne({_id:req.params.id}).then(user => {
        res.render('forms/edit-member-form',{loggedin_user:req.user.firstName,user_data:user, type:req.user.userType})
    }).catch(error => {
        res.json({message:'fetching data cannot be done'})
    });
});

router.post('/edit-user/',checkNotAuthenticated, async (req, res) => {
    const user_check = await User.findById(req.body.user_id)
    if(user_check){
        const updateUser = await User.findByIdAndUpdate(req.body.user_id,
            {
              $set: {
                username: req.body.uname,
                firstName: req.body.fname,
                lastName: req.body.lname,
                province: req.body.province,
                municipality: req.body.municipality,
                barangay: req.body.barangay,
                postalCode: req.body.pcode,
              },
            },
            { new: true }
        );
        res.json({message:'user_updated'})
        return;
    }

    res.json({message:'not_user_existed'})
    return;
});


router.post('/activate',checkNotAuthenticated, async (req, res) => {
    const check_user = await User.findById(req.body.id)

    if(check_user.userStatus == 'Active'){
        res.json({message:'user_already_activated'})
        return;
    }

    if(check_user){
        await User.findByIdAndUpdate(req.body.id,{$set: {userStatus: "Active"}})
        res.json({message:'user_activated'})
    }
});


router.post('/remove/',checkNotAuthenticated, async (req, res) => {
    const check_user = await User.findById(req.body.id)

    if(check_user){
        await User.findByIdAndDelete(req.body.id)
        res.json({message:'user_deleted'})
        return;
    }

    res.json({message:'user_not_found'})
    return;
});



router.get('/view-user/:id',checkNotAuthenticated,(req, res) => {
    User.findOne({_id:req.params.id}).then(user => {
        res.render('view_details',{loggedin_user:req.user.firstName,user_data:user, type:req.user.userType})
    }).catch(error => {
        res.json({message:'fetching data cannot be done'})
    });
});

export default router;