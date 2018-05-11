var estados = {"distancia":0, "duracion":1, "trig":2, "eco":3, "bomba":4, "valvula1":5, "valvula2":6, "valvula3":7, "manual":8};


var HOST = "ws://sistemacontrol.herokuapp.com/client";
var ws = new WebSocket(HOST);

var el = document.getElementById('messages');


ws.onmessage = function (event) {
	var currentEstados = event.data.split(",");
	$('#valvula1').bootstrapToggle('off').change();
	$('#valvula1').prop('checked', false).change();
	Object.keys(estados).forEach(function(estado) {
		if(estado == "distancia" || estado == "duracion"){
				$('#'+estado).text(currentEstados[estados[estado]]);
		}else{
			//console.log(($('#valvula1').is(':disabled')));
			if(($('#'+estado).is(':disabled'))){
				$('#'+estado).bootstrapToggle('enable');
				if(currentEstados[estados[estado]].trim().includes("ON")) $('#'+estado).bootstrapToggle('on');
				else if(currentEstados[estados[estado]].trim().includes("OFF")) $('#'+estado).bootstrapToggle('off');
				$('#'+estado).bootstrapToggle('disable');
			}else{
				if(currentEstados[estados[estado]].trim().includes("ON")) $('#'+estado).bootstrapToggle('on');
				else if(currentEstados[estados[estado]].trim().includes("OFF")) $('#'+estado).bootstrapToggle('off');
			}

		}
	});

	el.innerHTML = 'Server time: ' + event.data;
};

$(function() {
	$('#manual').change(function() {
		if($('#manual').is(':checked')){
			$('#bomba').bootstrapToggle('enable');
			$('#valvula1').bootstrapToggle('enable');
			$('#valvula2').bootstrapToggle('enable');
			$('#valvula3').bootstrapToggle('enable');
		}else{
			$('#bomba').bootstrapToggle('disable');
			$('#valvula1').bootstrapToggle('disable');
			$('#valvula2').bootstrapToggle('disable');
			$('#valvula3').bootstrapToggle('disable');
		}
	})
})
