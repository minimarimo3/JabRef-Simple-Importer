// 各サイトのパーサーをインポート
import githubParser from './github.com.js';
import qiitaParser from './qiita.com.js';
import zennParser from './zenn.dev.js';

const siteParsers = {
  'github.com': githubParser,
  'qiita.com': qiitaParser,
  'zenn.dev': zennParser,
};

// 登録簿をエクスポート
export default siteParsers;
