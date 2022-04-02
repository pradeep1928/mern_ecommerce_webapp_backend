const express = require("express");
const router = express.Router();
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

//Register route
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Login route
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    // checking if not user
    // use of && is similar to use of if condition
    !user && res.status(401).json("Wrong username or password");

    // decrypting password
    const hashedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

    originalPassword != req.body.password &&
      res.status(401).json("Wrong username or password");

    // accessing jwt token
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3600s" }
    );
    // destructuring password and other information of user
    // and sending only other information, and not password
    const { password, ...otherInfo } = user._doc;
    res.status(200).json({...otherInfo, accessToken}); //jwt token is also passed
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
