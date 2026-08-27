import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import Authrouter from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Database
connectDB();



// Routes
app.get("/", (req, res) => {
  res.send("Server is Listening....");
});

app.use("/auth",Authrouter);



// Server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is Running on PORT: http://localhost:${PORT}`);
});