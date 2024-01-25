import mongoose from 'mongoose';

export function dbconnection() {
    mongoose.connect('mongodb+srv://kjgnaquines:3LPAnunIakXjffLm@clusterpermit.ftpcqy1.mongodb.net/?retryWrites=true&w=majority').then(() => {
        console.log('MongoDB Connection established successfully')   
    }).catch((err) => {
        console.log(err)
    });
}