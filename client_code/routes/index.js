
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


module.exports=function(socket){

    //configuration of monitors input by admin
    server_config=''

    //render home page to START/STOP/Configure  the video wall
    router.get('/',function(req,res){
        
        res.render('start.ejs')//render the client webpage having start and stop button
        
        socket.on('connect',function(){
            console.log('Client connection to server established')
        })
        socket.on('config_response',function(data){
            console.log(data);
            server_config=data
        });
        socket.on('client_start',function(){
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
                console.log("stderr :"+data); // this is printed if there is an error and the error is also printed
            });
            workProcess.on('close',function(code) {
                    console.log("child process exited with code "+code);// this is printed after every stdout command on close
            });
        });
    
        socket.on('client_stop',function(){
            console.log('Server streaming has stopped');
            workProcess.kill()
        });
        

        // request({
        //     uri: "http://192.168.0.105:8080/config?config_button=Config",
        //     method: "GET",
        //   }, 
        //   function(error, response, body) 
        //   {
        //     if(body){
        //         var config_var=body;
        //         // console.log("config_var :"+config_var+'which is a '+typeof(config_var));
        //         var config_var_obj=JSON.parse(config_var);
        //         // console.log("config_var_obj: "+config_var_obj+'which is an '+typeof(config_var_obj));
        //         var config_val=config_var_obj['format'];
        //         // console.log("config_val :"+config_val+'which is a '+typeof(config_val));
        //         output_function(config_val)
        //         // return config_val;
        //     }
        //     else if(error){
        //         console.log(error);
        //     }
            
        //   }
        // );
    })

    /*
    function output_function(config_val){
        server_config=config_val;
        console.log('The variable is :',server_config)
        return server_config;
    }*/
    
    //handling start button
    /*
    router.get('/start_client',function(req,res)
    {
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
            console.log("stderr :"+data); // this is printed if there is an error and the error is also printed
        });
        workProcess.on('close',function(code) {
                console.log("child process exited with code "+code);// this is printed after every stdout command on close
        });
        // }
    })
    

    //handling stop button
    router.get('/stop_client',function(req,res){
        workProcess.kill()
    })
    */
    return router

}
