const express = require('express')
const userControllers = require('../controllers/userController')
const router = express.Router()


router.get('/api/users',userControllers.getAllUsers)



module.exports = router 