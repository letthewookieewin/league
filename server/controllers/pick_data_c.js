// this is our pick_data_c.js controller file
// note the immediate function and the object that is returned

// First add the following lines at the top of the friends controller so that we can access our models
// need to require mongoose to be able to run mongoose.model()
var mongoose = require('mongoose');
var MatchData = mongoose.model('MatchData');
var MatchID = mongoose.model('MatchID');
var Champion = mongoose.model('Champion');

//load up the http request module
var request = require('request');

//init the api keys we'll be using - doesn't support more than 2 keys right now
var keyIndex = 0;
var keys = ['5ec9cf1a-71be-44ef-8a54-e2ce3bbc1e45', '664b8522-f6e1-466e-9ca3-10123fe43058'];

var CONST_MATCHES_LOADED = 100;

//mark a single match as scanned in the db
//scanned matches have had their match data stored
//kinda buggy right now ... matches that get stored don't always successfully write themselves as scanned
function markMatchAsScanned(matchId)
{
    MatchID.update({uid:matchId},{$set:{scanned:1}}).exec(function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log("marked " + matchId + " as scanned");
        }
    })
};
//mark a single match as loaded in the db
//loaded matches are ones that we've pulled from the db but haven't yet stored the match data for
function markMatchAsLoaded(matchId)
{
    MatchID.update({uid:matchId},{$set:{loaded:1}}).exec(function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log("marked " + matchId + " as loaded");
        }
    })
};

//init some output objects that we'll populate and throw back to the viewer
var championData;
var matchData;

//immediate function
//on server startup, grab all our champion information from the db
(function ()
{
    Champion.find({}).exec(function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log("pulled champ info from db!");
            championData = results;
        }
    })
}());

//init our pick_data object which holds all info on how many times a champ was picked
var pick_data = {};
var total_picks = 0;

//immediate function to get all the db match data on server startup
(function ()
{
    //change limit to modify documents captured
    MatchData.find({}).limit(CONST_MATCHES_LOADED).exec(function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log("pulled match info from db");

            var champ_names = [];

            for (var champion in championData)
            {
                if (champ_names[championData[champion].name] === undefined)
                {
                    champ_names[championData[champion].id] = championData[champion].name;
                }
            }

            //traverse results to populate necessary view data
            for (var obj in results)
            {
                var match_data = results[obj]['match_data'];
                var teams = match_data['teams'];
                //console.log(teams);
                var winning_id = 0;
                for (var team in teams)
                {
                    if (teams[team]['winner'] === true)
                    {
                        winning_id = teams[team]['teamId'];
                    }
                }
                //console.log(winning_id);
                var participants = match_data['participants'];
                for (var part in participants)
                {
                    var champion_id = participants[part]['championId'];

                    if (pick_data[champion_id] === undefined)
                    {
                        pick_data[champion_id] = {'name': champ_names[champion_id], 'picks': 1};
                        total_picks++;
                    } else {
                        pick_data[champion_id].picks++;
                        total_picks++;
                    }
                }
            }

            console.log(pick_data);
        }
    })
}());

