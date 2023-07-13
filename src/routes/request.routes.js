const router = require('express').Router()
const { verifyToken } = require('../utils/jwt.util')
const Employee = require('../models/employee')
const Request = require('../models/request')

router.post('/create', verifyToken, async (req, res) => {

    if (!req.body.subject || !req.body.message || !req.body.date ) {
        return res.status(400).json({
            message: "Please check all the fields!"
        })
    }

    try {

        const employeeRequest = new Request({
            origin: req._id,
            subject: req.body.subject,
            message: req.body.message,
            requestdate: new Date(req.body.date),
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

        let pendingRequests = await Request.find({
            origin: user._id
        })

        return res.status(200).json({
            requests: pendingRequests
        })

    }

    let statusAccepted = user.type === 'MANAGER' ? 'IN_REVIEW' : 'IN_PROCESS'

    let pendingRequests = await Request.find({
        status: statusAccepted
    })

    return res.status(200).json({
        requests: pendingRequests
    })

})


module.exports = router