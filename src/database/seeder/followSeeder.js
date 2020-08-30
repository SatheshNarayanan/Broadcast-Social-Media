require("../dbConfig");
require("../models/userModel");
const Follow = require("../models/userFollower");

const follow = [
  {
    user: "5f4a5c438c59ec097a25734b",
    follower: "5f4a5c438c59ec097a25734a"
  }
];

const saveFollow = () => {
  follow.forEach(async (element) => {
    const newFollow = await new Follow(element);

    try {
      const result = await newFollow.save();
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  });
};

saveFollow();
