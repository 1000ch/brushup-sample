# brushup-sample

## About

HTMLInspectorとCSSLintとJSHintと試すリポジトリ。

## License

サンプルコードはライセンスありません。
HTMLInspector、CSSLint、JSHintはそれぞれに準じます。

# 遊び方

リポジトリをクローンしてきて、そのリポジトリに移動する。

```sh
$ git clone git@github.com:1000ch/brushup-sample.git
$ cd ./brushup-sample
```

`package.json`に定義してある依存モジュールをnpmでインストールする。
`grunt`とか`grunt-contrib-jshint`等がダウンロードされる。

```sh
$ npm install
```

通常は以下のコマンドを実行して、html/css/jsが保存等される場合にそれぞれにチェックがかかるようになっている。

```sh
grunt [watch]
```

これは`grunt-contrib-watch`モジュールを使って実現しており、設定は[`gruntfile.js`の12行目から25行目](https://github.com/1000ch/brushup-sample/blob/master/gruntfile.js#l12-25)に書いてある。
この記事では各タスクを別途実行して、HTML/CSS/JSそれぞれを修正していく。

# HTMLInspector - grunt-html-inspector

`grunt-html-inspector`モジュールを利用して、設定は[`gruntfile.js`の3行目から5行目](https://github.com/1000ch/brushup-sample/blob/master/gruntfile.js#l3-5)に書いてある。

```sh
$ grunt html-inspector
```

## Failed rule "validate-attributes".

> The 'bgcolor' attribute is no longer valid on the `<body>` element and should not be used.

bodyタグに`bgcolor`が付与されているが、使われるべきではない。
文書構造をHTMLで定義し、ページの装飾をCSSで行う。

## Failed rule "unused-classes".

> The class 'hoge' is used in the HTML but not found in any stylesheet.

HTML中に`hoge`というクラスが使用されているが、CSS中にその定義が存在していない。
JSで`getElementsByClassName`する場合は別だが、CSSの参照コストがかかるので定義されていないクラスは指定しない。

## Failed rule "unnecessary-elements".

> Do not use `<div>` or `<span>` elements without any attributes.

CSSのスタイリングや属性値が持たない`<div>`や`<span>`は、必要ないはず。
HTMLでのネストを深くすることで様々な参照コストを上げる可能性があるので、避けること。

## Failed rule "inline-event-handlers".

> An 'onclick' attribute was found in the HTML. Use external scripts for event binding instead.

```html
<button id='#js-button'>ボタン</button>
```

## Failed rule "script-placement".

> `<script>` elements should appear right before the closing `</body>` tag for optimal performance.

# CSSLint - grunt-contrib-csslint

`grunt-contrib-csslint`モジュールを利用して、設定は[`gruntfile.js`の6行目から8行目](https://github.com/1000ch/brushup-sample/blob/master/gruntfile.js#l6-8)に書いてある。

```sh
$ grunt csslint
```

## [L8:C11]

> Values of 0 shouldn't have units specified. You don't need to specify units when a value is 0. (zero-units)

## [L42:C19]

> Element (a.active) is overqualified, just use .active without element name. Don't use classes or IDs with elements (a.foo or a#foo). (overqualified-elements)

## [L46:C1]

> The properties padding-top, padding-bottom, padding-left, padding-right can be replaced by padding. Use shorthand properties where possible. (shorthand)

## [L48:C18]

> Values of 0 shouldn't have units specified. You don't need to specify units when a value is 0. (zero-units)
Linting css/import.css...

## [L1:C1]

> @import prevents parallel downloads, use <link> instead. Don't use @import, use <link> instead. (import)



# JShint - grunt-contrib-jshint

`grunt-contrib-jshint`モジュールを利用して、設定は[`gruntfile.js`の6行目から8行目](https://github.com/1000ch/brushup-sample/blob/master/gruntfile.js#l9-11)に書いてあります。

```sh
$ grunt jshint
```



## [L2:C14] W061: eval can be harmful.

evalで評価された文字列のJavaScriptは、スコープがわかりにくい上にパフォーマンスが低いため使うべきではないです。

```js
setTimeout(eval("alert('アラート')"), 0);
```

ではなく

```js
setTimeout(function() {
  alert('アラート');
}, 0);
```

同等の処理をこのように記述することが出来ます。



## [L5:C30] W010: The object literal notation {} is preferrable.
## [L5:C32] W033: Missing semicolon.

セミコロンが抜けているのと、オブジェクトの初期化にはリテラル(`{}`)を使ったほうがいいと言われている。

```js
var sampleObject = new Object();
```

ではなく

```js
var sampleObject = {};
```

と書いたほうが良い。初期化に関しては後述の、配列の初期化と同様の理由である。

## [L6:C28] W009: The array literal notation [] is preferrable.

オブジェクトに続いて、配列の初期化もリテラルを使った方がよいでしょう。

```js
var sampleArray = new Array();
```

ではなく

```js
var sampleArray = [];
```

と書いたほうが良い。

短く簡潔に書けるということと、コンストラクタを使うケースは
引数の取り方がわかりにいので、思わぬ不具合を招く場合がある。

- [Arrayコンストラクター](http://bonsaiden.github.io/JavaScript-Garden/ja/#array.constructor)

## [L9:C19] W041: Use '!==' to compare with 'null'.

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
