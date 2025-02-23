document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('save').addEventListener('click', function () {
        var url = document.getElementById('url').value;
        chrome.storage.local.set({ 'customNextVideo': url }, function () {
            alert('次の動画URLを保存しました！');
        });
    });
});
