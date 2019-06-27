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
router.use(bodyParser.json())


module.exports=function(socket){
    //global variables
    server_config='' ;    //configuration of monitors input by admin
    process_variable=false;

    //render home page to START/STOP/Configure  the video wall
    router.get('/',function(req,res){
        socket.on('connect',function(){
            console.log('Client connection to server established')
        });

        socket.on('config_response',function(data){
            console.log(data);
            server_config=data
        });

        socket.on('client_start',function()
        {
            console.log("Server streaming has started");

            if(server_config=='2x2'){
                workProcess=child_process.spawn('omxplayer',[ '-o',  'hdmi', '--crop' , '0,0,640,360','--win', ' 0,0,1920,1080','udp://239.1.1.1:1234']);
            }
            else if(server_config=='1x2'){
                workProcess=child_process.spawn('omxplayer',[ '-o',  'hdmi', '--crop' , '0,0,640,720', '--win', ' 0,0,1920,1080','udp://239.1.1.1:1234']);
            }
            else if(server_config=='2x1'){
                workProcess=child_process.spawn('omxplayer',[ '-o',  'hdmi', '--crop' , '0,0,1280,360', '--win', ' 0,0,1920,1080','udp://239.1.1.1:1234']);
            }
            else {
                workProcess=child_process.spawn('omxplayer',[ '-o',  'hdmi', '--win', ' 0,0,1920,1080','udp://239.1.1.1:1234']);
            }

            workProcess.stderr.on('data',function(data){
                console.log("stderr :"+data); 
            });
            workProcess.on('close',function(code) {
                    console.log("child process exited with code "+code);// this is printed after every stdout command on close
            });
        

        });
        
        socket.on('client_stop',function(){
                console.log('Server stream has been killed using kill()');
                workProcess.kill();

        });
        
    })
    return router

}
