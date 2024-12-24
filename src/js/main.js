const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const previewImage = document.getElementById('previewImage');
const placeholderText = document.getElementById('placeholderText');
const uploadButton = document.querySelector('.upload');
const addTextBtn = document.getElementById('addTextBtn');
const allSizeBtn = document.querySelectorAll('.size-btn');
const allThicknessBtn = document.querySelectorAll('.thickness-btn');
const downloadBtn = document.getElementById('downloadBtn');
const leftPanel = document.querySelector('.image-customization-page .left');
console.log(leftPanel);


let scale = 1;
let isImageUploaded = false;
let isDragging = false;
let initialX = 0, initialY = 0;
let currentX = 0, currentY = 0;
let xOffset = 0, yOffset = 0;

uploadBox.addEventListener('click', () => {
    if (!isImageUploaded) {
        fileInput.click();
    }
});

uploadButton.addEventListener('click', () => {
    fileInput.disabled = false;
    fileInput.click();
});

fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
            placeholderText.style.display = "none";
            isImageUploaded = true;
            initializeImageFeatures(previewImage);
            addTextBtn.style.display = 'block';
            downloadBtn.style.display = 'block';
            addTextBtn.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

function initializeImageFeatures(imageElement) {
    addResizeHandle(imageElement);
    addRotateHandle(imageElement);


    makeDraggable(imageElement, { resize: 'resize', rotate: 'rotate' });
}

function addResizeHandle(imageElement) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.right = '65%';
    resizeHandle.style.bottom = '20%';
    resizeHandle.style.cursor = 'nwse-resize';
    resizeHandle.innerText = '+';
    resizeHandle.style.color = 'blue';
    resizeHandle.style.backgroundColor = 'transparent';

    leftPanel.appendChild(resizeHandle);

    resizeHandle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const initialWidth = imageElement.offsetWidth;
        const initialMouseX = e.clientX;

        function resize(e) {
            const newWidth = initialWidth + (e.clientX - initialMouseX);
            imageElement.style.width = newWidth + 'px';
        }

        function stopResizing() {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResizing);
        }

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
    });
}

function addRotateHandle(imageElement) {
    const rotateHandle = document.createElement('div');
    rotateHandle.className = 'rotate';
    rotateHandle.style.position = 'absolute';
    rotateHandle.style.top = '15%';
    rotateHandle.style.left = '20%';
    rotateHandle.style.transform = 'translateX(-50%)';
    rotateHandle.style.cursor = 'pointer';
    rotateHandle.innerHTML = '&#8635;';
    rotateHandle.style.color = 'blue';
    rotateHandle.style.backgroundColor = 'transparent';

    leftPanel.appendChild(rotateHandle);

    rotateHandle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const rect = imageElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function rotate(e) {
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const degree = (angle * (180 / Math.PI) + 90) % 360;
            imageElement.style.transform = `rotate(${degree}deg)`;
        }

        function stopRotating() {
            document.removeEventListener('mousemove', rotate);
            document.removeEventListener('mouseup', stopRotating);
        }

        document.addEventListener('mousemove', rotate);
        document.addEventListener('mouseup', stopRotating);
    });
}

document.addEventListener('mousedown', (e) => {
    if (!previewImage.contains(e.target)) {
        previewImage.style.cursor = 'default';
    }
});

// ===========================================
// ============ADD TEXT BOX===================
// ===========================================

document.getElementById('addTextBtn').addEventListener('click', function () {
    document.getElementById('textModal').style.display = 'block';
});

function closeTextModal() {
    document.getElementById('textModal').style.display = 'none';
}

