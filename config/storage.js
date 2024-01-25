import multer from "multer";
import path from 'path';
import fs from 'fs';
import util from 'util';
import { dirname } from 'path';



const mkdirAsync = util.promisify(fs.mkdir);

export const clearance_storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const directory = path.join(process.cwd(),`public/clearance_document/`);

        if (fs.existsSync(directory)) {
            cb(null, directory);
            return;
        }

        if(mkdirAsync(directory, { recursive: false })){
            cb(null, dirname(directory));
            return;
        }
    },
    filename: function (req, file, cb) {
        const username  = req.user.username
        const timestamp = Date.now();
        const originalname  = path.parse(file.originalname);
        const newFilename   = `${timestamp}_${username}_${originalname.name}${originalname.ext}`;
        cb(null, newFilename);        
    }
});


export const certificate_storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const directory = path.join(process.cwd(),`public/certificate_document/`);

        if (fs.existsSync(directory)) {
            cb(null, directory);
            return;
        }
        
        if(mkdirAsync(directory, { recursive: false })){
            cb(null, dirname(directory));
            return;
        }
    },
    filename: function (req, file, cb) {
        const username  = req.user.username
        const timestamp = Date.now();
        const originalname  = path.parse(file.originalname);
        const newFilename   = `${timestamp}_${username}_${originalname.name}${originalname.ext}`;
        cb(null, newFilename); 
    }
});


export const profile_storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const directory = path.join(process.cwd(),`public/profile/`);

        if (fs.existsSync(directory)) {
            cb(null, directory);
            return;
        }
        
        if(mkdirAsync(directory, { recursive: false })){
            cb(null, dirname(directory));
            return;
        }
    },
    filename: function (req, file, cb) {
        const username  = req.user.username
        const timestamp = Date.now();
        const originalname  = path.parse(file.originalname);
        const newFilename   = `${timestamp}_${username}_${originalname.name}${originalname.ext}`;
        cb(null, newFilename); 
    }
});
