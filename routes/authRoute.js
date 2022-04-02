const express = require("express");
const router = express.Router();
const CryptoJs = require("crypto-js");

const User = require("../models/user");

//Register route
router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString() 
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(500).json(error);
    }
})





module.exports = router;