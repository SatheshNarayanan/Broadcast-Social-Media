const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userFollowing = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  follower: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  }
});

const Follow = model("Follow", userFollowing);

module.exports = Follow;
