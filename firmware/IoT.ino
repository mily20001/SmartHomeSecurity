#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "const_strings.h"

#define PIR_PIN 13
#define ONE_WIRE_BUS 12
#define DOOR_BUTTON_PIN 5
#define LOCK_BUTTON_PIN 4
#define BUZZER_PIN 14

#define BUZZER_ON digitalWrite(BUZZER_PIN, LOW)
#define BUZZER_OFF digitalWrite(BUZZER_PIN, HIGH);

#define LIGHT_ON_THRESHOLD 700

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

const char* ssid = SSID;
const char* password = WIFI_PASSWORD;
const char* mqtt_server = MQTT_URL;

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;
bool alarm_armed = false;

void setup() {
  pinMode(BUILTIN_LED, OUTPUT);
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  sensors.begin();

  pinMode(DOOR_BUTTON_PIN, INPUT);
  digitalWrite(DOOR_BUTTON_PIN, HIGH);

  pinMode(PIR_PIN, INPUT);
  digitalWrite(PIR_PIN, LOW);

  pinMode(BUZZER_PIN, OUTPUT);
  BUZZER_ON;

  delay(250);
  BUZZER_OFF;
  
}

void setup_wifi() {

  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  if(topic != ARMED_TOPIC)
    return;

  if ((char)payload[0] == '1') {
    alarm_armed = true;
    
    client.publish(ALARM_TOPIC, "1");
    
    digitalWrite(BUILTIN_LED, LOW);
    
  } else if((char)payload[0] == '0'){
    alarm_armed = false;
    client.publish(ALARM_TOPIC, "0");
    digitalWrite(BUILTIN_LED, HIGH);
  }

}

void reconnect() {
  // Loop until we're reconnected
  Serial.println("testing connection");
  WiFiClient testClient;
  const int httpPort = 27017;
  if (!testClient.connect(mqtt_server, httpPort)) {
    Serial.println("connection failed");
    return;
  }

  Serial.println("connection ok");
  
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(MQTT_USERNAME, MQTT_USERNAME, MQTT_PASSWORD)) {
      Serial.println("connected");
      client.subscribe(ARMED_TOPIC);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

int light_status = -1;
int light_value = 0;
bool pir_already_sent = false;
int door_status = -1;
int lock_status = -1;
int pir_status = 0;
long nextTempCheck = 0;
int alarm_triggered = false;
long buzzer_timer = 0;
bool buzzer_status = false;
long last_door_event = 0;
long last_lock_event = 0;

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  char msg2[10];
    
  light_value = 1024 - analogRead(A0);
  int tmp_light_status = light_value > LIGHT_ON_THRESHOLD ? 1 : 0;
  if(tmp_light_status != light_status) {
    light_status = tmp_light_status;
    snprintf (msg, 6, "%ld", light_value);
    Serial.print("ADC value: ");
    Serial.print(msg);
    snprintf (msg, 6, "%ld", light_status);
    Serial.print(", light status: ");
    Serial.println(msg);
    client.publish(LIGHT_TOPIC, msg);
  }

  pir_status = digitalRead(PIR_PIN);
  if(pir_status == 1 && !pir_already_sent) {
    snprintf (msg, 6, "%ld", pir_status);
    Serial.print("PIR status: ");
    Serial.println(msg);
    client.publish(MOTION_TOPIC, msg);
  }
  pir_already_sent = pir_status;

  if(nextTempCheck < millis()) {
    sensors.requestTemperatures();
    float temp1 = sensors.getTempCByIndex(0);
    dtostrf(temp1, 2, 1, msg2);
    snprintf (msg, 6, "%s", msg2);
    Serial.print("Temp1: ");
    Serial.print(msg);
    Serial.println("C");
    client.publish(TEMP1_TOPIC, msg);
    nextTempCheck = millis() + 120000; //2 mins
  }


  if(millis() - last_door_event > 90 && door_status != digitalRead(DOOR_BUTTON_PIN)) {
    door_status = !door_status;
    snprintf (msg, 6, "%ld", door_status);
    Serial.print("DOOR status: ");
    Serial.println(msg);
    client.publish(DOOR_TOPIC, msg);
    last_door_event = millis();
  }

  if(millis() - last_lock_event > 90 && lock_status != digitalRead(LOCK_BUTTON_PIN)) {
    lock_status = !lock_status;
    snprintf (msg, 6, "%ld", lock_status);
    Serial.print("LOCK status: ");
    Serial.println(msg);
    client.publish(LOCK_TOPIC, msg);
    last_lock_event = millis();
  }

  if(alarm_triggered && millis() >= buzzer_timer) {
    if(buzzer_status) {
      BUZZER_OFF;
      buzzer_status = false;
      buzzer_timer = millis() + 500;
    }
    else {
      BUZZER_ON;
      buzzer_status = true;
      buzzer_timer = millis() + 1000;
    }
  }

  if(alarm_armed && (pir_status || door_status || lock_status)) {
    if(!alarm_triggered) {
      alarm_triggered = true;
      client.publish(ALARM_TOPIC, "2");
      buzzer_timer = millis();
    }
  }
  else {
    if(alarm_triggered) {
      alarm_triggered = false;
      BUZZER_OFF;
      buzzer_status = false;
      client.publish(ALARM_TOPIC, alarm_armed ? "1" : "0");
    }
  }
}
