//This module handles the logic for user registraion , login , email verification , forget password and others

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");

exports.register = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const emailToken = crypto.randomBytes(32).toString("hex");

    user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      emailToken,
    });
    await user.save();

    // Send verification email
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${emailToken}`;

    const message = `<p>Hello ${name}, please verify your email by clicking this link:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`;

    await sendEmail({
      to: email,
      subject: "Pizza App - Verify Email",
      html: message,
    });

    res.status(201).json({
      message: "Registered successfully, check your email to verify.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ emailToken: req.params.token });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    user.emailToken = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {

  res.status(200).json({ message: "Logged out successfully" });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `<p>Click this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`;

    await sendEmail({
      to: email,
      subject: "Pizza App - Reset Password",
      html: message,
    });

    res.json({ message: "Email sent for password reset" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ user });
};
