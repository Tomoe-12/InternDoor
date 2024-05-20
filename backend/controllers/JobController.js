const jobs = require('../models/Jobs')
const jobCategory = require('../../frontend/public/jobCategories.json')


// get all jobs use this if sth goes wrong
// const getAllJobsItems = async (req, res) => {
//     try {
//         const job = await jobs.find().sort({ createdAt: -1 })
//         res.status(200).json(job)
//     } catch (error) {
//         res.status(500).json({ msg: error.message  })
//     }
// }

// const categoryOptions = [
//     "Software Development",
//     "Data Science and Analytics",
//     "Cybersecurity",
//     "IT Support and Infrastructure",
//     "Software Testing and Quality Assurance",
//     "Database Management",
//     "Computer Networking",
//     "Game Development",
//     "UI/UX Design",
//     "Research and Development",
//     "Web Development",
//     "Mobile App Development",
//     "Cloud Computing",
//     "Artificial Intelligence and Machine Learning",
//     "DevOps and Continuous Integration/Continuous Deployment (CI/CD)",
//     "Embedded Systems",
//     "Information Systems Management",
//     "Information Technology Consulting",
//     "Computer Graphics and Visualization",
//     "Robotics and Automation"
// ];



const getAllJobsItems = async (req, res) => {
    try {
        let search = req.query.search || "";
        const regex = new RegExp(search, 'i');

        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 9;
        const category = req.query.category || 'All';
        let sort = req.query.sort || "rating";


        const categoryOptions = [...jobCategory]


        // console.log(categoryOptions);

        let categoryFilter;
        if (category === 'All') {
            categoryFilter = categoryOptions.map(category => category.category);
        } else {
            categoryFilter = category.split(",").map(category => category.trim());
        }

        const sortOptions = sort.split(",");
        const sortBy = {};
        sortBy[sortOptions[0]] = sortOptions[1] || 'asc';

        const resultJobs = await jobs.find({
            title: { $regex: regex },
            category: { $in: categoryFilter }
        })
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit);

        const total = await jobs.countDocuments({
            category: { $in: categoryFilter },
            title: { $regex: regex }
        });

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            category: categoryOptions,
            resultJobs,
        };
        // console.log('category options are', categoryOptions);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


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