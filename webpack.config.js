const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  // モード: 'development'は開発用、'production'は本番用
  mode: 'development',

  // エントリーポイント: どのファイルからバンドルを始めるか
  entry: {
    popup: './src/popup.js',
    content_script: './src/content_script.js',
    background: './src/background.js',
  },

  // 出力設定: どこに、何という名前でファイルを出力するか
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // [name]にはentryのキー（popup）が入る
  },

  // パフォーマンス（ファイルサイズ）に関する警告をすべて無効にする
  performance: {
    hints: false,
  },

  // プラグイン設定
  plugins: [
    new CopyPlugin({
      patterns: [
        // manifest.jsonとpopup.htmlをdistフォルダにコピーする
        { from: './manifest.json', to: 'manifest.json' },
        { from: './src/popup.html', to: 'popup.html' },
        // もしアイコンがあれば、それもコピーする
        // { from: 'src/icons', to: 'icons' }
      ],
    }),
  ],

  // developmentモードでソースマップを有効にする
  devtool: 'cheap-module-source-map',
};