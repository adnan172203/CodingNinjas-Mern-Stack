const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

//model
const Profile = require('../models/Profile');
const User = require('../models/User');

//get router
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile)
      return res.status(400).send('There is no profile for his user');

    res.json(profile);
  } catch (err) {
    console.log(err.message);

    res.status(500).send('Server error');
  }
});

//create of update user profile

router.post(
  '/',
  [
    auth,
    check('status', 'status is required').notEmpty(),
    check('skills', 'skills is required').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send(errors.array());
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      //if profile exists than update profile
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //create profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

//get all profiles route
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server error');
  }
});

//get profile by user id
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.find({
      user: req.params.userId
    }).populate('user', ['name', 'avatar']);

    if (!profile) res.status(400).send('There is no profile for this user');

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      res.status(400).send('There is no profile for this user');
    }
    res.status(500).send('Server Error');
  }
});

//delte profile,user & post
router.delete('/', auth, async (req, res) => {
  try {
    //remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'user deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server error from delete');
  }
});

//Add profile experience route

router.put(
  '/experience',
  [
    auth,

    check('title', 'title is required').notEmpty(),
    check('company', 'company is required').notEmpty(),
    check('from', 'From date is required').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).send({errors:errors.array()});
    }

    const { title,company,location,from,to,current, description } = req.body;

    //value is assigned like this title:title .. but u can write it only title
    const newExp = { title,company,location,from,to,current, description }

    try{
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    }catch(err){
      console.log(err.message);
      res.status(500).send('Server Error from experience');
    }
  }
);

module.exports = router;
