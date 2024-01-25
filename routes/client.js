import express, { application } from 'express';
import Certificate from '../models/Certificate.js';
import Clearance from '../models/Clearance.js';
import User from '../models/User.js';
import { checkNotAuthenticated } from '../config/authentication-checker.js';
import multer from 'multer';
import { clearance_storage,certificate_storage, profile_storage } from '../config/storage.js';
import { allowedMimesApplication,allowedMimesProfile,disallowedMimes } from '../config/mimetypes.js';

const upload_clearance_requirements = multer({
    storage: clearance_storage,
    fileFilter: function (req, file, cb) {
        if (allowedMimesApplication.includes(file.mimetype)) {
            cb(null, true);
        } else if (disallowedMimes.includes(file.mimetype)) {
            cb('disallowed'); 
        } else {
            cb('unsupported');
        }

    },
    error(req, res, next) {
        req.fileValidationError = res;
        next();
    }
}).fields([
    {name: 'archi_file', maxCount: 1},
    {name: 'civil_file', maxCount: 1},
    {name: 'elec_file', maxCount: 1},
    {name: 'mech_file', maxCount: 1},
    {name: 'plumb_file', maxCount: 1},
    {name: 'electro_file', maxCount: 1},
    {name: 'sanit_file', maxCount: 1},
    {name: 'fore_pro_file', maxCount: 1},
    {name: 'fscr_file', maxCount: 1},
    {name: 'costestimate_file', maxCount: 1},
    {name: 'workoperation_file', maxCount: 1},
]);

const upload_certificate_requirements = multer({
    storage: certificate_storage,
    fileFilter: function (req, file, cb) {
        if (allowedMimesApplication.includes(file.mimetype)) {
            cb(null, true);
        } else if (disallowedMimes.includes(file.mimetype)) {
            cb('disallowed'); 
        } else {
            cb('unsupported');
        }
    }
}).fields([
    { name: 'endoresment_file', maxCount: 1 },
    { name: 'completion_file', maxCount: 1 },
    { name: 'assessment_file', maxCount: 1 },
    { name: 'plan_file', maxCount: 1 },
    { name: 'fscr_file', maxCount: 1 },
    { name: 'business_assessment_file', maxCount: 1 },
    { name: 'occupancy_file', maxCount: 1 },
    { name: 'affidavity_file', maxCount: 1 },
    { name: 'fire_insurance_file', maxCount: 1 },
    { name: 'renew_assessment_bill', maxCount: 1 },
    { name: 'renew_fire_insurance_file', maxCount: 1 },
    { name: 'renew_firesafety_maintenance', maxCount: 1 },
    { name: 'renew_firesafety_clearance', maxCount: 1 },
]);

// DONE

const upload_profile_requirements = multer({
    storage: profile_storage,
    fileFilter: (req, file, cb) => {
        if (allowedMimesProfile.includes(file.mimetype)) {
            cb(null, true);
        } else if (disallowedMimes.includes(file.mimetype)) {
            cb('disallowed'); 
        } else {
            cb('unsupported');
        }
    },
}).single('profile_img')


const router = express.Router()

// DONE
router.get("/my",checkNotAuthenticated, async (req,res) => {

    var cert_data;
    var clear_data;
   
    const fullname = `${req.user.firstName} ${req.user.lastName}`;

    await Certificate.find({owner_name: fullname}).then(applications => {
        cert_data = applications;
    });

    await Clearance.find({project_owner: fullname}).then(applications => {
        clear_data = applications
    });


    var count_cert = await Certificate.countDocuments({owner_name: fullname})
    var count_clear = await Clearance.countDocuments({project_owner: fullname})
    var count_all = count_cert + count_clear

    res.render('client/my',{loggedin_user:req.user.firstName,type:req.user.userType,certificates:cert_data, clearances: clear_data, count_all: count_all,count_cert:count_cert,count_clear:count_clear, user_profile:req.user.profile_img});
});

