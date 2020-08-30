const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"]
  },
  status: {
    type: String,
    required: true,
    enum: ["Single", "Married", "Committed", "Complicated"]
  },
  createddate: {
    type: Date,
    default: Date.now()
  },
  followers: {
    type: Number,
    required: true,
    default: 0
  },
  following: {
    type: Number,
    required: true,
    default: 0
  },
  myPosts: {
    type: Number,
    required: true,
    default: 0
  }
});

const User = model("users", userSchema);

module.exports = User;
