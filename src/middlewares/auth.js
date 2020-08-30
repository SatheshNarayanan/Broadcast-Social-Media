const { verify } = require("../utils/jwtService");

const auth = (request, response, next) => {
  try {
    const payload = verify(request.cookies.jwt);
    if (payload) {
      request.jwt = payload;
      next();
    } else {
      response.redirect("/");
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = auth;
