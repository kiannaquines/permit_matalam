import mongoose from "mongoose";

const certificateApplicationSchema = mongoose.Schema({
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
    owner_name: {
        type: String,
        required: true
    },
    establishment_name: { 
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    authorize_representative: {
        type: String,
        required: true
    },
    business_nature: {
        type: String,
        required: true,
    },
    total_floor: {
        type: Number,
        required: true
    },
    contact_number: {
        type: String,
        required: true,
    },
    no_of_storey: {
        type: Number,
        required: true
    },
    email_address: {
        type: String,
        required: true,
    },
    endorsement_filename: {
        type: String,
        required: false,
        default: null,
    },
    completion_filename: {
        type: String,
        required: false,
        default: null,
    },
    assessment_filename: {
        type: String,
        required: false,
        default: null,
    },
    builtInPlan_filename: {
        type: String,
        required: false,
        default: null,
    },
    fileSafetyComplianceReport_filename: {
        type: String,
        required: false,
        default: null,
    },
    business_assessment_file: {
        type: String,
        required: false,
        default: null,
    },
    occupancy_file: {
        type: String,
        required: false,
        default: null,
    },
    affidavity_file: {
        type: String,
        required: false,
        default: null,
    },
    fire_insurance_file: {
        type: String,
        required: false,
        default: null,
    },

    renew_assessment_bill: {
        type: String,
        required: false,
        default: null,
    },
    renew_fire_insurance_file: {
        type: String,
        required: false,
        default: null,
    },
    renew_firesafety_maintenance: {
        type: String,
        required: false,
        default: null,
    },
    renew_firesafety_clearance: {
        type: String,
        required: false,
        default: null,
    },
    application_status: {
        type: String,
        required: true,
        default: "Pending"
    },
    businessPermitType: {
        type: String,
        required: true,
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
});

const Certificate = mongoose.model('certificate_application',certificateApplicationSchema);

export default Certificate