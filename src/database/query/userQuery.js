require("../dbConfig");
const User = require("../models/userModel");
const Follow = require("../models/userFollower");

const findUsers = async (data, element) => {
  let result;
  if (element === "id") {
    result = await User.find({ uniqueId: data });
  } else {
    result = await User.find({ email: data });
  }

  return result;
};

const findDupliMail = async (email, id) => {
  let result;
  result = await User.find({ _id: { $nin: [id] }, email });
  return result;
};

const findUsersbulk = async (datas, email) => {
  const data = await findUsers(email, "email");
  const id = data[0]["_id"];
  console.log(id);
  const followers = await Follow.find({ user: id });
  let userIds = [];
  followers.forEach((element) => {
    userIds.push(element.follower);
  });
  let result = await User.find({
    uniqueId: { $regex: datas },
    _id: { $nin: [id] }
  }).limit(5);
  result.forEach((element) => {
    userIds.forEach((data) => {
      if (element._id.equals(data)) {
        console.log(element);
        element.password = "yes";
      }
    });
  });
  return result;
};

module.exports = { findUsers, findDupliMail, findUsersbulk };
