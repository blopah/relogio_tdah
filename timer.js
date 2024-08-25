let timers = [];
let intervals = [];

function parseTimeInput(input) {
    const timeUnits = {
        's': 1,
        'm': 60,
        'h': 3600,
        'd': 86400
    };
    const unit = input.slice(-1);
    const value = parseInt(input.slice(0, -1));
    return value * (timeUnits[unit] || 1);
}

function emitirAlerta(volume, frequency) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const gainNode = context.createGain();
    gainNode.gain.value = volume;

    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.connect(gainNode).connect(context.destination);

    oscillator.start();
    setTimeout(() => oscillator.stop(), 600);
}

function startTimer(index) {
    const timer = timers[index];
    const interval = setInterval(() => {
        if (timer.remainingTime > 0) {
            timer.remainingTime--;
            renderTimers();
        } else {
            emitirAlerta(timer.volume, timer.frequency);
            timer.remainingTime = timer.initialTime;
        }
    }, 1000);
    intervals[index] = interval;
}

function addTimer() {
    const timerValue = document.querySelector('.timer-value').value;
    if (timerValue) {
        const timeInSeconds = parseTimeInput(timerValue);
        const timer = {
            initialTime: timeInSeconds,
            remainingTime: timeInSeconds,
            volume: 0.5,
            frequency: 440
        };
        timers.push(timer);
        renderTimers();
    }
}

function removeTimer(index) {
    clearInterval(intervals[index]);
    timers.splice(index, 1);
    intervals.splice(index, 1);
    renderTimers();
}

function editTimer(index) {
    const newValue = prompt("Digite o novo valor do cronômetro (ex: 1h, 1d, 1m, 1s):", timers[index].initialTime);
    if (newValue) {
        const timeInSeconds = parseTimeInput(newValue);
        timers[index].initialTime = timeInSeconds;
        timers[index].remainingTime = timeInSeconds;
        renderTimers();
    }
}

function updateVolume(index, volume) {
    timers[index].volume = volume;
}

function updateFrequency(index, frequency) {
    timers[index].frequency = frequency;
}

function renderTimers() {
    const timerList = document.getElementById('timer-list');
    timerList.innerHTML = '';
    timers.forEach((timer, index) => {
        const timerItem = document.createElement('div');
        timerItem.className = 'timer-item';
        timerItem.innerHTML = `
            <span>${timer.initialTime} segundos (restam ${timer.remainingTime} segundos)</span>
            <div class="controls">
                <input type="range" min="0" max="1" step="0.01" value="${timer.volume}" onchange="updateVolume(${index}, this.value)">
                <input type="range" min="100" max="1000" step="1" value="${timer.frequency}" onchange="updateFrequency(${index}, this.value)">
            </div>
            <button onclick="editTimer(${index})">Editar</button>
            <button onclick="removeTimer(${index})">Remover</button>
        `;
        timerList.appendChild(timerItem);
    });
}

function startTimers() {
    timers.forEach((_, index) => startTimer(index));
}

document.addEventListener('DOMContentLoaded', () => {
    renderTimers();
});