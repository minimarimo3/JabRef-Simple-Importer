// 各サイトのパーサーをインポート
// import githubParser from './github.com.js';
import qiitaParser from './qiita.com.js';

const siteParsers = {
  // 'github.com': githubParser,
  'qiita.com': qiitaParser,
};

// 登録簿をエクスポート
export default siteParsers;
