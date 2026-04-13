const express = require("express");
const {
  createTransaction,
  getTransactions,
  getBranchTransactions,
  getTransactionSummary,
} = require("../controllers/transactionController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);
router.get("/", getTransactions);
router.get("/summary", getTransactionSummary);
router.get("/branch/:branchId", authorize("admin"), getBranchTransactions);
router.post("/", authorize("admin", "branch_manager", "operator"), createTransaction);

module.exports = router;
