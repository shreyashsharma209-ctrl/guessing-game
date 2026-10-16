// Game state
let randomNumber;
let noOfGuesses;
let low;
let high;

// Page elements
const guessInput = document.getElementById("guess");
const submitBtn  = document.getElementById("submit");
const restartBtn = document.getElementById("restart");
const messageEl  = document.getElementById("message");
const hintsEl    = document.getElementById("hints");
const countEl    = document.getElementById("count");
const lowEl      = document.getElementById("low");
const highEl     = document.getElementById("high");
const windowEl   = document.getElementById("window");

function startGame() {
  randomNumber = Math.floor(Math.random() * 100) + 1; // 1 to 100
  noOfGuesses = 0;
  low = 1;
  high = 100;

  messageEl.textContent = "";
  messageEl.className = "message";
  hintsEl.innerHTML = "";
  guessInput.value = "";
  guessInput.disabled = false;
  submitBtn.disabled = false;
  restartBtn.hidden = true;
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
    messageEl.textContent =
      "Congrats!! You guessed it in " + noOfGuesses +
      (noOfGuesses === 1 ? " guess." : " guesses.");
    messageEl.className = "message win";
    guessInput.disabled = true;
    submitBtn.disabled = true;
    restartBtn.hidden = false;
    restartBtn.focus();
    updateDisplay();
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

submitBtn.addEventListener("click", handleGuess);
guessInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleGuess();
});
restartBtn.addEventListener("click", startGame);

startGame();
