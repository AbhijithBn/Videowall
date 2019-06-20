var socket=io.connect('http://localhost:8080');

var start=document.getElementById('start_button');
var stop=document.getElementById('stop_button');

//check
// var output=document.getElementById('output');

//event emitters
one_by_one.addEventListener('click',function(){
    socket.emit('layout','1x1');
})
one_by_two.addEventListener('click',function(){
    socket.emit('layout','1x2');
})
two_by_one.addEventListener('click',function(){
    socket.emit('layout','2x1');
})
two_by_two.addEventListener('click',function(){
    socket.emit('layout','2x2');
})

//start button event emitter


//stop button event emitter
stop.addEventListener('click',function(){
    console.log('Transmission stopped in server_config.js');
    socket.emit('txn_stop');
})


// socket.on('client_start',function(){
//     output.innerHTML+='<p><strong>'+'Hello'+':</strong>'+'</p>';
// })