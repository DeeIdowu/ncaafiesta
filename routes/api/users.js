const express = require("express");
const router = express.Router();

//@router - test route
//Get api/users
//access via pubic (private requires token)
router.get("/", (req, res) => res.send("User Route"));

module.exports = router;
