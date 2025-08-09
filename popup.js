/*
import Cite from 'citation-js';

// メインの処理を関数にまとめます
async function createCitation() {
  // 1. まず、現在アクティブなタブの情報を取得します
  // chrome.tabs.queryはPromiseを返すので、awaitで結果を待てます
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // タブ情報がなければ処理を終了
  if (!tab || !tab.url) {
    document.body.innerHTML = '<p>現在のタブ情報を取得できませんでした。</p>';
    return;
  }

  const pageUrl = tab.url;
  const pageTitle = tab.title;
  let citation; // 引用情報を入れる変数を宣言

  // 2. 引用の生成を試みます
  try {
    // まずURLから直接生成を試みる（DOIなどが見つかれば成功する）
    citation = new Cite(pageUrl);
    console.log('URLから引用を生成しました (成功)');
  } catch (error) {
    // 3. 失敗した場合（catchブロック）、手動でデータを作成します
    console.log('URLからの生成に失敗。手動でフォールバック引用を作成します。');
    citation = new Cite({
      type: 'webpage', // BibTeXの'misc'に相当し、ウェブサイトに適しています
      title: pageTitle,
      URL: pageUrl,
      'accessed': { // アクセス日を追加すると、より丁寧です
        'date-parts': [[new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]]
      }
    });
  }

  // 4. 成功・失敗どちらの場合でも、最終的に生成されたcitationオブジェクトを整形して表示します
  const output = citation.format('bibtex');

  document.body.innerHTML = `<pre>${output}</pre>`;
}

// 作成した関数を実行します
createCitation();
*/


import Cite from './citation.js';

async function main() {
  const displayArea = document.getElementById('output');
  displayArea.textContent = 'ページから情報を抽出中...';

  // 1. 現在アクティブなタブの情報を取得する
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // 2. コンテンツスクリプトに「情報をくれ！」というメッセージを送る
  // tab.idを指定することで、どのタブにメッセージを送るか決める
  chrome.tabs.sendMessage(tab.id, { action: "getMetadata" }, (response) => {
    // 3. コンテンツスクリプトから返信（response）が来たら、この中の処理が実行される

    if (chrome.runtime.lastError) {
      displayArea.textContent = 'エラー：ページの情報を取得できませんでした。\n' + chrome.runtime.lastError.message;
      return;
    }

    if (response) {
      console.log('受け取ったメタデータ:', response);
      try {
        // 4. 受け取ったデータ(response)を元に、引用を生成
        const citation = new Cite(response);
        const bibtexOutput = citation.format('bibtex');
        
        // 5. 結果をポップアップ画面に表示
        displayArea.textContent = bibtexOutput;
      } catch (e) {
        displayArea.textContent = '引用の生成に失敗しました。';
        console.error(e);
      }
    } else {
      displayArea.textContent = 'このページからは情報を取得できませんでした。';
    }
  });
}

// ページが読み込まれたらmain関数を実行
document.addEventListener('DOMContentLoaded', main);
