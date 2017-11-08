const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('./../models/User');
const mail = require('./../utils/mail');

exports.signUp = async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password
    });

    const registeredUser = await user.save();
    if (!registeredUser) {
      throw new Error('Signup failed!');
    }
    res.status(201).send('Signed up successfully!');
  } catch (error) {
    res.status(500).send(error);
  }
};

// Forgot password flow
exports.forgot = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.send(`Password reset email has been sent to your email: ${req.body.email}`);
    }
    user.passwordResetToken = crypto.randomBytes(20).toString('hex');
    user.passwordResetTokenExpiryDate = Date.now() + 3600000; // 60 min.

    await user.save();
    // TODO: Send email to user
    const resetURL = `http://${req.headers.host}/api/account/reset/${user.passwordResetToken}`;

    mail.send({
      user,
      subject: 'Password reset',
      resetURL
    });

    res.send(`Password reset link sent to ${user.email}`);
  } catch (error) {
    res.status(500).send();
  }
};

exports.reset = async (req, res) => {
  try {
    const user = await User.findOne({
      passwordResetToken: req.params.token,
      passwordResetTokenExpiryDate: { $gt: Date.now() }
    });
    if (!user) {
      res.status(500).send('Password reset is invalid or expired');
    }
    res.send('Enter password');
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    next();
    return;
  }
  res.status(500).send('Passwords does not match');
};

exports.update = async (req, res) => {
  try {
    const user = await User.findOne({
      passwordResetToken: req.params.token,
      passwordResetTokenExpiryDate: { $gt: Date.now() }
    });
    console.log('WTF');
    if (!user) {
      res.send(`Password reset is invalid or expired`);
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiryDate = undefined;
    const updatedUser = await user.save();
    
    res.status(201).send(updatedUser);
  } catch (error) {
    res.status(500).send();
  }
};