// DONE
router.get("/my-application-certificate",checkNotAuthenticated, async (req,res) => {

    var cert_data;

    const fullname = `${req.user.firstName} ${req.user.lastName}`;

    await Certificate.find({owner_name: fullname}).then(my_applications => {
        cert_data = my_applications;
    });

    res.render('client/my-application-certificate',{loggedin_user:req.user.firstName,type:req.user.userType,applications:cert_data, user_profile:req.user.profile_img});
});

// DONE
router.get("/my-application-clearance",checkNotAuthenticated, async (req,res) => {

    var clear_data;

    const fullname = `${req.user.firstName} ${req.user.lastName}`;

    await Clearance.find({project_owner: fullname}).then(my_applications => {
        clear_data = my_applications;
    });

    res.render('client/my-application-clearance',{loggedin_user:req.user.firstName,type:req.user.userType,applications:clear_data, user_profile:req.user.profile_img});
});

// DONE
router.get("/apply-clearance",checkNotAuthenticated,(req,res) => {

    const fullname = `${req.user.firstName} ${req.user.lastName}`;

    res.render('client/apply-clearance',{loggedin_user:req.user.firstName,type:req.user.userType, fullname: fullname, user_profile:req.user.profile_img});
});

// DONE
router.post('/apply-clearance',checkNotAuthenticated, (req,res) => {

    try {
        upload_clearance_requirements(req,res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: 'multer_error'});
            } else if (err === 'disallowed') {
                return res.status(400).json({ message: 'disallowed' });
            } else if (err === 'unsupported') {
                return res.status(400).json({ message: 'unsupported' });
            }

            const {owner,title,location,contact_number,email,address,contructor,representative,area,storey} = req.body;

            const archi_filename       = req.files.archi_file? req.files.archi_file[0].filename : null;
            const civil_filename       = req.files.civil_file? req.files.civil_file[0].filename : null;
            const electrical_filename  = req.files.elec_file? req.files.elec_file[0].filename : null;
            const mechanical_filename  = req.files.mech_file? req.files.mech_file[0].filename : null;
            const plumbing_filename    = req.files.plumb_file? req.files.plumb_file[0].filename : null;
            const electronics_filename = req.files.electro_file? req.files.electro_file[0].filename : null;
            const sanitary_filename    = req.files.sanit_file? req.files.sanit_file[0].filename : null;
            const protection_filename  = req.files.fore_pro_file? req.files.fore_pro_file[0].filename : null;
            const fscr_file  = req.files.fscr_file? req.files.fscr_file[0].filename : null;
            const costestimate_file  = req.files.costestimate_file? req.files.costestimate_file[0].filename : null;
            const workoperation_file  = req.files.workoperation_file? req.files.workoperation_file[0].filename : null;

            const clearance_application = new Clearance({
                ref_user: req.user._id,
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
                fscr_file: fscr_file,
                costestimate_file: costestimate_file,
                workoperation_file: workoperation_file,
            });


            clearance_application.save().then(application => {
                res.json({message:'success'})
                return;
            }).catch(error => {
                console.log(error)
                res.json({message:'failed'})
                return;
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'server_error' });
    }

});

// DONE
router.get("/apply-certificate",checkNotAuthenticated,(req,res) => {

    const fullname = `${req.user.firstName} ${req.user.lastName}`;
    
    res.render('client/apply-certificate',{loggedin_user:req.user.firstName,type:req.user.userType, fullname: fullname, user_profile:req.user.profile_img});
});


