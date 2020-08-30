const { verify } = require("../utils/jwtService");

const passiveauth = (request, response, next) => {
  try {
    const payload = verify(request.cookies.jwt);
    if (payload) {
      request.jwt = payload;
      response.redirect("/myPosts");
    } else {
      next();
    }
  } catch (e) {
    console.log("no prob");
  }
};

module.exports = passiveauth;
