import express from "express";
import Certificate from "../models/Certificate.js";
import Clearance from "../models/Clearance.js";
const router = express.Router()


router.get("/generate/:type", async (req,res) => {
    switch (req.params.type) {
        case 'clearance':
            await Clearance.find({}).then(clearances => {
                res.render('pdf_templates/report',{type:req.params.type,clearances:clearances})
            })
            break;
        case 'certificate':
            await Certificate.find({}).then(certificate => {
                res.render('pdf_templates/report',{type:req.params.type,certificates:certificate})
            })
            break;
        default:
            res.redirect('clearance-application')
            break;
    }
});

export default router;