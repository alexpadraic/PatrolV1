// Dependencies
var mongoose   = require('mongoose');
var Crimepoint = require('./model.js');

// Opens App Routes
module.exports = function(app) {

  // GET Routes
  // --------------------------------------------------------
  // Retrieve records for queried crimepoints in the db
  app.get('/crimepoints', function(req, res){

    now = new Date();


    // Grab all of the query parameters from the body - defaulted to current day and hour
    var dayofweek = req.body.dayofweek || now.getDay();
    var hour      = req.body.hour      || now.getHours();

    // Opens a generic Mongoose Query. Depending on the post body we will...
    var query = Crimepoint.find({});

    // ...include filter by day of week
    if(dayofweek){
      query = query.where('dayofweek').equals(dayofweek);
    }

    // ...include filter by hour
    if(hour){
      query = query.where('hour').equals(hour);
    }

    query.exec(function(err, crimepoints){
      if(err)
        res.send(err);

        // If no errors are found, it responds with a JSON of all crimepoints
        res.json(crimepoints);
      });
  });

  // POST Routes
  // --------------------------------------------------------

  // // Provides method for saving new crimepoints in the db
  // app.post('/crimepoints', function(req, res){

  //   // Creates a new Crimepoint based on the Mongoose schema and the post body
  //   var newCrimePoint = new Crimepoint(req.body);

  //   // New Crimepoint is saved in the db.
  //   newCrimePoint.save(function(err){
  //     if(err)
  //       res.send(err);

  //       // If no errors are found, it responds with a JSON of the new crimepoint
  //       res.json(req.body);
  //   });
  // });

  // DELETE Routes (Dev Only)
  // --------------------------------------------------------
  // Delete a User off the Map based on objID
  // app.delete('/crimepoints/:objID', function(req, res){
  //   var objID  = req.params.objID;
  //   var update = req.body;

  //   Crimepoint.findByIdAndRemove(objID, update, function(err, crimepoint){
  //     if(err)
  //       res.send(err);
  //     else
  //       res.json(req.body);
  //   });
  // });
};
