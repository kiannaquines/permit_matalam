import express from "express";
import { checkNotAuthenticated }  from '../config/authentication-checker.js';
import Clearance from "../models/Clearance.js";
import Certificate from "../models/Certificate.js";

const router = express.Router()

router.get('/clearance-application-form/',checkNotAuthenticated,(req, res) => {
    Clearance.find({application_status:'Approved'}).then(clearance_applications => {
        res.render('form_clearance',{loggedin_user:req.user.firstName,applications:clearance_applications, type:req.user.userType})
    }).catch(error => {
        res.json({message:'error_fecting_data'})
    });
});

router.get('/certificate-application-form/',checkNotAuthenticated,(req, res) => {
    Certificate.find({application_status:'Approved'}).then(certificate_applications => {
        res.render('form_certificate',{loggedin_user:req.user.firstName,applications:certificate_applications, type:req.user.userType})
    }).catch(error => {
        res.json({message:'error_fecting_data'})
    });
});

router.get('/print-form-certificate/:id',checkNotAuthenticated, async (req, res) => {
    const check_application = await Certificate.findById(req.params.id)

    res.render('pdf_templates/cert_form',{data:check_application,type:req.user.userType})
});

router.get('/print-form-clearance/:id',checkNotAuthenticated, async (req, res) => {
    const check_application = await Clearance.findById(req.params.id)

    res.render('pdf_templates/clearance_form',{data:check_application,type:req.user.userType})
});

export default router;