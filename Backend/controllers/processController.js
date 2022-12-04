const Process = require("../models/process");

// Handle process create on POST with landlord _id and question as arguments
exports.process_create_post = function (req, res, next) {
    Process.create(
        { landlord_id: req.params.lid, question: req.params.question, created_on: Date.now() },
        function (err, process) {
            // Do something if there is an err.
            if (err) {
                return next(err);
            }
            // On success, return process _id
            res.send(process._id);
        }
    );
};

// Handle process update on POST with process _id, dataset_address and applicant_address as arguments
exports.process_update_post = function (req, res, next) {
    Process.findByIdAndUpdate(
        req.params.pid,
        { dataset_address: req.params.dataset, applicant_address: req.params.aaddr, state: 2 },
        function (err, process) {
            // Do something if there is an err.
            if (err) {
                return next(err);
            }
            // On success, return process _id
            res.send(process._id);
        }
    );
};

// Handle process updatetask on POST with process _id, task_id
exports.process_updatetask_post = function (req, res, next) {
    Process.findByIdAndUpdate(
        req.params.pid,
        { task_id: req.params.tid, state: 3},
        function (err, process) {
            // Do something if there is an err.
            if (err) {
                return next(err);
            }
            // On success, return process _id
            res.send(process._id);
        }
    );
};

// Return (load) all processes assosiated to specified landlord on GET with landlord object _id as argument
exports.processes_load_get = (req, res) => {
    Process.find(
        { landlord_id: req.params.lid },
        function (err, process) {
            // Do something if there is an err.
            if (err) {
                return next(err);
            }
            // On success, return process _id
            res.send(process);
        }
    ).sort({created_on: -1});
};