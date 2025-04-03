chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getSEOReport") {
        fetch("http://localhost:3000/api/v1/sample")
            .then(res => res.json())
            .then(data => sendResponse(data))
            .catch(err => sendResponse({ error: err.message }));

        return true; // Keeps sendResponse alive for async fetch
    }
});
