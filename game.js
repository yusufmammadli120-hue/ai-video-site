const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let gameStarted = false;
let speed = 0;
let coins = 1500;
let x = canvas.width / 2;
let cameraMode = 0;

document.getElementById("startBtn").onclick = () => {
  document.getElementById("startScreen").style.display = "none";
  gameStarted = true;
  loop();
};

document.getElementById("gasBtn").ontouchstart = () => speed += 2;
document.getElementById("brakeBtn").ontouchstart = () => speed -= 3;

document.getElementById("leftBtn").ontouchstart = () => x -= 20;
document.getElementById("rightBtn").ontouchstart = () => x += 20;

document.getElementById("cameraBtn").onclick = () => {
  cameraMode = (cameraMode + 1) % 3;
};

function drawRoad() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#555";
  ctx.setLineDash([40, 40]);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
}

function drawCar() {
  ctx.fillStyle = "red";
  ctx.fillRect(x - 25, canvas.height - 120, 50, 100);
}

function rain() {
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  for (let i = 0; i < 100; i++) {
    ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 2, 10);
  }
}

function trafficLogic() {
  if (speed > 120) {
    coins -= 100;
  }
}

function loop() {
  if (!gameStarted) return;

  drawRoad();
  rain();
  drawCar();
  trafficLogic();

  document.getElementById("speed").innerText = Math.max(speed,0) + " km/h";
  document.getElementById("coins").innerText = "Coins: " + coins;

  requestAnimationFrame(loop);
}const carImg = new Image();
carImg.src = "f90.png"; 
let player = {
  x: canvas.width / 2,
  y: canvas.height - 200,
  width: 70,
  height: 140,
  speed: 0
};

function drawPlayer() {
  ctx.drawImage(
    carImg,
    player.x - player.width / 2,
    player.y - player.height / 2,
    player.width,
    player.height
  );
}
let traffic = [];

const trafficTypes = [
  { name: "Honda S600", color: "white" },
  { name: "Mazda Miata", color: "red" },
  { name: "Porsche Macan", color: "blue" },
  { name: "Toyota Camry", color: "black" },
  { name: "Kia K5 GT", color: "gray" },
  { name: "Hyundai Sonata N", color: "black" },
  { name: "Escalade", color: "black", police: true }
];

function spawnTraffic() {
  let type = trafficTypes[Math.floor(Math.random() * trafficTypes.length)];
  traffic.push({
    x: Math.random() * canvas.width,
    y: -150,
    speed: 2 + Math.random() * 2,
    type
  });
}

setInterval(spawnTraffic, 1200);
function drawTraffic() {
  traffic.forEach(car => {
    ctx.fillStyle = car.type.color;
    ctx.fillRect(car.x, car.y, 50, 100);
    car.y += car.speed + player.speed * 0.3;
  });

  traffic = traffic.filter(c => c.y < canvas.height + 200);
}
function checkPolice() {
  traffic.forEach(car => {
    if (!car.type.police) return;

    let dx = Math.abs(car.x - player.x);
    let dy = Math.abs(car.y - player.y);

    if (dx < 60 && dy < 120) {
      if (player.speed > 100) {
        coins -= 100;
        showPenalty("Speeding: -100 coins");
      }
    }
  });
}
let redLight = true;

setInterval(() => {
  redLight = !redLight;
}, 6000);

function checkRedLight() {
  if (redLight && player.speed > 20) {
    coins -= 500;
    showPenalty("Red light violation: -500 coins");
  }
}
let penaltyText = "";
let penaltyTimer = 0;

function showPenalty(text) {
  penaltyText = text;
  penaltyTimer = 120;
}

function drawPenalty() {
  if (penaltyTimer > 0) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText("PLEASE WAIT", canvas.width / 2 - 100, canvas.height / 2);
    ctx.fillText(penaltyText, canvas.width / 2 - 160, canvas.height / 2 + 40);

    penaltyTimer--;
  }
}
function loop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawRoad();
  drawTraffic();
  drawPlayer();
  drawPenalty();

  checkPolice();
  checkRedLight();

  document.getElementById("speed").innerText = player.speed + " km/h";
  document.getElementById("coins").innerText = "Coins: " + coins;

  requestAnimationFrame(loop);
}
