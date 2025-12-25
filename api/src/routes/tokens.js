const express = require("express");
const router = express.Router();

const tokensController = require("../controllers/tokens");

router.route("/")
    .post(tokensController.find);

module.exports = router;
