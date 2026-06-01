const counterDisplay = document.getElementById('counter');
const explorerGrid = document.getElementById('explorer-grid');
const pathLabel = document.getElementById('path-label');
const backBtn = document.getElementById('back-btn');
const photoViewer = document.getElementById('photo-viewer');
const closeViewerBtn = document.getElementById('close-viewer-btn');
const viewerPhoto = document.getElementById('viewer-photo');
const viewerCaption = document.getElementById('viewer-caption');

const pageMaxMandarins = 5;
const placeholderPhoto1 = '../img/IMG_20181226_084322.jpg';
const placeholderaltgirl1 = '../img/altgirl1.jpg';
const placeholderaltgirl2 = '../img/altgirl2.jpg';
const placeholderaltgirl3 = '../img/altgirl3.jpg';
const fileSystem = {
    name: 'folder 1',
    type: 'folder',
    children: [
        {
            name: 'Перейди в папку 7',
            type: 'folder',
            children: [
                { 
                    name: 'folder 4',
                    type: 'folder' 
                }
            ]
        },
        {
            name: 'folder 2',
            type: 'folder',
            children: [
                { name: 'Хз, тут просто Орхан.jpg', type: 'photo', src: placeholderPhoto1 }
            ]
        },
        {
            name: 'folder 3',
            type: 'folder',
            children: [
                { }
            ]
        },
        {
            name: 'folder 4',
            type: 'folder',
            children: [
                {}
            ]
        },
        {
            name: 'folder 5',
            type: 'folder',
            children: [
                { }
            ]
        },
        {
            name: 'folder 6',
            type: 'folder',
            children: [
                { }
            ]
        },
        {
            name: 'folder 7',
            type: 'folder',
            children: [
                { 
                    name: 'Тобі сюди',
                    type: 'folder'
                },
                {
                    name: 'Не заходи, пж',
                    type: 'folder',
                    children: [
                        { name: 'Хз, тут просто Орхан.jpg', type: 'photo', src: placeholderaltgirl1 },
                        { name: 'Хз, тут просто Туран.jpg', type: 'photo', src: placeholderaltgirl2 },
                        { name: 'А тут вони разом.jpg', type: 'photo', src: placeholderaltgirl3 },
                    ]
                }
            ]
        },
        {
            name: 'folder 8',
            type: 'folder',
            children: [
                { }
            ]
        },
        {
            name: 'folder 9',
            type: 'folder',
            children: [
                { }
            ]
        },
        {
            name: 'folder 10',
            type: 'folder',
            children: [
                { }
            ]
        },
        {
            name: 'folder 11',
            type: 'folder',
            children: [
                { }
            ]
        },
    ]
};

let currentFolder = fileSystem;
const history = [];

CounterManager.setPageMaxLimit(pageMaxMandarins);
CounterManager.updateCounterDisplay(counterDisplay);
renderFolder();

function renderFolder() {
    explorerGrid.textContent = '';
    pathLabel.textContent = `/ ${currentFolder.name}`;
    backBtn.disabled = history.length === 0;

    currentFolder.children.forEach(item => {
        const button = document.createElement('button');
        button.className = 'file-item';
        button.type = 'button';
        button.innerHTML = `
            <span class="file-icon">${item.type === 'folder' ? '📁' : '🖼️'}</span>
            <span class="file-name">${item.name}</span>
        `;

        button.addEventListener('click', function() {
            if (item.type === 'folder') {
                history.push(currentFolder);
                currentFolder = item;
                renderFolder();
                return;
            }

            openPhoto(item);
        });

        explorerGrid.appendChild(button);
    });
}

function openPhoto(photo) {
    viewerPhoto.src = photo.src;
    viewerCaption.textContent = photo.name;
    photoViewer.classList.add('active');
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

photoViewer.addEventListener('click', function(event) {
    if (event.target === photoViewer) {
        photoViewer.classList.remove('active');
    }
});
