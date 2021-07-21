import esp
from machine import Pin
from conf import wifi, pin

esp.osdebug(None)

"""
*** Conexion wifi con libreria personal wifi.py ***
"""

ssid = 'Sebas y Felipe'
password = '@LSISENSSSNMYMS060201@'

internet = wifi.Wifi(ssid, password, mode_sta=True)
internet.connect()

"""
*** Configuracion Pines ***
"""

pinIN = []
pinOUT = [2]
pinPWM = [18,19,5]
frecPWM = 1000

GPIOS = pin.Pins(pinIN, pinOUT, pinPWM, frecPWM)
pins = GPIOS.Start()

print("\n[Boot log] Pin's IN enables: ", pins['IN'])
print("[Boot log] Pin's OUT enables: ", pins['OUT'])
print("[Boot log] Pin's PWM enables: ", pins['PWM'])

"""
*** Ejemplo para instanciar un pin y usarlo con la libreria pin.py ***
"""
# El metodo Start en la clase Pins, retorna un diccionario donde sus claves son los modos de pines y
# el valor son diccionarios con los pines.

# pins almacena el diccionario de pines. [mode pin][number pin].
# en este caso asignamos los diccionarios de los diferentes modos con los pines afines a variables.
dict_pwm = pins['PWM']
dict_OUT = pins['OUT']
dict_in = pins['IN']