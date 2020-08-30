require("../dbConfig");
const User = require("../models/userModel");
const { hash } = require("../../utils/hash");

const users = [
  {
    firstName: "Moses",
    lastName: "Stephen",
    email: "moses@gmail.com",
    password: hash("12345"),
    uniqueId: "@mosa",
    gender: "Male",
    status: "Single"
  },
  {
    firstName: "Sathesh",
    lastName: "N",
    email: "sathesh@gmail.com",
    password: hash("12345"),
    uniqueId: "@sathesh",
    gender: "Male",
    status: "Single"
  },
  {
    firstName: "Paramasivam",
    lastName: "M",
    email: "paramasivam@gmail.com",
    password: hash("12345"),
    uniqueId: "@paramasivam",
    gender: "Male",
    status: "Committed"
  }
];

const saveUser = () => {
  users.forEach(async (element) => {
    const newUser = await new User(element);

    try {
      const result = await newUser.save();
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  });
};

saveUser();