//functions to export to our server
module.exports = (function () {
    return {
        //for the given unix time, perform an API call for the match IDs for that window
        populateMatchIDs: function (req, res, time) {
            var key = keys[keyIndex];
            keyIndex = keyIndex === 0 ? 1 : 0;
            var url = encodeURI('https://na.api.pvp.net/api/lol/na/v4.1/game/ids?beginDate=' + time + '&api_key=' + key);

            console.log(time);
            var matchDate = new Date(time*1000).toISOString();

            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var parsedBody = JSON.parse(body);
                    console.log(parsedBody);
                    for (var i =0;i<parsedBody.length;i++)
                    {
                        console.log(parsedBody[i]);
                        var match = new MatchID({uid: parsedBody[i],date:matchDate});
                        match.save(function (err, results) {
                            if (err)
                            {
                                console.log(err);
                            } else {
                                console.log('added match ID' + results);
                            }
                        })
                    }
                }
            })
            res.json({'reply':'success'});
        },
        //get 20 match IDs from the db and then perform an API call for each ID to get the match data
        populateMatchData: function (req, res) {
            MatchID.find({loaded:null}).limit(20).exec(function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    for (var i=0;i<results.length;i++)
                    {
                        var uid = results[i]['uid'];
                        markMatchAsLoaded(uid)
                        var key = keys[keyIndex];
                        keyIndex = keyIndex === 0 ? 1 : 0;
                        var url = encodeURI('https://na.api.pvp.net/api/lol/na/v2.2/match/' + uid + '?api_key=' + key);
                        //console.log(url);
                        request(url, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var parsedBody = JSON.parse(body);
                                //console.log(parsedBody['teams'][0]);
                                var match = new MatchData({match_data: parsedBody});
                                match.save(function (err, results) {
                                    if (err)
                                    {
                                        console.log(err);
                                    } else {
                                        console.log('added match ' + results['match_data']['matchId']);
                                        markMatchAsScanned(results['match_data']['matchId']);
                                        //res.json(results);
                                    }
                                })
                            }
                        })
                    }
                    res.json({'reply':'success'});
                }
            })
        },
        //retrieve all the pick_data assembled when the server started up
        getPickData: function (req, res)
        {
            var data = {'pick_data': pick_data, 'total_picks': total_picks};
            res.json(data);
        },
        //deprecated
        //populates the pick_data object on demand
        scrub: function (req, res, champs, matches)
        {
            var champions = champs;
            var matches = matches;
            var pick_data = {};
            var total_picks = 0;

            var champ_names = [];
            for (var champion in champions)
            {
                // console.log(champions[champion]);
                if (champ_names[champions[champion].name] === undefined)
                {
                    champ_names[champions[champion].id] = champions[champion].name;
                    //champ_names[champions[champion].id] = {'name':champions[champion].name};
                }
            }

            for (var match in matches)
            {
                if (pick_data[matches[match].champion_id] === undefined)
                {
                    pick_data[matches[match].champion_id] = {'name': champ_names[matches[match].champion_id], 'picks': 1};
                    total_picks++;
                } else if (matches[match].result != 2) {
                    pick_data[matches[match].champion_id].picks++;
                    total_picks++;
                }
            }

            var data = {'pick_data': pick_data, 'total_picks': total_picks};

            //console.log(total_picks);
            res.json(data);
        },
        //migrate champion data from mysql to mongodb
        migrateChamps: function (req, res) {
            connection.connect();
            connection.query('SELECT * from champions', function (err, rows, fields) {
                //connection.end();
                if (!err)
                {
                    for (var i=0;i<rows.length;i++)
                    {
                        var champ = new Champion({
                            id: rows[i]['id'],
                            name: rows[i]['name'],
                        });
                        champ.save(function (err, results) {
                            if (err)
                            {
                                console.log(err);
                            } else {
                                console.log('added a champion' + results);
                                //res.json(results);
                            }
                        })
                    }
                    console.log("got champs " + rows.length);
                } else {
                    console.log('Error while performing Query.');
                    res.json({'reply': 'error'});
                }
                connection.end();
            });
        },
        //migrate match IDs from mysql to mongodb
        migrate: function (req, res) {
            connection.connect();
            connection.query('SELECT * from matches', function (err, rows, fields) {
                //connection.end();
                if (!err)
                {
                    for (var i=0;i<rows.length;i++)
                    {
                        var matchID = new MatchID({
                            uid: rows[i]['uid'],
                            date: rows[i]['time'],
                            scanned: rows[i]['scanned'],
                            loaded: rows[i]['loaded'],
                        });
                        matchID.save(function (err, results) {
                            if (err)
                            {
                                console.log(err);
                            } else {
                                console.log('added a match' + results);
                                //res.json(results);
                            }
                        })
                    }
                    console.log("got matches" + rows.length);
                } else {
                    console.log('Error while performing Query.');
                    res.json({'reply': 'error'});
                }
                connection.end();
            });
        }
    }
})();


// connection.query('SELECT * from champions', function(err, rows, fields) {
//      //connection.end();
//        if (!err)
//        {
//          champions = rows;
//          // pick_data.push(champions);
//          console.log("got champions" + champions.length);
//          // res.json(rows);
//          //return rows;
//        }

//          //console.log('The solution is: ', rows);
//        else{
//          console.log('Error while performing Query.');
//      }
//      });

// connection.query('SELECT * from matches_champions LIMIT 10000', function(err, rows, fields) {
//      //connection.end();
//        if (!err)
//        {
//          match_data = rows;
//          // pick_data.push(match_data);
//          console.log("got matches" + match_data.length);
//          //res.json(rows);
//          //console.log(champions);
//          //return rows;
//        }

//          //console.log('The solution is: ', rows);
//        else{
//          console.log('Error while performing Query.');
//      }
//      });

// connection.end();