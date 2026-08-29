import User from "../models/user.js"
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    //grab the tokens from user
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    console.log("Decoded JWT:", decoded);


    req.user = decoded;

    next();

  } catch (error) {
    console.log("JWT verification failed")
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default authMiddleware;