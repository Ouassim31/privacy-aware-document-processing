const Process = require("../models/process");

// CREATE PROCESS 
exports.process_create = (req, res, next) => {
    Process.create(
        { created_on: Date.now(), landlord_id: req.body.landlord_id, description: req.body.description },
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
                error.status = 400;
                next(error);
                return
            }
            // On success, return message
            res.send("Process deleted successfully")
        }
    );
};

// UPDATE DESCRIPTION
exports.process_update_description = (req, res, next) => {
    // If description parameter given -> continue, else throw error
    if (req.body.hasOwnProperty("description")) {
        Process.findByIdAndUpdate(
            req.params.pid,
            { description: req.body.description },
            {new: true},
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
    } else {
        const error = new Error("Description not specified in request body");
        error.status = 400;
        next(error);
        return
    }
    
};

// SET APPLICANT & DATASET (set state == 2)
exports.process_update_applicant_dataset = (req, res, next) => {
    const hasApplicantId = req.body.hasOwnProperty("applicant_id");
    const hasDatasetAddress = req.body.hasOwnProperty("dataset_address");

    // If applicant_id & dataset_address parameters given -> continue, else throw error
    if (hasApplicantId && hasDatasetAddress) {
        Process.findByIdAndUpdate(
            req.params.pid,
            { applicant_id: req.body.applicant_id, dataset_address: req.body.dataset_address, process_state: 2 },
            { new: true },
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
    } else {
        if (hasApplicantId == true) {
            const error = new Error("Dataset_address not specified in request body");
            error.status = 400;
            next(error);
            return
        }
        if (hasDatasetAddress == true) {
            const error = new Error("Applicant_id not specified in request body");
            error.status = 400;
            next(error);
            return
        }

        const error = new Error("Applicant_id and dataset_address not specified in request body");
        error.status = 400;
        next(error);
        return
    }

};

// SET TASK (set state == 3)
exports.process_update_task = (req, res, next) => {
    if (req.body.hasOwnProperty("task_id")) {
       // If task_id parameter given -> continue, else throw error
        Process.findByIdAndUpdate(
            req.params.pid,
            { task_id: req.body.task_id, process_state: 3 },
            {new: true},
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
    } else {
        const error = new Error("Task_id not specified in request body");
        error.status = 400;
        next(error);
        return
    }
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

// GET PROCESS BY ID
exports.process_get = (req, res, next) => {
    Process.findById(
        req.params.pid,
        (err, process) => {
            // If error, then log and pass to error handling middleware
            if (err) {
                console.log(`error ${err.message}`)
                const error = new Error(`${err.message}`);
                error.status = 500;
                next(error);
                return
            }
            // On success, return process objects in json format
            res.json(process)
        }
    );
};

// PUT SET STATE
exports.process_update_state = (req, res, next) => {
    // If state parameter given -> continue, else throw error
    if (req.body.hasOwnProperty("state")) {
        Process.findByIdAndUpdate(
            req.params.pid,
            { process_state: req.body.state },
            { new: true },
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
    } else {
        const error = new Error("State not specified in request body");
        error.status = 400;
        next(error);
        return
    }

};

// PUT DEREFERENCE APPLICANT
exports.process_dereference_applicant = (req, res, next) => {
    Process.findByIdAndUpdate(
        req.params.pid,
        { applicant_id: undefined },
        { new: true },
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

// PUT RESET PROCESS TO INITIAL STATE (dereference applicant_id; delete dataset_address; set state == 1)
exports.process_reset = (req, res, next) => {
    Process.findByIdAndUpdate(
        req.params.pid,
        { applicant_id: undefined, process_state: 1, dataset_address: undefined },
        { new: true },
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