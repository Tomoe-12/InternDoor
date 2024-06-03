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
    company_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requireStudent: {
        type: Number,
        default: 1,
        required: true
    },
    category: {
        type: String,
        enum: [
            'Software Development',
            'Data Science and Analytics',
            'Cybersecurity',
            'IT Support and Infrastructure',
            'Software Testing and Quality Assurance',
            'Database Management',
            'Computer Networking',
            'Game Development',
            'UI/UX Design',
            'Research and Development',
            'Web Development',
            'Mobile App Development',
            'Cloud Computing',
            'Artificial Intelligence and Machine Learning',
            'DevOps and Continuous Integration/Continuous Deployment (CI/CD)',
            'Embedded Systems',
            'Information Systems Management',
            'Information Technology Consulting',
            'Computer Graphics and Visualization',
            'Robotics and Automation',
            'Computer Vision'
        ],
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    skills: {
        type: [String],  // array string
        required: true
    },
    deadline: {
        type: Date,
        required: true,
        default: function () {
            return moment().add(2, 'months').toDate();
        },
    },
    receiveApplicantEmail: {
        type: String,
        trim: true,
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model('jobs', jobSchema)