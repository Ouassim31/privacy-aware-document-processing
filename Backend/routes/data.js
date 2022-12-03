const express = require("express");
const router = express.Router();

// Require controller modules.
const landlord_controller = require("../controllers/landlordController");
const process_controller = require("../controllers/processController");

/// LANDLORD ROUTES ///

// GET index -> for now not specified
router.get("/", landlord_controller.index);

// GET request for fetching landlord ID. If object is found, then landlord does exist and _id is returned.
router.get("/landlord/:identifier", landlord_controller.landloard_loadId_get);

// POST request for creating landlord.
router.post("/landlord/:identifier/create", landlord_controller.landlord_create_post);

/// PROCESS ROUTES ///

// GET request to get all processes of landlord. Param is landlord_id
router.get("/process/:lid", process_controller.processes_load_get);

// POST request to create process. Params are landlord_id and question
router.post("/process/:lid/:question/create", process_controller.process_create_post);

// POST request to update process. Params are process_id, dataset_address and applicant_address
router.post("/process/:pid/:dataset/:aaddr/update", process_controller.process_update_post);

// POST request to update process. Params are process_id, task_id
router.post("/process/:pid/:tid/updatetask", process_controller.process_updatetask_post);

module.exports = router;