#include <WiFi.h>
#include "DHT.h"
#include <Wire.h>
#include <Adafruit_BMP085.h>
#include <HTTPClient.h>
#include <WiFiClient.h>

const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* serverUrl = "http://host.wokwi.internal:8000/leituras";

// Definindo os pinos dos sensores
const int Pino_Umidade_Solo = 34;
const int Pino_luminosidade = 35;
const int Pino_DHT = 4;

#define DHTTYPE DHT22

Adafruit_BMP085 bmp;
DHT dht(Pino_DHT, DHTTYPE);

struct DadosEstacao {

  float temperatura;
  float umidadeAtm;
  float umidadeSolo;
  float pressaoAtm;
  float luminosidade;

};

DadosEstacao leituraAtual;


void umidade() {
  int leituraBruta = analogRead(Pino_Umidade_Solo);
  float porcentagem = map(leituraBruta, 4095, 0, 0, 100);
  leituraAtual.umidadeSolo = porcentagem;
}

void lerPressao() {
  leituraAtual.pressaoAtm = bmp.readPressure() / 100.0;
}

void lerDHT() {
  leituraAtual.temperatura = dht.readTemperature();
  leituraAtual.umidadeAtm = dht.readHumidity();
}

void lerLuminosidade() {
  float leituraBruta = analogRead(Pino_luminosidade);
  float porcentagem = map(leituraBruta, 0, 4095, 0, 100);
  leituraAtual.luminosidade = porcentagem;
}


void enviar_dados() {

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi desconectado!");
    return;
  }

  WiFiClient client;
  HTTPClient http;

  Serial.println("Conectando ao servidor...");
  Serial.println(serverUrl);

  if (!http.begin(client, serverUrl)) {
    Serial.println("ERRO: http.begin() falhou!");
    return;
  }

  http.addHeader("Content-Type", "application/json");

  String json = "{";

  json += "\"temperatura\":" + String(leituraAtual.temperatura) + ",";
  json += "\"umidade_atm\":" + String(leituraAtual.umidadeAtm) + ",";
  json += "\"umidade_solo\":" + String(leituraAtual.umidadeSolo) + ",";
  json += "\"pressao_atm\":" + String(leituraAtual.pressaoAtm) + ",";
  json += "\"luminosidade\":" + String(leituraAtual.luminosidade);

  json += "}";

  Serial.println("Enviando JSON:");
  Serial.println(json);

  int codigoResposta = http.POST(json);

  Serial.print("Código HTTP: ");
  Serial.println(codigoResposta);

  if (codigoResposta > 0) {
    Serial.println("Resposta da API:");
    Serial.println(http.getString());
  } else {
    Serial.print("Erro HTTP: ");
    Serial.println(http.errorToString(codigoResposta));
  }

  http.end();
}

void mensagem() {
  Serial.print(leituraAtual.temperatura);
  Serial.print(", ");
  Serial.print(leituraAtual.umidadeSolo);
  Serial.print(", ");
  Serial.print(leituraAtual.umidadeAtm);
  Serial.print(", ");
  Serial.print(leituraAtual.pressaoAtm);
  Serial.print(", ");
  Serial.println(leituraAtual.luminosidade);
}


void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("Conectado!");

  if (!bmp.begin()) {
    Serial.println(
      "Erro: Sensor BMP180 não encontrado."
    );
    while (1) {}
  }

  dht.begin();
  pinMode(Pino_Umidade_Solo, INPUT);
  pinMode(Pino_luminosidade, INPUT);
  Serial.println(
    "Iniciando estação meteorológica!"
  );
}


void loop() {
  lerDHT();
  lerPressao();
  umidade();
  lerLuminosidade();

  mensagem();
  enviar_dados();

  delay(10000);
}