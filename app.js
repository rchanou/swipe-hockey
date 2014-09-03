var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('underscore');

app.use(express.static(__dirname + '/public'));
server.listen(80);

var players = [];

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){	
	var playerId = '';

	socket.on('hi', function(id){
		playerId = id;
		if (!_.contains(players, id)){
			players.push(id);
			if (players.length > 1){
				socket.broadcast.emit('need start', id);
			}
		}
	});

	socket.on('jumpstart', function(start){
		socket.broadcast.emit('give start', start);
	});
	
	socket.on('ball', function(data){
		console.log(data);
		socket.broadcast.emit('ball', data);
	});
	
	socket.on('disconnect', function(){
		players = _.reject(players, function(id){
			return id == playerId;
		});
	});
});