let currentWordIndex = 0;
let timer;
let timeLeft;
const timeLimit = 15;

const wordElement = document.getElementById('current-word');
const speakButton = document.getElementById('speak-btn');
const options = document.querySelectorAll('.option');
const resultElement = document.getElementById('result');
const timeElement = document.getElementById('time');
const startButton = document.getElementById('start-btn');

// Speech synthesis setup
const speech = new SpeechSynthesisUtterance();
speech.lang = 'en-US';
speech.rate = 0.8;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startTimer() {
    timeLeft = timeLimit;
    timeElement.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timeElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResult(false);
            setTimeout(nextWord, 2000);
        }
    }, 1000);
}

function showWord() {
    if (currentWordIndex >= wordsList.length) {
        wordElement.textContent = "測驗完成！";
        options.forEach(option => option.style.display = 'none');
        speakButton.style.display = 'none';
        startButton.style.display = 'block';
        startButton.textContent = '重新開始';
        return;
    }

    const currentWord = wordsList[currentWordIndex];
    wordElement.textContent = currentWord.word;
    
    // Shuffle options
    const shuffledOptions = shuffleArray([...currentWord.options]);
    options.forEach((option, index) => {
        option.textContent = shuffledOptions[index];
        option.style.display = 'block';
        option.classList.remove('correct', 'wrong');
    });
    
    resultElement.textContent = '';
    startButton.style.display = 'none';
    startTimer();
}

function speakWord() {
    speech.text = wordsList[currentWordIndex].word;
    window.speechSynthesis.speak(speech);
}

function checkAnswer(selectedIndex) {
    clearInterval(timer);
    const currentWord = wordsList[currentWordIndex];
    const correctOption = currentWord.options[currentWord.correct];
    const isCorrect = options[selectedIndex].textContent === correctOption;
    
    showResult(isCorrect);
    setTimeout(nextWord, 2000);
}

function showResult(isCorrect) {
    resultElement.textContent = isCorrect ? '答對了！' : '答錯了！';
    resultElement.className = 'result ' + (isCorrect ? 'correct' : 'wrong');
}

function nextWord() {
    currentWordIndex++;
    showWord();
}

function startQuiz() {
    currentWordIndex = 0;
    shuffleArray(wordsList);
    showWord();
}

// Event Listeners
speakButton.addEventListener('click', speakWord);

options.forEach((option, index) => {
    option.addEventListener('click', () => checkAnswer(index));
});

startButton.addEventListener('click', startQuiz);

// Hide options initially
options.forEach(option => option.style.display = 'none');
