const mongoose = require("mongoose");
const { Transaction } = require("../models/Transaction");
const { User } = require("../models/User");
const moment = require("moment");


module.exports.add_transaction_post = async (req, res) => {
    try {
        const {
            title,
            amount,
            category,
            description,
            transactionType,
            date,
            userId
        } = req.body;

        if (!title ||
            !amount ||
            !category ||
            !description ||
            !transactionType ||
            !date
            )
            {
            res.status(408).json({
                success: false,
                message: "All fields are required"
            })
        } 
        else {
            const user = await User.findById({_id: userId});
            if (!user) {
                res.status(404).json({
                    message: "User not found"
                })
            } else {
                const transaction = new Transaction({
                    title: title,
                    amount: amount,
                    category: category,
                    description: description,
                    transactionType: transactionType,
                    date: date,
                    userId: userId
                })
                // append new transaction into empty array in model
                user.transactions.push(transaction);

                await user.save();
                res.status(201).json({
                    success: true,
                    message: "Transaction successfully created!"
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: error.message,
            message: "Couldn't add this transaction at this moment"
        })
    }
}



// get transaction using Id
module.exports.get_transaction_by_id = async (req, res) => {

}



module.exports.get_all_transactions = async (req, res) => {

}


// update transaction using Id
module.exports.update_transaction = async (req, res) => {

}


// delete transaction using transactionId
module.exports.delete_transaction = async (req, res) => {

}