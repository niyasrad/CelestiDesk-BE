const router = require('express').Router()
const bcrypt = require('bcrypt')
const { generateToken } = require('../utils/jwt.util') 
const Org = require('../models/org')

router.post('/create', async (req, res) => {
    
    if (!req.body.name || !req.body.handle || !req.body.passkey) {
        return res.status(400).json({
            message: "Please check all the fields!"
        })
    }

    const hashedPass = await bcrypt.hash(req.body.passkey, 10)
    const findOrg = await Org.findOne({
        handle: req.body.handle
    })

    if (findOrg) {
        return res.status(400).json({
            message: "Organization Already Exists"
        })
    }

    try {

        const organizationInstance = new Org({
            name: req.body.name,
            handle: req.body.handle,
            passkey: hashedPass
        })
    
        await organizationInstance.save()
    
        const token = generateToken({ handle: organizationInstance.handle })
    
        return res.status(200).json({
            message: "Organization Created Successfully!",
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

    if (!req.body.handle || !req.body.passkey) {
        return res.status(400).json({
            message: "Please check all the fields!"
        })
    }

    const findOrg = await Org.findOne({
        handle: req.body.handle
    })

    if (!findOrg) {
        return res.status(400).json({
            message: "Organization Not Found!"
        })
    }

    const isMatch = await bcrypt.compare(req.body.passkey, findOrg.passkey)

    if (!isMatch) {
        return res.status(400).json({
            message: "Check Your Credentials!"
        })
    }

    const token = generateToken({ handle: findOrg.handle })

    return res.status(200).json({
        message: "Logged In Successfully!",
        token: token
    })

})


module.exports = router