document.getElementById('addTextModalBtn').addEventListener('click', function () {
    const text = document.getElementById('modalTextInput').value;
    const textColor = document.getElementById('textColor').value;
    const fontStyle = document.getElementById('fontStyleSelect').value;

    if (text.trim() !== '') {
        const textBox = document.createElement('div');
        textBox.className = 'text-box';
        textBox.innerText = text;

        textBox.style.position = 'absolute';
        textBox.style.fontFamily = fontStyle;
        textBox.style.color = textColor;
        textBox.style.fontSize = '24px';
        textBox.style.top = '50%';
        textBox.style.left = '50%';
        textBox.style.transform = 'translate(-50%, -50%)';
        textBox.style.cursor = 'move';
        textBox.style.border = 'none';
        document.getElementById('uploadBox').appendChild(textBox);

        makeDraggable(textBox, { resize: 'resize-handle', rotate: 'rotate-handle' });
        makeResizable(textBox);
        makeRotatable(textBox);
    }

    closeTextModal();
});

function makeDraggable(element, handle) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        element.style.cursor = 'grabbing';

        element.style.border = '2px dashed #248EE6';

        document.querySelector(`.${handle.resize}`).style.display = 'block';
        document.querySelector(`.${handle.rotate}`).style.display = 'block';

    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            element.style.left = e.clientX - offsetX + 'px';
            element.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
        element.style.cursor = 'move';
    });

    document.addEventListener('mousedown', function (e) {
        if (!element.contains(e.target)) {
            element.style.border = 'none';
            document.querySelector(`.${handle.resize}`).style.display = 'none';
            document.querySelector(`.${handle.rotate}`).style.display = 'none';
        }
    });
}

function makeResizable(element) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.right = '-11.3px';
    resizeHandle.style.bottom = '-6.5px';
    resizeHandle.style.fontSize = '24px';
    resizeHandle.style.cursor = 'crosshair';
    resizeHandle.innerText = '+';
    resizeHandle.style.display = 'none';

    element.appendChild(resizeHandle);

    resizeHandle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const initialWidth = element.offsetWidth;
        const initialMouseX = e.clientX;

        function resize(e) {
            const newSize = initialWidth + (e.clientX - initialMouseX);
            element.style.fontSize = newSize + 'px';
        }
        function stopResizing() {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResizing);
        }

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
    });
}

function makeRotatable(element) {
    const rotateHandle = document.createElement('div');
    rotateHandle.className = 'rotate-handle';
    rotateHandle.style.position = 'absolute';
    rotateHandle.style.top = '-30px';
    rotateHandle.style.left = '50%';
    rotateHandle.style.transform = 'translateX(-50%)';
    rotateHandle.style.cursor = 'pointer';
    rotateHandle.style.fontSize = '24px';
    rotateHandle.innerHTML = '&#8635;';
    rotateHandle.style.display = 'none';

    element.appendChild(rotateHandle);

    rotateHandle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function rotate(e) {
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const degree = (angle * (180 / Math.PI) + 90) % 360;
            element.style.transform = `translate(-50%, -50%) rotate(${degree}deg)`;
        }

        function stopRotating() {
            document.removeEventListener('mousemove', rotate);
            document.removeEventListener('mouseup', stopRotating);
        }

        document.addEventListener('mousemove', rotate);
        document.addEventListener('mouseup', stopRotating);
    });
}

function updatePreview() {
    const text = document.getElementById('modalTextInput').value || 'Preview Text';

    document.querySelectorAll('option').forEach(option => {
        const font = option.value;
        option.style.fontFamily = font;
        option.textContent = `${text}`;
    });
}

function changeFontFamily() {
    const selectedFont = document.getElementById('fontStyleSelect').value;
    const textInput = document.getElementById('fontStyleSelect');
    textInput.style.fontFamily = selectedFont;
}

allSizeBtn.forEach(btn => {
    btn.addEventListener('click', function () {
        allSizeBtn.forEach(button => button.classList.remove('active'));
        this.classList.add('active');
    });
});

allThicknessBtn.forEach(btn => {
    btn.addEventListener('click', function () {
        allThicknessBtn.forEach(button => button.classList.remove('active'));
        this.classList.add('active');
    });
});

downloadBtn.addEventListener('click', () => {
    html2canvas(uploadBox, { backgroundColor: null }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'customized-image.png'; 
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});