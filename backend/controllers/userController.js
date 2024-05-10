const User = require('../models/User')

const user = {
   getAllUsers : (req,res) => {
    return res.json({ msg : 'get all users'})
   }
}




module.exports = user 
