const rulesBtn = document.getElementById('rules-btn');
const loginBtn = document.getElementById('login-btn');
const rulesModal = document.getElementById('rules-modal');
const loginModal = document.getElementById('login-modal');
const closeButtons = document.querySelectorAll('.close-btn');
const closeLoginBtn = document.querySelector('.close-login-btn');
const counterDisplay = document.getElementById('counter');
const buyHintBtn1 = document.getElementById('buy-hint-btn-1');
const buyHintBtn2 = document.getElementById('buy-hint-btn-2');
const hintContent1 = document.getElementById('hint-content-1');
const hintContent2 = document.getElementById('hint-content-2');
const loginInput = document.getElementById('login-input');
const passwordInput = document.getElementById('password-input');
const steamLoginBtn = document.getElementById('steam-login-btn');

const hint1PurchasedKey = 'hint1Purchased';
const hint2PurchasedKey = 'hint2Purchased';
const correctLogins = ['belchonok', 'belсhonok'];
const correctPassword = 'UraGroznyj';
const pageMaxMandarins = 2;

CounterManager.setPageMaxLimit(pageMaxMandarins);
CounterManager.updateCounterDisplay(counterDisplay);
restorePurchasedHints();

rulesBtn.addEventListener('click', function() {
    rulesModal.classList.add('active');
});

loginBtn.addEventListener('click', function() {
    loginModal.classList.add('active');
});

closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const modalId = this.getAttribute('data-modal');
        document.getElementById(modalId).classList.remove('active');
    });
});

closeLoginBtn.addEventListener('click', function() {
    loginModal.classList.remove('active');
});

function showHint(hintContent, hintText) {
    hintContent.textContent = '';
    const hintElement = document.createElement('div');
    hintElement.className = 'hint-revealed';
    hintElement.textContent = hintText;
    hintContent.appendChild(hintElement);
}

function buyHint(hintContent, hintText, storageKey) {
    if (localStorage.getItem(storageKey) === 'true') {
        showHint(hintContent, hintText);
        return;
    }

    if (CounterManager.spendCount(1)) {
        localStorage.setItem(storageKey, 'true');
        showHint(hintContent, hintText);
        CounterManager.updateCounterDisplay(counterDisplay);
    } else {
        alert('❌ У тебе недостатньо мандаринок! Потрібна 1 мандаринка.');
    }
}

function restorePurchasedHints() {
    if (localStorage.getItem(hint1PurchasedKey) === 'true') {
        showHint(hintContent1, 'belchonok');
    }

    if (localStorage.getItem(hint2PurchasedKey) === 'true') {
        showHint(hintContent2, correctPassword);
    }
}

buyHintBtn1.addEventListener('click', function() {
    buyHint(hintContent1, 'belchonok', hint1PurchasedKey);
});

buyHintBtn2.addEventListener('click', function() {
    buyHint(hintContent2, correctPassword, hint2PurchasedKey);
});

steamLoginBtn.addEventListener('click', function() {
    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();

    if (correctLogins.includes(login) && password === correctPassword) {
        window.location.href = '../html/page3.html';
    } else {
        alert('невірно');
    }
});

window.addEventListener('click', function(event) {
    if (event.target === rulesModal) {
        rulesModal.classList.remove('active');
    }
    if (event.target === loginModal) {
        loginModal.classList.remove('active');
    }
});
