var websocket = function() {
    var socket = io.connect('http://192.168.0.10:3001');
    socket.on('connect', function(){ console.log("Connected to Server"); });
    socket.on('newMessage', function(data){ 
        console.log(data);

        // To-Do: Beautify Date
        $('#stream').prepend('<li><p>' + data.date + '</p><p>' + data.text + '</p></li>');
    });    
}


$(document).ready(function(){
    var cHeight = $('.matchcard').height() + 20;

    websocket();

    $('.matchcard').waypoint(function(direction) {
        var padding = 0;
        console.log(direction);
        if (direction === 'down') {
            padding = cHeight;
            $('body').css({'padding-top': cHeight}).addClass('fixedMatchcard');
        } /*else {
            $('body').css({'padding-top': 0}).removeClass('fixedMatchcard');
        }*/

        
    }, { offset: 0 });
});