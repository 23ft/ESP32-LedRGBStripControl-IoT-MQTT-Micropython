import machine as m
import utime

class Pins():
    def __init__(self, pinsIn=[], pinsOut=[], pinsPWM=[], PWMfrec=0):
        self.pIn = pinsIn
        self.pOut = pinsOut
        self.pPwm = pinsPWM
        self.PWMfrec = PWMfrec
        
    def restartduty(self):
        for resduty in self.pPwms:
            self.pPwms[resduty].duty(0)
        
    def Start(self):
        self.pIns = {str(pinin): m.Pin(pinin, m.Pin.IN) for pinin in self.pIn}
        self.pOuts = {str(pinout): m.Pin(pinout, m.Pin.OUT) for pinout in self.pOut}
        utime.sleep(0.5)
        self.pPwms = {str(pinpwm): m.PWM(m.Pin(pinpwm, m.Pin.OUT), freq=self.PWMfrec, duty=0) for pinpwm in self.pPwm}
        self.restartduty()
        print('\n[Config GPIO] Pins-IN, Pins-OUT, Pins-PWM is started!')

        return {'IN':self.pIns, 'OUT':self.pOuts, 'PWM':self.pPwms}
