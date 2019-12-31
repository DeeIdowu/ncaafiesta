const express = require("express");
const router = express.Router();

//@router - test route
//Get api/posts
//access via pubic (private requires token)
router.get("/", (req, res) => res.send("Post Route"));

module.exports = router;
