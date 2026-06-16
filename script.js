const cells = document.querySelectorAll("[data-cell]");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

let currentPlayer = "X";
let gameActive = true;

const winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

cells.forEach(cell => {
  cell.addEventListener("click", handleClick, { once: true });
});

function handleClick(e) {
  const cell = e.target;
  cell.textContent = currentPlayer;

  const winningCombo = getWinningCombo();

if (winningCombo) {
  statusText.textContent = currentPlayer + " wins!";
  gameActive = false;

  launchConfetti();

  winningCombo.forEach(index => {
    cells[index].classList.add("win-cell");
  });

  drawWinLine(winningCombo); // ⭐ NEW

  return;
}

  if ([...cells].every(cell => cell.textContent !== "")) {
    statusText.textContent = "Draw!";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function getWinningCombo() {
  return winCombos.find(combo => {
    return combo.every(index => {
      return cells[index].textContent === currentPlayer;
    });
  });
}

restartBtn.addEventListener("click", () => {
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("win-cell");
  });

  winLine.style.width = "0px"; // reset line

  currentPlayer = "X";
  statusText.textContent = "";
  gameActive = true;

  cells.forEach(cell => {
    cell.addEventListener("click", handleClick, { once: true });
  });
});

function launchConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });

    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

const winLine = document.getElementById("winLine");

function drawWinLine(combo) {
  const boardRect = document.getElementById("board").getBoundingClientRect();
  const first = cells[combo[0]].getBoundingClientRect();
  const last = cells[combo[2]].getBoundingClientRect();

  const x1 = first.left + first.width / 2 - boardRect.left;
  const y1 = first.top + first.height / 2 - boardRect.top;

  const x2 = last.left + last.width / 2 - boardRect.left;
  const y2 = last.top + last.height / 2 - boardRect.top;

  const dx = x2 - x1;
  const dy = y2 - y1;

  const length = Math.sqrt(dx * dx + dy * dy);

  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  // 🔥 extend both sides
  const extend = 30;

  const startX = x1 - (dx / length) * extend;
  const startY = y1 - (dy / length) * extend;

  const finalLength = length + extend * 2;

  winLine.style.width = finalLength + "px";
  winLine.style.transform = `translate(${startX}px, ${startY}px) rotate(${angle}deg)`;
}

document.addEventListener("mousemove", (e) => {
  createSparkle(e.clientX, e.clientY);
});

function createSparkle(x, y) {
  const sparkle = document.createElement("div");
  sparkle.classList.add("sparkle");

  // slight random offset so it feels natural
  sparkle.style.left = x + (Math.random() * 10 - 5) + "px";
  sparkle.style.top = y + (Math.random() * 10 - 5) + "px";

  document.body.appendChild(sparkle);

  // remove after animation
  setTimeout(() => {
    sparkle.remove();
  }, 800);
}