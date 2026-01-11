const express = require("express");
const router = express.Router();

const filesController = require("../controllers/files");
const permissionsRouter = require("./files/permissions");

router.use("/:id/permissions", permissionsRouter);

router.route("/").post(filesController.create).get(filesController.getAll);

router
  .route("/:id")
  .get(filesController.get)
  .patch(filesController.update)
  .delete(filesController.delete);

module.exports = router;
