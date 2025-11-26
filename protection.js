// Screenshot va nusxalashni bloklash

// 1. Right-click bloklash
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
});

// 2. Screenshot klaviatura kombinatsiyalarini bloklash
document.addEventListener('keydown', function (e) {
    // Print Screen
    if (e.keyCode === 44) {
        e.preventDefault();
        return false;
    }

    // F12 - Developer Tools
    if (e.keyCode === 123) {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+I - Developer Tools
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+J - Console
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
    }

    // Ctrl+U - View Source
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
    }

    // Ctrl+S - Save
    if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
    }

    // Ctrl+P - Print
    if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        return false;
    }

    // Ctrl+C - Copy
    if (e.ctrlKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
    }
});

// 3. Drag & Drop bloklash
document.addEventListener('dragstart', function (e) {
    e.preventDefault();
    return false;
});

// 4. Select bloklash
document.addEventListener('selectstart', function (e) {
    e.preventDefault();
    return false;
});

// 5. Copy bloklash
document.addEventListener('copy', function (e) {
    e.preventDefault();
    return false;
});

// 6. Cut bloklash
document.addEventListener('cut', function (e) {
    e.preventDefault();
    return false;
});

// 7. Paste bloklash
document.addEventListener('paste', function (e) {
    e.preventDefault();
    return false;
});

// 8. Rasmlarni drag qilishni bloklash
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('draggable', 'false');
        img.style.userSelect = 'none';
        img.style.pointerEvents = 'none';
        img.oncontextmenu = () => false;
    });
});

// 9. DevTools ochilishini aniqlash
let devtoolsOpen = false;
const threshold = 160;

setInterval(() => {
    if (window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold) {
        if (!devtoolsOpen) {
            devtoolsOpen = true;
            document.body.innerHTML = '<h1 style="text-align:center; margin-top:50px;">⚠️ Developer Tools taqiqlangan!</h1>';
        }
    }
}, 1000);

// 10. Console xabarlarini tozalash
setInterval(() => {
    console.clear();
}, 3000);

// 11. Watermark qo'shish (screenshot olsa ham ko'rinadi)
function addWatermark() {
    const watermark = document.createElement('div');
    watermark.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 100px;
        color: rgba(0, 0, 0, 0.05);
        pointer-events: none;
        user-select: none;
        z-index: 9999;
        font-weight: bold;
    `;
    watermark.textContent = 'Makhmudov Sardor';
    document.body.appendChild(watermark);
}

window.addEventListener('load', addWatermark);

console.log('%c⚠️ OGOHLANTIRISH!', 'color: red; font-size: 40px; font-weight: bold;');
console.log('%cBu sayt himoyalangan! Screenshot va nusxalash taqiqlangan!', 'color: red; font-size: 20px;');
