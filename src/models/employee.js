const mongoose = require('mongoose')

const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    orghandle: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['EMPLOYEE', 'TEAM_LEAD', 'MANAGER'],
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Employee', employeeSchema)