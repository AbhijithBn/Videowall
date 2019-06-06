var http=require('http');
var express=require('express');
var app=express();
var PORT=8081;

//socket.io for client
// const socket = require('socket.io-client');
// const io=socket.connect('http://192.168.0.105:8080');
var io=require('socket.io-client');
var socket=io.connect('http://192.168.0.105:8080');


//body parser
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));// if there is an error at body parsing the change it to False
app.use(bodyParser.json());//body is represented in json format
app.use(express.static('public'));// for the use of html files

//EJS
app.set('views', __dirname + '/views');
app.set('view engine','ejs');

//client server
var server=app.listen(PORT,function(){
    var host=server.address().address
    var port=server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

// socket.on('connect',function(socket){
//     console.log("Connection established with socket ID:");
// })
// socket.on('config_response',function(data){
//     console.log(data);
// });

// router
var routes = require('./routes/index')(socket);
app.use('/', routes);




