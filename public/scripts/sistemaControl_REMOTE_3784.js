var estados = {"distancia":0, "duracion":1, "trig":2, "eco":3, "bomba":4, "valvula1":5, "valvula2":6, "valvula3":7, "manual":8};
var letraComando = {"bomba":'a', "valvula1":'b', "valvula2":'c', "valvula3":'d', "manual":'e'};
var raspberryCommand = {"bomba":'Bomba', "valvula1":'Valvula1', "valvula2":'Valvula2', "valvula3":'Valvula3', "manual":'Manual'};
var comandos = [];
var intentos = {};
const CANT_MENSAJES = 15;
var historial = [];
var ws = null;

$('#bomba').bootstrapToggle('enable');
$('#valvula1').bootstrapToggle('enable');
$('#valvula2').bootstrapToggle('enable');
$('#valvula3').bootstrapToggle('enable');
$('#manual').bootstrapToggle('enable');
$('#servidor').bootstrapToggle('enable');

$('#bomba').bootstrapToggle('off');
$('#valvula1').bootstrapToggle('off');
$('#valvula2').bootstrapToggle('off');
$('#valvula3').bootstrapToggle('off');
$('#manual').bootstrapToggle('off');
$('#servidor').bootstrapToggle('off');

$('#bomba').bootstrapToggle('disable');
$('#valvula1').bootstrapToggle('disable');
$('#valvula2').bootstrapToggle('disable');
$('#valvula3').bootstrapToggle('disable');
$('#manual').bootstrapToggle('disable');
$('#servidor').bootstrapToggle('disable');


var HOST = "ws://192.168.0.41:3000/client";
ws = new WebSocket(HOST);


ws.onopen = function() {
	setTimeout(checkServer, 5000);
};

function checkServer() {
	$('#servidor').bootstrapToggle('enable');
	if(ws.readyState === ws.CLOSED) $('#servidor').bootstrapToggle('off');
	else $('#servidor').bootstrapToggle('on');
	$('#servidor').bootstrapToggle('disable');
}


var el = document.getElementById('messages');


ws.onmessage = function (event) {
	var previousEstados = getCurrentEstados().split(",");
	var currentEstados = event.data.split(",");
	var [nombrePendiente, comandoPendiente] = ["",""];
	if(comandos.length > 0) [nombrePendiente, comandoPendiente] = comandos[0].split(',');
	if(comandos.length > 0)
		console.log(comandos);


	Object.keys(estados).forEach(async function(estado) {

		if(nombrePendiente == estado){
			var previousComando = (currentEstados[estados[nombrePendiente]].trim().includes("ON")) ? letraComando[nombrePendiente].toUpperCase() : letraComando[nombrePendiente];
			console.log(estado + " - " + comandos + " - " + "  (" + comandoPendiente + " , " + previousComando + ")");
			if(comandoPendiente == previousComando || intentos[comandos] > 3){
				var index = comandos.indexOf(comandos);
				comandos.splice(index,1);
				delete intentos[comandos];
				console.log("Se elimino " + previousComando);
			}else{
				intentos[comandos] = intentos[comandos] + 1;
				ws.send(raspberryCommand[nombrePendiente] + "," + comandoPendiente);
				var mensaje = "Se envio: " + raspberryCommand[nombrePendiente] + ", " ;
				if(comandoPendiente == comandoPendiente.toUpperCase()) mensaje += "ON"
				else mensaje += "OFF"
				imprimirMensaje(mensaje);

				console.log("Se envio: " + raspberryCommand[nombrePendiente] + "," + comandoPendiente);
			}
		}else{
			if(previousEstados[estados[estado]] != currentEstados[estados[estado]]){
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
			}
		}
	});
};



function imprimirMensaje(texto){
	if(historial.length > 0){
		if(historial[0] != texto){
			historial.unshift(texto);
		}
	}else{
		historial.unshift(texto);
	}

	if(historial.length > CANT_MENSAJES){
		historial.pop();
	}
	el.innerHTML = "";
	historial.forEach(function(mensaje) {
		el.innerHTML += mensaje + "<br>" ;
	});

}

function getCurrentLetra(estado){
	var currentEstado = "";
	if($('#'+estado).is(':checked')) currentEstado = "ON";
	else currentEstado = "OFF";

	return currentEstado;
}

function getCurrentEstados(){
	var currentEstados = "";
	for(var estado in estados){
		currentEstados += ","
		if(estado == "distancia" || estado == "duracion") currentEstados += $("#"+estado).text();
		else{
			if($('#'+estado).is(':checked')) currentEstados += "ON";
			else currentEstados += "OFF";
		}
	}
	currentEstados = currentEstados.substr(1, currentEstados.length);
	return currentEstados;
}



$('#manual').click( function() {
	 alert("test");
 });


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var botones = Object.keys(letraComando);

botones.forEach(function(boton) {
	$('#'+boton+'b').click(function() {
		var comando = letraComando[boton];
		if($('#'+boton).is(':checked')==false) comando = comando.toUpperCase();
		comando = boton + "," + comando;
		comandos.push(comando);
		intentos[comando] = 0;
	});
});
