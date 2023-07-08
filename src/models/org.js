const mongoose = require('mongoose')

const orgSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    handle: {
        type: String,
        unique: true,
        required: true
    },
    passkey: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Org', orgSchema)