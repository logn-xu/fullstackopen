const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

userRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;
  if (username.length <= 3 || password.length <= 3) {
    return res
      .status(400)
      .json({ error: "User name or password length is greater than 3" });
  }

  const saltRound = 10;
  const passwordHash = await bcrypt.hash(password, saltRound);

  const user = User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

userRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  res.status(200).json(users);
});

module.exports = userRouter;
