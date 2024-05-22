const User = require('../models/User')

const getAllUsers = (req, res) => {
   return res.json({ msg: 'get all users' })
}

const login = (req, res) => {
   return res.json({ msg: 'user login' })
}
const register = (req, res) => {
   return res.json({ msg: 'user register' })
}

module.exports = {
   getAllUsers,
   login,
   register,
}
