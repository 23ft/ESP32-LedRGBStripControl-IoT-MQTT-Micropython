/*

  App controll luces RGB IoT
  @_23ft_
  
  */
 
 var host, port , client, clientId , topics, cont, active, infod, esp32;
 
 esp32 = false;
 infod = new Date().getUTCDate();
 var key_user = makeid(10);
 key_user += "_" + infod;
 
 host  = "192.168.0.31";
 port = 9001;
 clientId = "[JS_C_ESP32]_" + key_user;
 cont = 0;


 
 /*
 
 FUNCIONES
 
 */

// Funcion para general key aleatoria.
 function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
  }
  return result;
}

// enviar conexion ESP32.
const resESP32 = () => {
  let userobj = {c_id: clientId,
    statusc: true};
    
    messagePublish("fDWsZDAVg7/ESP32/JSINF", jsonMethod(userobj));
  }


// mosquitto broker free.
topicSub = ["fDWsZDAVg7/JS_Response", "fDWsZDAVg7/ESP32_RGB/response"];

// local
//topicSub = "ES32_RGB/MODE";

// Convert JSON to STRING.
const jsonMethod = (obj) => {
  let json = JSON.stringify(obj);

  return json;
}

// Function for close the connecton.
const closeConnection = () => {
  client.disconnect();
  controll.style.visibility = "hidden";
  btnMQTT.disabled = false;
  if (esp32) {
    esp32 = false;
    statusESP.innerHTML = "<b> ESP32 Disconnect! </b>";
  }
  
  alert("Puedes salir de la pagina, cliente desconectado.");


}

// Function to send a message how PUBLISH.
const messagePublish = (topic, payload) => {
  let message = new Paho.MQTT.Message(payload);
  message.destinationName = topic;
  client.send(message);
}

// CallBack function, ejecuted when the client is already.
const succesConnect = () => {
  console.log("Conexion establecida con server MQTT: " + host + ":" + `${port}`);
  
  for (t of topicSub) {
    client.subscribe(t);
    console.log("sub to: " + t);
  }
  
  resESP32();
}

// CallBack function for see new messages.
const messageNew = (messageObject) => {
  
  if ((messageObject.destinationName == topicSub[1]) && (messageObject.payloadString == "True")) {
    esp32 = true;
    statusESP.innerHTML = "<b> ESP32 is Connect! </b>"

    console.log("ESP32 CONNECT!");
   
  } else {
    console.log(messageObject.destinationName + ":" + messageObject.payloadString);
  }
}

// CallBack function for see the error in connection lost.
const connectLost = (responseObject) => {
  if (responseObject.errorCode !== 0) {
    console.log("Connection is lost, error log is: "+responseObject.errorMessage);
  }
}

// Function connect client to broker MQTT.
const connectMQTT = ()=> {

  // Instanciamos objeto Client.
  client = new Paho.MQTT.Client(host, port, clientId);
  
  // Asignando Callbacks para cada propiedad evento.
  client.onConnectionLost = connectLost;
  client.onMessageArrived = messageNew;
  client.connect({
    onSuccess: succesConnect,
    keepAliveInterval: 10});

    /* 
    ** Otras propiedades del metodo connect.
    onFailure: ConnectionFailed,
    userName: username,
    useSSL: false,
    password: password
    */
   controll.style.visibility = "visible"
   btnMQTT.disabled = true;
   alert("Conectado! Podras usar el control!")
}




/* 
****
BOTONES CONTROLL- ELEMENTOS HTML
****
*/
const btnMQTT = document.getElementById("connect");
const btnMQTTD = document.getElementById("disconnect");
const controll = document.getElementById("cont");
const btnsCONT = document.getElementsByClassName("btn_mode")
const statusESP = document.getElementById("statusESP")

// loop for assign a listener and function; this function convert the JSON in string a send to broker. 
for (var i = 0; i < btnsCONT.length; i++) {
  console.log(i)
  btnsCONT[i].addEventListener('click', function() {
    obj = {id: cont, payload: this.id}
    messagePublish('fDWsZDAVg7/ESP32_RGB/MODE', jsonMethod(obj));
    cont += 1;
  });
}

/* 
****
 ACTIVACION O DESATIVACION
****
*/

btnMQTTD.addEventListener("click", closeConnection)
btnMQTT.addEventListener("click", connectMQTT);

// Ocultando y colocando controll */
controll.style.visibility = "hidden";

if (!esp32) {
   statusESP.innerHTML = "<b> Client Disconnect! </b>"
}