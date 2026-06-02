const counterDisplay = document.getElementById('counter');
const explorerGrid = document.getElementById('explorer-grid');
const pathLabel = document.getElementById('path-label');
const backBtn = document.getElementById('back-btn');
const photoViewer = document.getElementById('photo-viewer');
const closeViewerBtn = document.getElementById('close-viewer-btn');
const viewerPhoto = document.getElementById('viewer-photo');
const viewerText = document.getElementById('viewer-text');
const viewerCaption = document.getElementById('viewer-caption');
const buyTextHintBtn = document.getElementById('buy-text-hint-btn');
const passwordModal = document.getElementById('password-modal');
const passwordTitle = document.getElementById('password-title');
const folderPasswordInput = document.getElementById('folder-password-input');
const passwordError = document.getElementById('password-error');
const passwordCancelBtn = document.getElementById('password-cancel-btn');
const passwordSubmitBtn = document.getElementById('password-submit-btn');

const pageMaxMandarins = 5;
const almostFileOpenedKey = 'folder8AlmostOpened';
const revealedTextFile = textFile(
    'щось новеньке?.txt',
    `Тут реально з'явилося щось новеньке 54`
);

// Паролі для папок міняються тут.
// Наприклад: folder2: '1234', folder4: 'abcd'
const folderPasswords = {
    folder2: '9754',
    folder4: '7854'
};

const photos = {
    orhan: '../img/orkhan.jpg',
    mandaryn: '../img/mandaryn.jpg',
    turan: '../img/turan.jpg',
    colage1: '../img/colage1.jpg',
    orkh_turan: '../img/orkh_turan.jpg',
    alt1: '../img/altgirl1.jpg',
    alt2: '../img/altgirl2.jpg',
    alt3: '../img/altgirl3.jpg'
};

function folder(name, children = []) {
    return { name, type: 'folder', children };
}

function protectedFolder(name, passwordKey, children = []) {
    return { name, type: 'folder', passwordKey, children };
}

function photo(name, src) {
    return { name, type: 'photo', src };
}

function textFile(name, text, options = {}) {
    return { name, type: 'text', text, ...options };
}

