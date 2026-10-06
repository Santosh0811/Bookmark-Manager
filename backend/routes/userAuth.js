const bcrypt = require('bcrypt');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require("resend");
const fetchUser = require('../middleware/fetchUser.js');
const signupSchema = require('../model/Signup.js');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const resend = new Resend(process.env.RESEND_APIKEY);

const mail = async ({ name, email, msg, sub }) => {
  try {
    const otp = crypto.randomInt(100000, 999999).toString();

    if (!otp) {
      return res.status(500).json({ message: "OTP not Generated" });
    }

    const hashedOtp = await bcrypt.hash(otp, 10);

    const otpExpireAt = Date.now() + 10 * 60 * 1000;

    const updatedUserData = await signupSchema.findOneAndUpdate({ email: email }, { otp: hashedOtp, otpExpireAt });

    if (!updatedUserData) {
      return res.status(404).json({ message: "OTP not Send" });
    }

    await resend.emails.send({
      from: `${msg} <no-reply@santoshvishwakarma.site>`,
      to: [`${name} <${email}>`],
      subject: `${sub}`,
      html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>Your Verification Code</title>
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f7;
                  font-family: 'Segoe UI', sans-serif;
                }
                .email-container {
                  max-width: 600px;
                  margin: auto;
                  background-color: #ffffff;
                  padding: 40px;
                  border-radius: 10px;
                  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
                }
                .header {
                  text-align: center;
                  padding-bottom: 20px;
                }
                .header h1 {
                  font-size: 26px;
                  color: #4f46e5;
                }
                .content {
                  font-size: 16px;
                  color: #333;
                  line-height: 1.6;
                }
                .otp-code {
                  font-size: 24px;
                  font-weight: bold;
                  color: #1f2937;
                  background: #e0e7ff;
                  padding: 10px 20px;
                  border-radius: 8px;
                  display: inline-block;
                  margin-top: 20px;
                }
                .footer {
                  text-align: center;
                  font-size: 13px;
                  color: #999;
                  margin-top: 40px;
                }
                .textInJustify {
                  text-align: justify;
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="header">
                  <h1>Verification Code</h1>
                </div>
                <div class="content">
                  <p>Hi <strong>${name}</strong>,</p>
                  <p>Your One-Time Password (OTP) is:</p>
                  <div class="otp-code">${otp}</div>
                  <p class="textInJustify">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
                </div>
                <div class="footer">
                  <p>Thanks for using our service!</p>
                </div>
              </div>
            </body>
            </html>
            `,
    });

  } catch (mailError) {
    console.error("Mail sending failed:", mailError.message);

    return res.status(500).json({
      message: "Login failed: Unable to send confirmation email",
    });
  }

}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    const user = await signupSchema.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "Email is not Registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    const isUserVerified = user.verified;

    if (!isUserVerified) {
      return res.status(401).json({ verified: false, message: "User not verified" });
    }

    try {
      await mail({ name: user.userName, email: user.email, msg: "Bookmark-noreply", sub: "Login into Bookmark Site - Your OTP Code" })
    } catch (error) {
      return res.status(400).json({ message: "Failed to send otp" });
    }

    return res.status(200).json({ message: "Check your Email for OTP" });

  } catch (error) {
    console.error("Error while Login", error);
    res.status(500).json({ message: "Error while Login" });
  }
})

router.post('/signup', async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ error: "Missing required field" });
    }

    const user = await signupSchema.findOne({ email });

    if (user) {
      return res.status(401).json({ message: "Email is already Registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new signupSchema({ userName, email, password: hashedPassword });

    if (!newUser) {
      return res.status(404).json({ message: "Failed to Create Account" });
    }

    await newUser.save();

    try {
      await mail({ name: userName, email: email, msg: "Bookmark-noreply", sub: "Account Creating into Bookmark Site - Your OTP Code" })
    } catch (error) {
      return res.status(400).json({ message: "Failed to send otp" });
    }

    return res.status(200).json({ message: "Check your Email for OTP" });

  } catch (error) {
    console.error("Error while Login", error);
    res.status(500).json({ message: "Error while Creating a Account" });
  }
})

router.post('/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;

    const userData = await signupSchema.findOne({ email });

    if (!userData) {
      return res.status(404).json({ message: "Email not Registered" });
    }

    const isUserVerified = userData.verified;

    if (!isUserVerified) {
      return res.status(401).json({ verified: false, message: "User not verified" });
    }

    try {
      await mail({ name: userData.userName, email: userData.email, msg: "Bookmark-noreply", sub: "Forgot Password of your Account - Your OTP Code" })
    } catch (error) {
      return res.status(400).json({ message: "Failed to send otp" });
    }

    return res.status(200).json({ message: "Check your Email for OTP" });

  } catch (error) {
    console.error("Error while Forgoting Password:", error);
    res.status(500).json({ message: "Error while Forgoting Password" });
  }
})

router.post('/resendOtp', async (req, res) => {
  try {
    const { email, method } = req.body;

    if (!email) {
      return res.status(500).json({ message: "Missing Email" });
    }

    const userData = await signupSchema.findOne({ email });

    if (!userData) {
      return res.status(404).json({ message: "Email not found" });
    }

    try {
      await mail({ name: userData.userName, email: userData.email, msg: method, sub: "Verify your Email - Your Re-Send OTP Code" })
    } catch (error) {
      return res.status(400).json({ message: "Failed to send otp" });
    }

    return res.status(200).json({ message: "Check your Email for OTP" });

  } catch (error) {
    console.error("Error while Re-Sending OTP:", error);
    res.status(500).json({ message: "Error while Re-Sending OTP" });
  }
})

router.put('/changePasswordOutside', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (!newPassword) {
      return res.status(404).json({ message: "New Password is Blank" });
    }

    const userPassword = await signupSchema.findOne({ email });

    if (!userPassword) {
      return res.status(404).json({ message: "No account Found to change Password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userPassword.updateOne({ password: hashedPassword }, { new: true });

    return res.status(200).json({ message: "Password Changed Successfully" });

  } catch (error) {
    console.error("Error while Changing Password:", error);
    res.status(500).json({ message: "Error while Changing Password" });
  }
})

router.post("/verifyOtp", async (req, res) => {
  try {
    const { email, otp, method } = req.body;

    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (!otp) {
      return res.status(404).json({ message: "Otp not found" });
    }

    const userData = await signupSchema.findOne({ email: email });

    if (!userData) {
      return res.status(404).json({ message: "Email not Registered" });
    }

    if (Date.now() > userData.otpExpireAt) {
      return res.status(401).json({ message: "OTP is Expired" });
    }

    const decryptOtp = await bcrypt.compare(otp, userData.otp);

    if (!decryptOtp) {
      return res.status(401).json({ message: "OTP is not Correct" });
    }

    await userData.updateOne({ verified: true, otp: null, otpExpireAt: null }, { new: true });

    if (method === "Login") {
      const authToken = jwt.sign({ userId: userData.userId }, JWT_SECRET, { expiresIn: "1h" });

      res.cookie("bookmark_token", authToken, { httpOnly: true, sameSite: "none", secure: true, maxAge: 60 * 60 * 1000 });

      return res.status(200).json({
        success: true,
        verified: true,
        message: "Login Successfully"
      });
    }

    if (method === "Signup") {
      return res.status(200).json({ message: "Account created successfully" });
    }

    if (method === "ForgotPassword") {
      return res.status(200).json({ message: "Otp verified" });
    }

    if (method === "VerifyEmail") {
      return res.status(200).json({ message: "Email verified successfully" });
    }

  } catch (error) {
    console.error("Error while Verifying OTP:", error);

    res.status(500).json({
      message: "Error while Verifying OTP"
    });
  }
});

router.get("/checkLogin", fetchUser, async (req, res) => {
  try {
    const user = await signupSchema.findOne({ userId: req.userId });

    if (!user) {
      return res.status(404).json({ message: "Login Required" });
    }

    return res.status(200).json({ userInfo: user });

  } catch (error) {
    console.error("Error while Verifying OTP:", error);
    res.status(500).json({ message: "Error while Verifying OTP" });
  }
})

router.post("/logout", fetchUser, async (req, res) => {
  try {
    const user = await signupSchema.findOne({ userId: req.userId });

    if (!user) {
      return res.status(404).json({ message: "Login Required" });
    }

    res.clearCookie("bookmark_token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });

    return res.status(200).json({
      message: "Logout successful",
    });

  } catch (error) {
    console.error("Error while logout:", error);
    res.status(500).json({ message: "Error while logout" });
  }
})

module.exports = router;