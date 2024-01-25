import mongoose from 'mongoose';

export function dbconnection() {
    mongoose.connect('mongodb://127.0.0.1:27017/permit_management_systemDB').then(() => {
        console.log('MongoDB Connection established successfully')   
    }).catch((err) => {
        console.log(err)
    });
}