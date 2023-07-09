const router = require('express').Router()
const bcrypt = require('bcrypt')
const { generateToken } = require('../utils/jwt.util')
const Employee = require('../models/employee')
const Org = require('../models/org')

router.post('/signup', async (req, res) => {

    if (!req.body.name || !req.body.username || !req.body.orghandle || !req.body.type || !req.body.password) {
        return res.status(400).json({
            message: "Please check all the fields!"
        })
    }

    if (!['EMPLOYEE', 'TEAM_LEAD', 'MANAGER'].includes(req.body.type)) {
        return res.status(400).json({
            message: "Please check your type!"
        })
    }

    const hashedPass = await bcrypt.hash(req.body.password, 10)
    const findEmployee = await Employee.findOne({
        username: req.body.username
    })

    if (findEmployee) {
        return res.status(400).json({
            message: "Username Already Exists"
        })
    }

    const findOrg = await Org.findOne({
        handle: req.body.orghandle
    })

    if (!findOrg) {
        return res.status(400).json({
            message: "Organization Not Found!"
        })
    }

    try {

        const employeeInstance = new Employee({
            name: req.body.name,
            username: req.body.username,
            orghandle: req.body.orghandle,
            type: req.body.type,
            password: hashedPass
        })
    
        await employeeInstance.save()
    
        const token = generateToken({ username: employeeInstance.username })
    
        return res.status(200).json({
            message: "Employee Added Successfully!",
            token: token
        })

    } catch (err) {
        
        console.log(err.message)
        return res.status(500).json({
            message: "Something Went Wrong!"
        })

    }

})

router.post('/login', async (req, res) => {

    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: "Please check all the fields!"
        })
    }

    const findEmployee = await Employee.findOne({
        username: req.body.username
    })

    if (!findEmployee) {
        return res.status(400).json({
            message: "Username Not Found!"
        })
    }

    const isMatch = await bcrypt.compare(req.body.password, findEmployee.password)

    if (!isMatch) {
        return res.status(400).json({
            message: "Check Your Credentials!"
        })
    }

    const token = generateToken({ username: findEmployee.username })

    return res.status(200).json({
        message: "Logged In Successfully!",
        token: token
    })

})

module.exports = router