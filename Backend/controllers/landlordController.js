const Landlord = require("../models/landlord");
const async = require("async");

// Index - for now not specified
exports.index = (req, res) => {
    res.send("INDEX");
  };

// Return Landlord _id on GET with identifier as argument.
exports.landloard_loadId_get = function (req, res, next) {
  Landlord.findOne(
    { username: req.params.username },
    function (err, landlord) {
      // Do something if there is an err.
      if (err) {
        return next(err);
      }
      // On success, return landlord _id
      res.send(landlord._id);
    }
  );
};

// Handle Landlord create on POST.
exports.landlord_create_post = function (req, res, next) {
  Landlord.create(
    { username: req.params.username },
    function (err, landlord) {
      // Do something if there is an err.
      if (err) {
        return next(err);
      }
      // On success, return landlord _id
      res.send(landlord._id);
    }
  );
};