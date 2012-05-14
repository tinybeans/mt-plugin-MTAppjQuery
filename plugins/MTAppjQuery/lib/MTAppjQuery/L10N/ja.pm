package MTAppjQuery::L10N::ja;
use strict;
use base 'MTAppjQuery::L10N::en_us';
use vars qw ( %Lexicon );

%Lexicon = (
# MTAppjQuery.pl
	'Customize the management screen of MT5.1 to use jQuery.' => 'MT5.1の管理画面をjQueryを使ってカスタマイズします。',
    'basename' => 'ベースネーム',
# Callbacks.pm
	'Page Loading' => 'ページをロード中',
	'Custom Fields' => 'カスタムフィールド',
	'Community' => 'コミュニティ',
	'Rebuild' => '再構築',
# 	'Select files' => 'ファイルを選択',
	'You can upload up to 1MB file.' => 'アップロードできるファイルサイズは1MBまでです。',
	'Failed to save the item.' => 'アイテムの保存に失敗しました。',
	'Free area of system' => 'システムメニュー用のフリーエリア',
	'Free area of website or blog' => 'ウェブサイト・ブログメニュー用のフリーエリア',
	'Install [_1] and  [_2]' => '[_1]と[_2]をインストール',
# Tmplset.pm
	'structure' => '構造',
# config.tmpl
	'active' => '有効にする',
	'Enable' => '有効',
	'Disable' => '無効',
	'ex.' => '例 : ',
	'Setting user.js' => 'user.jsの設定',
	'Setting user.css' => 'user.cssの設定',
	'Change URL' => 'URLを変更する',
	'Enable plugin' => 'プラグインを有効にする',
	'Enable user.css' => 'user.cssを有効にする',
	'user.css URL' => 'user.cssのURL',
	'Enable MTAppjQuery.js' => 'MTAppjQuery.jsを有効にする',
	'Enable user.js' => 'user.jsを有効にする',
	'user.js URL' => 'user.jsのURL',
	'Slide Menu' => 'スライドメニュー',
	'Enable Slide Menu' => 'スライドメニューを有効にする',
	'plugins' => 'プラグイン',
	'Setting jquery_ready.js' => 'jquery_ready.jsの設定',
	'Setting jQselectable.js' => 'jQselectable.jsの設定',
	'Free textarea' => '自由テキストエリア',

    'Inner head tag' => '&lt;head&gt;&lt;/head&gt;タグ内',
    'Append to variable mtapp_top_head' => '変数 mtapp_top_head に追加（&lt;head&gt;内の最初）',
    'Append to variable html_head' => '変数 html_head に追加（mt.jsの直前）',
    'Append to variable js_include' => '変数 js_include に追加（&lt;/head&gt;の直前）',
    'Append to variable html_body' => '変数 html_body に追加（div#headerの直前）',
    'Append to variable form_header' => '変数 form_header に追加（div#content内の最初）',
    'Before &lt;/html&gt;' => '&lt;/body&gt;タグの手前',
    'Append to variable jq_js_include' => '変数 jq_js_include に追加（MT本体のjQuery内の最初）',
    'Append to variable mtapp_html_foot' => '変数 mtapp_html_foot に追加（MTAppjQueryのuser.jsの直前）',
    'Append to variable mtapp_end_body' => '変数 mtapp_end_body に追加（&lt;/body&gt;タグの直前）',
    'Set the source to be inserted at each of the template management screen. You can use MT tags for the management screen. be inserted into any position <br /> value of each, in the source code &lt;!-- Variable Name (MTAppjQuery) --&gt; You can check, etc. (only during initial configuration).' => '管理画面テンプレートのそれぞれの位置に挿入するソースを設定します。管理画面用のMTタグが使えます。<br />それぞれの値がどの位置に挿入されるかは、ソースコードの中の&lt;!-- 変数名 (MTAppjQuery) --&gt;等で確認できます（初期設定時のみ）。',

	'invalid' => '無効化設定',
    '(JavasScript unless you are familiar with the contents of the file it is recommended that you disable it.)' => '（JavasScriptファイルの内容を理解している場合以外は無効にしないことをお勧めします。）',

# Uploadify blog_config.tmpl / system_config.tmpl
	'Uploadify' => 'マルチファイルアップロード',
	'active Uploadify' => 'マルチファイルアップロードを有効する',
	'To stop using Uploadify' => 'Uploadifyの利用を停止する',
    'Upload folder' => 'アップロード先フォルダ',
    'The path to the folder you would like to save the files to. Do not end the path with a ‘/’.' 
        => 'ファイルをアップロードするフォルダのパスを指定。末尾の「/」は不要。',
	'img element' => 'img要素',
	'a element' => 'a要素',
	'You can write that File name is __filename__, File path is __filepath__.' => 'ファイル名＝「__filename__」、ファイルのパス＝「__filepath__」',
	'A multiple file upload' => 'マルチファイルアップロード',
	'A multiple file upload meta' => 'マルチファイルアップロード　メタ情報',
);

1;