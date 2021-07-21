import machine
from machine import PWM
from utime import sleep

class Strip():
    def __init__(self, pinred, pingreen, pinblue):
        self.red = pinred
        self.green = pingreen
        self.blue = pinblue
        self.stop = False
        self.colors = {'sec2':[1023, 700, 500, 255, 200, 150, 100, 50]}

    def Stop(self):
        self.stop = True
        self.red.duty(0)
        self.green.duty(0)
        self.blue.duty(0)

    def Blue(self):
        
        self.red.duty(0)
        self.green.duty(0)
        self.blue.duty(1023)
        #utime.sleep(1)

    def Green(self):
        
        self.red.duty(0)
        self.green.duty(1023)
        self.blue.duty(0)
        #utime.sleep(1)

    def Red(self):
        
        self.red.duty(1023)
        self.green.duty(0)
        self.blue.duty(0)
        #utime.sleep(1)

    def Fullcolor(self):
        
        self.red.duty(1023)
        self.green.duty(1023)
        self.blue.duty(1023)
        #utime.sleep(1)

    def Sec1(self):
        
        for signal_ in range(0, 1023, 100):
            if self.stop:
                break
            
            self.red.duty(signal_)
            self.blue.duty(signal_)
            self.green.duty(signal_)
            sleep(0.5)

        for signal_2 in range(1023, 0, -100):
            if self.stop:
                self.stop = False
                break

            self.red.duty(signal_2)
            self.blue.duty(signal_2)
            self.green.duty(signal_2)
            sleep(0.5)


    def Sec2(self):
          
        for signal in self.colors['sec2']:
            if self.stop:
                break
            
            self.red.duty(signal)
            self.green.duty(signal)
            self.blue.duty(signal)
            sleep(0.05)
            

        for signal2 in range((len(self.colors['sec2'])-1), 0, -1):
            if self.stop:
                self.stop = False
                break
            
            self.red.duty(self.colors['sec2'][signal2])
            self.green.duty(self.colors['sec2'][signal2])
            self.blue.duty(self.colors['sec2'][signal2])
            sleep(0.05)
