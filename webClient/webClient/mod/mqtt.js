import { makeid } from './rand.js';
import { controll, btnMQTT, statusESP, statusBROKER } from '../elements/elements.js';

export const esp32St = false;
export var brokerSt = false;
export var client, infod, key_user, clientId;

var host = "35.199.113.247";
var port = 8083;
var topicSub = ["fDWsZDAVg7/JS_Response", "fDWsZDAVg7/ESP32_RGB/response"];

// Callback for failure connection with broker MQTT.
const failureConnection = () => {
    alert("Error try connect to broker [" + host + "]");
    statusBROKER.innerHTML = "</b> BROKER is disconnect </b>";
}

// Connection finish, client is disconnect from broker.
export const closeConnection = () => {
    console.log(controll)
    client.disconnect();
    controll.style.visibility = "hidden";
    btnMQTT.disabled = false;
    if (esp32St) {
        esp32St = false;
        statusESP.innerHTML = "<b> ESP32 is Disconnect! </b>";
        statusESP.style.background = "#eee";
    }

    if (brokerSt) {
        brokerSt = false;
        statusBROKER.innerHTML = "<b> BROKER is Disconnect! </b>";
        statusBROKER.style.background = "#eee";
    }
    return true;

    // alert("Puedes salir de la pagina, cliente desconectado.");
}

// Callback for succesconect to broker, exec when the client already connect.
export const succesConnect = () => {
    // Activando indicador estado MQTT.
    brokerSt = true;
    statusBROKER.innerHTML = "<b> BROKER is connect </b>";
    statusBROKER.style.background = "#1d1"

    console.log("Conexion establecida con server MQTT: " + host + ":" + `${port}`);

    // Subscribiendo cliente a los topics.
    for (let t of topicSub) {
        client.subscribe(t);
        console.log("sub to: " + t);
    }

    // Enviamos respuesta de conexion a la ESP32.
    // resESP32();
}

// CallBack for new message arrived.
export const messageNew = (messageObject) => {

    if ((messageObject.destinationName == topicSub[1]) && (messageObject.payloadString == "True")) {
        esp32St = true;
        statusESP.innerHTML = "<b> ESP32 is Connect! </b>"
        statusESP.style.background = '#0f0'
        statusESP.style.color = "#111"
        console.log("ESP32 CONNECT!");

    } else {
        console.log(messageObject.destinationName + ":" + messageObject.payloadString);
    }
}

// Callback for connection lost.
export const connectLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
        console.log("Connection is lost, error log is: " + responseObject.errorMessage);
    }
}

// Function to generate random id from connection to MQTT.
const genId = () => {
    client = "", infod = "", key_user = "", clientId = "";

    infod = new Date().getUTCDate();
    key_user = makeid(6);
    key_user += "_" + infod;
    clientId = "[JS_C_ESP32]_" + key_user;

    return true;
}

// Function to connect to broker MQTT.
export const connectMQTT = () => {
    // creacion Id Usuario.
    if (genId()) {
        console.log("[genId] Id generada con extio");
    }

    // Instanciamos objeto Client.
    client = new Paho.MQTT.Client(host, port, clientId);

    // Asignando Callbacks para cada propiedad evento.
    client.onConnectionLost = connectLost;
    client.onMessageArrived = messageNew;
    client.connect({
        onSuccess: succesConnect,
        keepAliveInterval: 10,
        onFailure: failureConnection
    });

    return client;
}

console.log("Import mqtt.js completed!");
