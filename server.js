var express = require('express');
var mongojs = require('mongojs');
var fs = require('fs');
var bodyParser = require("body-parser");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var app = express();
var db = mongojs('football');
var players = db.collection('players');
var playerFines = db.collection('playerFines');
var fines = db.collection('fines');
var playerGameStats = db.collection('playerGameStats');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/players/image', multipartMiddleware, function (req , res, next){
  var playerName = req.body.picturePlayer.substring(7);
  var playerpicture = req.files.playerPicture;
  var orgName = req.files.playerPicture.name;
  var ext = orgName.split(".");
  ext = '.'+ext[ext.length-1];


  fs.readFile(playerpicture.path, function (err, data) {
    var newPath = __dirname + "/public/images/players/" + playerName.replace(' ', '-') + ext;
    fs.writeFile(newPath, data, function (err) {
      players.findAndModify({
        query: {name : playerName},
        update: {$set : {'image': playerName.replace(' ', '-') + ext}},
        new : true
      }, function (err, doc, lastErrorObject) {
        console.log('Image update for ' + playerName);
        res.redirect('/');
      });
    });
  });



  // res.status(200);
  // res.end();
});

app.get('/players/', function (req , res, next){
  players.find({}, function(err, doc) {
    res.status(200).send(doc);
    res.end();
  });
});

app.post('/players/', function (req , res, next){
  var player = req.body;
  player.image = 'demo.png'
  players.insert(player);
  playerFines.insert({
    player: player.name,
    payed: 0,
    fines: [],
    updated: Date.now()
  });
  playerGameStats.insert({
    name: player.name,
    games: 0,
    goals: 0,
    assists: 0,
    yellows: 0,
    reds: 0,
    updated: Date.now()
  });
  res.status(200);
  res.end();
});

app.get('/gamestats/', function (req , res, next){
  playerGameStats.find({}, function(err, doc) {
    res.status(200).send(doc);
    res.end();
  });
});
app.post('/gamestats/', function (req , res, next){
  var selectedPlayer = req.body;
  console.log(selectedPlayer.name);
  playerGameStats.findAndModify({
    query: {name : selectedPlayer.name},
    update: {$set : {
      'games': selectedPlayer.games,
      'goals' : selectedPlayer.goals,
      'assists' : selectedPlayer.assists,
      'yellows' : selectedPlayer.yellows,
      'reds' : selectedPlayer.reds,
      'updated': Date.now()}},
    new : true
  }, function (err, doc, lastErrorObject) {
    res.status(200);
    res.end();
  });
});


app.get('/fines/', function (req , res, next){
  fines.find({}, function(err, doc) {
    res.status(200).send(doc);
    res.end();
  });
});

app.post('/fines/', function (req , res, next){
  var fine = req.body;
  console.log('Fine added: '+fine.desc);
  fines.insert(fine);
  res.status(200);
  res.end();
});

app.get('/playerfines/', function (req , res, next){
  playerFines.find().sort({updated: -1}, function(err, doc) {
    res.status(200).send(doc);
    res.end();
  });
});

app.post('/playerfines/pay', function (req , res){
  var playerFine = req.body;
  console.log(playerFine);
  playerFines.findAndModify({
    query: {player : playerFine.player},
    update: {$inc: {'payed': playerFine.payAmout}, $set : {'updated': Date.now()}},
    new : true
  }, function (err, doc, lastErrorObject) {
    res.status(200);
    res.end();
  });

});

app.post('/playerfines/', function (req , res){
  var playerName = req.body.player;
  var theFine = {};
  theFine.desc = req.body.fine.desc;
  theFine.price = req.body.fine.price;
  theFine.commited = Date.now();
  console.log(playerName+' was give a fine: '+theFine.desc);
  playerFines.update(
    {player : playerName},
    {$addToSet : {fines : theFine}}
  , function (err, doc, lastErrorObject) {
    res.status(200);
    res.end();
  });

});

app.listen(8080, function(){
  console.log('listen on port 8080');
});
