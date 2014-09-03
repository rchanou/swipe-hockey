var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static(__dirname + '/public'));

server.listen(80, function(){

});

//app.set('port', (process.env.PORT || 3000));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	socket.emit('news');
	socket.on('my other event', function(data){
		console.log(data);
	});
});