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
        // XXX: なんか知らんが日本語がここで削り落とされるので、強制的に上書きする
        const citation = new Cite(response);
        let biblatexOutput = citation.format('biblatex');

        // 1. 正しい日本語タイトルを元のデータから取得
        const correctTitle = response.title;

        // 2. BibTeX出力の中から title = {...} の行を見つけるための正規表現
        const titleRegex = /title\s*=\s*\{.*\}/i;

        // 3. 新しいtitle行を作成（二重の中括弧で日本語を保護するのがポイント）
        const newTitleLine = `title = {{${correctTitle}}}`;

        // 4. biblatexOutputのtitle行を、作成した新しい行で置き換える
        if (biblatexOutput.match(titleRegex)) {
          biblatexOutput = biblatexOutput.replace(titleRegex, newTitleLine);
          console.log('タイトルを日本語に強制上書きしました。');
        } else {
          // もしtitle行自体がなかった場合の予備処理
          // 最初の「{」の直後に挿入する
          biblatexOutput = biblatexOutput.replace('{', `{\n  ${newTitleLine},`);
          console.log('titleフィールドが見つからなかったため、日本語タイトルを追加しました。');
        }

        // 5. 結果をポップアップ画面に表示
        displayArea.textContent = biblatexOutput;
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