// DONE
router.post("/apply-certificate",checkNotAuthenticated, (req,res) => {
    try {
        upload_certificate_requirements(req,res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: 'multer_error'});
            } else if (err === 'disallowed') {
                return res.status(400).json({ message: 'disallowed' });
            } else if (err === 'unsupported') {
                return res.status(400).json({ message: 'unsupported' });
            }

            const {owner_name,establishment,contact_number,email,address,representative,type,area,storey,typePermit} = req.body

            const endoresment_filename = req.files.endoresment_file ? req.files.endoresment_file[0].filename : null;
            const completion_filename = req.files.completion_file ? req.files.completion_file[0].filename : null;
            const assessment_filename = req.files.assessment_file ? req.files.assessment_file[0].filename : null;
            const plan_filename = req.files.plan_file ? req.files.plan_file[0].filename : null;
            const fire_safety_filename = req.files.fscr_file ? req.files.fscr_file[0].filename : null;
            const business_assessment_file = req.files.business_assessment_file ? req.files.business_assessment_file[0].filename : null;
            const occupancy_file = req.files.occupancy_file ? req.files.occupancy_file[0].filename : null;
            const affidavity_file = req.files.affidavity_file ? req.files.affidavity_file[0].filename : null;
            const fire_insurance_file = req.files.fire_insurance_file ? req.files.fire_insurance_file[0].filename : null;
            const renew_assessment_bill = req.files.renew_assessment_bill ? req.files.renew_assessment_bill[0].filename : null;
            const renew_fire_insurance_file = req.files.renew_fire_insurance_file ? req.files.renew_fire_insurance_file[0].filename : null;
            const renew_firesafety_maintenance = req.files.renew_firesafety_maintenance ? req.files.renew_firesafety_maintenance[0].filename : null;
            const renew_firesafety_clearance = req.files.renew_firesafety_clearance ? req.files.renew_firesafety_clearance[0].filename : null;

            const certificate_application = new Certificate({
                ref_user: req.user._id,
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
                business_assessment_file: business_assessment_file,
                occupancy_file: occupancy_file,
                affidavity_file: affidavity_file,
                fire_insurance_file: fire_insurance_file,
                renew_assessment_bill: renew_assessment_bill,
                renew_fire_insurance_file: renew_fire_insurance_file,
                renew_firesafety_maintenance: renew_firesafety_maintenance,
                renew_firesafety_clearance: renew_firesafety_clearance,
                businessPermitType: typePermit,
            });

            certificate_application.save().then(application => {
                res.json({message:'success_added_application'})
            }).catch(error => {
                res.json({message:'error_adding_application'})
                console.log(error)
            });

        });
    } catch (error) {
        res.status(500).json({ message: 'server_error' });
    }

});


// DONE
router.get("/generate-certificate-form/:id",checkNotAuthenticated, async (req,res) => {
    const cert_data = await Certificate.findById(req.params.id)
    res.render('pdf_templates/cert_form',{data:cert_data,type:req.user.userType, user_profile:req.user.profile_img})
});

// DONE
router.get("/generate-clearance-form/:id",checkNotAuthenticated, async (req,res) => {
    const clearance_data = await Clearance.findById(req.params.id)
    res.render('pdf_templates/clearance_form',{data:clearance_data,type:req.user.userType, user_profile:req.user.profile_img})
});



// DONE
router.get("/edit-certificate/:id",checkNotAuthenticated, async (req,res) => {
    Certificate.findById(req.params.id).then(application => {
        res.render('client/edit-certificate',{loggedin_user:req.user.firstName,type:req.user.userType, application: application, user_profile:req.user.profile_img})
    }).catch(error => {
        console.log(error)
    })
});


// DONE
router.get("/edit-clearance/:id",checkNotAuthenticated, async (req,res) => {
    await Clearance.findById(req.params.id).then(application => {
        res.render('client/edit-clearance',{loggedin_user:req.user.firstName,type:req.user.userType,application:application, user_profile:req.user.profile_img})
    }).catch(error => {
        console.log(error)
    });
});


// TODO
router.post("/edit-certificate/",checkNotAuthenticated, async (req,res) => {
    await Certificate.findByIdAndUpdate(req.body.application_id, {
        $set: {
            'owner_name': req.body.owner_name,
            'establishment_name': req.body.establishment_name,
            'contact_number': req.body.contact_number,
            'email_address': req.body.email_address,
            'address': req.body.address,
            'authorize_representative': req.body.authorize_representative,
            'business_nature': req.body.business_nature,
            'total_floor': req.body.total_floor,
            'no_of_storey': req.body.no_of_storey,
        },
    }, { new: true }).catch(error => {
        console.log(error)
    })

    res.json({message:'certificate_updated'})
    return;
});


