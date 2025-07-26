//This module defiens the user fields like email password and others in the database.

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required:true },
  email: { type: String, required:true, unique:true, lowercase:true },
  password: { type: String, required:true },
  isAdmin: { type: Boolean, default:false },
  isVerified: { type: Boolean, default:false },
  emailToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps:true });

module.exports = mongoose.model('User', userSchema);