import e from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getDashboardOverview } from "../controllers/dashboardController.js";

const dashRouter = e.Router();

dashRouter.get("/",authMiddleware,getDashboardOverview);

export default dashRouter;