const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const postsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  likes: {
    type: Number,
    required: true,
    default: 0
  },
  createddate: {
    type: Date,
    default: Date.now()
  }
});

const Posts = model("Posts", postsSchema);

module.exports = Posts;
