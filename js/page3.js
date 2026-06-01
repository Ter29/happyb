const counterDisplay = document.getElementById('counter');
const submitAnswerBtn = document.getElementById('submit-answer-btn');
const wrongAnswerModal = document.getElementById('wrong-answer-modal');
const closeWrongModalBtn = document.getElementById('close-wrong-modal-btn');
const successOverlay = document.getElementById('success-overlay');

const pageMaxMandarins = 3;
const page43CompletedKey = 'page43Completed';

CounterManager.setPageMaxLimit(pageMaxMandarins);
CounterManager.updateCounterDisplay(counterDisplay);

function getSelectedAnswer() {
    return document.querySelector('input[name="answer"]:checked').value;
}

function showWrongAnswer() {
    wrongAnswerModal.classList.add('active');
}

function showCorrectAnswer() {
    submitAnswerBtn.disabled = true;

    if (localStorage.getItem(page43CompletedKey) !== 'true') {
        CounterManager.incrementCount();
        localStorage.setItem(page43CompletedKey, 'true');
        CounterManager.updateCounterDisplay(counterDisplay);
    }

    successOverlay.classList.add('active');

    setTimeout(function() {
        window.location.href = '../html/page44.html';
    }, 3000);
}

submitAnswerBtn.addEventListener('click', function() {
    if (getSelectedAnswer() === 'lidiia') {
        showWrongAnswer();
        return;
    }

    showCorrectAnswer();
});

closeWrongModalBtn.addEventListener('click', function() {
    wrongAnswerModal.classList.remove('active');
});

wrongAnswerModal.addEventListener('click', function(event) {
    if (event.target === wrongAnswerModal) {
        wrongAnswerModal.classList.remove('active');
    }
});
