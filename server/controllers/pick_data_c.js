// this is our friends.js file located at /server/controllers/friends.js
// note the immediate function and the object that is returned

// First add the following two lines at the top of the friends controller so that we can access our model through var Friend
// need to require mongoose to be able to run mongoose.model()
var mongoose = require('mongoose');
var MatchData = mongoose.model('MatchData');
var MatchID = mongoose.model('MatchID');
var Champion = mongoose.model('Champion');

var request = require('request');

var keyIndex = 0;
var keys = ['5ec9cf1a-71be-44ef-8a54-e2ce3bbc1e45', '664b8522-f6e1-466e-9ca3-10123fe43058'];

var championData;
var matchData;
var pickData;

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

(function ()
{
    Champion.find({}).exec(function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log("pulled champ info from db");
            championData = results;
        }
    })
}());

// championData = getChampData();

var pick_data = {};
var total_picks = 0;

(function ()
{
    MatchData.find({}).limit(100).exec(function (err, results) {
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

module.exports = (function () {
    return {
        // show: function(req, res) {
        //   res.json(friends);
        // },
        // Edit the show method as follows
        show: function (req, res) {
            // Friend.find({}, function (err, results) {
            //     if (err) {
            //         console.log(err);
            //     } else {
            //         res.json(results);
            //     }
            // })
        },
        add: function (req, res) {
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
                            console.log('added a match');
                            res.json(results);
                        }
                    })
                }
            })
        },
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
        getPickData: function (req, res)
        {
            var data = {'pick_data': pick_data, 'total_picks': total_picks};
            res.json(data);
        },
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