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
    from: {
        type: Date,
        default: () => new Date()
    },
    to: {
        type: Date,
        default: () => {
            const day = new Date()
            day.setHours(23, 59, 59, 999)
            return day
        }
    },
    status: {
        type: String,
        enum: ["IN_PROCESS", "IN_REVIEW", "ACCEPTED", "REJECTED"],
        default: "IN_PROCESS"
    }
})

module.exports = mongoose.model('Request', requestSchema)