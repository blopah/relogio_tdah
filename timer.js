let timers = {};
let volume = 1.0; // Volume inicial

function emitirAlerta(intervalo) {
    const agora = new Date();
    let mensagem;

    switch (intervalo) {
        case 's':
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, context.currentTime);
            gainNode.gain.value = volume;
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            oscillator.start();
            setTimeout(() => oscillator.stop(), 600);
            return;
        case 'm':
            mensagem = `${agora.getMinutes()} minutos`;
            break;
        case 'h':
            mensagem = `${agora.getHours()} horas`;
            break;
    }

    const utterance = new SpeechSynthesisUtterance(mensagem);
    utterance.volume = volume;
    utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Female');
    speechSynthesis.speak(utterance);
}

function calcularProximoTempo(intervalo, unidade) {
    const agora = new Date();
    let proximo;

    switch (unidade) {
        case 's':
            proximo = new Date(agora.getTime() + intervalo * 1000);
            break;
        case 'm':
            proximo = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), agora.getHours(), agora.getMinutes() + intervalo, 0, 0);
            break;
        case 'h':
            proximo = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), agora.getHours() + intervalo, 0, 0, 0);
            break;
    }

    return proximo;
}

function iniciarTimer(intervalo, unidade) {
    const key = `${intervalo}${unidade}`;
    if (timers[key]) {
        clearTimeout(timers[key]);
    }

    const proximoTempo = calcularProximoTempo(intervalo, unidade);
    const tempoEspera = proximoTempo - new Date();

    timers[key] = setTimeout(() => {
        emitirAlerta(unidade);
        iniciarTimer(intervalo, unidade);
    }, tempoEspera);
}

function pararTimer(intervalo, unidade) {
    const key = `${intervalo}${unidade}`;
    if (timers[key]) {
        clearTimeout(timers[key]);
        timers[key] = null;
    }
}

function toggleTimer(intervalo, unidade) {
    const checkbox = document.getElementById(`switch-${intervalo}${unidade}`);
    if (checkbox.checked) {
        iniciarTimer(intervalo, unidade);
    } else {
        pararTimer(intervalo, unidade);
    }
}

function adjustVolume() {
    const volumeSlider = document.getElementById('volume-slider');
    volume = volumeSlider.value;
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os timers se necessário
});