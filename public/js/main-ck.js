var websocket=function(){var e=io.connect("http://localhost:3001");e.on("connect",function(){console.log("Connected to Server")});e.on("newMessage",function(e){console.log(e);$("#stream").prepend("<li><p>"+e.date+"</p><p>"+e.text+"</p></li>")})};$(document).ready(function(){var e=$(".matchcard").height()+20;websocket();$(".matchcard").waypoint(function(t){var n=0;console.log(t);t==="down"&&(n=e);$("body").toggleClass("fixedMatchcard").css({"padding-top":n})},{offset:0})});