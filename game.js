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
}
