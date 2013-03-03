var socket = io.connect('http://localhost:3001');

socket.on('connect', function(){ console.log("Connected to Server"); });

socket.on('newMessage', function(data){ 
    console.log(data);

    /*if (data.type === 'goal') {
        $('body').append('<div class="hidden" style="display:none;"><object width="420" height="315"><param name="movie" value="http://www.youtube-nocookie.com/v/KNih-Jky8yQ?hl=de_DE&amp;version=3"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube-nocookie.com/v/KNih-Jky8yQ?hl=de_DE&amp;version=3" type="application/x-shockwave-flash" width="1" height="1" allowscriptaccess="always"></embed></object></div>');
    }*/

    // To-Do: Beautify Date
    $('#stream').append('<tr><td>' + data.date + '</td><td>' + data.text + '</td></tr>');
});