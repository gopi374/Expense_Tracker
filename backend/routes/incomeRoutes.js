import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addIncome, deleteIncome, downnloadIncome, getAllincome, getIncomeOverview, updateIncome } from "../controllers/incomeController.js";

const incomeRouter = express.Router();

incomeRouter.post("/add",authMiddleware,addIncome);
incomeRouter.get("/all",authMiddleware,getAllincome);

incomeRouter.put("/update/:id",authMiddleware,updateIncome);
incomeRouter.get("/downloadexcel",authMiddleware,downnloadIncome);

incomeRouter.delete("/delete/:id",authMiddleware,deleteIncome);
incomeRouter.get("/overview",authMiddleware,getIncomeOverview);

export default incomeRouter;