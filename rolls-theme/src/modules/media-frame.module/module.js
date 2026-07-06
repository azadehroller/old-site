// Defer Wistia script loading until first interaction
let wistiaLoaded = false;
const loadingVideos = new Set();
const videoHandles = new Map();

function loadWistiaScript() {
    if (wistiaLoaded) return Promise.resolve();

    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://fast.wistia.com/assets/external/E-v1.js';
        script.onload = () => {
            wistiaLoaded = true;
            resolve();
        };
        document.body.appendChild(script);
    });
}

document.querySelectorAll('[data-video]').forEach(element => {
    // Preconnect to Wistia on hover for faster loading
    element.addEventListener('mouseenter', () => {
        if (!wistiaLoaded) {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = 'https://fast.wistia.com';
            document.head.appendChild(link);
        }
    }, { once: true });

    element.addEventListener('click', async (e) => {
        const videoElement = e.target.closest('[data-video]');
        if (!videoElement) return;

        const videoId = videoElement.getAttribute('data-video');

        // If already loaded, just re-show the popover and play
        if (videoHandles.has(videoId)) {
            const video = videoHandles.get(videoId);
            video.popover.show();
            video.play();
            return;
        }

        // Prevent concurrent load attempts for the same video
        if (loadingVideos.has(videoId)) return;
        loadingVideos.add(videoId);

        videoElement.classList.add('-loading');

        await loadWistiaScript();

        const videoScript = document.createElement('script');
        videoScript.async = true;
        videoScript.src = `https://fast.wistia.com/embed/medias/${videoId}.jsonp`;
        document.body.appendChild(videoScript);

        window._wq = window._wq || [];
        window._wq.push({
            id: videoId,
            options: { popover: true , playerColor: '011840' },
            onReady: (video) => {
                videoElement.classList.remove('-loading');
                videoHandles.set(videoId, video);
                video.popover.show();
                video.play();
            }
        });
    });
});