const fileSystem = folder('folder 1', [
    folder('folder 1', [
        textFile('Очевидний текстовий файл.txt', 'Очевидно, що ти його відкрив. Аянокоджи читає тебе, як книжку.'),
        
        folder('folder 8', [
            textFile('not-a-hint.txt', 'Це майже підказка. Майже. phone number.', {
                hintKey: 'phoneNumberHintPurchased',
                hintText: 'Це майже підказка. Майже. your phone number.'
            }),
            photo('Хз, тут просто Орхан.jpg', photos.orhan),
            folder('folder 3', [
                textFile('loop.txt', 'Вітаю в петлі. Тут красиво, але безрезультатно.'),
                photo('Хз, тут просто Туран.jpg', photos.turan),
                folder('folder 1488', [
                    textFile('текст.txt', 'Ти заліз далеко, а сенс. Перевір 7 папку'),
                    photo('Хз, тут просто Орхан і Туран.jpg', photos.orkh_turan)
                ])
            ])
        ])
    ]),
    protectedFolder('folder 2', 'folder2', [
        textFile('passwords.txt', 'Ніяких мандаринок тут немає. Серйозно.'),
        folder('folder 10', [
            textFile('якісь циферки.txt', '03')
        ])
    ]),
    folder('folder 3', [
        textFile('important.txt', 'Важлива інформація: тут ти нічого не знайдеш.'),
        photo('fake-important.jpg', photos.colage1),
        folder('folder 6', [
            textFile('empty.txt', 'А файл не такий вже й порожній.', { invisible: true }),
            photo('empty-proof.jpg')
        ])
    ]),
    protectedFolder('folder 4', 'folder4', [
        textFile('!!!.txt', 'Бачиш фото, не відкривай, вчися на своїх помилках.'),
        photo('warning.jpg', photos.alt3),
        folder('folder 1', [
            textFile('again.txt', 'Так, це знову folder 1. Лабіринт має право бути нахабним.'),
            photo('again.jpg', photos.orhan)
        ])
    ]),
    folder('folder 5', [
        textFile('secret.txt', 'Ти додумався скопіювати текст, а ти не промах. 78', { redacted: true }),
        photo('secret.jpg', photos.mandaryn)
    ]),
    folder('folder 6', [
        textFile('анекдот.txt', 'Знайшов єврей пачку доларів, а там не хватає.'),
        photo('map.jpg', photos.alt2)
    ]),
    folder('folder 7', [
        textFile('Тобі сюди.txt', 'Ти тут, як неочікувано. Шукай папку з назвою яка виділяється.'),
        folder('Тобі сюди', [
            textFile('Folder2.txt', '-3, number, -3'),
            folder('Не заходи, пж', [
                folder('folder 11', [
                    textFile('text.txt', 'Кінець')
                ])
            ])
        ]),
        folder('Не заходи, пж', [
            textFile('НЕ ВІДКРИВАЙ!!!.txt', 'Навіть якщо ти відкрив мене, в ніякому разі НЕ ВІДКРИВАЙ ФОТО '),
            photo('Хз, тут просто Орхан.jpg', photos.alt1),
            photo('А тут Туран.jpg', photos.alt2),
            photo('А тут вони разом.jpg', photos.alt3),
        ])
    ]),
    folder('folder 8', [
        textFile('almost.txt', 'Вернися в папку 1, присядь 10 раз, побачиш результат.', {
            revealFileKey: almostFileOpenedKey
        }),
        photo('almost-no.jpg', photos.alt2)
    ]),
    folder('folder 9', [
        textFile('note.txt', 'folder 9 існує тільки щоб збивати з пантелику.'),
        photo('confusion.jpg', photos.alt1)
    ]),
    folder('folder 10', [
        textFile('system.txt', 'SYSTEM: користувач пішов не туди.'),
        photo('system.jpg', photos.alt3)
    ]),
    folder('folder 11', [
        textFile('lonely.txt', 'Одинока папка. Вона нічого не вирішує.'),
        photo('lonely.jpg', photos.orhan)
    ])
]);

let currentFolder = fileSystem;
const history = [];
let pendingFolder = null;
let currentTextHintFile = null;

CounterManager.setPageMaxLimit(pageMaxMandarins);
CounterManager.updateCounterDisplay(counterDisplay);
restoreRevealedFiles();
renderFolder();

function renderFolder() {
    restoreRevealedFiles();
    explorerGrid.textContent = '';
    pathLabel.textContent = getCurrentPath();
    backBtn.disabled = history.length === 0;

    currentFolder.children.forEach(item => {
        const button = document.createElement('button');
        button.className = 'file-item';
        button.type = 'button';
        button.innerHTML = `
            <span class="file-icon">${getIcon(item.type)}</span>
            <span class="file-name">${item.name}</span>
        `;

        button.addEventListener('click', function() {
            if (item.type === 'folder') {
                openFolder(item);
                return;
            }

            openFile(item);
        });

        explorerGrid.appendChild(button);
    });
}

function openFolder(item) {
    if (item.passwordKey) {
        showPasswordModal(item);
        return;
    }

    enterFolder(item);
}

function enterFolder(item) {
    history.push(currentFolder);
    currentFolder = item;
    renderFolder();
}

function showPasswordModal(folderItem) {
    pendingFolder = folderItem;
    passwordTitle.textContent = `Пароль для ${folderItem.name}`;
    folderPasswordInput.value = '';
    passwordError.textContent = '';
    passwordModal.classList.add('active');
    folderPasswordInput.focus();
}

function closePasswordModal() {
    pendingFolder = null;
    passwordModal.classList.remove('active');
}

