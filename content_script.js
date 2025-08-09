import siteParsers from './parser/index.js';


// 新しく追加する変換関数
function convertJsonLdToCsl(jsonData) {
  const cslData = {};

  // 1. タイプのマッピング
  const typeMap = {
    'article': 'article-journal',
    'newsarticle': 'article-newspaper',
    'blogposting': 'article-journal',
    'book': 'book',
    'webpage': 'webpage'
  };
  const jsonLdType = (jsonData['@type'] || 'webpage').toString().toLowerCase();
  cslData.type = typeMap[jsonLdType] || 'webpage';

  // 2. タイトルのマッピング (headline, name, titleの順で探す)
  cslData.title = jsonData.headline || jsonData.name || jsonData.title;

  // 3. 著者のマッピング (一番複雑！)
  if (jsonData.author) {
    // 著者が単一オブジェクトの場合でも処理できるよう配列に統一
    const authors = Array.isArray(jsonData.author) ? jsonData.author : [jsonData.author];
    cslData.author = authors.map(author => {
      // 著者が名前だけの文字列の場合
      if (typeof author === 'string') {
        return { literal: author };
      }
      // 著者がオブジェクトで、nameプロパティを持つ場合
      if (typeof author === 'object' && author.name) {
        return { literal: author.name }; // 姓名分割は難しいのでliteralで対応
      }
      return author; // その他の形式はそのまま渡す
    });
  }

  // 4. 発行日のマッピング
  if (jsonData.datePublished) {
    const date = new Date(jsonData.datePublished);
    if (!isNaN(date)) {
      cslData.issued = {
        'date-parts': [[date.getFullYear(), date.getMonth() + 1, date.getDate()]]
      };
    }
  }

  // 5. URLのマッピング
  cslData.URL = jsonData.url || jsonData.mainEntityOfPage;

  return cslData;
}

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
    'DC.publisher': 'publisher'
  };

  metaTags.forEach(tag => {
    const name = tag.getAttribute('name');
    if (mapping[name]) {
      const cslKey = mapping[name];
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

  // サイト専用パーサーの呼び出し
  const url = new URL(window.location.href);
  const domain = url.hostname;

  if (siteParsers[domain]) {
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
