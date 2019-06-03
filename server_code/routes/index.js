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
// router.use(bodyParser.urlencoded({extended:true}))
// let urlencodedParser = bodyParser.urlencoded({ extended: true });
// var body_parse=bodyParser.json()
router.use(bodyParser.json())


module.exports=function(){

    global_var=''//global variable to hold the arrangement required

    router.get('/',function(req,res){

        console.log("Display configuration");
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        })
        
        readline.question(`What's the layout of screens?`, (data) => {
            console.log(`The layout is ${data}`)
            global_var=data
        })
        if(global_var){
            readline.close()
        }

        res.render('server_start.ejs')//rendering the ejs file 
    })

    router.get('/start_server',function(req,res){

        console.log('Request to stream video');
        // if(req.query.start_button){
        workProcess=child_process.spawn('avconv', ['-i', 'cat.mp4', '-c:v' ,  'libx264',  '-f',  'mpegts',  'udp://239.1.1.1:1234'])
    
        workProcess.stderr.on('data',function(data){//stderr is an output stream
            console.log("stderr :"+data);
        });
        workProcess.on('close',function(code) {
                console.log("child process exited with code "+code);// this is printed after every stdout command on close
        });
    })

    router.get('/stop_server',function(req,res){
        workProcess.kill()
    })
    
    router.get('/config',function(req,res){
        res.json({format:global_var})
    })

    return router
}
