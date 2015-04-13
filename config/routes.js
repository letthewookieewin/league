// This is our routes.js file located in /config/routes.js
  // This is where we will define all of our routing rules!
  // We will have to require this in the server.js file (and pass it app!)

// First at the top of your routes.js file you'll have to require the controller
// var friends = require('./../server/controllers/friends.js');
var pick_data_c = require('./../server/controllers/pick_data_c.js');

  module.exports = function(app) {
  	app.get('/remove_friend/:id/destroy', function(req, res) {
      friends.delete(req, res, req.params.id);
    });
    app.get('/friends', function(req, res) {
      friends.show(req, res);
    });
    app.post('/friends', function(req, res) {
    	friends.add(req, res);
    });
    app.get('/pick_data', function(req,res){
      pick_data_c.getPickData(req,res);
    });
    app.get('/counter_data', function(req,res){
      pick_data_c.getCounterData(req,res);
    });
    app.get('/champion_data', function(req,res){
      pick_data_c.getChampionData(req,res);
    });
    app.get('/fetch_data', function(req,res){
      res.render('fetch');
    });
    app.get('/chord', function(req,res){
      res.render('chord');
    });
    // app.post('/store_match_data_in_db', function(req,res){
    //   pick_data_c.add(req,res);
    //   //console.log(req.body);
    // });
    app.get('/store_match_data_in_db', function(req,res){
      pick_data_c.populateMatchData(req,res);
      //console.log(req.body);
    });
    app.get('/get_match_ids/:time', function(req,res){
      pick_data_c.populateMatchIDs(req,res,req.params.time);
      //console.log(req.body);
    });
    app.get('/migrate', function(req,res){
      pick_data_c.migrate(req,res);
      //console.log(req.body);
    });
    app.get('/migrate_champs', function(req,res){
      pick_data_c.migrateChamps(req,res);
      //console.log(req.body);
    });
}