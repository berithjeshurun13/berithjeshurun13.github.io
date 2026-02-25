


function reload() {
    location.reload();
}

setInterval(5000, reload);


function resetkeyStroke() {
    lastKey = null;
}

function reset_keystroke() {
    setTimeout(resetkeyStroke, 1500);
}
let startY = 0;

if (window.innerWidth <= 768) {
    document.body.addEventListener("touchstart", e => {
        startY = e.touches[0].clientY;
    });

    document.body.addEventListener("touchend", e => {
        const endY = e.changedTouches[0].clientY;
        const deltaY = startY - endY;

        if (deltaY > 50) {
            LAYOUT_APP_MENU.style.display = LAYOUT_APP_MENU.style.display === 'none' ? 'flex' : 'none';
            if (LAYOUT_APP_MENU.style.display == 'flex') {
                master_overlay.style.display = 'block';
            } else {
                master_overlay.style.display = 'none';
            }
        }
    });
}

function openGenerative() {
    location.href = `${document.location.origin}/generative.redirect`
}

document.addEventListener('keydown', function (e) {
    if (lastKey == '`' && e.key.toLowerCase() == 'i') {
        LAYOUT_APP_MENU.style.display = LAYOUT_APP_MENU.style.display === 'none' ? 'flex' : 'none';
        if (LAYOUT_APP_MENU.style.display == 'flex') {
            master_overlay.style.display = 'block';
        } else {
            master_overlay.style.display = 'none';
        }
    }
});


document.addEventListener('keydown', function (e) {
    lastKey = e.key.toLowerCase();
    reset_keystroke();
});

