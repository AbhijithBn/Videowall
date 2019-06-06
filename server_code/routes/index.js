//Router
var express=require('express');
var router=express.Router();
router.use(express.static('public'));
// var socket =require('socket.io');//this is not needed in the router

//request
var request=require('request');

//Handling child processes
const child_process=require('child_process');


//body parser
var bodyParser=require('body-parser');
router.use(bodyParser.urlencoded({extended:true}))
// let urlencodedParser = bodyParser.urlencoded({ extended: true });
// var body_parse=bodyParser.json()
router.use(bodyParser.json())


module.exports=function(io){

    // global_var=''//global variable to hold the arrangement required

    router.get('/',function(req,res){

        // console.log("Display configuration");
        // const readline = require('readline').createInterface({
        //     input: process.stdin,
        //     output: process.stdout
        // })
        
        // readline.question(`What's the layout of screens?`, (data) => {
        //     console.log(`The layout is ${data}`)
        //     global_var=data
        // })
    
        // if(global_var){
        //     readline.close()
        // }
        res.render('server_start.ejs')//rendering the ejs file 

        //socket for configuration request by the client
        io.on('connection',function(socket){
            console.log("Connection established with socket-id:",socket.id);
            
            socket.on('layout',function(data){
                io.sockets.emit('config_response',data);
                console.log("Screen layout has been sent ")
            });

            socket.on('txn_start',function(){
                io.sockets.emit('client_start');
                console.log("Start button has been pressed");
            });

            socket.on('txn_stop',function(){
                io.sockets.emit('client_stop');
                console.log("Stop button has been pressed")
            });

            // Disconnect listener
            socket.on('disconnect', function() {
                console.log('Client disconnected.');
            });
        })

        
    })

    //when user first presses stop button instead of start button
    process_variable=false;

    //starting server when user presses the start button
    router.get('/start_server',function(req,res){

        console.log('Request to stream video');
        // if(req.query.start_button){
        workProcess=child_process.spawn('avconv', ['-i', 'cat.mp4', '-c:v' ,  'libx264',  '-f',  'mpegts',  'udp://239.1.1.1:1234'])
        
        process_variable=true;

        workProcess.stderr.on('data',function(data){//stderr is an output stream
            console.log("stderr :"+data);
        });
        workProcess.on('close',function(code) {
                console.log("child process exited with code "+code);// this is printed after every stdout command on close
        });
    })

    router.get('/stop_server',function(req,res){
        if(process_variable==false){
            console.log('No process to kill');
            res.redirect('/');
        }
        else{
            workProcess.kill()
        }
        
    })
    
    router.get('/config',function(req,res){
        res.json({format:global_var})
    })

    return router
}
