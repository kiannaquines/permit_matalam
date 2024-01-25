import express from "express";
import Certificate from "../models/Certificate.js";
import Clearance from "../models/Clearance.js";

const router = express.Router()


router.get('/generate-pdf-permit/:type/:subtype/:id',async (req,res) => {
    if(req.params.subtype == 'certificate'){
        await Certificate.findById(req.params.id).then(application => {

            var type;

            if(req.params.type == 'member'){
                type = 'Applicant/Owner’s COPY'
            }
        
            if(req.params.type == 'bfp'){
                type = 'BFP Copy'
            }
        
            if(req.params.type == 'bplo'){
                type = 'BPLO Copy'
            }

            console.log(application)
            res.render('pdf_templates/certificate',{type: type, data:application})
        });
    }


    if(req.params.subtype == 'clearance'){
        await Clearance.findById(req.params.id).then(application => {

            var type;

            if(req.params.type == 'member'){
                type = 'Applicant/Owner’s COPY'
            }
        
            if(req.params.type == 'bfp'){
                type = 'BFP Copy'
            }
        
            if(req.params.type == 'bplo'){
                type = 'BPLO Copy'
            }
            
            console.log(application)
            res.render('pdf_templates/clearance',{type: type, data:application})
        });
    }

});

export default router;