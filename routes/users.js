const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

//models
const User = require('../models/User');

//register users route
router.post(
  '/',
  [
    check('name', 'name is required').notEmpty(),
    check('email', 'email is required').isEmail(),
    check('password', 'password is required').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }

    const { name, email, password } = req.body;

    try {
      //check if user is exist
      const foundUser = await User.findOne({ email });
      if (foundUser) return res.status(500).send('user email exists');

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      //create new user

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //save user in database
      await user.save();

      //create payload for jwt
      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(payload, 'secretKey', { expiresIn: '4h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });

      // res.send('User route');
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
