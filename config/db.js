import mongoose from 'mongoose';

export function dbconnection() {
    mongoose.connect('mongodb+srv://kjgnaquines:password0000@cluster0.rkiolj8.mongodb.net/?retryWrites=true&w=majority').then(() => {
        console.log('MongoDB Connection established successfully')   
    }).catch((err) => {
        console.log(err)
    });
}