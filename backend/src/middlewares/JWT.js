const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign({ username: user.firstName, id: user._id }, process.env.SECRET);
  return accessToken;
}

const validateToken = (req, res, next) => {
  const accessToken = req.query.access;
  if (!accessToken) {
    return res.status(400).send({ error: "User not Authenticated!!!", status: false });
  }
  try {
    const validToken = verify(accessToken, process.env.SECRET);
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