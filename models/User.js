import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: { 
        type: String,
        required: true,
        unique: true 
    },
    profile_img: {
        type: String,
        required: false,
        default: null,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false,
    },
    municipality: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true,
    },
    barangay: {
        type: String,
        required: true
    },
    postalCode: {
        type: Number,
        required: true,
    },
    userType: {
        type: String,
        required: false,
        default: "2"
    },
    userStatus: {
        type: String,
        required: false,
        default: "Inactive"
    },
    user_date_added: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema);

export default User;


