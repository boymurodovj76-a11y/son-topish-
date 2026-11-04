const MAX_NUMBER = 100;
const MAX_ATTEMPTS = 7;
const MAX_LEVEL = 10;

/* TUGMA OVOZI */

let audioContext;

function playClickSound() {
  try {
    audioContext = audioContext || new (
      window.AudioContext || window.webkitAudioContext
    )();

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
      650,
      audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      350,
      audioContext.currentTime + 0.06
    );

    gain.gain.setValueAtTime(
      0.12,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.07
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.07);

  } catch (error) {
    console.log("Ovoz ishlamadi:", error);
  }
}

// Barcha tugmalarga ovoz qo'shish
document.querySelectorAll("button").forEach(button => {
  button.addEventListener("click", playClickSound);
});

/* TARJIMALAR */

const translations = {
  uz: {
    title: "SIRLI SON",
    subtitle: "1 dan 100 gacha bo‘lgan sirli sonni top!",
    welcome: "O‘yinga xush kelibsiz!",
    start: "O‘yinni boshlash",
    rules: "Qoidalar",
    rule1: "Sirli son 1 dan 100 gacha.",
    rule2: "Sonni topish uchun 7 ta imkoniyating bor.",
    rule3: "Har bir bosqichda ball to‘pla.",
    level: "Bosqich",
    score: "Ball",
    attempts: "Urinishlar",
    best: "Eng yaxshi",
    question: "Sirli sonni top!",
    guess: "Sonni kiriting",
    check: "Tekshirish",
    restart: "Qayta boshlash",
    home: "Bosh sahifa",
    next: "Keyingi bosqich",
    finalScore: "Yakuniy ball",
    totalScore: "Jami ball",
    secret: "Sirli son",
    usedAttempts: "Ishlatilgan urinishlar",
    resultTitle: "Natija",
    higher: "Kattaroq son kiriting!",
    lower: "Kichikroq son kiriting!",
    correct: "To‘g‘ri! Sirli sonni topdingiz!",
    invalid: "1 dan 100 gacha butun son kiriting!",
    duplicate: "Bu sonni oldin kiritgansiz!",
    win: "Tabriklaymiz! Bosqichdan o‘tdingiz!",
    lose: "Imkoniyatlaringiz tugadi!",
    gameComplete: "Ajoyib! Barcha bosqichlarni tugatdingiz!",
    footer: "BOYMURODOV JAHONGIR"
  },

  ru: {
    title: "ТАЙНОЕ ЧИСЛО",
    subtitle: "Угадай число от 1 до 100!",
    welcome: "Добро пожаловать в игру!",
    start: "Начать игру",
    rules: "Правила",
    rule1: "Тайное число находится от 1 до 100.",
    rule2: "У тебя есть 7 попыток.",
    rule3: "Набирай очки на каждом уровне.",
    level: "Уровень",
    score: "Очки",
    attempts: "Попытки",
    best: "Рекорд",
    question: "Угадай тайное число!",
    guess: "Введите число",
    check: "Проверить",
    restart: "Начать заново",
    home: "Главная",
    next: "Следующий уровень",
    finalScore: "Очки за уровень",
    totalScore: "Всего очков",
    secret: "Тайное число",
    usedAttempts: "Использовано попыток",
    resultTitle: "Результат",
    higher: "Введите число больше!",
    lower: "Введите число меньше!",
    correct: "Верно! Ты угадал число!",
    invalid: "Введите целое число от 1 до 100!",
    duplicate: "Ты уже вводил это число!",
    win: "Поздравляем! Уровень пройден!",
    lose: "Попытки закончились!",
    gameComplete: "Отлично! Все уровни пройдены!",
    footer: "BOYMURODOV JAHONGIR"
  },

  en: {
    title: "SECRET NUMBER",
    subtitle: "Guess the secret number from 1 to 100!",
    welcome: "Welcome to the game!",
    start: "Start Game",
    rules: "Rules",
    rule1: "The secret number is between 1 and 100.",
    rule2: "You have 7 attempts.",
    rule3: "Earn points at every level.",
    level: "Level",
    score: "Score",
    attempts: "Attempts",
    best: "Best",
    question: "Guess the secret number!",
    guess: "Enter a number",
    check: "Check",
    restart: "Restart",
    home: "Home",
    next: "Next Level",
    finalScore: "Level Score",
    totalScore: "Total Score",
    secret: "Secret Number",
    usedAttempts: "Attempts Used",
    resultTitle: "Result",
    higher: "Enter a higher number!",
    lower: "Enter a lower number!",
    correct: "Correct! You guessed the secret number!",
    invalid: "Enter a whole number from 1 to 100!",
    duplicate: "You already entered that number!",
    win: "Congratulations! Level completed!",
    lose: "You have run out of attempts!",
    gameComplete: "Great! You completed all levels!",
    footer: "BOYMURODOV JAHONGIR"
  }
};

/* O'YIN O'ZGARUVCHILARI */

let currentLanguage =
  localStorage.getItem("secretNumberLanguage") || "uz";

let secretNumber = 0;
let attemptsLeft = MAX_ATTEMPTS;
let currentLevel = 1;
let score = 0;
let totalScore = 0;
let gameActive = false;
let usedNumbers = [];
let levelWon = false;

let bestScore =
  Number(localStorage.getItem("secretNumberBest")) || 0;

