// This is the pick_data_m.js file
// We want to create a file that has the schemas for our app and creates models that we can then call upon in our controller
var mongoose = require('mongoose');
// create our matchDataSchema proto that holds the data object for one match
var matchDataSchema = new mongoose.Schema({
	match_data: Object
});
// create our matchIDSchema proto that holds a single match ID
var matchIDSchema = new mongoose.Schema({
	uid: Number,
	date: {type: Date, default: new Date},
	scanned: {type:Number,default: null},
	loaded: {type:Number,default: null}
});
// create our championIDSchema proto that holds the id and name of a single champion
var championIDSchema = new mongoose.Schema({
	id: Number,
	name: String
});
// create our championIDSchema proto that holds the id and name of a single champion
var counterDataSchema = new mongoose.Schema({
	counter_data: Object
});
// use the schemas to create the models
// Note that creating a model CREATES the collection in the database (makes the collection plural)
mongoose.model('MatchData', matchDataSchema);
mongoose.model('MatchID', matchIDSchema);
mongoose.model('Champion', championIDSchema);
mongoose.model('CounterData', counterDataSchema);
// notice that we aren't exporting anything -- this is because this file will be run when we require it using our config file and then since the model is defined we'll be able to access it from our controller