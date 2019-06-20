//Router
var express=require('express');
var router=express.Router();
router.use(express.static('public'));

//body parser
var bodyParser=require('body-parser');
router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())

//to read the video files in the directory 
const path=require('path');
const fs=require('fs');

//file upload
const multer=require('multer');
// const video_name=''
var storage=multer.diskStorage({

    destination:function(req,file,cb){
        cb(null,'./')// 'uploads', __dirname ,'../'<-- this will lead into Videowall directory
    },
    filename:function(req,file,cb){
        // fieldname,originalname,encoding,mimetype are the different fields in file (+'-'+Date.now()+'.mp4')
        var video_name=file.originalname;
        cb(null,video_name)
    }
})
var upload=multer({storage:storage})

const child_process=require('child_process');


module.exports=function(io){
    
    //global variables
    var video_file='';
    process_variable=false;

    router.get('/',function(req,res){
        res.render('server_start.ejs')

        //socket.io
        io.on('connection',function(socket){
            console.log("Connection with server established with socket-id:",socket.id);

            socket.on('disconnect', function() {
                console.log('Client disconnected.');
            });
        })
    })

    //Layout specofied by the server admin
    router.post('/layoutInfo',function(req,res){
        layout_data=req.body.layout;
        
        io.sockets.emit('config_response',layout_data);
        console.log("Screen layout has been sent ")
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
                // console.log(files[i]);
                file_arr.push(files[i]);
            }
        }
        res.json(file_arr);
        })
    })

    //delete file button pressed
    router.post('/del_video',function(req,res){
        filename=req.body.name;
        fs.unlink(filename, function(err){
            if(err){
                console.log("Error in deleting file",err);
            }
            else{
                console.log("File has been deleted and the file name is :",filename)
            }
        })
    })

    //request to play data 
    router.post('/video_data',function(req,res){
        video_file=req.body.name;
        console.log("In video_data the video requested to play is",video_file);

    })

    router.post('/uploadfile',upload.single('myFile'),function(req,res){
        const file=req.file
        if(!file){
            const error=new Error("Please upload a file")
            error.httpStatusCode=400
        }
        res.redirect('/')
    })


    //starting server when user presses the start button
    router.get('/start_server',function(req,res){
        console.log('Start button is pressed in /start_server start button with video_file',video_file);
        
        
        io.sockets.emit('client_start');
        console.log("Start button has been pressed");       
        
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
        console.log('Stop button pressed in index.js and /stop_server');

        io.sockets.emit('client_stop');
        console.log("Stop button has been pressed")

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
