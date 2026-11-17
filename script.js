
// Список слів для гри
const words = [
    "комп'ютер",
    "програмування",
    "інтернет",
    "монітор",
    "клавіатура",
    "телефон",
    "алгоритм",
    "браузер",
    "технологія",
    "розробка",
    "навчання",
    "університет",
    "інформація",
    "програма",
    "мережа"
];

// Український алфавіт
const alphabet = [
    "а", "б", "в", "г", "ґ", "д", "е", "є",
    "ж", "з", "и", "і", "ї", "й", "к", "л",
    "м", "н", "о", "п", "р", "с", "т", "у",
    "ф", "х", "ц", "ч", "ш", "щ", "ь", "ю", "я"
];

// Основні змінні гри
const maxAttempts = 6;

let selectedWord = "";
let guessedLetters = [];
let mistakes = 0;
let gameOver = false;

// Отримання елементів HTML
const wordDisplay = document.getElementById("word-display");
const keyboard = document.getElementById("keyboard");
const attemptsDisplay = document.getElementById("attempts");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart-button");

const bodyParts = document.querySelectorAll(".body-part");

// Вибір випадкового слова
function chooseWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

// Створення віртуальної клавіатури
function createKeyboard() {
    keyboard.innerHTML = "";

    alphabet.forEach(letter => {
        const button = document.createElement("button");

        button.textContent = letter;
        button.classList.add("key");
        button.type = "button";

        button.addEventListener("click", () => {
            guessLetter(letter, button);
        });

        keyboard.appendChild(button);
    });
}

// Відображення загаданого слова
function displayWord() {
    wordDisplay.innerHTML = "";

    Array.from(selectedWord).forEach(letter => {
        const span = document.createElement("span");

        span.classList.add("letter");

        if (!alphabet.includes(letter) || guessedLetters.includes(letter)) {
            span.textContent = letter;
        } else {
            span.textContent = "";
        }

        wordDisplay.appendChild(span);
    });
}

// Перевірка вибраної літери
function guessLetter(letter, button) {
    if (gameOver || guessedLetters.includes(letter)) {
        return;
    }

    guessedLetters.push(letter);
    button.disabled = true;

    if (selectedWord.includes(letter)) {
        button.classList.add("correct");
        message.textContent = "Правильно! Така літера є у слові.";
    } else {
        button.classList.add("wrong");
        mistakes++;

        updateHangman();

        message.textContent = "Неправильно! Спробуй ще раз.";
    }

    displayWord();
    updateAttempts();
    checkGameStatus();
}

// Оновлення малюнка шибениці
function updateHangman() {
    if (mistakes > 0 && mistakes <= bodyParts.length) {
        bodyParts[mistakes - 1].classList.add("visible");
    }
}

// Оновлення кількості спроб
function updateAttempts() {
    attemptsDisplay.textContent = maxAttempts - mistakes;
}

// Перевірка перемоги та поразки
function checkGameStatus() {
    const isWinner = Array.from(selectedWord).every(letter =>
        !alphabet.includes(letter) || guessedLetters.includes(letter)
    );

    if (isWinner) {
        gameOver = true;

        message.textContent = "Вітаємо! Ти вгадав слово!";
        message.className = "message win";

        disableKeyboard();

    } else if (mistakes >= maxAttempts) {
        gameOver = true;

        message.textContent = `Гру завершено! Загадане слово: ${selectedWord}`;
        message.className = "message lose";

        disableKeyboard();
        displayWord();
    }
}

// Блокування клавіатури після завершення гри
function disableKeyboard() {
    const buttons = keyboard.querySelectorAll(".key");

    buttons.forEach(button => {
        button.disabled = true;
    });
}

// Обробка введення з фізичної клавіатури
document.addEventListener("keydown", event => {
    const letter = event.key.toLowerCase();

    if (!alphabet.includes(letter) || gameOver) {
        return;
    }

    const buttons = keyboard.querySelectorAll(".key");

    buttons.forEach(button => {
        if (button.textContent === letter && !button.disabled) {
            guessLetter(letter, button);
        }
    });
});

// Початок нової гри
function startNewGame() {
    selectedWord = chooseWord();

    guessedLetters = [];
    mistakes = 0;
    gameOver = false;

    // Очищення малюнка шибениці
    bodyParts.forEach(part => {
        part.classList.remove("visible");
    });

    // Скидання повідомлення
    message.textContent = "Удачі! Спробуй вгадати слово.";
    message.className = "message";

    // Оновлення ігрових елементів
    updateAttempts();
    createKeyboard();
    displayWord();
}

// Кнопка початку нової гри
restartButton.addEventListener("click", startNewGame);

// Запуск гри після завантаження сторінки
startNewGame();
