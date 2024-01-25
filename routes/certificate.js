import express from 'express'
import Certificate from '../models/Certificate.js';
import multer from 'multer';
import { checkNotAuthenticated }  from '../config/authentication-checker.js';
import {certificate_storage} from '../config/storage.js'

const router = express.Router()



const upload_certificate_requirements = multer({ storage: certificate_storage });


router.get('/add-certificate-application/',checkNotAuthenticated,(req, res) => {
    res.render('forms/add-certificate-form',{loggedin_user:req.user.firstName,user_profile:req.user.firstName,type:req.user.userType})
});

router.post('/add-certificate-application/',checkNotAuthenticated, upload_certificate_requirements.fields([
    { name: 'endoresment_file', maxCount: 1 },
    { name: 'completion_file', maxCount: 1 },
    { name: 'assessment_file', maxCount: 1 },
    { name: 'plan_file', maxCount: 1 },
    { name: 'fscr_file', maxCount: 1 },
]), (req,res) => {
    const {owner_name,establishment,contact_number,email,address,representative,type,area,storey} = req.body
    const endoresment_filename    = req.files.endoresment_file[0].filename
    const completion_filename     = req.files.completion_file[0].filename
    const assessment_filename     = req.files.assessment_file[0].filename
    const plan_filename           = req.files.plan_file[0].filename
    const fire_safety_filename           = req.files.fscr_file[0].filename

    const certificate_application = new Certificate({
        owner_name: owner_name,
        establishment_name: establishment,
        address: address,
        authorize_representative: representative,
        business_nature:type,
        total_floor: area,
        contact_number: contact_number,
        no_of_storey: storey,
        email_address: email,
        endorsement_filename: endoresment_filename,
        completion_filename: completion_filename,
        assessment_filename: assessment_filename,
        builtInPlan_filename: plan_filename,
        fileSafetyComplianceReport_filename: fire_safety_filename,
    });

    certificate_application.save().then(application => {
        res.json({message:'success_added_application'})
    }).catch(error => {
        res.json({message:'error_adding_application'})
        console.log(error)
    })
});

router.get('/certificate-application-list/',checkNotAuthenticated,(req, res) => {
    Certificate.find({application_status:'Approved'}).then(certificate_applications => {
        res.render('generate_certificate',{loggedin_user:req.user.firstName,applications:certificate_applications,type:req.user.userType})
    }).catch(error => {
        res.json({message:'error_fecting_data'})
    });
});

router.get('/review-certificate-application/:id',checkNotAuthenticated,(req, res) => {
    Certificate.findOne({_id:req.params.id}).then(application => {
        res.render('review_document_certificate',{loggedin_user:req.user.firstName,application:application,type:req.user.userType})
    }).catch(error => {
        console.log(error)
    })
});

router.get('/review-certificate-application/:id/:type',checkNotAuthenticated,(req, res) => {
    Certificate.findOne({_id:req.params.id}).then(application => {
        var mypdf;
        if(req.params.type == 'endoresemnt'){
            mypdf = `certificate_document/${application.endorsement_filename}`
        }else if(req.params.type == 'completion'){
            mypdf = `certificate_document/${application.completion_filename}`
        }else if(req.params.type == 'assessment'){
            mypdf = `certificate_document/${application.assessment_filename}`
        }else if(req.params.type == 'builtInPlan'){
            mypdf = `certificate_document/${application.builtInPlan_filename}`
        }else if(req.params.type == 'fileSafetyComplianceReport'){
            mypdf = `certificate_document/${application.fileSafetyComplianceReport_filename}`
        }else if(req.params.type == 'business_assessment_file'){
            mypdf = `certificate_document/${application.business_assessment_file}`
        }else if(req.params.type == 'occupancy_file'){
            mypdf = `certificate_document/${application.occupancy_file}`
        }else if(req.params.type == 'affidavity_file'){
            mypdf = `certificate_document/${application.affidavity_file}`
        }else if(req.params.type == 'fire_insurance_file'){
            mypdf = `certificate_document/${application.fire_insurance_file}`
        }else if(req.params.type == 'renew_assessment_bill'){
            mypdf = `certificate_document/${application.renew_assessment_bill}`
        }else if(req.params.type == 'renew_fire_insurance_file'){
            mypdf = `certificate_document/${application.renew_fire_insurance_file}`
        }else if(req.params.type == 'renew_firesafety_maintenance'){
            mypdf = `certificate_document/${application.renew_firesafety_maintenance}`
        }else if(req.params.type == 'renew_firesafety_clearance'){
            mypdf = `certificate_document/${application.renew_firesafety_clearance}`
        }else{
            res.redirect('/certificate-application/');
            return;
        }

        res.render('review_application',{loggedin_user:req.user.firstName, mypdf:mypdf, type:req.user.userType})
    }).catch(error => {
        console.log(error)
    })
});

router.get('/edit-certificate-application/:id',checkNotAuthenticated,(req, res) => {
    Certificate.findOne({_id:req.params.id}).then(application => {
        res.render('forms/edit-certificate-form',{loggedin_user:req.user.firstName,application_obj:application, type:req.user.userType})
    }).catch(error => {
        console.log(error)
    })
});


router.post('/edit-certificate-application/',checkNotAuthenticated, async (req, res) => {
    const {application_number, application_id, owner_name,establishment_name,address,authorize_representative,business_nature,total_floor,contact_number,no_of_storey,email_address} = req.body
    const check_application = await Certificate.findOne({application_number:application_number})
    if(check_application){
        await Certificate.findByIdAndUpdate(application_id,{
            $set: {
                owner_name: owner_name,
                establishment_name:establishment_name,
                address: address,
                authorize_representative: authorize_representative,
                business_nature: business_nature,
                total_floor: total_floor,
                contact_number: contact_number,
                no_of_storey: no_of_storey,
                email_address: email_address,
            }
        },{ new: true });

        res.json({message:'application_updated'})
        return;
    }else{
        res.json({message:'no_application'})
        return;
    }
    
});


router.post('/remove-certificate-application/',checkNotAuthenticated, async (req, res) => {
    const check_application = await Certificate.findById(req.body.id)

    if(check_application){
        await Certificate.findByIdAndDelete(req.body.id)
        res.json({message:'application_deleted'})
        return;
    }

    res.json({message:'application_not_found'})
    return;
});

router.post('/approve-certificate-application/',checkNotAuthenticated, async (req, res) => {
    const check_application = await Certificate.findById(req.body.id)

    if(check_application){
        await Certificate.findByIdAndUpdate(req.body.id,{$set:{application_status:'Approved'}})
        res.json({message:'application_approved'})
        return;
    }

    res.json({message:'cannot_approved_application'})
    return;
});

router.get('/certificate-application/',checkNotAuthenticated,(req, res) => {
    Certificate.find({}).then(certificate_applications => {
        res.render('list_certificate',{loggedin_user:req.user.firstName,applications:certificate_applications, type:req.user.userType})
    }).catch(error => {
        res.json({message:'error_fecting_data'})
    });
});

export default router;