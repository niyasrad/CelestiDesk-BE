const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    origin: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Employee'
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    requestdate: {
        type: Date,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["IN_PROCESS", "IN_REVIEW", "ACCEPTED", "REJECTED"],
        default: "IN_PROCESS"
    }
})

module.exports = mongoose.model('Request', requestSchema)