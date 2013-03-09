var socket = io.connect('http://localhost:3001');

socket.on('connect', function(){ console.log("Connected to Server"); });

socket.on('newMessage', function(data){ 
    console.log(data);

    // To-Do: Beautify Date
    $('#stream').prepend('<li class="media"><p>' + data.date + '</p><p>' + data.text + '</p></li>');
});