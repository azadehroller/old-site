// Defer Wistia script loading until first interaction
let wistiaLoaded = false;
const loadedVideos = new Set();

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
        
        if (loadedVideos.has(videoId)) return;
        
        videoElement.classList.add('-loading');
        loadedVideos.add(videoId);
        
        // Load Wistia script if not already loaded
        await loadWistiaScript();
        
        // Load the specific video
        const videoScript = document.createElement('script');
        videoScript.async = true;
        videoScript.src = `https://fast.wistia.com/embed/medias/${videoId}.jsonp`;
        document.body.appendChild(videoScript);
        
        window._wq = window._wq || [];
        window._wq.push({
            id: videoId,
            onReady: (video) => {
                videoElement.classList.remove('-loading');
                video.popover.show();
                video.play();
            }
        });
    });
});