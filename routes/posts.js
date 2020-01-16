const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../middleware/auth');

//models
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const User = require('../models/User');

//create post route

router.post(
  '/',
  [auth, check('text', 'text is required').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//get all post
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});
//onno user er post access kora jay
//get post by id
router.get('/:id', auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    if (!posts) {
      res.status(404).json({ msg: 'post not found' });
    }
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      res.status(404).json({ msg: 'post not found' });
    }
    res.status(500).send('Server error');
  }
});

//delete post by id
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!posts) {
      res.status(404).json({ msg: 'post not found' });
    }

    //check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({msg:'post removed'});
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      res.status(404).json({ msg: 'post not found' });
    }
    res.status(500).send('Server error');
  }
});


//like a post route
router.put('/like/:id', auth, async(req, res) =>{
  try{
    const post = await Post.findById(req.params.id);

    //check the post has already been liked
    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
      res.status(400).json({msg:"post already liked"});
    }

    post.likes.unshift({user: req.user.id});

    await post.save();

    res.json(post.likes)
  }catch(err){
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//unlike a post
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
