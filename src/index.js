const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressHBS = require("express-handlebars");
const ifEquality = require("./views/helpers/ifEquality");
const userRouter = require("./router/userRouter");
const postRouter = require("./router/postRouter");
const auth = require("./middlewares/auth");
const passiveauth = require("./middlewares/passiveauth");
const { findUsers } = require("./database/query/userQuery");
const { findPosts } = require("./database/query/postQuery");
const app = express();

const hbs = expressHBS.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials"),
  helpers: {
    ifEquality
  }
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));

app.use("/public", express.static(path.join(__dirname, "./public")));
app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/post", postRouter);

const seperateFunc = (users) => {
  const data = {
    firstName: users.firstName,
    lastName: users.lastName,
    uniqueId: users.uniqueId,
    followers: users.followers,
    following: users.following,
    myPosts: users.myPosts,
    status: users.status,
    gender: users.gender,
    email: users.email,
    password: users.password
  };
  return data;
};

app.get("/signup", passiveauth, (request, response) => {
  response.status(200).render("signup.hbs", {
    layout: "main.hbs",
    title: "Sign up",
    login: "false",
    action: "/user/signup",
    method: "POST"
  });
});

app.get("/", passiveauth, (request, response) => {
  response.status(200).render("login.hbs", {
    layout: "main.hbs",
    title: "Login",
    login: "false",
    action: "/user/login",
    method: "POST"
  });
});

app.get("/createPost", auth, (request, response) => {
  response.status(200).render("createPost.hbs", {
    layout: "main.hbs",
    title: "Create Post",
    login: "true",
    action: "post/create",
    method: "POST"
  });
});

app.get("/myPosts", auth, async (request, response) => {
  const data = await findPosts();
  response.status(200).render("myPosts.hbs", {
    layout: "main.hbs",
    title: "My Posts",
    data: data
  });
});

app.get("/editProfile", auth, async (request, response) => {
  const { email } = request.jwt;
  const data = await findUsers(email, "email");
  let users = seperateFunc(data[0]);
  response.status(200).render("signup.hbs", {
    layout: "main.hbs",
    title: "Edit Profile",
    login: "true",
    user: users,
    action: "/user/updateProfile",
    method: "POST"
  });
});

app.get("/findUsers", auth, async (request, response) => {
  const { email } = request.jwt;
  const data = await findUsers(email, "email");
  let users = seperateFunc(data[0]);
  response.status(200).render("findUsers.hbs", {
    layout: "main.hbs",
    title: "Find Users",
    login: "true",
    user: users
  });
});

app.get("/profile", auth, async (request, response) => {
  const { email } = request.jwt;
  const data = await findUsers(email, "email");
  let users = seperateFunc(data[0]);
  console.log(users);
  response.status(200).render("profile.hbs", {
    layout: "main.hbs",
    title: "Profile",
    login: "true",
    user: users
  });
});

app.get("/editProfile", auth, async (request, response) => {
  const { email } = request.jwt;
  const data = await findUsers(email, "email");
  let users = seperateFunc(data[0]);
  response.status(200).render("signup.hbs", {
    layout: "main.hbs",
    title: "Edit Profile",
    login: "true",
    user: users,
    action: "/user/updateProfile",
    method: "POST"
  });
});

app.get("/logout", auth, (request, response) => {
  response.clearCookie("jwt");
  response.redirect("/");
});

app.get("*", (req, res) => {
  res.status(404).send("<h1> 404,Page Not Found </h1>");
});

app.listen(process.env.port || 8080, () => {
  console.log("App is running!!");
});
