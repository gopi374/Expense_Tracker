import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addExpense, deleteExpense, downnloadExpense, getAllexpense, getExpenseOverview, updateExpense } from "../controllers/expenseController.js";

const expenseRouter = express.Router();

expenseRouter.post("/add",authMiddleware,addExpense);
expenseRouter.get("/all",authMiddleware,getAllexpense);

expenseRouter.put("/update/:id",authMiddleware,updateExpense);
expenseRouter.delete("/delete/:id",authMiddleware,deleteExpense);

expenseRouter.get("/download",authMiddleware,downnloadExpense);
expenseRouter.get("/overview",authMiddleware,getExpenseOverview);

export default expenseRouter;