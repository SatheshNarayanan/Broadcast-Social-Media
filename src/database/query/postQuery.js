require("../dbConfig");
require("../models/userModel");
const Posts = require("../models/postsModel");

const dataSeperator = (element) => {
  const data = {
    name: element.userId.firstName + " " + element.userId.lastName,
    likes: element.likes,
    title: element.title,
    content: element.content,
    date: element.createddate,
    id: element._id
  };
  return data;
};

const findPosts = async () => {
  let result;
  result = await Posts.find()
    .sort({ createddate: "desc" })
    .populate("userId", "firstName lastName");
  const output = await result.map((element) => dataSeperator(element));
  console.log(output);
  return output;
};

module.exports = { findPosts };
