import express from "express"
import { loginUSer, registerUser, getLoginUser, updateProfile, changePassword } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const Authrouter = express.Router();

Authrouter.post("/register", registerUser);
Authrouter.post("/login", loginUSer);

//Protected Routes
Authrouter.get("/me",authMiddleware, getLoginUser);
Authrouter.put("/profileUpdate",authMiddleware,updateProfile);
Authrouter.put("/changePassword",authMiddleware,changePassword)

export default Authrouter;