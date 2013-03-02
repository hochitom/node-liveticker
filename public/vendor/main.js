var socket = io.connect('http://localhost:3001');

socket.on('connect', function(){ console.log("Connected to Server"); });

socket.on('newMessage', function(data){ 
    console.log(data);

    $('#stream').append('<tr><td>' + data.date + '</td><td>' + data.text + '</td></tr>');
});