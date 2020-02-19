const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");

//@router - test route
//Get api/auth
//access via pubic (private requires token)
router.get("/", auth, async (req, res) => {
  try {
    //returning user data w/id no password
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
    console.log(user);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
