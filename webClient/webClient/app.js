import { controll, btnMQTT, btnMQTTD, checks, btnsCONT, statusBROKER, statusESP } from './elements/elements.js';
import {esp32St, brokerSt, connectMQTT, closeConnection} from './mod/mqtt.js';

// Variables globals.
var client;

// Loop for assign a listener function to switches when event change.
for (let x = 0; x < checks.length; x++) {
//   console.log("i:" + x);
  checks[x].addEventListener('change', function () {
    console.log("Excecute swith");
  });
}

// loop for assign a listener and function; this function convert the JSON in string a send to broker. 
for (let i = 0; i < btnsCONT.length; i++) {
  btnsCONT[i].addEventListener('click', function () {
    obj = { id: cont, payload: this.id }
    messagePublish('fDWsZDAVg7/ESP32_RGB/MODE', jsonMethod(obj));
    cont += 1;
  });
}

// Configuracion escuchadores botones principales.
btnMQTTD.addEventListener("click", () => {
    if (closeConnection()){
        console.log("Desconectado del servidor MQTT");
        console.log("Broker variable date: ", brokerSt);
    }
});

btnMQTT.addEventListener("click", () => {
    client = connectMQTT();
    if (client){
        controll.style.visibility = "visible"
        btnMQTT.disabled = true;
    }
});

// Ocultando y colocando controll.
controll.style.visibility = "hidden";

// Mensaje principal estado BROKER.
statusBROKER.innerHTML = "<b> BROKER is Disconnect! </b>";

if (!esp32St) {
  statusESP.innerHTML = "<b> ESP32 is Disconnect! </b>";

  statusESP.style.color = "#111";

}

if (!brokerSt) {
    console.log("Broker false");
}


