const express = require("express");
const router = express.Router();

//@router - test route
//Get api/auth
//access via pubic (private requires token)
router.get("/", (req, res) => res.send("Auth Route"));

module.exports = router;
