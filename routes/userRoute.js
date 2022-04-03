const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");
const User = require("../models/user");

// Update user info after login 
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateUser)
  } catch (error) {
      res.status(500).json(error);
  }
});

module.exports = router;
