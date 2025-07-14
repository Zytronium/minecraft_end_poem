document.addEventListener('DOMContentLoaded', () => {
    async function loadPoem() {
        const response = await fetch('end.txt');
        let text = await response.text();

        const lines = text.split('\n').map(line => {
            // Handle obfuscated text marker
            line = line.replace(/§f§k§a§b§[32]/g, () => {
                return '<span class="obfuscated">' + generateRandom(10) + '</span>';
            });

            // Check for color codes
            if (line.startsWith('§3')) {
                return `<div class="line teal">${line.slice(2)}</div>`;
            } else if (line.startsWith('§2')) {
                return `<div class="line green">${line.slice(2)}</div>`;
            } else if (line.includes('§7')) {
                const [before, after] = line.split('§7', 2);
                return `<div class="line">${before}<span class="gray">${after}</span></div>`;
            } else {
                return `<div class="line">${line}</div>`;
            }
        });

        document.getElementById('poem-content').innerHTML += lines.join('\n');

        // Animate obfuscated text every 25ms
        setInterval(() => {
            document.querySelectorAll('.obfuscated').forEach(span => {
                span.textContent = generateRandom(6);
            });
        }, 25);
    }

    function generateRandom(length) {
        const chars = 'abcdeghjmnopqrsuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789#$%&€';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    loadPoem();

    // autoplay workaround
    document.addEventListener('click', () => {
        document.getElementById('bg-music').play().catch(() => {});
    }, { once: true });

    const svgCursor = 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><circle cx="2" cy="2" r="2" fill="rgba(255,255,255,0.5)" /></svg>\') 2 2, auto';

    let cursorHiddenByTimeout = false;
    let inactivityTimeout;
    let lastFullscreenChange = 0;

    function updateCursor() {
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        if (isFullscreen || cursorHiddenByTimeout) {
            document.body.style.cursor = 'none';
        } else {
            document.body.style.cursor = svgCursor;
        }
    }

    function resetInactivityTimer(event) {
        // Ignore if input happened right after fullscreen change
        if (Date.now() - lastFullscreenChange < 300) return;

        // (Try to) ignore F11 keydown
        if (event && event.type === 'keydown' && event.key === 'F11') return;

        if (cursorHiddenByTimeout) {
            cursorHiddenByTimeout = false;
            updateCursor();
        }
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(() => {
            cursorHiddenByTimeout = true;
            updateCursor();
        }, 3000);
    }

    ['mousemove', 'mousedown', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, resetInactivityTimer, { passive: true });
    });
    window.addEventListener('keydown', resetInactivityTimer, { passive: true });

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
        document.addEventListener(evt, () => {
            lastFullscreenChange = Date.now();
            updateCursor();
        });
    });

    resetInactivityTimer();
    updateCursor();
});
