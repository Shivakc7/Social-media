const express = require("express");
const router = express.Router();
const User = require("../modals/User");
const bcrypt = require("bcrypt");
// Register

router.post("/register", async (req, res) => {
  try {
    // generate new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });

    // save user and  respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error)

  }
});

router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        !user && res.status(404).send("user not found")
        
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).send('wrong password')

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})
module.exports = router;
