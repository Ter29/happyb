const counterDisplay = document.getElementById('counter');
const mandarinAddInput = document.getElementById('mandarin-add-input');
const addMandarinBtn = document.getElementById('add-mandarin-btn');
const bonusMessage = document.getElementById('bonus-message');

const pageMaxMandarins = 9;

CounterManager.setPageMaxLimit(pageMaxMandarins);
CounterManager.updateCounterDisplay(counterDisplay);

addMandarinBtn.addEventListener('click', function() {
    const amount = parseInt(mandarinAddInput.value, 10);

    if (!Number.isInteger(amount) || amount < 1) {
        bonusMessage.textContent = 'Введи нормальну кількість мандаринок.';
        return;
    }

    CounterManager.setCount(CounterManager.getCount() + amount);
    CounterManager.setTotalCollected(CounterManager.getTotalCollected() + amount);
    CounterManager.updateCounterDisplay(counterDisplay);
    bonusMessage.textContent = `Додано ${amount} 🍊. Оце вже серйозний запас.`;
});
