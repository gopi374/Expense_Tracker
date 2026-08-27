import User from "../models/user.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES = "24h";

const createToken = (Userid) => {
  return jwt.sign({ id: Userid }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
};

//REGISTER New user
export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All Fields are required !!",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Enter a Strong password atleast 8 charaters",
    });
  }

  try {
    if (await User.findOne({ email })) {
      return res.status(409).json({
        success: false,
        message: "email already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = createToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
      message: "Account Created Successfully !!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server Error !",
    });
  }
}

//LOGIN user
export async function loginUSer(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Both feilds are Required !",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email  or password",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server Error !",
    });
  }
}

// to get login user details
export async function getLoginUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select("name email");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found !",
      });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Internal server Error !",
    });
  }
}

// to update user details
export async function updateProfile(req, res) {
  const { name, email } = req.body;

  if (!name || !email || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Valid email and name are required"
    });
  }

  try {
    // Check whether another user already has this email
    const exists = await User.findOne({
      email,
      _id: { $ne: req.user.id }
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email already in use!"
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      {
        new: true,
        runValidators: true
      }
    ).select("name email");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal server error!"
    });
  }
}

//to update the current password
export async function changePassword(req,res){
    const {currentPassword ,newPassword} = req.body;

    if(!currentPassword || !newPassword){
        return res.status(400).json({
            success:false,
            message:"Enter both passwords"
        })
    }

    try {
        const user = await User.findById(req.body.id).select("password");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not Found"
            })
        }
        const match = await bcrypt.compare(currentPassword,user.password);
        if(!match){
            return res.status(201).json({
                success:false,
                message:"Current password is  Incorrect"
            })
        }
        user.password = await bcrypt.hash(newPassword,10);
        await user.save();
        res.json({
            success:true,
            message:"Password changed !"
        })

    } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Internal server Error !",
    });
  }
}