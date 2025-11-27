// Yengil screenshot bloklash - login ishlab turadi

// 1. Right-click bloklash
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
});

// 2. Screenshot klaviatura kombinatsiyalarini bloklash
document.addEventListener('keyup', function (e) {
    // Print Screen
    if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('⚠️ Screenshot taqiqlangan!');
    }
});

document.addEventListener('keydown', function (e) {
    // Print Screen
    if (e.keyCode === 44 || e.key === 'PrintScreen') {
        e.preventDefault();
        navigator.clipboard.writeText('');
        return false;
    }

    // Ctrl+P - Print
    if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        alert('⚠️ Print taqiqlangan!');
        return false;
    }

    // Ctrl+S - Save
    if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
    }
});

// 3. Rasmlarni himoyalash
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('draggable', 'false');
        img.style.userSelect = 'none';
        img.style.webkitUserSelect = 'none';
        img.style.mozUserSelect = 'none';
        img.style.msUserSelect = 'none';
        img.oncontextmenu = () => false;
        img.ondragstart = () => false;
    });
});

// 4. Ko'p watermark qo'shish (screenshot olsa ham ko'rinadi)
function addWatermark() {
    // Markaziy watermark
    const watermark1 = document.createElement('div');
    watermark1.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 100px;
        color: rgba(102, 126, 234, 0.15);
        pointer-events: none;
        user-select: none;
        z-index: 9999;
        font-weight: bold;
        white-space: nowrap;
    `;
    watermark1.textContent = 'Makhmudov Sardor';
    document.body.appendChild(watermark1);

    // Ko'p watermarklar
    for (let i = 0; i < 20; i++) {
        const wm = document.createElement('div');
        wm.style.cssText = `
            position: fixed;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            transform: rotate(-45deg);
            font-size: 40px;
            color: rgba(102, 126, 234, 0.1);
            pointer-events: none;
            user-select: none;
            z-index: 9998;
            font-weight: bold;
        `;
        wm.textContent = '© Sardor';
        document.body.appendChild(wm);
    }

    // Overlay qatlam
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 100px,
            rgba(102, 126, 234, 0.02) 100px,
            rgba(102, 126, 234, 0.02) 200px
        );
        pointer-events: none;
        z-index: 9997;
    `;
    document.body.appendChild(overlay);
}

// 5. Screenshot ogohlantirish
window.addEventListener('blur', function () {
    console.warn('⚠️ Screenshot olish taqiqlangan!');
});

// Sahifa yuklanganda
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addWatermark);
} else {
    addWatermark();
}

console.log('%c⚠️ OGOHLANTIRISH!', 'color: red; font-size: 30px; font-weight: bold;');
console.log('%cBu sayt himoyalangan!', 'color: red; font-size: 16px;');