// DONE 
router.post("/edit-clearance/",checkNotAuthenticated, async (req,res) => {
    await Clearance.findByIdAndUpdate(req.body.application_id, {
        $set: {
            'project_owner': req.body.owner,
            'project_title': req.body.title,
            'project_location': req.body.location,
            'total_floor': req.body.total_floor,
            'no_of_storey': req.body.no_of_storey,
            'contact_number': req.body.contact_number,
            'email_address': req.body.email_address,
            'owner_address': req.body.address,
            'contructor': req.body.contructor,
            'representative': req.body.representative,
        },
    }, { new: true });

    res.json({message:'clearance_updated'})
    return;
});

// TODO
router.get("/profile",checkNotAuthenticated,(req,res) => {
    res.render('profile',{loggedin_user:req.user.firstName,user_date:req.user,type:req.user.userType, user_profile:req.user.profile_img})
});


router.post("/profile",checkNotAuthenticated, async (req,res) => {

    try {
        upload_profile_requirements(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: 'multer_error'});
            } else if (err === 'disallowed') {
                return res.status(400).json({ message: 'disallowed' });
            } else if (err === 'unsupported') {
                return res.status(400).json({ message: 'unsupported' });
            }
            const {id,firstName,lastName,userName,municipality,province,barangay,postalCode} = req.body;
            const profile_img = req.file.filename;

            User.findByIdAndUpdate(id,{
                $set: {
                    username: userName,
                    profile_img: profile_img,
                    firstName: firstName,
                    lastName: lastName,
                    municipality: municipality,
                    province: province,
                    barangay: barangay,
                    postalCode: postalCode,
                }
            },{ new: true }).catch(error => {
                console.log(error)
            })

            res.json({ message: 'success' });
        });
    } catch (error) {
        res.status(500).json({ message: 'server_error' });
    }

});


// TODO:
router.get("/my-documents-certificate",checkNotAuthenticated, async (req,res) => {

    var applications;
    await Certificate.find({ref_user:req.user._id}).then(my_uploads => {
        applications = my_uploads
    });

    res.render("client/my-documents-certificate",{loggedin_user:req.user.firstName,user_date:req.user,type:req.user.userType, user_profile:req.user.profile_img, mine:applications})

});

// TODO:
router.get("/my-documents-clearance",checkNotAuthenticated,async (req,res) => {
    var applications;
    await Clearance.find({ref_user:req.user._id}).then(my_uploads => {
        applications = my_uploads
    });
    
    res.render("client/my-documents-clearance",{loggedin_user:req.user.firstName,user_date:req.user,type:req.user.userType, user_profile:req.user.profile_img, mine: applications})
   
});


router.get('/view-document/:file_name',checkNotAuthenticated,(req, res) => {
    Clearance.findOne({_id:req.params.id}).then(application => {
        res.render('client/review',{loggedin_user:req.user.firstName, filename:req.params.file_name, type:req.user.userType})
    }).catch(error => {
        console.log(error)
    });
});


router.get('/view-document-certificate/:file_name',checkNotAuthenticated,(req, res) => {
    Clearance.findOne({_id:req.params.id}).then(application => {
        res.render('client/review-certificate',{loggedin_user:req.user.firstName, filename:req.params.file_name, type:req.user.userType})
    }).catch(error => {
        console.log(error)
    });
});


router.post("/filter-certificate", checkNotAuthenticated, async (req, res) => {

    var data = await Certificate.find({
        date_added: {
            $gte: new Date(`${parseInt(req.body.data)}-01-01T00:00:00.000Z`),
            $lt: new Date(`${parseInt(req.body.data) + 1}-01-01T00:00:00.000Z`), 
        },
        ref_user: req.user._id,
    });

    res.json({results:data})

});
  

router.post("/filter-clearance",checkNotAuthenticated, async (req,res) => {

    var data = await Clearance.find({
        date_added: {
            $gte: new Date(`${parseInt(req.body.data)}-01-01T00:00:00.000Z`),
            $lt: new Date(`${parseInt(req.body.data) + 1}-01-01T00:00:00.000Z`), 
        },
        ref_user: req.user._id,
    });

    res.json({results:data})

});

export default router