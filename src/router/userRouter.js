require("../database/dbConfig");
const express = require("express");
const { hash, compareHash } = require("../utils/hash");
const { sign } = require("../utils/jwtService");
const {
  findUsers,
  findDupliMail,
  findUsersbulk
} = require("../database/query/userQuery");
const { userSchema, editSchema } = require("../validation/userValidation");
const User = require("../database/models/userModel");
const Follower = require("../database/models/userFollower");
const auth = require("../middlewares/auth");
const passiveauth = require("../middlewares/passiveauth");

const userRouter = express.Router();

userRouter.get("/follow/:id", auth, async (request, response) => {
  const { id } = request.params;
  const { email } = request.jwt;
  try {
    const data = await findUsers(email, "email");
    const dataFollow = await User.find({ _id: id });
    console.log(dataFollow);
    let { _id, following } = data[0];
    let { _id: idF, followers } = dataFollow[0];
    following += 1;
    followers += 1;
    console.log(following, followers);
    const updateUser = await User.findOneAndUpdate(
      {
        _id: _id
      },
      {
        following: following
      }
    );
    const updateFollower = await User.findOneAndUpdate(
      {
        _id: idF
      },
      {
        followers: followers
      }
    );
    const newFollower = await new Follower({
      user: _id,
      follower: id
    });
    const result = await newFollower.save();
    console.log(result);
    response.status(200).send({
      message: "User has been followed"
    });
  } catch (e) {
    console.log(e);
    response.status(500).send({
      message: "Please try after some time"
    });
  }
});

userRouter.get("/unfollow/:id", auth, async (request, response) => {
  const { id } = request.params;
  const { email } = request.jwt;
  try {
    const data = await findUsers(email, "email");
    const dataFollow = await User.find({ _id: id });
    console.log(dataFollow);
    let { _id, following } = data[0];
    let { _id: idF, followers } = dataFollow[0];
    following -= 1;
    followers -= 1;
    console.log(following, followers);
    const updateUser = await User.findOneAndUpdate(
      {
        _id: _id
      },
      {
        following: following
      }
    );
    const updateFollower = await User.findOneAndUpdate(
      {
        _id: idF
      },
      {
        followers: followers
      }
    );
    const result = await Follower.deleteOne({
      user: _id,
      follower: id
    });
    console.log(result);
    response.status(200).send({
      message: "User has been un followed"
    });
  } catch (e) {
    console.log(e);
    response.status(500).send({
      message: "Please try after some time"
    });
  }
});

userRouter.post("/uniqueid/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await findUsers(id, "id");
    if (result.length > 0) {
      response.status(400).json({
        message: "Unique Id is already taken"
      });
    } else {
      response.status(200).json({
        message: "The id provided is unique"
      });
    }
  } catch (e) {
    response.status(500).json({
      message: "Please try again after sometime"
    });
  }
});

userRouter.post("/findusers/:id", auth, async (request, response) => {
  try {
    const { id } = request.params;
    const { email } = request.jwt;
    const result = await findUsersbulk(id, email);
    if (result.length > 0) {
      response.status(200).json({
        data: result
      });
    } else {
      response.status(400).json({
        message: "Please try after some time"
      });
    }
  } catch (e) {
    response.status(500).json({
      message: "Please try again after sometime"
    });
  }
});

userRouter.post("/signup", async (request, response) => {
  const result = userSchema.validate(request.body);
  if (result.error) {
    response.status(400).send({
      message: "Data entered is invalid!!"
    });
  } else {
    try {
      const { email, password, uniqueId } = request.body;
      console.log(email, password);
      const exists = await findUsers(email, "email");
      if (exists.length > 0) {
        response.status(400).send({
          message: "Email id already exists"
        });
      } else {
        const data = {
          ...request.body,
          password: hash(password),
          email: email.toLowerCase(),
          uniqueId: uniqueId.toLowerCase()
        };
        const newUser = await new User(data);
        const result = await newUser.save();
        response.status(200).send({
          message: "User signed Up successfully"
        });
      }
    } catch (e) {
      response.status(400).send(e);
    }
  }
});

userRouter.post("/login", async (request, response) => {
  const { email, password } = request.body;
  const exists = await findUsers(email, "email");
  if (exists.length > 0) {
    const isValidPassword = compareHash(password, exists[0].password);
    if (isValidPassword) {
      const token = sign({
        sub: "user",
        email
      });
      response.cookie("jwt", token, { httpOnly: true });
      response.status(200).json({
        message: "Valid user!!"
      });
    } else {
      response.status(400).send("Invalid User");
    }
  } else {
    response.status(400).send("Invalid User");
  }
});

userRouter.post("/updateProfile", auth, async (request, response) => {
  const result = editSchema.validate(request.body);
  const { email: emails } = request.jwt;
  if (result.error) {
    response.status(400).send({
      message: "Data entered is invalid!!"
    });
  } else {
    try {
      const exists = await findUsers(emails, "email");
      const { _id: id } = exists[0];
      const { email } = request.body;
      const newExists = await findDupliMail(email, id);
      if (exists.length < 1 || newExists.length > 0) {
        response.status(400).send({
          message: "Email has already been registered against another user"
        });
      } else {
        const data = {
          ...request.body,
          email: email.toLowerCase()
        };
        const result = await User.findOneAndUpdate(
          {
            email: emails
          },
          data
        );
        console.log(result);
        response.status(200).send({
          message: "User signed Up successfully"
        });
      }
    } catch (e) {
      console.log(e);
      response.status(400).send(e);
    }
  }
});

module.exports = userRouter;
