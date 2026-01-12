const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users");

router.route("/").post(usersController.create).patch(usersController.findByUsername);

router.route("/:id").get(usersController.get);

module.exports = router;
