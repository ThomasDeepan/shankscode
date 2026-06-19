const express = require("express");
const router = express.Router();
const workshopController = require("./workshop.controller");
const { protect } = require("../../middlewares/authMiddleware");

router.post("/create", protect(["ADMIN"]), workshopController.createWorkshop);
router.get("/", workshopController.getAllWorkshops);
router.post("/:id/checkout", protect(), workshopController.initializeCheckout);

module.exports = router;
