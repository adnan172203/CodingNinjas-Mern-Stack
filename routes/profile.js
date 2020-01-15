const express = require('express');
const request = require('request');
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

//delete profile,user & post
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

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    //value is assigned like this title:title .. but u can write it only title
    const newExp = { title, company, location, from, to, current, description };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error from experience');
    }
  }
);

//Delete experience from profile

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index
    const removeIndex = await profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error from delete experience');
  }
});

//Add EDUCATION route

router.put(
  '/education',
  [
    auth,
    check('school', 'School is required').notEmpty(),
    check('degree', 'Degree is required').notEmpty(),
    check('fieldofstudy', 'Field of study is required').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    //value is assigned like this title:title .. but u can write it only title
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error from education');
    }
  }
);

//Delete EDUCATION from profile

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index
    const removeIndex = await profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error from delete education');
  }
});


//get github repo route
router.get('/github/:username',(req, res)=>{
  try{
    const options = {
      uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=bbe5069b49bdd66db832&client_secret=08108d667f3016821e56997179a8b0768b6130e7`,
      method: 'GET',
      headers: { 'user-agent':'node.js' }
    }

    request(options, (error, response, body) => {
      if(error) console.error(error);

      if( response.statusCode !== 200 ){
        return res.status(400).json({msg:'no github profile found'});
      }

      res.json(JSON.parse(body));
      
    });
  }catch(err){
    console.log(err.message);
    res.status(500).send('server error from gihub');
  }
});

module.exports = router;
