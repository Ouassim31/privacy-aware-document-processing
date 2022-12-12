const Process = require("../models/process");

// Handle process create on POST with landlord _id and question as arguments
exports.process_create_post = function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    Process.create(
        { landlord_id: req.params.lid, created_on: Date.now() },
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

// Handle process update on POST with process _id and download_address as arguments
exports.process_update_post = function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    Process.findByIdAndUpdate(
        req.params.pid,
        { download_address: req.params.daddr, process_state: 2 },
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

// Handle process updatetask on POST with process _id and task_id as arguments
exports.process_updatetask_post = function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    Process.findByIdAndUpdate(
        req.params.pid,
        { task_id: req.params.tid, process_state: 3},
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
    res.set('Access-Control-Allow-Origin', '*');
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