const $ = id => document.getElementById(id);

/* TILNI ALMASHTIRISH */

function changeLanguage(language) {
  if (!translations[language]) return;

  currentLanguage = language;

  localStorage.setItem(
    "secretNumberLanguage",
    language
  );

  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    element.textContent = translations[language][key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    const key = element.dataset.i18nPlaceholder;
    element.placeholder = translations[language][key];
  });

  document.querySelectorAll(".language-button").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.language === language
    );
  });

  updateStats();

  if ($("message").dataset.messageKey) {
    const key = $("message").dataset.messageKey;

    showMessage(
      translations[language][key]
    );
  }

  if (!$("result").classList.contains("hidden")) {
    $("resultTitle").textContent =
      translations[language].resultTitle;

    $("resultText").textContent = levelWon
      ? currentLevel > MAX_LEVEL
        ? translations[language].gameComplete
        : translations[language].win
      : translations[language].lose;

    $("nextButton").textContent =
      translations[language].next;
  }
}

/* TEMA */

function changeTheme(theme) {
  document.body.dataset.theme = theme;
}

/* XABAR */

function showMessage(text, key = "") {
  $("message").textContent = text;
  $("message").dataset.messageKey = key;
}

/* O'YINNI BOSHLASH */

function startGame() {
  currentLevel = 1;
  totalScore = 0;

  startLevel();
}

function startLevel() {
  secretNumber =
    Math.floor(Math.random() * MAX_NUMBER) + 1;

  attemptsLeft = MAX_ATTEMPTS;
  score = 0;
  usedNumbers = [];
  gameActive = true;
  levelWon = false;

  $("home").classList.add("hidden");
  $("result").classList.add("hidden");
  $("game").classList.remove("hidden");

  $("guessInput").value = "";
  $("history").textContent = "";

  showMessage("");

  $("nextButton").classList.add("hidden");

  updateStats();

  $("guessInput").focus();
}

/* SONNI TEKSHIRISH */

function checkGuess() {
  if (!gameActive) return;

  const guess = Number($("guessInput").value);

  if (
    !$("guessInput").value ||
    !Number.isInteger(guess) ||
    guess < 1 ||
    guess > MAX_NUMBER
  ) {
    showMessage(
      translations[currentLanguage].invalid,
      "invalid"
    );

    return;
  }

  if (usedNumbers.includes(guess)) {
    showMessage(
      translations[currentLanguage].duplicate,
      "duplicate"
    );

    return;
  }

  usedNumbers.push(guess);
  attemptsLeft--;

  $("history").textContent =
    `${translations[currentLanguage].attempts}: ${usedNumbers.join(", ")}`;

  if (guess === secretNumber) {
    levelWon = true;
    gameActive = false;

    score = Math.max(
      10,
      100 - (MAX_ATTEMPTS - attemptsLeft - 1) * 10
    );

    totalScore += score;

    if (totalScore > bestScore) {
      bestScore = totalScore;

      localStorage.setItem(
        "secretNumberBest",
        bestScore
      );
    }

    showMessage(
      translations[currentLanguage].correct,
      "correct"
    );

    updateStats();
    endGame(true);

    return;
  }

  if (attemptsLeft <= 0) {
    gameActive = false;
    levelWon = false;

    showMessage(
      translations[currentLanguage].lose,
      "lose"
    );

    endGame(false);

    return;
  }

  if (guess < secretNumber) {
    showMessage(
      translations[currentLanguage].higher,
      "higher"
    );
  } else {
    showMessage(
      translations[currentLanguage].lower,
      "lower"
    );
  }

  $("guessInput").value = "";
  $("guessInput").focus();

  updateStats();
}

/* STATISTIKA */

function updateStats() {
  $("level").textContent = currentLevel;
  $("score").textContent = score;
  $("attempts").textContent = attemptsLeft;
  $("bestScore").textContent = bestScore;
}

/* NATIJA */

function endGame(won) {
  $("game").classList.add("hidden");
  $("result").classList.remove("hidden");

  $("resultTitle").textContent =
    translations[currentLanguage].resultTitle;

  $("resultText").textContent = won
    ? translations[currentLanguage].win
    : translations[currentLanguage].lose;

  $("finalScore").textContent = score;
  $("totalScore").textContent = totalScore;
  $("finalNumber").textContent = secretNumber;

  $("finalAttempts").textContent =
    MAX_ATTEMPTS - attemptsLeft;

  $("nextButton").classList.toggle(
    "hidden",
    !won || currentLevel >= MAX_LEVEL
  );

  if (won && currentLevel >= MAX_LEVEL) {
    $("resultText").textContent =
      translations[currentLanguage].gameComplete;
  }
}

/* KEYINGI BOSQICH */

function nextLevel() {
  if (!levelWon || currentLevel >= MAX_LEVEL) return;

  currentLevel++;

  startLevel();
}

/* QAYTA BOSHLASH */

function restartGame() {
  startGame();
}

/* BOSH SAHIFA */

function goHome() {
  gameActive = false;

  $("game").classList.add("hidden");
  $("result").classList.add("hidden");
  $("home").classList.remove("hidden");
}

/* ENTER TUGMASI */

$("guessInput").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    checkGuess();
  }
});

/* BOSHLANG'ICH SOZLAMALAR */

changeLanguage(currentLanguage);
updateStats();