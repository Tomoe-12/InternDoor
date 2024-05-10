const jobs = require('../models/Jobs')



// get all jobs
const getAllJobsItems = async (req, res) => {
    try {
        const job = await jobs.find().sort({ createdAt: -1 })
        res.status(200).json(job)
    } catch (error) {
        res.status(500).json({ msg: error.message  })
    }
}

// add new jobs
const postJobs = async (req, res) => {
    const newJob = req.body
    try {
        const result = await jobs.create(newJob)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// show single jobs
const singleJob = async (req, res) => {
    const jobId = req.params._id
    try {
        const job = await jobs.findById(jobId)
        res.status(200).json(job)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete jobs
const deleteJobs = (req, res) => {
    return res.json({ msg: 'delete new jobs' })
}

// update job
const updateJob = (req, res) => {
    return res.json({ msg: 'updte  jobs' })
}


module.exports = {
    getAllJobsItems,
    postJobs,
    singleJob,
    deleteJobs,
    updateJob
}