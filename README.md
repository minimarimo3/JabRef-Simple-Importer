# JabRef Simple Importer

今見てるサイトをcitation.jsで解析してJabRefに取り込む**小規模な**拡張機能です。

PDFの自動取り込みはないし、サイトの自動解析は公式の拡張機能（というかあれは内部でZotero拡張機能使ってるのでZoteroですが）に劣ります。

公式のはzotero-connectorをcloneしてビルドすれば使えるには使えるんですがmanifest V2なのでV3の拡張機能を作りました。

## 使用するための前準備

### 拡張機能のインストール

+ `chrome://extensions/`にアクセス
+ 右上の\[デベロッパー モード\]をオンに
+ \[パッケージ化されていない拡張機能を読み込む\]をクリック
+ ダウンロードした拡張機能を展開して展開後のフォルダーを指定。

### 拡張機能にJabRefとの通信を許可する

`org.jabref.jabref.json`ファイルを開き、`"allowed_origins":`の下にある`"chrome-extension://`に下の行を追加。

ファイルはOSによって違う。その辺はAIに聞いたら答えてくれる。嘘かもしれんが。

macOS & Vivaldiは`/Library/Google/Chrome/NativeMessagingHosts/org.jabref.jabref.json`

```txt
chrome-extension://拡張機能のID/
```

多分中身はこうなる。（バージョンによって異なる）

```json
{
  "name": "org.jabref.jabref",
  "description": "JabRef",
  "path": "/Applications/JabRef.app/Contents/jabrefHost.py",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://bifehkofibaamoeaopjglfkddgkijdlh/",
    "chrome-extension://pgkajmkfgbehiomipedjhoddkejohfna/",
    "chrome-extension://ggbkgndfflhfannnhijflbbgioainncc/"
  ]
}
```

これでChromeを再起動したらOK!
