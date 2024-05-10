const mongoose = require('mongoose')
const moment = require('moment');
const { Schema } = mongoose

const jobSchema = new Schema({
    title: {
        type: String,
        trim: true,
        minlength: 3,
        required: true
    },
    requireStudent: {
        type: Number,
        default: 1,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    skills : {
        type : [String] ,  // array string
        required : true
    },
    deadline: {
        type: Date,
        required: true,
        default: function () {
            return moment().add(2, 'months').toDate();
        },
    },
    receiveApplicantEmail : {
        type : String ,
        trim : true ,
        required : true 
    }

}, { timestamps: true })

module.exports =  mongoose.model('jobs',jobSchema)