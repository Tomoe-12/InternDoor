const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        trim: true,
        minlength: 3
    },
    photoURL: String,
    phoneNumber: String,
    password : {
        type : String ,
        required : true 
    },
    role: {
        type: String,
        enum: ['admin', 'company', 'student'],
        default: 'student'
    },
    studentInfo: {
        rollno: String,
        address: String,
    },
    companyInfo: {
        slogan: String,
        location : String ,
        companySize: String,
        companyDescription: String,
        website: String,
        industry: String,
        foundingYear: Number
    }
});


const User = mongoose.model('User', userSchema);

module.exports =  User 