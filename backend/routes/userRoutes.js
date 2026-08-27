import express from "express"
import { Router } from "express";
import { loginUSer, registerUser, getLoginUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const Authrouter = express.Router();

Authrouter.post("/register", registerUser);
Authrouter.post("/login", loginUSer);
Authrouter.get("/me",authMiddleware, getLoginUser);

export default Authrouter;