// 1. 注意: 'citation-js'ではなく'@citation-js/core'からCiteをインポートします
import { Cite } from '@citation-js/core';

// 2. 必要なプラグインをインポート
import '@citation-js/plugin-wikidata';
import '@citation-js/plugin-bibtex';
import '@citation-js/plugin-doi';
import '@citation-js/plugin-software-formats';
import '@citation-js/plugin-isbn';

// 3. 設定済みのCiteクラスを、アプリケーションの他の部分で使えるようにエクスポートします
export default Cite;
