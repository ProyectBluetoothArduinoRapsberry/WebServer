
var HOST = "ws://192.168.0.17:3000/cliente";
var ws = new WebSocket("ws://192.168.0.17:3000/client");
var el = document.getElementById('messages');
var estados = ["distancia", "duracion", "trig", "eco", "bomba", "valvula1", "valvula1", "valvula1", "modoManual"];

function getCurrentTime(){
	return new Date(YYYY, MM, DD, 0, 0, 0, 0);
}

function getDifferenceTime(var time1, var time2){
	var difference = time1.getTime() - time2.getTime();
	return Math.abs(difference/1000); // Diferencia en segundos
}

var lastTime = getCurrentTime();
$( document ).ready(function() {
    console.log( "ready!" );
});
function checkConnection(){
    // do whatever you like here
		alert("test");
		console.log("test");
    setTimeout(checkConnection, 1000);
}
checkConnection();
window.setInterval(function(){
	//var difference = getDifferenceTime(getCurrentTime(), lastTime);
	console.log("test");
	/*if(difference > 7) {  // Si han pasado mas de 7 segundos desde el ultimo mensaje recibido
		$('#servidor').bootstrapToggle('disable');
	}else{
		$('#servidor').bootstrapToggle('enable');
	}*/

}, 1000);

$(function() {
    var intervalID = setInterval(function() {
        console.log("test");
    }, 3000);
    setTimeout(function() {
        clearInterval(intervalID);
    }, 18000);
});

ws.onmessage = function (event) {
	if(event.data != null){
		var datos = event.data.split(",");

	}
	var lastTime = getCurrentTime();
	el.innerHTML = '<h5>Datos: ' + event.data + '</h5>';
};





$(function() {
	$('#bomba').change(function() {
		alert("test");
	})
})

$(function() {
	$('#valvula1').change(function() {
		alert("test");
	})
})

$(function() {
	$('#valvula2').change(function() {
		alert("test");
	})
})


$(function() {
	$('#valvula3').change(function() {
		alert("test valvula 3");
	})
})


$(function() {
	$('#manual').change(function() {
		if($('#manual').is(':checked')){
			$('#bomba').bootstrapToggle('disable');
			$('#valvula1').bootstrapToggle('disable');
			$('#valvula2').bootstrapToggle('disable');
			$('#valvula3').bootstrapToggle('disable');

		}else{
			$('#bomba').bootstrapToggle('enable');
			$('#valvula1').bootstrapToggle('enable');
			$('#valvula2').bootstrapToggle('enable');
			$('#valvula3').bootstrapToggle('enable');
		}
	})
})


$(function() {
	$('#servidor').change(function() {
		alert("test");
	})
})
