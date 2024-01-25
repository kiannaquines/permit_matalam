import express from 'express'
import Clearance from '../models/Clearance.js';
import multer from 'multer';
import { checkNotAuthenticated }  from '../config/authentication-checker.js';
import { clearance_storage } from '../config/storage.js';


const router = express.Router()

const upload_clearance_requirements = multer({ storage: clearance_storage });


router.get('/clearance-application-list/',checkNotAuthenticated,(req, res) => {
    Clearance.find({application_status:'Approved'}).then(clearance_applications => {
        res.render('generate_clearance',{loggedin_user:req.user.firstName,applications:clearance_applications, type:req.user.userType})
    }).catch(error => {
        res.json({message:'error_fecting_data'})
    });
});

router.get('/add-clearance-application/',checkNotAuthenticated,(req, res) => {
    res.render('forms/add-clearance-form',{loggedin_user:req.user.firstName, type:req.user.userType})
});

router.post('/add-clearance-application/',checkNotAuthenticated,upload_clearance_requirements.fields([
    {name: 'archi_file', maxCount: 1},
    {name: 'civil_file', maxCount: 1},
    {name: 'elec_file', maxCount: 1},
    {name: 'mech_file', maxCount: 1},
    {name: 'plumb_file', maxCount: 1},
    {name: 'electro_file', maxCount: 1},
    {name: 'sanit_file', maxCount: 1},
    {name: 'fore_pro_file', maxCount: 1},
]),(req, res) => {

    const {owner,title,location,contact_number,email,address,contructor,representative,area,storey} = req.body;

    const archi_filename            = req.files.archi_file[0].filename;
    const civil_filename            = req.files.civil_file[0].filename;
    const electrical_filename       = req.files.elec_file[0].filename;
    const mechanical_filename       = req.files.mech_file[0].filename;
    const plumbing_filename         = req.files.plumb_file[0].filename;
    const electronics_filename      = req.files.electro_file[0].filename;
    const sanitary_filename         = req.files.sanit_file[0].filename;
    const protection_filename       = req.files.fore_pro_file[0].filename;

    const clearance_application = new Clearance({
        project_owner: owner,
        project_title: title,
        project_location: location,
        total_floor: area,
        no_of_storey: storey,
        contact_number: contact_number,
        email_address: email,
        owner_address: address,
        contructor: contructor,
        representative: representative,
        architectural_filename: archi_filename,
        structural_filename: civil_filename,
        electrical_filename: electrical_filename,
        mechanical_filename: mechanical_filename,
        plumbing_filename: plumbing_filename,
        electronics_filename:electronics_filename,
        sanitary_filename:sanitary_filename,
        fireprotection_filename: protection_filename,
    });

    clearance_application.save().then(application => {
        res.json({message:'success'})
    }).catch(error => {
        console.log(error)
        res.json({message:'failed'})
    });
});


router.get('/edit-clearance-application/:id',checkNotAuthenticated,(req, res) => {
    Clearance.findOne({_id:req.params.id}).then(application => {
        res.render('forms/edit-clearance-form',{loggedin_user:req.user.firstName,application_obj:application, type:req.user.userType})
    }).catch(error => {
        console.log(error)
    })
});


router.post('/edit-clearance-application/',checkNotAuthenticated, async (req, res) => {

    const {application_id, application_number, owner,title,location,contact_number,email,address,contructor,representative,area,storey} = req.body;

    const check_application = await Clearance.findOne({application_number:application_number})

    if(check_application){
        await Clearance.findByIdAndUpdate(application_id,{$set:{
            project_owner: owner,
            project_title: title,
            project_location: location,
            total_floor:area,
            no_of_storey: storey,
            contact_number: contact_number,
            email_address: email,
            owner_address: address,
            contructor: contructor,
            representative: representative,
        }})
        res.json({message:'success_update_clearance'})
        return;
    }

    res.json({message:'incorrect_application_number'})
    return;
});


router.get('/review-clearance-application/:id/:type',checkNotAuthenticated,(req, res) => {
    Clearance.findOne({_id:req.params.id}).then(application => {
        var myPdf;
        if(req.params.type == 'architectural'){
            myPdf = `clearance_document/${application.architectural_filename}`
        }else if(req.params.type == 'civil'){
            myPdf = `clearance_document/${application.structural_filename}`
        }else if(req.params.type == 'electrical'){
            myPdf = `clearance_document/${application.electrical_filename}`
        }else if(req.params.type == 'mechanical'){
            myPdf = `clearance_document/${application.mechanical_filename}`
        }else if(req.params.type == 'plumbing'){
            myPdf = `clearance_document/${application.plumbing_filename}`
        }else if(req.params.type == 'electronics'){
            myPdf = `clearance_document/${application.electronics_filename}`
        }else if(req.params.type == 'sanitary'){
            myPdf = `clearance_document/${application.sanitary_filename}`
        }else if(req.params.type == 'fire_protection'){
            myPdf = `clearance_document/${application.fireprotection_filename}`
        }else if(req.params.type == 'fscr_file'){
            myPdf = `clearance_document/${application.fscr_file}`
        }else if(req.params.type == 'costestimate_file'){
            myPdf = `clearance_document/${application.costestimate_file}`
        }else if(req.params.type == 'workoperation_file'){
            myPdf = `clearance_document/${application.workoperation_file}`
        }else{
            res.redirect('/certificate-application/');
            return;
        }

        res.render('review_application',{loggedin_user:req.user.firstName, mypdf:myPdf, type:req.user.userType})
    }).catch(error => {
        console.log(error)
    })
});

router.post('/approve-application-clearance/',checkNotAuthenticated, async (req, res) => {
    const check_application = await Clearance.findById(req.body.id)

    if(check_application){
        await Clearance.findByIdAndUpdate(req.body.id,{$set:{application_status:'Approved'}})
        res.json({message:'application_approved'})
        return;
    }

    res.json({message:'application_not_found'})
    return;
});

// DONE
router.post('/remove-application-clearance/',checkNotAuthenticated, async (req, res) => {
    const check_application = await Clearance.findById(req.body.id)

    if(check_application){
        await Clearance.findByIdAndDelete(req.body.id)
        res.json({message:'application_deleted'})
        return;
    }

    res.json({message:'application_not_found'})
    return;
});


router.get('/review-document-clearance/:id',checkNotAuthenticated,(req, res) => {
    Clearance.findOne({_id:req.params.id}).then(application => {
        res.render('review_document',{loggedin_user:req.user.firstName,application:application, type:req.user.userType})
    }).catch(error => {
        console.log(error)
    })
});

router.get('/clearance-application/',checkNotAuthenticated,(req, res) => {
    Clearance.find({}).then(clearance_applications => {
        res.render('list_clearance',{loggedin_user:req.user.firstName,applications:clearance_applications, type:req.user.userType})
    }).catch(error => {
        res.json({message:'error_fecting_data'})
    });
});

export default router;
