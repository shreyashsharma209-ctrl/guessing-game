// Players and whose turn it is
const players = [
  { name: "Player 1", guesses: 0 },
  { name: "Player 2", guesses: 0 }
];
let current = 0;

// State for the current turn
let randomNumber;
let noOfGuesses;
let low;
let high;

// Screens
const setupEl  = document.getElementById("setup");
const playEl   = document.getElementById("play");
const resultEl = document.getElementById("result");

// Elements
const name1Input = document.getElementById("name1");
const name2Input = document.getElementById("name2");
const startBtn   = document.getElementById("start");
const turnTitle  = document.getElementById("turnTitle");
const guessInput = document.getElementById("guess");
const submitBtn  = document.getElementById("submit");
const nextBtn    = document.getElementById("next");
const messageEl  = document.getElementById("message");
const hintsEl    = document.getElementById("hints");
const countEl    = document.getElementById("count");
const lowEl      = document.getElementById("low");
const highEl     = document.getElementById("high");
const windowEl   = document.getElementById("window");
const scoresEl   = document.getElementById("scores");
const winnerEl   = document.getElementById("winner");
const againBtn   = document.getElementById("again");

function showScreen(screen) {
  setupEl.hidden  = screen !== setupEl;
  playEl.hidden   = screen !== playEl;
  resultEl.hidden = screen !== resultEl;
}

// Start the whole game from the setup screen
function startGame() {
  players[0].name = name1Input.value.trim() || "Player 1";
  players[1].name = name2Input.value.trim() || "Player 2";
  players[0].guesses = 0;
  players[1].guesses = 0;
  current = 0;
  showScreen(playEl);
  startTurn();
}

// Start one player's turn with a fresh secret number
function startTurn() {
  randomNumber = Math.floor(Math.random() * 100) + 1; // 1 to 100
  noOfGuesses = 0;
  low = 1;
  high = 100;

  turnTitle.textContent = players[current].name + "'s turn";
  messageEl.textContent = "";
  messageEl.className = "message";
  hintsEl.innerHTML = "";
  guessInput.value = "";
  guessInput.disabled = false;
  submitBtn.disabled = false;
  nextBtn.hidden = true;
  updateDisplay();
  guessInput.focus();
}

// Hint 1: the range the number can still be in
function updateDisplay() {
  countEl.textContent = noOfGuesses;
  lowEl.textContent = low;
  highEl.textContent = high;
  windowEl.style.left  = ((low - 1) / 99) * 100 + "%";
  windowEl.style.right = ((100 - high) / 99) * 100 + "%";
}

function addHint(text, cssClass) {
  const li = document.createElement("li");
  li.textContent = text;
  if (cssClass) li.className = cssClass;
  hintsEl.appendChild(li);
}

function handleGuess() {
  const guessedNumber = parseInt(guessInput.value, 10);

  if (Number.isNaN(guessedNumber) || guessedNumber < 1 || guessedNumber > 100) {
    messageEl.textContent = "Enter a whole number from 1 to 100.";
    return;
  }

  noOfGuesses++;
  hintsEl.innerHTML = ""; // show only the hints for the latest guess

  if (guessedNumber > randomNumber) {
    messageEl.textContent = "Lower number please!";
    if (guessedNumber <= high) high = guessedNumber - 1;
  } else if (guessedNumber < randomNumber) {
    messageEl.textContent = "Higher number please!";
    if (guessedNumber >= low) low = guessedNumber + 1;
  } else {
    finishTurn();
    return;
  }

  // Hint 2: hot / cold based on distance from the answer
  const diff = Math.abs(guessedNumber - randomNumber);
  if (diff <= 5)       addHint("Burning hot!", "temp-burning");
  else if (diff <= 10) addHint("Hot", "temp-hot");
  else if (diff <= 20) addHint("Warm", "temp-warm");
  else                 addHint("Cold", "temp-cold");

  // Hint 3: after 3 guesses, reveal even or odd
  if (noOfGuesses >= 3) {
    addHint("Extra hint: the number is " + (randomNumber % 2 === 0 ? "EVEN." : "ODD."));
  }

  // Hint 4: after 5 guesses, reveal divisibility by 5
  if (noOfGuesses >= 5) {
    addHint("Extra hint: the number is " +
      (randomNumber % 5 === 0 ? "divisible by 5." : "NOT divisible by 5."));
  }

  updateDisplay();
  guessInput.value = "";
  guessInput.focus();
}

// The current player guessed correctly
function finishTurn() {
  players[current].guesses = noOfGuesses;

  messageEl.textContent =
    "Congrats " + players[current].name + "! You guessed it in " +
    noOfGuesses + (noOfGuesses === 1 ? " guess." : " guesses.");
  messageEl.className = "message win";

  guessInput.disabled = true;
  submitBtn.disabled = true;
  updateDisplay();

  nextBtn.textContent = current === 0
    ? "Next: " + players[1].name + "'s turn"
    : "See final result";
  nextBtn.hidden = false;
  nextBtn.focus();
}

function handleNext() {
  if (current === 0) {
    current = 1;
    startTurn();
  } else {
    showResult();
  }
}

function showResult() {
  scoresEl.innerHTML = "";

  const best = Math.min(players[0].guesses, players[1].guesses);
  players.forEach((p) => {
    const row = document.createElement("tr");
    if (p.guesses === best) row.className = "best";

    const nameCell = document.createElement("td");
    nameCell.textContent = p.name;
    const guessCell = document.createElement("td");
    guessCell.textContent = p.guesses;

    row.appendChild(nameCell);
    row.appendChild(guessCell);
    scoresEl.appendChild(row);
  });

  if (players[0].guesses === players[1].guesses) {
    winnerEl.textContent = "It's a draw! Both needed " + best +
      (best === 1 ? " guess." : " guesses.");
  } else {
    const winner = players[0].guesses < players[1].guesses ? players[0] : players[1];
    winnerEl.textContent = winner.name + " wins with " + best +
      (best === 1 ? " guess!" : " guesses!");
  }

  showScreen(resultEl);
}

startBtn.addEventListener("click", startGame);
submitBtn.addEventListener("click", handleGuess);
nextBtn.addEventListener("click", handleNext);
againBtn.addEventListener("click", () => showScreen(setupEl));
guessInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleGuess();
});
