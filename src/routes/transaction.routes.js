const router = require('express').Router()

const { verifyToken } = require('../utils/jwt.util')
const Employee = require('../models/employee')
const Request = require('../models/request')
const Transaction = require('../models/transaction')

const accountSid = process.env.TWILIO_ACC_ID
const authToken = process.env.TWILIO_AUTH_TOKEN


router.post('/message', verifyToken, async (req, res) => {

    const client = require('twilio')(accountSid, authToken);

    if (!req.body.message || !req.body.password || req.body.password !== process.env.TWILIO_PASS) {
        return res.status(400).json({
            message: "Please check your credentials!"
        })
    }

    try {
        client.messages
        .create({
            body: req.body.message ? req.body.message: "Your request has been Accepted!",
            from: `+${process.env.TWILIO_NUMBER}`,
            to: `+${process.env.PERSONAL_NUMBER}`
        })
        .then(message => console.log(message.sid))

        return res.status(200).json({
            message: "Message Sent!"
        })

    } catch(err) {
        console.log(err)
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
    

   
})



router.post('/decide', verifyToken, async (req, res) => {
    
    const user = await Employee.findById(req._id)
    const decisions = ["ACCEPTED", "REJECTED"]

    if (!user || user.type === 'EMPLOYEE') {
        return res.status(403).json({
            message: "You are not authorized to access this resource!"
        })
    }

    if (!req.body.reqID || !req.body.decision || !decisions.includes(req.body.decision)) {
        return res.status(400).json({
            message: "Check Your Request Again!"
        })
    }

    const request = await Request.findById(req.body.reqID).populate('origin', '-password')

    if (!request) {
        return res.status(400).json({
            message: "No Request Found!"
        })
    }

    if (request.status === 'IN_PROCESS' && user.type === 'TEAM_LEAD') {

        if (req.body.decision === 'ACCEPTED') {
            request.status = 'IN_REVIEW'
        } else {
            request.status = 'REJECTED'
        }
        await request.save()
        
    } else if (request.status === 'IN_REVIEW' && user.type === 'MANAGER') {

        if (req.body.decision === 'ACCEPTED') {
            request.status = 'ACCEPTED'
        } else {
            request.status = 'REJECTED'
        }
        await request.save()

    } else {

        return res.status(400).json({
            message: "Invalid Request Choice!"
        })
        
    }

    const completedTransaction = new Transaction({
        origin: request.origin,
        responder: user._id,
        request: request._id,
        result: req.body.decision
    })
    await completedTransaction.save()

    return res.status(200).json({
        message: "Request Controlled Successfully!"
    })

})

router.get('/history', verifyToken, async (req, res) => {

    const user = await Employee.findById(req._id)

    if (!user || user.type === 'EMPLOYEE') {
        return res.status(403).json({
            message: "You are not authorized to access this resource!"
        })
    }

    const transactions = await Transaction.find({
        responder: req._id
    })
    .populate('request', 'subject message from to status -_id')
    .populate('responder', 'name -_id')
    .populate('origin', 'name -_id')

    return res.status(200).json({
        history: transactions
    })

})

module.exports = router