const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const previewImage = document.getElementById('previewImage');
const placeholderText = document.getElementById('placeholderText');

uploadBox.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const previewImage = document.getElementById("previewImage");
    const placeholderText = document.getElementById("placeholderText");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
            placeholderText.style.display = "none";
        };
        reader.readAsDataURL(file);
        fileInput.disabled = true;
        makeDraggable(previewImage);
    }
});

const rotateIcon = document.getElementById('rotateIcon');

let isDragging = false;
let initialX = 0, initialY = 0;
let currentX = 0, currentY = 0;
let xOffset = 0, yOffset = 0;
let scale = 1;
let rotateAngle = 0;

function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('click', function (e) {
        element.style.cursor = 'grabbing';
        element.style.border = '2px dashed #248EE6';
    });

    element.addEventListener('dblclick', function (e) {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;

    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            element.style.left = e.clientX - offsetX + 'px';
            element.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('click', function () {
        isDragging = false;
        element.style.cursor = 'move';
    });

    document.addEventListener('mousedown', function (e) {
        if (!element.contains(e.target)) {
            element.style.border = 'none';
            element.querySelector('.resize-handle').style.display = 'none';
            element.querySelector('.rotate-handle').style.display = 'none';
        }
    });
}

function updateImagePosition() {
    previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale}) rotate(${rotateAngle}deg)`;
}
