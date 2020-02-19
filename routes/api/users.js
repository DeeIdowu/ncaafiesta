const express = require("express");
const router = express.Router();

//@route - POST request route
//registration of user
router.post("/", (req, res) => {
  console.log(req.body);
  res.send("User Route");
});

module.exports = router;
