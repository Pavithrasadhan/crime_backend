const mongoose = require('mongoose');

const CrimeReportSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
    },

    type: {
        type: String,
        required: true,
        enum: [ "Theft", "Assault", "Robbery", "Fraud", "Cybercrime", "Homicide", "Domestic Violence", "Drug Offense" ],
    },

    location: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        required: true,
        enum: ['Pending', 'In Review', 'Resolved'],
        default: 'Pending',
    },

    assignedOfficer: {
        type: String,
    },

}, {
    timestamps: true
},
);

module.exports = mongoose.model('CrimeReport', CrimeReportSchema);