const counterDisplay = document.getElementById('counter');
const breakPage = document.getElementById('break-page');
const chaosBtn = document.getElementById('chaos-btn');
const realBtn = document.getElementById('real-btn');

const pageMaxMandarins = 7;
const page66CaughtButtonKey = 'page66CaughtButton';
const greenButtonDelay = 30000;

CounterManager.setPageMaxLimit(pageMaxMandarins);
CounterManager.updateCounterDisplay(counterDisplay);

let chaosStarted = false;
let realButtonVisible = false;
let realButtonDrag = null;

chaosBtn.addEventListener('click', function() {
    if (chaosStarted) {
        return;
    }

    chaosStarted = true;
    breakPage.classList.add('is-broken');
    chaosBtn.textContent = 'Спробуй зловити мене';

    setTimeout(function() {
        realButtonVisible = true;
        breakPage.classList.add('show-real-button');
        realBtn.textContent = 'Тягни мене на червону';
    }, greenButtonDelay);
});

chaosBtn.addEventListener('pointerenter', function() {
    if (!breakPage.classList.contains('is-broken')) {
        return;
    }

    const maxX = Math.max(0, window.innerWidth - chaosBtn.offsetWidth - 24);
    const maxY = Math.max(0, window.innerHeight - chaosBtn.offsetHeight - 24);

    chaosBtn.style.left = `${Math.floor(Math.random() * maxX)}px`;
    chaosBtn.style.top = `${Math.floor(Math.random() * maxY)}px`;
});

realBtn.addEventListener('pointerdown', function(event) {
    if (!realButtonVisible) {
        return;
    }

    realBtn.setPointerCapture(event.pointerId);
    const rect = realBtn.getBoundingClientRect();
    realButtonDrag = {
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top
    };
    realBtn.classList.add('is-dragging');
});

realBtn.addEventListener('pointermove', function(event) {
    if (!realButtonDrag) {
        return;
    }

    const nextLeft = event.clientX - realButtonDrag.offsetX;
    const nextTop = event.clientY - realButtonDrag.offsetY;

    realBtn.style.left = `${Math.max(0, Math.min(window.innerWidth - realBtn.offsetWidth, nextLeft))}px`;
    realBtn.style.top = `${Math.max(0, Math.min(window.innerHeight - realBtn.offsetHeight, nextTop))}px`;
    realBtn.style.bottom = 'auto';
    realBtn.style.transform = 'none';

    if (buttonsOverlap(realBtn, chaosBtn)) {
        catchRedButton();
    }
});

realBtn.addEventListener('pointerup', function() {
    realButtonDrag = null;
    realBtn.classList.remove('is-dragging');
});

realBtn.addEventListener('pointercancel', function() {
    realButtonDrag = null;
    realBtn.classList.remove('is-dragging');
});

function buttonsOverlap(firstButton, secondButton) {
    const firstRect = firstButton.getBoundingClientRect();
    const secondRect = secondButton.getBoundingClientRect();

    return !(
        firstRect.right < secondRect.left ||
        firstRect.left > secondRect.right ||
        firstRect.bottom < secondRect.top ||
        firstRect.top > secondRect.bottom
    );
}

function catchRedButton() {
    if (localStorage.getItem(page66CaughtButtonKey) !== 'true') {
        CounterManager.incrementCount();
        localStorage.setItem(page66CaughtButtonKey, 'true');
        CounterManager.updateCounterDisplay(counterDisplay);
    }

    realButtonDrag = null;
    realBtn.textContent = 'Спіймав! +1 🍊';
    realBtn.disabled = true;
    chaosBtn.disabled = true;
    breakPage.classList.add('is-fixed');

    setTimeout(function() {
        window.location.href = '../html/page77.html';
    }, 900);
}
