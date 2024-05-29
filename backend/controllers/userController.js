const User = require('../models/User')
const createToken = require('../helpers/createToken')
const bcrypt = require('bcrypt')
require('dotenv')

const getAllUsers = async (req, res) => {
   try {
      const users = await User.find({})
      res.status(200).json(users)
   } catch (e) {
      res.status(400).json({ message: e.message })
   }
}


const login = async (req, res) => {
   try {
      let { email, password } = req.body
      let user = await User.findOne({ email })
      console.log(user);
      if (!user) {
         throw new Error("user does not exists ")
      }
      let isCorrect = await bcrypt.compare(password, user.password)
      if (isCorrect) {
         let token = createToken(user._id)
         res.cookie(user.name + "'sjwt", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
         return res.json({ user, token })
      } else {
         throw new Error('password incorrect ! ')
      }
   } catch (e) {
      console.log(e);
      res.status(400).json({ error: e.message })
   }
}

const studentRegister = async (req, res) => {
   try {
      let { name, email, password, photoURL, role, studentInfo, phoneNumber } = req.body
      let { rollno, address } = studentInfo

      const existingUser = await User.findOne({ email })
      if (existingUser) {
         throw new Error('Email already in used !')
      }

      let salt = await bcrypt.genSalt()
      let hashValue = await bcrypt.hash(password, salt)

      let user = {
         name,
         email,
         password: hashValue,
         photoURL,
         role,
         studentInfo: {
            rollno,
            address,
            phoneNumber
         }
      }
      const resultUser = await User.create(user)
      let token = createToken(resultUser._id)
      res.cookie(user.name + "'sjwt", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
      return res.json({ resultUser, token })
   } catch (e) {
      return res.status(302).json({ error: e.message })
   }
}


const companyRegister = async (req, res) => {
   try {
      let { name, email, photoURL, password, role, phoneNumber, companyInfo } = req.body
      let { slogan, location, companySize, companyDescription, website, industry, foundingYear } = companyInfo

      const existingUser = await User.findOne({ email })
      if (existingUser) throw new Error('Company Email already exist ! ')

      let salt = await bcrypt.genSalt()
      let hashValue = await bcrypt.hash(password, salt)

      let user = {
         name,
         email,
         photoURL,
         phoneNumber,
         password: hashValue,
         role,
         companyInfo: {
            slogan,
            location,
            companySize,
            companyDescription,
            website,
            industry,
            foundingYear,
         }
      }
      const resultUser = await User.create(user)
      let token = createToken(resultUser._id)
      res.cookie(user.name + "'sjwt", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
      res.status(200).json({ resultUser, token })
      return res.status(200).json({ message: { user } })
   } catch (e) {
      return res.status(302).json({ error: e.message })
   }
}

const logout = async (req, res) => {
   res.clearCookie('jwt', '', { maxAge: 1 })
   return res.json({ message: 'logged out' })
}


module.exports = {
   getAllUsers,
   login,
   studentRegister,
   companyRegister,
   logout,
}
