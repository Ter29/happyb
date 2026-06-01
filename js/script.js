const button = document.getElementById('mandarin-btn');
const textElement = document.getElementById('text-to-select');
const hiddenMandarinBtn = document.getElementById('hidden-mandarin-btn');
const hiddenMandarinUsedKey = 'hiddenMandarinUsed';
const hiddenElements = document.querySelectorAll('.non-active');

if (CounterManager.isPage1Completed()) {
    showHiddenElements();
}

if (localStorage.getItem(hiddenMandarinUsedKey) === 'true') {
    hiddenMandarinBtn.classList.add('used');
    hiddenMandarinBtn.disabled = true;
}

function showHiddenElements() {
    hiddenElements.forEach(element => {
        element.style.display = 'block';
    });
}

function checkTextSelected() {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    const fullText = textElement.textContent;
    
    if (selectedText.length === fullText.length && !CounterManager.isPage1Completed()) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

document.addEventListener('mouseup', checkTextSelected);
document.addEventListener('keyup', checkTextSelected);

button.addEventListener('click', function() {
    if (!CounterManager.isPage1Completed()) {
        const newCount = CounterManager.incrementCount();
        alert("🍊 Вітаємо! Ти отримав 1 мандаринку!");
        CounterManager.markPage1Completed();
        showHiddenElements();
        window.location.href = 'html/page2.html';
    }
});

hiddenMandarinBtn.addEventListener('click', function() {
    if (localStorage.getItem(hiddenMandarinUsedKey) !== 'true') {
        const newCount = CounterManager.incrementCount();
        localStorage.setItem(hiddenMandarinUsedKey, 'true');
        hiddenMandarinBtn.classList.add('used');
        hiddenMandarinBtn.disabled = true;
        showHiddenElements();
        alert("🍊 +1 мандаринка знайдена!");
    }
});
