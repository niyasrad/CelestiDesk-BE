const router = require('express').Router()
const { verifyToken } = require('../utils/jwt.util')
const Employee = require('../models/employee')
const Request = require('../models/request')

router.post('/create', verifyToken, async (req, res) => {

    if (!req.body.subject || !req.body.message || !req.body.from || !req.body.to ) {
        return res.status(400).json({
            message: "Please check all the fields!"
        })
    }

    const recentRequests = await Request.countDocuments({
        origin: req._id,
        time: {
            $gte: Date.now() - (30 * 24 * 60 * 60 * 1000)
        }
    })

    if (recentRequests >= 5) {
        return res.status(400).json({
            message: "You've used up 5 requests this month!"
        })
    }

    try {

        const employeeRequest = new Request({
            origin: req._id,
            subject: req.body.subject,
            message: req.body.message,
            emergency: req.body.emergency ? true: false,
            from: new Date(req.body.from),
            to: new Date(req.body.to),
        })
    
        await employeeRequest.save()
    
        return res.status(200).json({
            message: "Request created successfully!"
        })

    } catch (err) {
        
        console.log(err)
        return res.status(500).json({
            message: "Something went wrong!"
        })

    }
    
})

router.get('/pending', verifyToken, async (req, res) => {

    const user = await Employee.findById(req._id)

    if (user.type === 'EMPLOYEE') {

        let rejectionRequests = await Request.find({
            origin: user._id,
            status: 'IN_REVIEW',
            time: {
                $lt: Date.now() - (20 * 60 * 1000)
            }
        })

        rejectionRequests.forEach(async (request) => {
            request.status = 'REJECTED'
            await request.save()
        })

        let pendingRequests = await Request.find({
            origin: user._id
        })

        return res.status(200).json({
            requests: pendingRequests
        })

    }

    let statusAccepted = user.type === 'MANAGER' ? 'IN_REVIEW' : 'IN_PROCESS'

    let query = {
        status: statusAccepted,
    }
    
    let emergencyNeeded = user.type === 'EMERGENCY'

    if (emergencyNeeded) {
        query.emergency = true;
    } else if (user.type === 'MANAGER') {
        query.time = {
            $gte: Date.now() - (20 * 60 * 1000)
        }
    }

    let pendingRequests = await Request.find(query)

    return res.status(200).json({
        requests: pendingRequests
    })

})


module.exports = router