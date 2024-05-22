const express = require('express')
const app = express()
const cors = require('cors')
const usersRoutes = require('./routes/userRouter')
const mongoose = require('mongoose');
require('dotenv').config()
const port = process.env.PORT || 6001


// import routers here
const jobRoutes = require('./routes/jobRouter')

// middleware
app.use(cors())
app.use(express.json())


// mongodb configuration using mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@interndoor.orsutfq.mongodb.net/InternDoor?retryWrites=true&w=majority&appName=InternDoor`)
    .then(
        console.log('mongodb connected successfully')
    ).catch((e) => {
        console.log('error connecting to mnogodb', e);
    })



// jobs api
app.use('/api/jobs', jobRoutes)
// user api
app.use('/api/users', usersRoutes)




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(` app listening on port ${port}`)
})