var jade = require('jade');
var express = require('express'), app = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });
app.configure(function() {
    app.use(express.static(__dirname + '/public'));
});
app.get('/', function(req, res){
  res.render('home.jade');
});
app.listen(3000);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
    //our other events...
    
});