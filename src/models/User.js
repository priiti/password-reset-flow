const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
  passwordResetToken: String,
  passwordResetTokenExpiryDate: Date
});

module.exports = mongoose.model('User', userSchema);
