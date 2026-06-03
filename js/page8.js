const counterDisplay = document.getElementById('counter');
const flightStage = document.getElementById('flight-stage');
const plane = document.getElementById('plane');
const multiplierDisplay = document.getElementById('multiplier-display');
const crashText = document.getElementById('crash-text');
const betInput = document.getElementById('flight-bet-input');
const targetCoefficientInput = document.getElementById('target-coefficient-input');
const halfBtn = document.getElementById('flight-half-btn');
const maxBtn = document.getElementById('flight-max-btn');
const startFlightBtn = document.getElementById('start-flight-btn');
const flightResult = document.getElementById('flight-result');

const pageMaxMandarins = 8;
const tickMs = 50;

let isFlying = false;
let flightTimer = null;

CounterManager.setPageMaxLimit(pageMaxMandarins);
CounterManager.updateCounterDisplay(counterDisplay);
resetFlightView();

halfBtn.addEventListener('click', function() {
    betInput.value = Math.max(1, Math.floor(CounterManager.getCount() / 2));
});

maxBtn.addEventListener('click', function() {
    betInput.value = Math.max(1, CounterManager.getCount());
});

startFlightBtn.addEventListener('click', startFlight);

function startFlight() {
    if (isFlying) {
        return;
    }

    const bet = parseInt(betInput.value, 10);
    const targetCoefficient = parseFloat(targetCoefficientInput.value);

    if (!Number.isInteger(bet) || bet < 1) {
        flightResult.textContent = 'Ставка має бути хоча б 1 🍊';
        return;
    }

    if (!Number.isFinite(targetCoefficient) || targetCoefficient < 1.1 || targetCoefficient > 20) {
        flightResult.textContent = 'Коефіцієнт має бути від 1.1 до 20.';
        return;
    }

    if (!CounterManager.spendCount(bet)) {
        flightResult.textContent = 'Недостатньо мандаринок для польоту.';
        return;
    }

    const crashAt = generateCrashCoefficient();
    let currentCoefficient = 1;

    isFlying = true;
    startFlightBtn.disabled = true;
    betInput.disabled = true;
    targetCoefficientInput.disabled = true;
    crashText.textContent = '';
    flightStage.classList.remove('crashed', 'won');
    flightStage.classList.add('flying');
    flightResult.textContent = 'Літачок набирає висоту...';
    CounterManager.updateCounterDisplay(counterDisplay);

    flightTimer = setInterval(function() {
        currentCoefficient += getCoefficientStep(currentCoefficient);
        updateFlightView(currentCoefficient);

        if (currentCoefficient >= targetCoefficient && targetCoefficient <= crashAt) {
            finishFlightWin(bet, targetCoefficient);
            return;
        }

        if (currentCoefficient >= crashAt) {
            finishFlightCrash(crashAt);
        }
    }, tickMs);
}

function generateCrashCoefficient() {
    const random = Math.random();

    if (random < 0.08) {
        return 1 + Math.random() * 0.5;
    }

    if (random < 0.82) {
        return 1.4 + Math.random() * 2.9;
    }

    if (random < 0.97) {
        return 4.3 + Math.random() * 5.7;
    }

    return 10 + Math.random() * 10;
}

function getCoefficientStep(currentCoefficient) {
    return 0.025 + currentCoefficient * 0.018;
}

function updateFlightView(coefficient) {
    const cappedProgress = Math.min(1, (coefficient - 1) / 9);
    const x = cappedProgress * 72;
    const y = cappedProgress * 58;

    multiplierDisplay.textContent = `${coefficient.toFixed(2)}x`;
    plane.style.left = `${12 + x}%`;
    plane.style.bottom = `${12 + y}%`;
    plane.style.transform = `rotate(${Math.min(28, 8 + coefficient * 2)}deg)`;
}

function finishFlightWin(bet, targetCoefficient) {
    clearInterval(flightTimer);
    const payout = Math.floor(bet * targetCoefficient);
    CounterManager.setCount(CounterManager.getCount() + payout);
    CounterManager.updateCounterDisplay(counterDisplay);

    flightStage.classList.remove('flying');
    flightStage.classList.add('won');
    flightResult.textContent = `Долетів до ${targetCoefficient.toFixed(2)}x. Виграш: +${payout} 🍊`;
    endFlight();
}

function finishFlightCrash(crashAt) {
    clearInterval(flightTimer);
    flightStage.classList.remove('flying');
    flightStage.classList.add('crashed');
    crashText.textContent = `Впав на ${crashAt.toFixed(2)}x`;
    flightResult.textContent = 'Літачок впав раніше. Ставка згоріла.';
    endFlight();
}

function endFlight() {
    isFlying = false;
    startFlightBtn.disabled = false;
    betInput.disabled = false;
    targetCoefficientInput.disabled = false;
}

function resetFlightView() {
    plane.style.left = '12%';
    plane.style.bottom = '12%';
    plane.style.transform = 'rotate(8deg)';
    multiplierDisplay.textContent = '1.00x';
}
