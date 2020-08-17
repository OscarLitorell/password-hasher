
chrome.runtime.onMessage.addListener(
    request => {
        document.querySelector('input[type="password"]').value = request.message
    }
)