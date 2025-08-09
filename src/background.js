/*
async function sendToJabRefNativeHost(bibtexText) {
    // これが起動しない。
    console.log('Sending BibTeX to JabRef Native Host:', bibtexText);
    return new Promise((resolve, reject) => {
        try {
            const port = chrome.runtime.connectNative('org.jabref.jabref');
            port.postMessage({ text: bibtexText });

            port.onMessage.addListener((response) => {
                resolve(response);
                port.disconnect();
            });

            port.onDisconnect.addListener(() => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

// popupからのリクエストを受けてページタイトルを取得し、BibTeXを生成してJabRefに送信
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message:', message);
    if (message.type === 'SEND_BIBTEX_TO_JABREF') {
        // ここでbibtexはstringとして受け取れる
        sendToJabRefNativeHost(message.bibtex)
            .then(response => sendResponse({ success: true, response }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // 非同期応答
    }
});
*/

async function sendToJabRefNativeHost(bibtexText) {
    console.log('Sending BibTeX to JabRef Native Host:', bibtexText);
    return new Promise((resolve, reject) => {
        try {
            const port = chrome.runtime.connectNative('org.jabref.jabref');
            port.postMessage({ text: bibtexText });

            port.onMessage.addListener((response) => {
                resolve(response);
                port.disconnect();
            });

            port.onDisconnect.addListener(() => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

// async functionでPromiseを返す（Manifest V3対応）
chrome.runtime.onMessage.addListener(async (message, sender) => {
    console.log('Received message:', message);
    if (message.type === 'SEND_PAGE_TITLE_TO_JABREF') {
        try {
            const response = await sendToJabRefNativeHost(message.biblatex);
            return { success: true, response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
});