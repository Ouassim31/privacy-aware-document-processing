const express = require("express");
const router = express.Router();

// Require controller module 
const process_controller = require("../controllers/processController");

/// ROUTES ///

// POST: Create process
router.post("/", process_controller.process_create);

// DELETE: Delete process
router.delete("/:pid", process_controller.process_delete);

// POST: Update description
router.post("/:pid/update/description", process_controller.process_update_description);

// POST: Set applicant and dataset
router.post("/:pid/update/applicant_dataset", process_controller.process_update_applicant_dataset);

// POST: Set iExec task-id
router.post("/:pid/update/task", process_controller.process_update_task);

// GET: Get processes by applicant
router.get("/by_applicant", process_controller.process_get_applicant);

// GET: Get processes by landlord
router.get("/by_landlord", process_controller.process_get_landlord);

// GET: Get process by ID 
router.get("/:pid", process_controller.process_get);

// PUT: Set state
router.put("/:pid/update/state", process_controller.process_update_state);

// PUT: Dereference applicant
router.put("/:pid/dereference_applicant", process_controller.process_dereference_applicant);

// PUT: Reset process to initial state (state 1)
router.put("/:pid/reset", process_controller.process_reset);

module.exports = router;