// content.js

let videoEndListener = null;

function handleVideoEnd() {
    try {
        // YouTubeの自動再生を無効化
        const autoplayToggle = document.querySelector('.ytp-autoplay-button');
        if (autoplayToggle) {
            const autoplayEnabled = autoplayToggle.getAttribute('aria-checked') === 'true';
            if (autoplayEnabled) {
                autoplayToggle.click();
            }
        }

        // localストレージから保存されたURLを取得
        chrome.storage.local.get('customNextVideo', function (data) {
            if (data.customNextVideo && data.customNextVideo.trim() !== "") {
                const nextVideoUrl = data.customNextVideo;
                // URLをクリア
                chrome.storage.local.remove('customNextVideo', function () {
                    // URLクリア後に遷移
                    setTimeout(() => {
                        window.location.href = nextVideoUrl;
                    }, 500);
                });
            }
        });
    } catch (error) {
        console.error('Error in handleVideoEnd:', error);
    }
}

function setupVideoListener() {
    try {
        const video = document.querySelector('video');
        if (video) {
            // 古いリスナーを削除
            if (videoEndListener) {
                video.removeEventListener('ended', videoEndListener);
            }
            // 新しいリスナーを設定
            videoEndListener = handleVideoEnd;
            video.addEventListener('ended', videoEndListener);
        }
    } catch (error) {
        console.error('Error in setupVideoListener:', error);
    }
}

// YouTubeのSPA遷移を監視
try {
    const observer = new MutationObserver(() => {
        setupVideoListener();
    });

    // 初期設定
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初回実行
    setupVideoListener();
} catch (error) {
    console.error('Error in observer setup:', error);
}
