const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");

let score = 0;
let playerX = 160;
let speed = 3;

// Player move (touch + mouse)
game.addEventListener("mousemove", e => {
  const rect = game.getBoundingClientRect();
  playerX = e.clientX - rect.left - 20;
});

game.addEventListener("touchmove", e => {
  const rect = game.getBoundingClientRect();
  playerX = e.touches[0].clientX - rect.left - 20;
});

// Spawn objects
function spawn(type) {
  const el = document.createElement("div");
  el.classList.add(type);
  el.style.left = Math.random() * 330 + "px";
  game.appendChild(el);

  let y = -30;

  const fall = setInterval(() => {
    y += speed;
    el.style.top = y + "px";

    const px = playerX;
    const py = 580;
    const ex = el.offsetLeft;
    const ey = y;

    // Collision
    if (
      ex < px + 40 &&
      ex + 30 > px &&
      ey < py + 40 &&
      ey + 30 > py
    ) {
      if (type === "enemy") {
        alert("Game Over! Score: " + score);
        location.reload();
      } else {
        score++;
        scoreEl.innerText = "Score: " + score;
        el.remove();
        clearInterval(fall);
      }
    }

    if (y > 700) {
      el.remove();
      clearInterval(fall);
    }
  }, 20);
}

// Game loop
setInterval(() => {
  player.style.left = playerX + "px";
}, 10);

setInterval(() => spawn("enemy"), 1200);
setInterval(() => spawn("coin"), 900);
