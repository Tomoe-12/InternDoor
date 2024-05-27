const { User, Company } = require('../models/User')

const getAllUsers = async (req, res) => {
   try {
      const users = await User.find({})
      res.status(200).json(users)
   } catch (error) {
      res.status(400).json({ message: error.message })
   }
}


const createUser = (req, res) => {
   return res.json({ msg: 'user register' })
}


const login = (req, res) => {
   return res.json({ msg: 'user login' })
}
module.exports = {
   getAllUsers,
   login,
   createUser,
}
