const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

//@router - test route
//Get api/auth
//access via pubic (private requires token)
router.get("/", auth, (req, res) => res.send("Auth Route"));

module.exports = router;
