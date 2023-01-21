const Process = require("../models/process");

// CREATE PROCESS 
exports.process_create = (req, res, next) => {
    Process.create(
        { created_on: Date.now(), landlord_id: Object.values(req.body)[0], description: Object.values(req.body)[1] },
        (err, process) => {
            // If error, then log and pass to error handling middleware
            if (err) {
                console.log(`error ${err.message}`)
                const error = new Error(`${err.message}`);
                error.status = 500;
                next(error);
                return
            }
            // On success, return process object in json format
            res.json(process)
        }
    );
};

// DELETE PROCESS
exports.process_delete = (req, res, next) => {
    Process.findByIdAndRemove(
        req.params.pid,
        (err, process) => {
            // If error, then log and pass to error handling middleware
            if (err) {
                console.log(`error ${err.message}`)
                const error = new Error(`${err.message}`);
                error.status = 404;
                next(error);
                return
            }
            // On success, return message
            res.json("Process deleted successfully")
        }
    );
};

// UPDATE DESCRIPTION
exports.process_update_description = (req, res, next) => {
    Process.findByIdAndUpdate(
        req.params.pid,
        { description: Object.values(req.body)[0] },
        (err, process) => {
            // If error, then log and pass to error handling middleware
            if (err) {
                console.log(`error ${err.message}`)
                const error = new Error(`${err.message}`);
                error.status = 500;
                next(error);
                return
            }
            // On success, return process object in json format
            res.json(process)
        }
    );
};

// SET APPLICANT & DATASET (set state == 2)
exports.process_update_applicant_dataset = (req, res, next) => {
    Process.findByIdAndUpdate(
        req.params.pid,
        { applicant_id: Object.values(req.body)[0], dataset_address: Object.values(req.body)[1], process_state: 2 },
        (err, process) => {
            // If error, then log and pass to error handling middleware
            if (err) {
                console.log(`error ${err.message}`)
                const error = new Error(`${err.message}`);
                error.status = 500;
                next(error);
                return
            }
            // On success, return process object in json format
            res.json(process)
        }
    );
};

// SET TASK (set state == 3)
exports.process_update_task = (req, res, next) => {
    Process.findByIdAndUpdate(
        req.params.pid,
        { task_id: Object.values(req.body)[0], process_state: 3 },
        (err, process) => {
            // If error, then log and pass to error handling middleware
            if (err) {
                console.log(`error ${err.message}`)
                const error = new Error(`${err.message}`);
                error.status = 500;
                next(error);
                return
            }
            // On success, return process object in json format
            res.json(process)
        }
    );
};

// GET PROCESSES BY APPLICANT
exports.process_get_applicant = (req, res, next) => {
    Process.find(
        { applicant_id: req.query.applicant },
        (err, process) => {
            // If error, then log and pass to error handling middleware
            if (err) {
                console.log(`error ${err.message}`)
                const error = new Error(`${err.message}`);
                error.status = 400;
                next(error);
                return
            }
            // On success, return process objects in json format
            res.json(process)
        }
    ).sort({ created_on: -1 });
};

// GET PROCESSES BY LANDLORD
exports.process_get_landlord = (req, res, next) => {
    Process.find(
        { landlord_id: req.query.landlord },
        (err, process) => {
            // If error, then log and pass to error handling middleware
            if (err) {
                console.log(`error ${err.message}`)
                const error = new Error(`${err.message}`);
                error.status = 400;
                next(error);
                return
            }
            // On success, return process objects in json format
            res.json(process)
        }
    ).sort({ created_on: -1 });
};
