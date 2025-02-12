const board = document.getElementById('game-board');
const message = document.getElementById('message');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const missesElement = document.getElementById('misses');
const gridSizeElement = document.getElementById('grid-size');
const restartButton = document.getElementById('restart-btn');

let gridSize = 4; // Starting grid size (4x4)
let timer = 0;
let moves = 0;
let misses = 0;
let maxMisses = 3;
let values = [];
let revealed = [];
let matched = 0;
let timerInterval;

// Initialize the game
function initGame() {
  clearInterval(timerInterval);
  timer = 0;
  moves = 0;
  misses = 0;
  matched = 0;
  revealed = [];
  values = [];

  // Update UI
  timerElement.textContent = timer;
  movesElement.textContent = moves;
  missesElement.textContent = misses;
  gridSizeElement.textContent = `${gridSize}x${gridSize}`;
  message.textContent = '';

  // Generate randomized values
  const totalTiles = gridSize * gridSize;
  const pairs = Array.from({ length: totalTiles / 2 }, (_, i) => i + 1);
  values = [...pairs, ...pairs].sort(() => Math.random() - 0.5);

  // Clear and set up board
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
  board.style.gridTemplateRows = `repeat(${gridSize}, 80px)`;

  values.forEach((value, index) => {
    const tile = document.createElement('div');
    tile.classList.add('tile', 'hidden');
    tile.dataset.value = value;
    tile.dataset.index = index;
    tile.textContent = value; // Hidden by default
    tile.addEventListener('click', handleTileClick);
    board.appendChild(tile);
  });

  // Start timer
  timerInterval = setInterval(() => {
    timer++;
    timerElement.textContent = timer;
  }, 1000);
}

// Handle tile click
function handleTileClick(e) {
  const tile = e.target;

  // Ignore already matched or revealed tiles
  if (!tile.classList.contains('hidden') || revealed.length === 2) return;

  // Reveal the tile
  tile.classList.remove('hidden');
  revealed.push(tile);

  // Increment moves
  moves++;
  movesElement.textContent = moves;

  // Check for match
  if (revealed.length === 2) {
    const [first, second] = revealed;
    if (first.dataset.value === second.dataset.value) {
      first.classList.add('matched');
      second.classList.add('matched');
      matched += 2;
      revealed = [];

      // Check for win
      if (matched === values.length) {
        clearInterval(timerInterval);
        message.textContent = 'You Win!';
      }
    } else {
      misses++;
      missesElement.textContent = misses;

      // Restart if max misses reached
      if (misses >= maxMisses) {
        message.textContent = 'Too many misses! Restarting...';
        setTimeout(restartGame, 1000);
      } else {
        setTimeout(() => {
          first.classList.add('hidden');
          second.classList.add('hidden');
          revealed = [];
        }, 1000);
      }
    }
  }
}

// Restart the game
function restartGame() {
  clearInterval(timerInterval);
  initGame();
}

// Event listener for restart button
restartButton.addEventListener('click', restartGame);

// Start the game
initGame();
