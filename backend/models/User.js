const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        trim: true,
        minlength: 3
    },
    photoURL: String,
    role: {
        type: String,
        enum: ['admin', 'company', 'tudent'],
        default: 'tudent'
    },
    studentInfo: {
        rollno: String,
        university: String,
        address: String,
        phoneNumber: String
    },
    companyInfo: {
        type: Schema.Types.ObjectId,
        ref: 'CompanyInfo'
    }
});

const CompanyInfo = new Schema({
    slogan: String,
    companySize: String,
    companyDescription: String,
    website: String,
    industry: String,
    foundingYear: Number
});

const User = mongoose.model('User', userSchema);
const Company = mongoose.model('CompanyInfo', CompanyInfo);

module.exports = { User, Company };