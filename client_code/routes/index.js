//client router

// child_process.spawn('omxplayer',[ '-o',  'hdmi', '--crop' , '0,0,640,720', '--win', ' 0,0,1920,1080','udp://239.1.1.1:1234']);

//Router
var express=require('express');
var router=express.Router();
router.use(express.static('public'));

//request
var request=require('request');

//Handling child processes
const child_process=require('child_process');

var request=require('request');

//body parser
var bodyParser=require('body-parser');
router.use(bodyParser.urlencoded({extended:true}))
// let urlencodedParser = bodyParser.urlencoded({ extended: true });
// var body_parse=bodyParser.json()                           
router.use(bodyParser.json())


module.exports=function(){
    
    router.get('/',function(req,res){
        res.render('start.ejs')//render the client webpage having start and stop button
    })

    router.get('/start_client',function(req,res){
        // if(req.query.start_button){
        workProcess=child_process.spawn('omxplayer',[ '-o',  'hdmi', '--crop' , '0,0,640,720', '--win', ' 0,0,1920,1080','udp://239.1.1.1:1234']);

        workProcess.stderr.on('data',function(data){
            console.log("stderr :"+data); // this is printed if there is an error and the error is also printed
        });
        workProcess.on('close',function(code) {
                console.log("child process exited with code "+code);// this is printed after every stdout command on close
        });
        // }
    })

    router.get('/stop_client',function(req,res){
        workProcess.kill()
    })

    router.get('/config',function(req,res){

        request({
            uri: "http://192.168.0.105:8080/config?config_button=Config",
            method: "GET",
          }, 
          function(error, response, body) {
            console.log(body);
        });

    })

    return router

}
