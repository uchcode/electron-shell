# electron-shell

Electronのレンダラーコードをシェルスクリプトのように実行するアプリです。[Ruby Shoes!](http://shoesrb.com) にインスパイアされて作りました。

## システム構成

以下の環境で開発。最新バージョンで問題ないと思われます。

- macOS 10.12.6
- Xcode 8.3.3
- Homebrew 1.3.1
- node.js v8.4.0
- npm 5.3.0
- electron-packager 8.7.2

## ビルド手順

Xcode を MacApp Store より入手してください。node.js は HomeBrew でインストールを想定していますが、各自の環境に合わせたインストールで構いません。npm で electron-packager をインストールしてビルドの準備は完了です。

プロジェクトのルートにある ```build.sh``` を実行するとアプリがビルドされます。アプリは任意の場所（例えば /Applications 内）に配置すれば良いでしょう。

## 使用例

プロジェクト内にある ```examples``` をダブルクリックするとコードが実行されます。実行前にコード内容を確認してください。コードは ```.electronhtml``` と ```.electronhtmld``` の二種類があります。前者は Electron の一般的なレンダラープロセスコードとなっています。後者の ```electronhtmld``` はレンダラープロセスコード群を１つの書類のように扱うバンドル形式の書類です。