function submitFolderPassword() {
    if (!pendingFolder) {
        return;
    }

    const requiredPassword = folderPasswords[pendingFolder.passwordKey];
    const enteredPassword = folderPasswordInput.value.trim();

    if (enteredPassword !== requiredPassword) {
        passwordError.textContent = 'Невірний пароль';
        return;
    }

    const folderToOpen = pendingFolder;
    closePasswordModal();
    enterFolder(folderToOpen);
}

function getIcon(type) {
    if (type === 'folder') {
        return '📁';
    }

    if (type === 'text') {
        return '📄';
    }

    return '🖼️';
}

function getCurrentPath() {
    const names = history.map(item => item.name).concat(currentFolder.name);
    return `/ ${names.join(' / ')}`;
}

function openFile(file) {
    viewerCaption.textContent = file.name;
    currentTextHintFile = null;
    buyTextHintBtn.classList.add('is-hidden');

    if (file.revealFileKey) {
        localStorage.setItem(file.revealFileKey, 'true');
        restoreRevealedFiles();
    }

    if (file.type === 'text') {
        viewerPhoto.classList.add('is-hidden');
        viewerText.classList.remove('is-hidden');
        renderTextFile(file);

        if (file.hintKey && localStorage.getItem(file.hintKey) !== 'true') {
            currentTextHintFile = file;
            buyTextHintBtn.classList.remove('is-hidden');
        }
    } else {
        viewerText.classList.add('is-hidden');
        viewerPhoto.classList.remove('is-hidden');
        viewerPhoto.src = file.src;
    }

    photoViewer.classList.add('active');
}

function restoreRevealedFiles() {
    if (localStorage.getItem(almostFileOpenedKey) !== 'true') {
        return;
    }

   const targetFolder = fileSystem.children[0].children;
    const fileAlreadyVisible = targetFolder.some(item => item.name === revealedTextFile.name);

    if (!fileAlreadyVisible) {
        targetFolder.push(revealedTextFile);
    }
}

function renderTextFile(file) {
    viewerText.classList.toggle('redacted-file', Boolean(file.redacted));
    viewerText.classList.toggle('invisible-file', Boolean(file.invisible));

    if (file.redacted) {
        viewerText.innerHTML = '';
        getTextFileContent(file).split(' ').forEach(word => {
            const wordElement = document.createElement('span');
            wordElement.className = 'redacted-word';
            wordElement.textContent = word;
            viewerText.appendChild(wordElement);
        });
        return;
    }

    viewerText.classList.remove('redacted-file');
    viewerText.textContent = getTextFileContent(file);
}

function getTextFileContent(file) {
    if (file.hintKey && localStorage.getItem(file.hintKey) === 'true') {
        return file.hintText;
    }

    return file.text;
}

function buyCurrentTextHint() {
    if (!currentTextHintFile) {
        return;
    }

    if (!CounterManager.spendCount(1)) {
        alert('У тебе недостатньо мандаринок!');
        return;
    }

    localStorage.setItem(currentTextHintFile.hintKey, 'true');
    renderTextFile(currentTextHintFile);
    buyTextHintBtn.classList.add('is-hidden');
    currentTextHintFile = null;
    CounterManager.updateCounterDisplay(counterDisplay);
}

backBtn.addEventListener('click', function() {
    if (history.length === 0) {
        return;
    }

    currentFolder = history.pop();
    renderFolder();
});

closeViewerBtn.addEventListener('click', function() {
    photoViewer.classList.remove('active');
});

buyTextHintBtn.addEventListener('click', buyCurrentTextHint);

photoViewer.addEventListener('click', function(event) {
    if (event.target === photoViewer) {
        photoViewer.classList.remove('active');
    }
});

passwordSubmitBtn.addEventListener('click', submitFolderPassword);

passwordCancelBtn.addEventListener('click', closePasswordModal);

folderPasswordInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        submitFolderPassword();
    }
});

passwordModal.addEventListener('click', function(event) {
    if (event.target === passwordModal) {
        closePasswordModal();
    }
});
