import siteParsers from './parser/index.js';


function extractMetadata() {
  // メタタグを探す

  // 1. まず、フォールバックとして基本情報を作成
  let cslData = {
    type: 'webpage',
    title: document.title,
    URL: window.location.href,
    // アクセス日も基本情報として入れておく
    accessed: {
      'date-parts': [[new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]]
    }
  };

  // 2. メタタグを検索し、情報があればcslDataを上書きしていく
  const metaTags = document.querySelectorAll('meta');
  const mapping = {
    // Highwire Press / Google Scholar
    'citation_title': 'title',
    'citation_author': 'author',
    'citation_publication_date': 'issued',
    'citation_journal_title': 'container-title',
    'citation_publisher': 'publisher',
    'citation_doi': 'DOI',
    'citation_isbn': 'ISBN',

    // Dublin Core
    'DC.title': 'title',
    'DC.creator': 'author',
    'DC.date': 'issued',
    'DC.publisher': 'publisher',

    // abstract用
    'description': 'abstract',
    'DC.description': 'abstract',
    'citation_abstract': 'abstract'
  };

  metaTags.forEach(tag => {
    const key = tag.getAttribute('name') || tag.getAttribute('property');
    if (mapping[key]) {
      const cslKey = mapping[key];
      const content = tag.getAttribute('content');

      // 有効なコンテンツがある場合のみ処理
      if (content) {
        // authorは特別扱い（配列にする）
        if (cslKey === 'author') {
          // 最初の著者が見つかった場合は、配列を初期化する
          if (!cslData.author) cslData.author = [];
          cslData.author.push({ literal: content });
        } else if (cslKey === 'issued') {
          // 日付も特別扱い
          const date = new Date(content);
          if (!isNaN(date)) {
            cslData.issued = {
              'date-parts': [[date.getFullYear(), date.getMonth() + 1, date.getDate()]]
            };
          }
        } else {
          // その他の情報はそのまま上書き
          cslData[cslKey] = content;
        }
      }
    }
  });

  // Open Graphのdescriptionもチェック (og:description)
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription && !cslData.abstract) {
    cslData.abstract = ogDescription.content;
  }

  // サイト専用パーサーの呼び出し
  const url = new URL(window.location.href);
  const domain = url.hostname;

  if (siteParsers[domain]) {
    console.log(`サイト${domain}専用パーサーを実行します`);
    cslData = siteParsers[domain](cslData, url);
  }

  // 3. メタタグ情報で更新されたデータを返す
  console.log('メタタグ情報で更新されたデータを返します:', cslData);

  return cslData;
}


// --- 拡張機能の他部分との連携 ---
// 例えば、ポップアップが開かれたときにメッセージを受け取り、
// 抽出したデータを返す、といった使い方をします。
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getMetadata") {
    const metadata = extractMetadata();
    sendResponse(metadata);
  }
});
