const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign({ username: user.firstName, id: user._id }, process.env.SECRET);   // creating JWT token 
  return accessToken;
}

const validateToken = (req, res, next) => {
  const accessToken = req.query.access;   // token from user request
  if (!accessToken) {
    return res.status(400).send({ error: "User not Authenticated!!!", status: false });
  }
  try {
    const validToken = verify(accessToken, process.env.SECRET);  // validating user's JWT token
    if (validToken) {
      req.authenticated = true;
      req.userId = validToken.id;
      return next();
    }
    return res.status(400).send({ error: "You are not authenticated", status: false });
  } catch (err) {
    return res.status(400).send({ error: err, status: false });
  }
}


module.exports = { createTokens, validateToken };