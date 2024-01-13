const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");


router.post("/addTransaction", transactionController.add_transaction_post);
router.get("/:transactionId", transactionController.get_transaction_by_id);
// router.post("/", transactionController.get_all_transactions_within_specified_range);
router.patch("/:transactionId", transactionController.update_transaction);
router.delete("/:transactionId", transactionController.delete_transaction);


module.exports = router;

