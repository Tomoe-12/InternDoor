const express = require('express')
const userControllers = require('../controllers/userController')
const router = express.Router()


router.get('/',userControllers.getAllUsers)
router.get('/login',userControllers.login)
router.get('/register',userControllers.createUser)



module.exports = router 