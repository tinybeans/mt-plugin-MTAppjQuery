(function($){
    // スクロールしても表示される右サイドバー
    $.MTAppNoScrollRightSidebar();
/*
    $.MTAppIfUserDashboard(function(){
        console.log('called!!');
        $("#page-title").text('一流を目指せ！');
        console.debug(this);
    });
*/
    // テンプレートの１クリック再構築
    $.MTApp1clickRebuild();
    
    // デバッグモード
    $.MTAppDebug();
    
    // フィールドを並べ替える
    // ブログ記事の作成
    if($('body#edit-entry').length){
        $.MTAppFieldSort({sort: 'keywords,c:textfield,title'});
    }

    // スライドメニューを有効にする
    $.MTAppSlideMenu();

    // テキストエディタの全画面表示
    $.MTAppFullscreen();
    
    // 表示オプションを非表示にする
    $('a.display-options-link').hide();
        
    // タグフィールドをマルチチェックボックスにする
    $.MTAppMultiCheckbox({
        basename: 'tags',
        label:    'Moveble Type,TypePad,MTOS,VOX',
        custom:   0,
        insert:   'before', // "before" or "after" 元のテキストエリアの前に挿入するか後ろに挿入するか
        add:      1, // ユーザーが追加できるようにする場合は 1
        skin:     "tags", // タグ選択デザインを適用する場合は'tags'
        sort:     "ascend", // "ascend"（昇順）,"descend"（降順）
        debug:    1
    });
    
    // デフォルトフィールド
    $.MTAppCustomize({
        basename: 'title',
        label: '旧タイトル',
        hint: 'ここにはキャッチーなタイトルを入れましょう！'
    });
    $.MTAppCustomize({
        basename: 'body',
        label: '旧本文',
        hint: '魂を込めて本文を書きましょう！'
    });
    $.MTAppCustomize({
        basename: 'more',
        label: '旧続き'
    });
    $("#editor-header").children('div:eq(1)').MTAppTooltip({text:'書ききれなければ追記しよう！'});
    $.MTAppCustomize({
        basename: 'tags',
        label: '旧タグ',
        hint: 'ここにはタグを入れましょう！'
    });
    $.MTAppCustomize({
        basename: 'keywords',
        label: '旧キーワード',
        hint: 'ここにはキーワードを入れましょう！'
    });
    $.MTAppCustomize({
        basename: 'excerpt',
        label: '旧概要',
        hint: '心に響く概要がいいよう！',
        show_field:1
    });

/*
    // カスタムフィールドの場合
    $.MTAppCustomize({
        basename: 'textfield',
        label: '旧テスト',
        hint: 'ここにはカスタムフィールドを入れましょう！',
        custom: 1
    });
*/

    // ウィジェットの場合
    $.MTAppCustomize({
        basename: 'status',
        label: '旧更新状態',
        hint: 'ここは更新状態を表示します',
        widget: 1
    });
    $.MTAppCustomize({
        basename: 'publishing',
        label: '旧公開',
        hint: 'ここで公開します',
        widget: 1
    });
    $.MTAppCustomize({
        basename: 'category',
        label: '旧カテゴリ',
        hint: 'ここでカテゴリを選択します',
        widget: 1
    });
    $.MTAppCustomize({
        basename: 'feedback',
        label: '旧コメント',
        hint: 'ここでコメントやトラックバックを許可します',
        widget: 1
    });
    $.MTAppCustomize({
        basename: 'assets',
        label: '旧アセット',
        hint: 'ここにアセットが表示されます',
        widget: 1
    });

    // メッセージを表示する
    $.MTAppMsg({
        msg: 'Update Me, Everyday!',
        type: 'info'
    });
    $.MTAppMsg({
        msg: 'Update Me, Everyday!',
        type: 'success'
    });
    $.MTAppMsg({
        msg: 'Update Me, Everyday!',
        type: 'error'
    });

    // カテゴリごとにUIを変更する
/*
    $.MTAppInCats({
        categories: '3',
        code      : function(){
            alert('カテゴリごとにUIを変更できるようになりました！');
        }
    });
*/
})(jQuery);