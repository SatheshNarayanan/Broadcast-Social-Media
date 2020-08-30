require("../database/dbConfig");
const express = require("express");
const { findUsers } = require("../database/query/userQuery");
const Posts = require("../database/models/postsModel");
const auth = require("../middlewares/auth");
const User = require("../database/models/userModel");

const postRouter = express.Router();

postRouter.post("/create", auth, async (request, response) => {
  const { email } = request.jwt;
  console.log(email);
  try {
    const data = await findUsers(email, "email");
    let { _id: id, myPosts } = data[0];
    const posts = {
      ...request.body,
      userId: id
    };
    const newPosts = await new Posts(posts);
    const result = await newPosts.save();
    myPosts += 1;
    const updateUser = await User.findOneAndUpdate(
      {
        _id: id
      },
      {
        myPosts: myPosts
      }
    );
    response.status(200).send({
      message: "Post has been added successfully"
    });
  } catch (e) {
    response.status(400).send({
      message: "Pleas try after sometime"
    });
  }
});

postRouter.post("/like/:id", async (request, response) => {
  try {
    const { id } = request.params;
    let { likes } = await Posts.findOne({ _id: id }, "likes");
    likes += 1;
    console.log(likes);
    const result = await Posts.findOneAndUpdate(
      {
        _id: id
      },
      {
        likes: likes
      }
    );
    response.status(200).send({
      message: "Post has been Liked"
    });
  } catch (e) {
    response.status(500).send({
      message: "Error"
    });
  }
});

module.exports = postRouter;
