const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const authMiddleware = require('../middleware/authMiddleware')

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../Models/user");

const router = express.Router();

//User Register..

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
  
    // if (!name || !email || !password) {
    //   console.log(req.body);
    //   return res.json({ success: false, message: "Missing Details" });
    // }
  
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.json({ success: false, message: "User already exists" });
      }
  
      const hashPassword = await bcrypt.hash(password, 10);
  
      const user = new User({ name, email, password: hashPassword });
      await user.save();
  
      //Generated an token..
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      // added this token in this cookie...
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ success: true }); //Because User Registered.
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  });
//Login..

router.post('/login', authMiddleware , async (req, res) => {
    //Get the email and password from the user body..
    const { email, password } = req.body;
  
    //Let validate these..
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and Password are required",
      });
    }
    //Sopposed we have email and password..
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.json({ success: false, message: "Invalid Email" });
      }
      //Soppossed there are exists user then check the their password..
      //first we have get password and compare them..that will be stored in database
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.json({ success: false, message: "Invalid Password" });
      }
      // Sopposed the password is Matching..exicute the next line..
  
      // then here create one token and ussing this token user will authenticated and logged in the wesite..
      //TO generate the token..
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      // added this token in this cookie... //or send this token in this response..
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      return res.json({ success: true }); //Because User is logged in.
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  });
module.exports = router;
