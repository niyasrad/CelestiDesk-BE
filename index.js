require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const combineRoutes = require('./src/routes')

const { verifyToken } = require('./src/utils/jwt.util')

const app = express()

app.use(cors())
app.use(express.json())

combineRoutes(app)

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Server up and running!"
    })
})

app.get('/checkauth', verifyToken, (req, res) => {
    return res.status(200).json({
        message: "You are authenticated!",
        username: req.username
    })
})

const PORT = process.env.PORT || 8080

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("-----CONNECTED TO DB-----")
    app.listen(PORT, () => {
        console.log(`-----LISTENING ON PORT ${PORT}-----`)
    })
})
.catch((err) => {
    console.log("Error While Connecting to DB! " + err.message)
})
