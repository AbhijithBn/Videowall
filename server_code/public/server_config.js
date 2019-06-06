var socket=io.connect('http://localhost:8080');

var start=document.getElementById('start_button');
var stop=document.getElementById('stop_button');
var one_by_one=document.getElementById('1x1');
var one_by_two=document.getElementById('1x2');
var two_by_one=document.getElementById('2x1');
var two_by_two=document.getElementById('2x2');

//check
// var output=document.getElementById('output');

//event emitters
// to specify the client monitor configuration
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
start.addEventListener('click',function(){
    socket.emit('txn_start');
});

//stop button event emitter
stop.addEventListener('click',function(){
    socket.emit('txn_stop');
})

// socket.on('client_start',function(){
//     output.innerHTML+='<p><strong>'+'Hello'+':</strong>'+'</p>';
// })