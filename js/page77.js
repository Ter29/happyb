const counterDisplay = document.getElementById('counter');
const wheelWindow = document.querySelector('.wheel-window');
const wheelTrack = document.getElementById('wheel-track');
const betInput = document.getElementById('bet-input');
const halfBtn = document.getElementById('half-btn');
const maxBtn = document.getElementById('max-btn');
const spinBtn = document.getElementById('spin-btn');
const resultText = document.getElementById('result-text');
const choiceButtons = document.querySelectorAll('.choice-btn');

const pageMaxMandarins = 7;
const tileWidth = 86;
const baseWheel = [
    'red', 'black', 'red', 'black', 'red', 'black', 'red',
    'green',
    'black', 'red', 'black', 'red', 'black', 'red', 'black'
];
const multipliers = {
    red: 2,
    black: 2,
    green: 14
};
const labels = {
    red: 'червоне',
    black: 'чорне',
    green: 'мандарин'
};

let selectedChoice = 'red';
let isSpinning = false;

CounterManager.setPageMaxLimit(pageMaxMandarins);
CounterManager.updateCounterDisplay(counterDisplay);
renderWheel();

choiceButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (isSpinning) {
            return;
        }

        selectedChoice = button.dataset.choice;
        choiceButtons.forEach(item => item.classList.remove('selected'));
        button.classList.add('selected');
    });
});

halfBtn.addEventListener('click', function() {
    const halfBalance = Math.max(1, Math.floor(CounterManager.getCount() / 2));
    betInput.value = halfBalance;
});

maxBtn.addEventListener('click', function() {
    betInput.value = Math.max(1, CounterManager.getCount());
});

spinBtn.addEventListener('click', spinWheel);

function renderWheel() {
    wheelTrack.textContent = '';
    wheelTrack.style.transition = 'none';
    wheelTrack.style.transform = 'translateX(0)';

    const longWheel = buildLongWheel();
    longWheel.forEach(color => {
        const tile = document.createElement('div');
        tile.className = `wheel-tile ${color}`;
        tile.textContent = color === 'green' ? '🍊' : multipliers[color] + 'x';
        wheelTrack.appendChild(tile);
    });
}

function buildLongWheel() {
    const result = [];

    for (let i = 0; i < 9; i += 1) {
        result.push(...baseWheel);
    }

    return result;
}

function spinWheel() {
    if (isSpinning) {
        return;
    }

    const bet = parseInt(betInput.value, 10);

    if (!Number.isInteger(bet) || bet < 1) {
        resultText.textContent = 'Ставка має бути хоча б 1 🍊';
        return;
    }

    if (!CounterManager.spendCount(bet)) {
        resultText.textContent = 'Недостатньо мандаринок для ставки.';
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;
    betInput.disabled = true;
    CounterManager.updateCounterDisplay(counterDisplay);
    resultText.textContent = 'Колесо крутиться...';

    const longWheel = buildLongWheel();
    const resultIndex = getRandomResultIndex(longWheel);
    const resultColor = longWheel[resultIndex];
    const targetOffset = getTargetOffset(resultIndex);

    wheelTrack.style.transition = 'none';
    wheelTrack.style.transform = 'translateX(0)';

    requestAnimationFrame(function() {
        wheelTrack.style.transition = 'transform 4.4s cubic-bezier(0.12, 0.78, 0.18, 1)';
        wheelTrack.style.transform = `translateX(-${targetOffset}px)`;
    });

    setTimeout(function() {
        finishSpin(bet, resultColor);
    }, 4550);
}

function getRandomResultIndex(longWheel) {
    const safeStart = baseWheel.length * 5;
    const safeEnd = baseWheel.length * 8;
    return safeStart + Math.floor(Math.random() * (safeEnd - safeStart));
}

function getTargetOffset(resultIndex) {
    const wheelCenter = wheelWindow.getBoundingClientRect().width / 2;
    const tileCenter = tileWidth / 2;
    return Math.max(0, (resultIndex * tileWidth) - wheelCenter + tileCenter);
}

function finishSpin(bet, resultColor) {
    const won = resultColor === selectedChoice;

    if (won) {
        const payout = bet * multipliers[resultColor];
        CounterManager.setCount(CounterManager.getCount() + payout);
        resultText.textContent = `Випало ${labels[resultColor]}. Перемога: +${payout} 🍊`;
    } else {
        resultText.textContent = `Випало ${labels[resultColor]}. Ставка згоріла.`;
    }

    CounterManager.updateCounterDisplay(counterDisplay);
    isSpinning = false;
    spinBtn.disabled = false;
    betInput.disabled = false;
}
