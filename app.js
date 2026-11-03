const ROUNDS = [4, 5, 6];

const startPanel = document.getElementById("start-panel");
const gamePanel = document.getElementById("game-panel");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const nextBtn = document.getElementById("next-btn");
const gridEl = document.getElementById("grid");
const roundLabel = document.getElementById("round-label");
const targetLabel = document.getElementById("target-label");
const subtitle = document.getElementById("subtitle");

let roundIndex = 0;
let nextNumber = 1;
let cells = [];

function targetCount() {
  return ROUNDS[roundIndex];
}

function createGrid() {
  gridEl.innerHTML = "";
  cells = [];

  for (let i = 0; i < 16; i += 1) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    cell.dataset.index = String(i);
    cell.onclick = function () {
      onCellClick(this);
    };
    gridEl.appendChild(cell);
    cells.push(cell);
  }
}

function getCellNumbers(cell) {
  if (!cell.dataset.numbers) {
    return [];
  }
  return cell.dataset.numbers.split(",").filter(Boolean);
}

function renderCell(cell, numbers) {
  cell.replaceChildren();
  cell.classList.toggle("marked", numbers.length > 0);
  cell.classList.toggle("split", numbers.length > 1);
  cell.dataset.count = String(numbers.length);

  numbers.forEach((n) => {
    const slice = document.createElement("span");
    slice.className = "cell-slice";
    slice.textContent = n;
    cell.appendChild(slice);
  });
}

function onCellClick(cell) {
  if (nextNumber > targetCount()) {
    return;
  }

  const numbers = getCellNumbers(cell);
  numbers.push(String(nextNumber));
  cell.dataset.numbers = numbers.join(",");
  renderCell(cell, numbers);
  nextNumber += 1;
  updateControls();
}

function updateControls() {
  const selected = nextNumber - 1;
  const target = targetCount();
  const isLastRound = roundIndex === ROUNDS.length - 1;
  const roundComplete = selected >= target;

  roundLabel.textContent = `Рунд ${roundIndex + 1} / ${ROUNDS.length}`;
  targetLabel.textContent = roundComplete
    ? isLastRound
      ? "Рундът е готов"
      : "Готово — следващ рунд"
    : `Направи ${target} натискания (${selected}/${target})`;

  subtitle.textContent = isLastRound && roundComplete
    ? "Трите рунда са готови. Натисни Ресет, за да започнеш отначало."
    : `Маркирай ${target} натискания в реда, в който ги помниш. Едно квадратче може да се натисне повече от веднъж.`;

  nextBtn.disabled = !roundComplete || isLastRound;
  nextBtn.textContent = isLastRound ? "Край" : "Следващ рунд";
  cells.forEach((cell) => {
    cell.disabled = roundComplete;
  });
}

function clearMarks() {
  nextNumber = 1;
  cells.forEach((cell) => {
    delete cell.dataset.numbers;
    delete cell.dataset.count;
    renderCell(cell, []);
    cell.disabled = false;
  });
}

function startGame() {
  roundIndex = 0;
  startPanel.classList.add("hidden");
  startPanel.hidden = true;
  gamePanel.classList.remove("hidden");
  gamePanel.hidden = false;
  createGrid();
  clearMarks();
  updateControls();
}

function nextRound() {
  if (roundIndex >= ROUNDS.length - 1) {
    return;
  }
  roundIndex += 1;
  clearMarks();
  updateControls();
}

function resetGame() {
  roundIndex = 0;
  startPanel.classList.remove("hidden");
  startPanel.hidden = false;
  gamePanel.classList.add("hidden");
  gamePanel.hidden = true;
  gridEl.innerHTML = "";
  subtitle.textContent = "Натисни Старт, за да започнеш три рунда.";
}

startBtn.onclick = startGame;
nextBtn.onclick = nextRound;
resetBtn.onclick = resetGame;
