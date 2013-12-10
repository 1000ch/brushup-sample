# brushup-sample

## About

HTMLInspectorとCSSLintとJSHintと試すリポジトリ。

## License

サンプルコードはライセンスありません。
その他Grunt、HTMLInspector、CSSLint、JSHint等はそれぞれに準じます。

## 0. やりかた

### gitがない人は

[ダウンロード](http://git-scm.com/downloads)してインストールする。黒い画面で`git`コマンドが使えるようになる。

### nodeがない人は

[ダウンロード](http://nodejs.org/)してインストールする。黒い画面で`node`と`npm`コマンドが使えるようになる

### grunt-cliのインストール

```sh
$ npm install -g grunt-cli
```

黒い画面で実行し、インストールする。`grunt`コマンドが使えるようになる。

### リポジトリのクローン

リポジトリをクローンしてきて、そのリポジトリに移動する。

```sh
$ git clone git@github.com:1000ch/brushup-sample.git
$ cd ./brushup-sample
```

`package.json`に定義してある依存モジュールをnpmでインストールする。`grunt`とか`grunt-contrib-jshint`等がダウンロードされる。

```sh
$ npm install
```

通常は以下のコマンドを実行して、html/css/jsが保存等される場合にそれぞれにチェックがかかるようになっている。

```sh
$ grunt [watch]
```

これは`grunt-contrib-watch`モジュールを使って実現しており、設定は[`gruntfile.js`の12行目から25行目](https://github.com/1000ch/brushup-sample/blob/master/gruntfile.js#l12-25)に書いてある。今回は各タスクを別途実行して、HTML/CSS/JSそれぞれを修正していく。

## 1. [HTMLInspector](https://github.com/philipwalton/html-inspector) - [grunt-html-inspector](https://github.com/gotdibbs/grunt-html-inspector)

`grunt-html-inspector`モジュールを利用して、設定は[`gruntfile.js`の3行目から5行目](https://github.com/1000ch/brushup-sample/blob/master/gruntfile.js#l3-5)に書いてある。

```sh
$ grunt html-inspector
```

### Failed rule "validate-attributes".

> The 'bgcolor' attribute is no longer valid on the `<body>` element and should not be used.

```html
<body bgcolor='#fff'>
```

bodyタグに`bgcolor`が付与されているが、使われるべきではない。文書構造をHTMLで定義し、ページの装飾をCSSで行う。

```css
body {
  background: #fff;
}
```

### Failed rule "unused-classes".

> The class 'hoge' is used in the HTML but not found in any stylesheet.

HTML中に`hoge`というクラスが使用されているが、CSS中にその定義が存在していない。JSで`getElementsByClassName`する場合は別だが、CSSの参照コストがかかるので定義されていないクラスは指定しない。

### Failed rule "unnecessary-elements".

> Do not use `<div>` or `<span>` elements without any attributes.

CSSのスタイリングや属性値が持たない`<div>`や`<span>`は、必要ないはず。HTMLでのネストを深くすることで様々な参照コストを上げる可能性があるので、避けること。

### Failed rule "validate-attributes".

> The 'alt' attribute is required for <img> elements.

必須とされている属性は付与すること。`<img>`については、 **srcを空にしない** 、 **widthとheightを指定する** ことも忘れずにやること。
`<img>`等の`src=''`、`<a>`や`<link>`の`href=''`を空文字で指定すると、無駄なHTTPリクエストが発生してしまうブラウザがある。
それによってパフォーマンスが低下するだけでなく、セッションの管理のためにトークン等を利用している場合はリクエストによってトークンが更新されてしまい動かなくなってしまう可能性もある。また、`width`と`height`を指定することでHTMLの解析時に`<img>`の占める領域が決定するため、画像のダウンロード後に発生する再レイアウトを予防することが可能。

- [Empty image src can destroy your site](http://www.nczonline.net/blog/2009/11/30/empty-image-src-can-destroy-your-site/)

### Failed rule "validate-elements".

> The `<font>` element is obsolete and should not be used.

HTMLは文書構造の定義、CSSは装飾という分離をするため、`<font>`タグは非推奨になった。同様の理由で`<center>`や`<basefont>`等も非推奨である。

- [HTML 要素リファレンス](https://developer.mozilla.org/ja/docs/Web/HTML/Element)

### Failed rule "inline-event-handlers".

> An 'onclick' attribute was found in the HTML. Use external scripts for event binding instead.

```html
<button id='#js-button' onclick='alert(0)'>ボタン</button>
```

HTMLのインラインでイベントを定義するべきではない。管理が非常に難しく、予期しない不具合を起こす可能性がある。

```html
<button id='#js-button'>ボタン</button>
```

HTMLにはJSから参照するIDやクラスをふっておき、

```js
document.getElementById('js-button').addEventListener('click', function() {
  alert(0);
}, false);
```

JS中でこのようにクリックイベントを定義する。

### Failed rule "script-placement".

> `<script>` elements should appear right before the closing `</body>` tag for optimal performance.

`<script>`タグは同期的に解決されるため、`<head>`タグの中に配置されていたりすると`<body>`タグの解析が始まる前に実行されるため、その間ページが白い画面になってしまう可能性がある。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Sample Page</title>
    <link rel="stylesheet" href="css/import.css">
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="js/app.js"></script>
  </head>
  <body>
    <div class="outline hoge">
      <header></header>
      ...
    </div>
  </body>
</html>
```

`</body>`タグのすぐ上部に配置することで、それを避ける事が可能である。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Sample Page</title>
    <link rel="stylesheet" href="css/import.css">
  </head>
  <body>
    <div class="outline hoge">
      <header></header>
      ...
    </div>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
```

`<script>`タグを`<head>`の中に配置してはいけないわけではない。
`<body>`の評価より先にされなければならない場合（例えば要素をJSでゴリゴリ作るとか）はそうするべき。

## 2. [CSSLint](http://csslint.net/) - [grunt-contrib-csslint](https://github.com/gruntjs/grunt-contrib-csslint)

`grunt-contrib-csslint`モジュールを利用して、設定は[`gruntfile.js`の6行目から8行目](https://github.com/1000ch/brushup-sample/blob/master/gruntfile.js#l6-8)に書いてある。

```sh
$ grunt csslint
```

### [L8:C11] zero-units

> Values of 0 shouldn't have units specified. You don't need to specify units when a value is 0.

値が0の場合は`px`をつけようが`%`をつけようが0に変わりないので、除く。

```css
.outline {
  margin: 0px auto;
  min-width: 320px;
  max-width: 960px;
}
```

数文字減った所でファイルサイズが大幅に減るわけではないが、気をつけておいて損はない。

```css
.outline {
  margin: 0 auto;
  min-width: 320px;
  max-width: 960px;
}
```

### [L42:C19] overqualified-elements

> Element (a.active) is overqualified, just use .active without element name. Don't use classes or IDs with elements (a.foo or a#foo).

`a.active`は不要に詳細度が増しているセレクタである。`.active`にすることで他のタグにも適用することが可能になる。更に具体的には

```css
ul.nav li.active a {}

div.header a.logo img {}

.main ul.features a.btn {}
```

このように記述していると、`<img>`を`<div class='header'><a class='logo'>`に入れなければスタイルが適用されないし、`.btn`も名前から察するに単独で使用可能なクラスであるべきだろう。

```css
.nav .active a {}

.logo > img {}

.features-btn {}
```

こうすることで`<ul>`を`<ol>`に変えてもスタイルが反映されるし、`.features-btn`も様々なタグで使用可能になった。

- [Code smells in CSS 日本語訳](http://enja.studiomohawk.com/2013/03/24/code-smells-in-css/)
- [Code smells in CSS](http://csswizardry.com/2012/11/code-smells-in-css/)

### [L46:C1] shorthand

> The properties padding-top, padding-bottom, padding-left, padding-right can be replaced by padding. Use shorthand properties where possible.

ショートハンドで記述可能な場合は、ショートハンドで記述することで冗長な表現を避ける事が出来る。

```css
.foo {
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-left: 20px;
}

.bar {
  margin-top: 5px;
  margin-left: 15px;
  margin-bottom: 10px;
  margin-right: 15px;
}
```

これは以下のように記述可能である。

```css
.foo {
  margin: 10px 20px;
}

.bar {
  margin: 5px 15px 10px;
}
```

ショートハンドで記述可能なプロパティは`margin`や`padding`の他にも`linear-gradient`や`border`などがあるが、可読性を保った範囲で行っていく。

### [L1:C1] import

> @import prevents parallel downloads, use <link> instead. Don't use @import, use <link> instead.

[import.css](https://github.com/1000ch/brushup-sample/blob/master/css/import.css)で以下の記述を行っているためである。

```css
@import url("reset.css");
@import url("app.css");
```

`@import`は直接にCSSファイルを解決するため、並列ダウンロードが可能な`<link>`タグを複数書くことで描画開始までを速くすることが可能である。

```html
<link rel='stylesheet' href='reset.css'>
<link rel='stylesheet' href='app.css'>
```

更に良いのは、予め`reset.css`と`app.css`を結合しておくことでHTTPリクエストの数を減らすことが可能である。

- [@importを使うべきでない理由](http://screw-axis.com/2009/06/07/css-import%E3%82%92%E4%BD%BF%E3%81%86%E3%81%B9%E3%81%8D%E3%81%A7%E3%81%AA%E3%81%84%E7%90%86%E7%94%B1/)
- [Mobile Front-end Optimization Standard:2012](https://speakerdeck.com/t32k/mobile-front-end-optimization-standard-2012)

## 3. [JShint](http://jshint.com) - [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint)

`grunt-contrib-jshint`モジュールを利用して、設定は[`gruntfile.js`の6行目から8行目](https://github.com/1000ch/brushup-sample/blob/master/gruntfile.js#l9-11)に書いてある。

```sh
$ grunt jshint
```

### [L2:C14] W061: eval can be harmful.

evalで評価された文字列のJavaScriptは、スコープがわかりにくい上にパフォーマンスが低いため使うべきではない。

```js
setTimeout(eval("alert('アラート')"), 0);
```

ではなく

```js
setTimeout(function() {
  alert('アラート');
}, 0);
```

同等の処理をこのように記述することが可能。

### [L5:C30] W010: The object literal notation {} is preferrable.
### [L5:C32] W033: Missing semicolon.

セミコロンが抜けているのと、オブジェクトの初期化にはリテラル(`{}`)を使ったほうが良い。

```js
var sampleObject = new Object();
```

ではなく

```js
var sampleObject = {};
```

と書いたほうが良い。初期化に関しては後述の、配列の初期化と同様の理由である。

### [L6:C28] W009: The array literal notation [] is preferrable.

オブジェクトに続いて、配列の初期化もリテラルを使った方がよい。

```js
var sampleArray = new Array();
```

ではなく

```js
var sampleArray = [];
```

と書いたほうが良い。
短く簡潔に書けるということと、コンストラクタを使うケースは引数の取り方がわかりにいので、思わぬ不具合を招く場合がある。

- [Arrayコンストラクター](http://bonsaiden.github.io/JavaScript-Garden/ja/#array.constructor)

### [L9:C19] W041: Use '!==' to compare with 'null'.

厳密等価演算子（`==`ではなく`===`、`!=`ではなく`!==`）を使用するべき。

```js
if(sampleObject != null) {
}
```

ではなく

```js
if(sampleObject !== null) {
}
```

と書いたほうが良い。
等価演算子は内部的に型を変換しているため、低速であり評価のされ方で誤解を招く場合がある。[厳密等価演算子は型変換がない分高速](http://jsperf.com/equals-operator-vs-strict-equals-operator/2)である。