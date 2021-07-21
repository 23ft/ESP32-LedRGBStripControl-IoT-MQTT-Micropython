global dict_pwm

import modes
import MQTT
import ubinascii
import _thread
from machine import unique_id

class RGBIoT():

    def __init__(self):
        """
        *** Pines Tira Led ***
        """
        self.red = dict_pwm['18']
        self.green = dict_pwm['5']
        self.blue = dict_pwm['19']

        # Instanciamos la tira led.
        self.RGB = modes.Strip(self.red, self.green, self.blue)

        """
        *** Datos conexion MQTT ***
        """
        self.mqtt_id = ubinascii.hexlify(unique_id())
        self.mqtt_host = "192.168.0.31" 
        self.mqtt_port = 1883
        self.mqtt_user = None
        self.mqtt_pass = None
        self.mqtt_topics_sub = [b'ESP32_RGB/MODE']
        self.mqtt_topics_pub = [b'ESP-BROKER']

        """
        *** Request ***
        """
        self.subcont = 1
        self.mode = None
        self.requs = {'end': b'request=END',
                      'fred': b'request=f_red',
                      'fgreen': b'request=f_green',
                      'fblue': b'request=f_blue',
                      'sec1': b'request=sec_1',
                      'sec2': b'request=sec_2'}
        
        """
        *** Run ***
        """
        self.MQTTconnect()
        self.Run()

    def MQTTCallBack(self, topic, payload):
        if payload == b'endesp':
            self.threadStop = True
            _thread.exit()
        
        if payload == self.requs['end']:
            self.RGB.Stop()
        print("[MQTT CallBack] New sms [", self.subcont , "]--> topic: ", topic, " | payload: ", payload)
        self.mode = payload
        self.subcont += 1

    def MQTTsubs(self):
        for topic in self.mqtt_topics_sub:
            print("[Client MQTT] Subscribe to topic: ", topic)
        
            self.client.subscribe(topic)

    def MQTTdisconnect(self):
        print("[Client MQTT] Disconnect client to the broker.")
        
        self.client.disconnect()

    def MQTTconnect(self):
        print("[Client MQTT] Client try connect to broker...")
        
        self.client = MQTT.MQTTClient(self.mqtt_id, self.mqtt_host, self.mqtt_port)
        self.client.set_callback(self.MQTTCallBack)
        self.client.connect()
        
        print("[Client MQTT] The Client is connect to broker!")
        self.MQTTsubs()

    def thread1(self):
        print("[Thread 1] The thread is Start!")
        
        while True:
            self.client.check_msg()

    def thread2(self):
        print("[Thread 0] The thread is Start!")
        
        while True:

            self.RGB.Red() if self.mode == self.requs['fred'] else None
            self.RGB.Green() if self.mode == self.requs['fgreen'] else None
            self.RGB.Blue() if self.mode == self.requs['fblue'] else None

            self.RGB.Sec1() if self.mode == self.requs['sec1'] else None
            self.RGB.Sec2() if self.mode == self.requs['sec2'] else None
            
            if self.threadStop:
                self.threadStop = None
                _thread.exit()
        
    def Run(self):
        self.threadStop = None
        _thread.start_new_thread(self.thread1, ())
        self.thread2()

            

            



main = RGBIoT()