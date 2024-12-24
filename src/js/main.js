const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const previewImage = document.getElementById('previewImage');
const placeholderText = document.getElementById('placeholderText');
const uploadButton = document.querySelector('.upload');
const zoomRange = document.getElementById('zoomRange');
let scale = 1;
let isImageUploaded = false;
let isDragging = false;
let initialX = 0, initialY = 0;
let currentX = 0, currentY = 0;
let xOffset = 0, yOffset = 0;
let rotateAngle = 0;

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
            makeDraggable(previewImage);
            makeRotatable(uploadBox);
            zoomRange.disabled = false;
        };
        reader.readAsDataURL(file);
    }
});

function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        element.style.cursor = 'grabbing';
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
}

document.addEventListener('mousedown', (e) => {
    if (!previewImage.contains(e.target)) {
        previewImage.style.cursor = 'default';
    }
});

zoomRange.addEventListener('input', function () {
    scale = parseFloat(zoomRange.value);
    updateImagePosition();
});

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

function updateImagePosition() {
    previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale}) rotate(${rotateAngle}deg)`;
}
