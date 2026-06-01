const counterDisplay = document.getElementById('counter');
const hackStartBtn = document.getElementById('hack-start-btn');
const hackOverlay = document.getElementById('hack-overlay');

const pageMaxMandarins = 4;
const page44CompletedKey = 'page44Completed';

CounterManager.setPageMaxLimit(pageMaxMandarins);
CounterManager.updateCounterDisplay(counterDisplay);

hackStartBtn.addEventListener('click', function() {
    hackStartBtn.disabled = true;

    if (localStorage.getItem(page44CompletedKey) !== 'true') {
        CounterManager.incrementCount();
        localStorage.setItem(page44CompletedKey, 'true');
        CounterManager.updateCounterDisplay(counterDisplay);
    }

    hackOverlay.classList.add('active');

    setTimeout(function() {
        window.location.href = '../html/page55.html';
    }, 15500);
});
