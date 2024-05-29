const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const usersRoutes = require('./routes/userRouter')
const mongoose = require('mongoose');
require('dotenv').config()
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 6001


// import routers here
const jobRoutes = require('./routes/jobRouter')

// middleware

app.use(express.json())

app.use(morgan('dev'))
app.use(cookieParser())


// mongodb configuration using mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@interndoor.orsutfq.mongodb.net/InternDoor?retryWrites=true&w=majority&appName=InternDoor`)
    .then(() => {
        console.log('mongodb connected successfully')
        app.listen(port, () => {
            console.log(` app listening on port ${port}`)
        })
    }
    ).catch((e) => {
        console.log('error connecting to mnogodb', e);
    })
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));//local development --WARNING---



// jobs api
app.use('/api/jobs', jobRoutes)
// user api
app.use('/api/users', usersRoutes)



app.get('/', (req, res) => {
    res.send('Hello World!')
})

//  cookie 
app.get('/set-cookie', (req, res) => {
    res.cookie('name', 'aungung')
    res.cookie('important-key', 'value', { httpOnly: true })
    return res.send('cooki already set')
})

app.get('/get-cookie', (req, res) => {
    return res.send(req.cookies)
})