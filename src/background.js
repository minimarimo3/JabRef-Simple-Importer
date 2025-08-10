/*
async function isJabRefRunning() {
  return new Promise((resolve) => {
    try {
      const port = chrome.runtime.connectNative('org.jabref.jabref');
      port.postMessage({ status: "validate" });

      port.onMessage.addListener((response) => {
        if (response.message === 'jarFound') {
          resolve(true);
        } else {
          resolve(false);
        }
        port.disconnect();
      });
      port.onDisconnect.addListener(() => {
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}
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
            // TODO: ここでJabRefのGUIが起動しているか確認したい。でも公式拡張でもやってないので、現状は無視
            //  単にサーバーが起動しているかどうかはisJabRefRunning()で確認できる
            const response = await sendToJabRefNativeHost(message.biblatex);
            return { success: true, response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
});