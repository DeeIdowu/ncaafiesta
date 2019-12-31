const express = require("express");
const router = express.Router();

//@router - test route
//Get api/profile
//access via pubic (private requires token)
router.get("/", (req, res) => res.send("Profile Route"));

module.exports = router;
