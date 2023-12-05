const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { query, validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'SaileshGhimire';


router.post('/createuser', [
  body('name', 'enter a valid name').isLength({ min: 3 }),
  body('email', 'enter valid email').isEmail(),
  body('password', 'password must be 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user already exists" })
    }

    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);


    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,

    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);

    // res.json(user)
    res.json({ authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
})



router.post('/login', [
  body('email', 'enter valid email').isEmail(),
  body('password', 'password cannot be blank').exists(),
], async (req, res) => {


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Wrong credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Please try with correct password" });
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken })


  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal error ");
  }


});



router.post('/getuser', fetchuser, async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select(".password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error");
  }
})   


module.exports = router;