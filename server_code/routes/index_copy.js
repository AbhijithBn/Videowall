//Router
var express=require('express');
var router=express.Router();
router.use(express.static('public'));

//body parser
var bodyParser=require('body-parser');
router.use(bodyParser.urlencoded({extended:true}))
// let urlencodedParser = bodyParser.urlencoded({ extended: true });
// var body_parse=bodyParser.json()
router.use(bodyParser.json())

//to read the video files in the directory
const path=require('path');
const fs=require('fs');



//file upload
const multer=require('multer');
const video_name=''
var storage=multer.diskStorage({

    destination:function(req,file,cb){
        cb(null,'./')// 'uploads', __dirname ,'../'<-- this will lead into Videowall directory
    },
    filename:function(req,file,cb){
        // console.log(file)
        // fieldname,originalname,encoding,mimetype are the different fields in file (+'-'+Date.now()+'.mp4')
        var video_name=file.originalname;
        cb(null,video_name)
    }
})
var upload=multer({storage:storage})

//request
var request=require('request');

//Handling child processes
const child_process=require('child_process');


module.exports=function(io){

    // global_var=''//global variable for layout
    var video_file='' //global var

    router.get('/',function(req,res){

        // console.log("Display configuration");
        // const readline = require('readline').createInterface({
        //     input: process.stdin,
        //     output: process.stdout
        // })
        
        // readline.question(`What's the layout of screens?`, (data) => 
        // {
        //     console.log(`The layout is ${data}`)
        //     global_var=data
        // })
    
        // if(global_var){
        //     readline.close()
        // }
        res.render('server_start.ejs')//rendering the ejs file 

        //socket for configuration request by the client
        io.on('connection',function(socket){
            console.log("Connection with server established with socket-id:",socket.id);
            
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

    //mp4 files in the directory
    router.get('/dirFile',function(req,res){
        const directoryPath=path.join('./');
        file_arr=[]
        fs.readdir(directoryPath,function(err,files){
        if(err){
            return console.log("Unable to scan the directory");
        }

        for(i=0;i<files.length;i++){
            var fileSplit=files[i].split('.');
            var fileSplitLength=fileSplit.length-1;
            var videoCheck=fileSplit[fileSplitLength];
            if(videoCheck=='mp4'){
                console.log(files[i]);
                file_arr.push(files[i]);
            }
        }

        res.json(file_arr);
    
})

    })

    router.post('/uploadfile',upload.single('myFile'),function(req,res){
        const file=req.file
        if(!file){
            const error=new Error("Please upload a file")
            error.httpStatusCode=400
            // console.log(error)
        }
        video_file=file.filename
        console.log("the video file global variable is :",video_file)
        
        res.redirect('/')
        // res.send(file)
    })

    //global variable
    //when user first presses stop button instead of start button
    process_variable=false;

    //starting server when user presses the start button
    router.get('/start_server',function(req,res){

        console.log('Request to stream video');
        // if(req.query.start_button){
        workProcess=child_process.spawn('avconv', ['-i', video_file, '-c:v' ,  'libx264',  '-f',  'mpegts',  'udp://239.1.1.1:1234'])
        
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
