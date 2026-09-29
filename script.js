let timerInterval;
let timeLeft = 30 * 60; // Default 30 menit (dalam detik)
let isRunning = false;
let isFocusMode = true;

const timeDisplay = document.getElementById('time-display');
const modeLabel = document.getElementById('mode-label');
const focusSelect = document.getElementById('focus-time');
const breakSelect = document.getElementById('break-time');
const circle = document.querySelector('.ring-progress');
const bgMusic = document.getElementById('bg-music');

// Kalkulasi lingkaran SVG
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = 0;

function setCircleProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const totalTime = isFocusMode ? focusSelect.value * 60 : breakSelect.value * 60;
    const progressPercent = (timeLeft / totalTime) * 100;
    setCircleProgress(progressPercent);
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    bgMusic.play(); // Putar musik
    
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            bgMusic.pause();
            alert("Waktu Habis!");
            // Switch mode otomatis
            isFocusMode = !isFocusMode;
            modeLabel.textContent = isFocusMode ? "MODE: FOKUS" : "MODE: ISTIRAHAT";
            timeLeft = (isFocusMode ? focusSelect.value : breakSelect.value) * 60;
            updateDisplay();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    bgMusic.pause();
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    bgMusic.pause();
    bgMusic.currentTime = 0;
    timeLeft = (isFocusMode ? focusSelect.value : breakSelect.value) * 60;
    updateDisplay();
}

// Event Listeners Kontrol Waktu
document.getElementById('btn-start').addEventListener('click', startTimer);
document.getElementById('btn-pause').addEventListener('click', pauseTimer);
document.getElementById('btn-reset').addEventListener('click', resetTimer);

// Ganti Durasi lewat Dropdown
focusSelect.addEventListener('change', resetTimer);
breakSelect.addEventListener('change', resetTimer);

// Toggle Tema
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const toggleBtn = document.getElementById('theme-toggle');
    toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Toggle Mute Audio
document.getElementById('btn-mute').addEventListener('click', () => {
    bgMusic.muted = !bgMusic.muted;
    document.getElementById('btn-mute').textContent = bgMusic.muted ? '🔇' : '🎵';
});

// Inisialisasi awal
updateDisplay();