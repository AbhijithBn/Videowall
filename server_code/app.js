//VIDEO WALL SERVER
var express=require('express');
var app=express();
var PORT=8080;
var socket =require('socket.io');

//body parser
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));// if there is an error at body parsing the change it to False
app.use(bodyParser.json());//body is represented in json format

//serving files
app.use(express.static(__dirname + '/public'));

//EJS
app.set('views', __dirname + '/views');
app.set('view engine','ejs');

// server
var server=app.listen(PORT,function(){
    var host=server.address().address
    var port=server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

//socket.io
var io=socket(server);

//handle routes
var routes=require('./routes/index')(io);
app.use('/',routes);
