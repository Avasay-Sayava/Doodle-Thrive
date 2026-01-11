const express = require("express");
const router = express.Router({ mergeParams: true });

const permissionsController = require("../../controllers/permissions");

router
  .route("/")
  .post(permissionsController.add)
  .get(permissionsController.get);

router
  .route("/:pId")
  .patch(permissionsController.update)
  .delete(permissionsController.delete);

module.exports = router;
