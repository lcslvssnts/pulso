
let weatherData;
let circles = [];
let windAngle = 0;
let windSpeed = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  fetchWeatherData();
  setInterval(fetchWeatherData, 60000); // atualiza a cada minuto
}

function draw() {
  if (weatherData) {
    let temp = weatherData.main.temp; // Celsius
    let humidity = weatherData.main.humidity;
    windAngle = radians(weatherData.wind.deg || 0);
    windSpeed = weatherData.wind.speed;

    // Cor de fundo baseada na temperatura
    let tempColor = map(temp, 15, 40, 0, 255); // azul a vermelho
    background(tempColor, 100, 255 - tempColor, 50);

    // Gera círculos baseados na umidade
    if (circles.length < humidity / 2) {
      circles.push(new PulsingCircle());
    }

    for (let c of circles) {
      c.update();
      c.display();
    }

    // Desenha linhas de vento
    drawWindLines();
  } else {
    background(0);
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Carregando dados do clima...", width / 2, height / 2);
  }
}

function fetchWeatherData() {
  const apiKey = "42d730a172753ac9c26ba3278b786466";
  const city = "Salvador,BR";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      weatherData = data;
      circles = []; // limpa os círculos para nova leitura
    })
    .catch(err => console.error("Erro ao buscar clima:", err));
}

class PulsingCircle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(10, 50);
    this.growth = random(0.05, 0.3);
  }

  update() {
    this.size += this.growth;
    if (this.size > 80 || this.size < 10) {
      this.growth *= -1;
    }
  }

  display() {
    noStroke();
    fill(255, 100);
    ellipse(this.x, this.y, this.size);
  }
}

function drawWindLines() {
  stroke(255, 80);
  strokeWeight(1);
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let len = map(windSpeed, 0, 20, 5, 50);
    let dx = cos(windAngle) * len;
    let dy = sin(windAngle) * len;
    line(x, y, x + dx, y + dy);
  }
}
