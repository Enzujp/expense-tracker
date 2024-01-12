const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'This is field is required']
    },
    amount: {
        type: Number,
        required: true
    },
    category : {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    transactionType :{
        type: String,
        required: true
    },
    date: {
        type : Date,
        required: true
    },
    user: {
        type: mongoose.Types.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: new Date(),
    }
})


const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = { Transaction };