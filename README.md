# Smart Home Security System
Project created for Internet of Things classes at Metropolia UAS.
## Motivation
### Why would someone need Smart Security System?
According to report done by the University of North Carolina at Charlotte’s Department of Criminal Justice and Criminology around 60% of burglars avoid homes with security systems.
Also almost 30% of burglars enter target home through an unlocked door or window. Another thing worth mentioning is that in the United States alone there are almost 5000 burglars every day.
Homes without any security system are 300% more likely to be burglarized. 83% burglars admitted that they specifically look if there is alarm installed in house.
### How our device can increase security?
First of all, by it presence. When someone will see that there is some alarm system installed, it will greatly increase your house security, just because of psychological impact. Also sound alarm will increase security even more, since it will make sound as soon as someone will get into house. When burglar will notice that he fired some alarm, he will probably freak out, because usually such alarms are also sending some notification about being fired (which is also a case in our project). Thanks to various sensors (door, lock, motion) our system is quite hard to bypass, and you can even increase security by adding more sensors. 
### Is security all what your system can offer to me?
Of course not. First idea was to provide some system which will just allow user to check if he or she closed the door and turned off the light. Then it evolved to also provide security features, since both things are quite close to each other. So with our system you can fast and easily check if your doors are closed and locked, also you can see if you turned off the light and current temperature in room. Because everyone sometimes is in hurry and after leaving house is wondering if he/she locked the doors and turned off the light.

## Functionality of device
### Sensors used
Basic version (which you were able to see during presentation) includes following sensors:
* PIR motion sensor
* Photoresistor
* Door/lock status sensor (using aluminium foil and wires)
* DS1822 temperature sensor
### Main board and misc
As a main chip we used ESP8266, which we bought in a module called Adafruit Feather Huzzah. Module basically provides 5V→3V3 converter, 2.54 pinout connected to ESP (since ESP is in SMD technology) and USB↔TTL converter, which allows to flash program to ESP. To our board we also connected, beside of sensors, red LED to inform about current alarm status (armed/not armed) and buzzer, to make some noise when someone breaks in.
### Physical stuff
To actually accomplish our project, we first built it on breadboard, and then we soldered everything to universal board and putted it in 3D printed case. We putted all sensors on riser cables (except of temperature sensor, more info below), so that we were able to put light sensor near the light, door sensors on the door, etc.
## Software
Basically we decided to use backend prepared by our colleagues, which includes MQTT broker and MongoDB database. 
### Backend/firmware 
We programmed ESP using Arduino IDE and libraries. This allowed us really fast development of code. ESP manages everything and sends all changes using MQTT and included wifi module. Our application main loop:
<soon>
### Frontend
Frontend has been done using React and Electron, which makes is multiplatform and quite fast to develop. Connecting to database and MQTT broker is done at Electron level, and rest is managed by React. Frontend at the beginning get latest data from database, and then starts to listen for messages from MQTT. User is also able to manage alarm status (arm/disarm). After choosing new mode for alarm, appropriate message is posted to MQTT, and then change must me confirmed by board. User can also put tiles in any order, and it will be persistent across app launch. It is also possible to connect to MQTT directly from browser, which would allow us to make just a webpage, but unfortunately backend didn’t support websockets, so in our case we had to use something between backend and browser frontend, which in this case is Electron.
## Technical description of sensors
### PIR
Pir sensor is based on infrared sensor. It watch for infrared level changes, which are caused by moving warm objects (such as people). To increase range there is fresnel lense used.
### DS1822
It is digital temperature sensor, which you can connect to using I2C protocol. Thanks to that you can have multiple sensors connected using only one pin of uC. In our project it is just additional feature, since temperature cannot be really used as a thing to detect security issues.
### Door and lock sensors
In our presentation they has been done by putting wires on two ends of the doors frame, and a stripe of aluminium foil on doors, so that when door are closed, two wires are connected by aluminium stripe. It is realised very similar in lock sensor.
### Light sensor
It is photoresistor connected with 12k resistor making voltage divider. It has to be done this way since ESP’s ADC pin is rated only 0-1V. There are also other ways to detect if light is on or off, but this is definitely the cheapest one.

## Issues we ran into
### Temperature sensor
Well, we putted temperature sensor directly on board, and after putting everything in 3D printed box it turned out that ESP module gets warm after some time, which made our temperature readings rather useless (we were getting temperature around 31° during presentation)
### 3D printed doors
During presentation it turned out that our doors are too light, so that after closing they are not able to connect wires in a reliable way. 

## Developer notes
To disable git tracking of config files run:
```
git update-index --skip-worktree src/constStrings.json firmware/const_strings.h 
```

### Installation
```
npm install
```
### Launching dev version
```
npm start
```