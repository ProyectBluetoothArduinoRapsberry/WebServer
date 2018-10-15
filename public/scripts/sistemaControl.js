var estados = {"altura":0, "altura1":1, "distancia":2, "distancia1":3, "bomba":4, "valvula1":5, "valvula2":6, "valvula3":7, "RcvParametros":8, "manual":9};
var distancias = {"distancia":"altura", "distancia1":"altura1"};
var letraComando = {"bomba":'a', "valvula1":'b', "valvula2":'c', "valvula3":'d', "manual":'e'};
var raspberryCommand = {"bomba":'Bomba', "valvula1":'Valvula1', "valvula2":'Valvula2', "valvula3":'Valvula3', "manual":'Manual'};

var nivelesTanque = ["images/NivelesTanque/nivel0.png", "images/NivelesTanque/nivel1.png", "images/NivelesTanque/nivel2.png",
				 "images/NivelesTanque/nivel3.png", "images/NivelesTanque/nivel4.png", "images/NivelesTanque/nivel5.png"]

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

var HOST = "ws://sistemacontrol.herokuapp.com/client";
//var HOST = "ws://192.168.0.6:3000/client";
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
				if(estado.includes("distancia")){
						var indexDistancia = estados[estado];
						var indexAltura = estados[distancias[estado]];
						var nivelPorcentaje = parseFloat(currentEstados[indexDistancia]) / parseFloat(currentEstados[indexAltura]);
						$('#'+estado).text(currentEstados[indexDistancia] + "/" + currentEstados[indexAltura]);
						changeImageTanque(estado, nivelPorcentaje);

				}else if(!estado.includes("altura")){
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
		if(estado.includes("distancia") || estado.includes("altura")) currentEstados += $("#"+estado).text();
		else{
			if($('#'+estado).is(':checked')) currentEstados += "ON";
			else currentEstados += "OFF";
		}
	}
	currentEstados = currentEstados.substr(1, currentEstados.length);
	return currentEstados;
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var botones = Object.keys(letraComando);

botones.forEach(function(boton) {
	$('#'+boton+'b').click(function() {
		if(boton == "manual" || ($("#manual").is(':checked')) ){
			var comando = letraComando[boton];
			if($('#'+boton).is(':checked')==false) comando = comando.toUpperCase();
			comando = boton + "," + comando;
			comandos.push(comando);
			intentos[comando] = 0;
		}
	});
});

function changeImageTanque(distancia, alturaPorcentaje){
	var pathImage = getImageNivelTanque(alturaPorcentaje);
	document.getElementById(distancia+"-tanque").src=pathImage;
}

function getImageNivelTanque(alturaPorcentaje){
	if(alturaPorcentaje > 0.9999) alturaPorcentaje = 0.9999;
	alturaPorcentaje = 0.9999 - alturaPorcentaje;
	numberImage = alturaPorcentaje * nivelesTanque.length;
	return nivelesTanque[parseInt(numberImage)];
}
