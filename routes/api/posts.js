const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

//import models:
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route  POST api/posts
//@desc   Create a post
//@access Private due to login required

router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //error checking
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //to retrieve user, name and avatar upon post submission
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });
      //upon adding post, this is the response
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route  GET api/posts
//@desc   Get all posts
//@access Private due to login required

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //to get the most recent post
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  GET api/posts/:id
//@desc   Get Posts by ID
//@access Private due to login required

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //to get post by id
    //to check if theres a post with id:
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

//@route  Delete api/posts/:id
//@desc   Delete a post
//@access Private due to login required

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //if post not found
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    //to get the most recent post
    //to assure the user is whom they state they are (check user)
    if (post.user.toString() !== req.user.id) {
      //not authorized.
      return res.status(401).json({ msg: "User not authorized" });
    }
    await post.remove();

    res.json({ msg: "Post removed" });

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

//@route  PUT api/posts/like/:id
//@desc   To like a post
//@access Private due to login required

router.put("/like/:id", auth, async (req, res) => {
  try {
    //fetch the post
    const post = await Post.findById(req.params.id);

    //Check if post has already been liked by user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    //if user hasnt liked it and placing their like infront
    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  PUT api/posts/unlike/:id
//@desc   To unlike a post
//@access Private due to login required

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    //fetch the post
    const post = await Post.findById(req.params.id);

    //Check if post has already been liked by user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not been liked" });
    }

    // Get the remove index:
    const removeIndex = post.likes.map(like =>
      like.user.toString().indexOf(req.user.id)
    );
    //splice it out of array
    post.likes.splice(removeIndex, 1);
    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  POST api/posts/comment/:id
//@desc   Comment on a post
//@access Private due to login required

router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //error checking
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //to retrieve user, name and avatar upon post submission
      const user = await User.findById(req.user.id).select("-password");

      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);
      //upon adding post, this is the response
      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route DELETE api/posts/comment/:id/:comment_id
//@desc Delete a comment
//@access Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //pull out comment from post
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );
    //make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    //check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    //removal
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
