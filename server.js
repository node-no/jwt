require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const posts = [
  {
    username: "Kyle",
    title: "Post 1",
  },
  {
    username: "Huy",
    title: "Post 2",
  },
];

app.get("/", authenticateUser, (req, res) => {
  return res.json(posts.filter((post) => post.username == req.user.name));
});

function authenticateUser(req, res, next) {
  const authorization = req.headers["authorization"];
  const acccessToken = authorization && authorization.split(" ")[1];

  if (acccessToken == null) return res.sendStatus(401);
  jwt.verify(acccessToken, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
    if (err) return res.sendStatus(401);
    req.user = decoded;
    next();
  });
}

app.listen(3000);
