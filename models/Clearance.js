import mongoose from "mongoose";


const applicationSchema = mongoose.Schema({
    ref_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    application_number: {
        type: Number,
        required: true,
        unique: true,
        default: function() {
            return Math.floor(Math.random() * (99999999 - 10000000 + 1) + 100000000);
        },
    },
    project_owner: { 
        type: String,
        required: true,
    },
    project_title: {
        type: String,
        required: true,
    },
    project_location: {
        type: String,
        required: true
    },
    total_floor: {
        type: Number,
        required: true
    },
    no_of_storey: {
        type: Number,
        required: true
    },
    contact_number: {
        type: String,
        required: true,
    },
    email_address: {
        type: String,
        required: true,
    },
    owner_address: {
        type: String,
        required: true,
    },
    contructor: {
        type: String,
        required: true,
    },
    representative: {
        type: String,
        required: true,
    },
    architectural_filename: {
        type: String,
        required: false,
    },
    structural_filename: {
        type: String,
        required: false,
    },
    electrical_filename: {
        type: String,
        required: false,
    },
    mechanical_filename: {
        type: String,
        required: false,
    },
    plumbing_filename: {
        type: String,
        required: false,
    },
    electronics_filename: {
        type: String,
        required: false,
    },
    sanitary_filename: {
        type: String,
        required: false,
    },
    fireprotection_filename: {
        type: String,
        required: false,
    },
    fscr_file: {
        type: String,
        required: false,
    },
    costestimate_file: {
        type: String,
        required: false,
    },
    workoperation_file: {
        type: String,
        required: false,
    },
    application_status: {
        type: String,
        required: true,
        default: "Pending"
    },
    expiration_date: {
        type: Date,
        default: function () {
            const currentDate = new Date();
            const expirationDate = new Date(currentDate);
            expirationDate.setFullYear(currentDate.getFullYear() + 1);
            return expirationDate;
        },
    },
    date_added: {
        type: Date,
        default: Date.now()
    }
})

const Clearance = mongoose.model('clearance_application',applicationSchema);

export default Clearance