const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema({
    origin: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Employee'
    },
    responder: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Employee'
    },
    request: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Request'
    },
    result: {
        type: String,
        enum: ["EXPIRED","ACCEPTED", "REJECTED"],
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Transaction', transactionSchema)