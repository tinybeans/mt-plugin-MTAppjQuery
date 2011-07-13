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
# Tmplset.pm
	'structure' => '構造',
# config.tmpl
	'active' => '有効にする',
	'Enable plugin' => 'プラグインを有効にする',
	'Enable user.css' => 'user.cssを有効にする',
	'Enable MTAppjQuery.js' => 'MTAppjQuery.jsを有効にする',
	'Enable user.js' => 'user.jsを有効にする',
	'Slide Menu' => 'スライドメニュー',
	'Enable Slide Menu' => 'スライドメニューを有効にする',
	'plugins' => 'プラグイン',
	'free area' => 'フリーエリア',
	'Enable jquery_ready.js' => 'jquery_ready.jsを有効にする',
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