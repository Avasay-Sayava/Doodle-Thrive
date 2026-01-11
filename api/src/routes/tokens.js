const express = require("express");
const router = express.Router();

const tokensController = require("../controllers/tokens");

router.route("/").post(tokensController.auth);

module.exports = router;
