const express = require('express')
const userControllers = require('../controllers/userController')
const router = express.Router()
const handleErrorMessage = require('../middleware/handleErrorMessage')
const { body } = require('express-validator')

router.get('/', userControllers.getAllUsers)
router.post('/login', [
    body('email').notEmpty().isEmail(),
    body('password').notEmpty(),
], handleErrorMessage, userControllers.login)

router.post('/studentRegister', [
    body('name').notEmpty(),
    body('email').notEmpty().isEmail().trim(),
    body('photoURL'),
    body('role').notEmpty(),
    body('password').notEmpty(),
    body('phoneNumber').notEmpty(),
    body('studentInfo.rollno').notEmpty(),
    body('studentInfo.address').notEmpty(),

], handleErrorMessage, userControllers.studentRegister)

router.post('/companyRegister', [
    body('name').notEmpty(),
    body('email').notEmpty().isEmail().trim(),
    body('photoURL'),
    body('role').notEmpty(),
    body('password').notEmpty(),
    body('phoneNumber').notEmpty(),
    body('companyInfo.slogan').notEmpty(),
    body('companyInfo.location').notEmpty(),
    body('companyInfo.companySize').notEmpty(),
    body('companyInfo.companyDescription').notEmpty(),
    body('companyInfo.website').notEmpty(),
], handleErrorMessage, userControllers.companyRegister)


router.post('/logout', userControllers.logout)



module.exports = router 