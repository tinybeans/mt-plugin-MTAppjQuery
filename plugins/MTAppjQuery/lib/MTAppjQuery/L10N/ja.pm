package MTAppjQuery::L10N::ja;
use strict;
use base 'MTAppjQuery::L10N::en_us';
use vars qw ( %Lexicon );

%Lexicon = (
# MTAppjQuery.pl
	'jQuery to customize the interface to add.' => '管理画面をカスタマイズするためのjQueryを追加します。',
# Plugin.pm
	'Page Loading' => 'ページをロード中',
	'Custom Fields' => 'カスタムフィールド',
	'Community' => 'コミュニティ',
	'Rebuild' => '再構築',
# 	'Select files' => 'ファイルを選択',
	'You can upload up to 1MB file.' => 'アップロードできるファイルサイズは1MBまでです。',
	'Failed to save the item.' => 'アイテムの保存に失敗しました。',
# Tmplset.pm
	'structure' => '構造',
# system_config.tmpl
    'To stop using user.css' => 'すべてのウェブサイト・ブログのuser.cssの利用を停止する',
    'To stop using MTAppjQuery.js' => 'すべてのウェブサイト・ブログのMTAppjQuery.jsの利用を停止する',
    'To stop using user.js' => 'すべてのウェブサイト・ブログのuser.jsの利用を停止する',
    'To stop using Slide Menu' => 'すべてのウェブサイト・ブログのスライドメニューの利用を停止する',
    'Enable Super Slide Menu' => 'スパースライドメニューを有効にする',
    '(JavasScript unless you are familiar with the contents of the file it is recommended that you disable it.)' => '（JavasScriptファイルの内容を理解している場合以外は無効にしないことをお勧めします。）',
# blog_config.tmpl
	'active' => '有効にする',
	'Enable plugin' => 'プラグインを有効にする',
	'Enable user.css' => 'user.cssを有効にする',
	'Enable MTAppjQuery.js' => 'MTAppjQuery.jsを有効にする',
	'Enable user.js' => 'user.jsを有効にする',
	'Slide Menu' => 'スライドメニュー',
	'Enable Slide Menu' => 'スライドメニューを有効にする',
	'plugins' => 'プラグイン',
	'free area' => '自由入力欄',
	'Enable jQselectable.js' => 'jQselectable.jsを有効にする',
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