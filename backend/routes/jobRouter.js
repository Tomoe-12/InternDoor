const express = require('express')
const jobsControllers = require('../controllers/JobController')
const router = express.Router()

// get all jobs 
router.get('',jobsControllers.getAllJobsItems)

// post update single jobs
router.post('',jobsControllers.postJobs)
// get single jobs
router.get('/:id',jobsControllers.singleJob)
// delete jobs
router.delete('/:id',jobsControllers.deleteJobs)
// patch update single jobs
router.patch('/:id',jobsControllers.updateJob)

module.exports = router