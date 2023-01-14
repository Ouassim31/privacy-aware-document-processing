const express = require("express");
const router = express.Router();

// Require controller module 
const process_controller = require("../controllers/processController");

/// ROUTES ///

// POST: Create process
router.post("/", process_controller.process_create);

// POST: Update description
router.post("/:pid/update/description", process_controller.process_update_description);

// POST: Set applicant and dataset
router.post("/:pid/update/applicant_dataset", process_controller.process_update_applicant_dataset);

// POST: Set iExec task-id
router.post("/:pid/update/task", process_controller.process_update_post);

// DELETE: Delete process
router.delete("/:pid", process_controller.process_delete);

// GET: Get processes by applicant
router.get("/applicant?applicant=:applicant", process_controller.process_get_applicant);

// GET: Get processes by landlord
router.get("/landlord?landlord=:landlord", process_controller.process_get_landlord);

module.exports = router;