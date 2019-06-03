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

    server_config=''
    
    //render home page to START/STOP/Configure  the video wall
    router.get('/',function(req,res){
        res.render('start.ejs')//render the client webpage having start and stop button
    })

    //handling start button
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

    //handling stop button
    router.get('/stop_client',function(req,res){
        workProcess.kill()
    })

    //configuration handler
    router.get('/config',function(req,res){
        
        // config_var='hello';
        // config_var_obj={'name':'Abhijith'};
        var config_val='Abhi';

        config_val=configfunction();

        //request for accessing monitor configuration data from the server
        
        // console.log(config_val)
    })

    function configfunction(){
        request({
            uri: "http://192.168.0.105:8080/config?config_button=Config",
            method: "GET",
          }, 
          function(error, response, body) 
          {
            var config_var=body;
            // console.log("config_var :"+config_var+'which is a '+typeof(config_var));
            var config_var_obj=JSON.parse(config_var);
            // console.log("config_var_obj: "+config_var_obj+'which is an '+typeof(config_var_obj));
            var config_val=config_var_obj['format'];
            // console.log("config_val :"+config_val+'which is a '+typeof(config_val));
            output_function(config_val)
            // return config_val;
          }
        );
    }

    function output_function(config_val){
        server_config=config_val;
        console.log('The variable is :',server_config)
    }

    return router

}
