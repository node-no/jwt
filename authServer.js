require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const refreshTokens = [];

app.post("/login", (req, res) => {
  const user = { name: req.body.name };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: 15,
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_KEY);
  refreshTokens.push(refreshToken);

  return res.json({ accessToken: accessToken, refreshToken: refreshToken });
});
app.post("/token", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, decoded) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: decoded.name });
    return res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens.pop(req.body.refreshToken);
  return res.sendStatus(204);
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: 15,
  });
}
app.listen(4000);
