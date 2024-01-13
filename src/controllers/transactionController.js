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
                    _id: new mongoose.Types.ObjectId(),
                    title: title,
                    amount: amount,
                    category: category,
                    description: description,
                    transactionType: transactionType,
                    date: date,
                    user: userId // user makes use of generated signup id everytime they have to create a new transaction
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
// ideally we would use sessions for this
try {
    const id = req.params.transactionId;
    if (req.user){
        const transaction = await Transaction.findOne({_id: id});
        if (transaction){
            res.status(200).json({
                success: true,
                transaction: transaction
            })
        }
        else {
            res.status(400).json({
                message: "No Transactions matching this Id."
            })
        }
        
    }
    return res.status(400).json({
        message: "Unauthorized. You don't have access to this transaction."
    })
    
} catch (error) {
    console.log(error);
    res.status(500).json({
        message: "Couldn't find transaction"
    })
}
}


module.exports.get_transactions_in_specified_range = async (req, res) => {
    try {
        const { userId, type, frequency, startDate, endDate } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            })
        }
        const query = {
            user: userId
        }
        if (type !== 'all') {
            query.transactionType = type;
        }

        // Set date conditions on frequency and custom range
        if (frequency !== 'custom') {
            query.date = {
                $gt: moment().subtract(Number(frequency), "days").toDate()
            }
        } else if (startDate && endDate) {
            query.date = {
                $gte: moment(startDate).toDate(),
                $lte: moment(endDate).toDate()
            };
        }
        const transactions = await Transaction.find(query);
        return res.status(200).json({
            message: "Here are your transactions in stipulated time period",
            transactions: transactions
        })
            
        
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: error.message,
            message: "Could not retrieve transactions at this time"
        })
    }
}


// update transaction using Id
module.exports.update_transaction = async (req, res) => {
    try {
        const id = req.params.transactionId;
        const { title, amount, description, date, category, transactionType } = req.body;

        const transactionDetails = await Transaction.findById(id);

        if (!transactionDetails) {
            res.status(400).json({
                message:"Could not find this transaction"
            })
        }

        const updateOps = {}
        for (ops in req.body) {
            updateOps[ops.propName] = ops.value
        }
        const updatedTransaction = await Transaction.update({_id: id}, { $set: updateOps })
        updatedTransaction.save();
        res.status(200).json({
            success: true,
            message: "Transaction has been updated"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Couldn't update this transaction."
        })
    }
}


// delete transaction using transactionId
module.exports.delete_transaction = async (req, res) => {
    try {
        const id = req.params.transactionId; // id generated by mongoose
        const userId = req.body.userId;

        // perhaps this should be jwt signed ?
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }
        else {
            const transaction = await Transaction.findByIdAndDelete(id);
            if (!transaction) {
                res.status(400).json({
                    message: "Could not find this transaction"
                });
            } 
            const transactionArr = user.transactions.filter(
                (transaction) => transaction._id === id
            );

            user.transactions = transactionArr;
            user.save();

            return res.status(200).json({
                success: true,
                message: "Transaction successfully deleted"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Could not delete this transaction",
            error: error.message
        })
    }
};