/*
 * MTAppjQuery.js for MTAppjQuery (Movable Type Plugin)
 *
 * Copyright (c) 2010 Tomohiro Okuwaki (http://www.tinybeans.net/blog/)
 *
 * Since:   2010-06-22
 * Update:  2011-01-21
 * for version: 0.2
 * Comment: 
 * 
 */
(function($){

    // -------------------------------------------------
    //  $.MTAppIfScreen(); 2011-03-17
    // -------------------------------------------------
    $.MTAppIfScreen = function(options){
        var op = $.extend({}, $.MTAppIfScreen.defaults, options);

        function checkID(checkVar, globalVar){
            if (typeof checkVar === 'string') {
                checkVar = checkVar.replace(/ *, */g,',').split(',');
                for (var i = -1, n = checkVar.length; ++i < n;) {
                    if (checkVar[i] == globalVar) return true; 
                }
                return false;
            } else {
                return checkVar == globalVar
            }
        };
        // optionsで指定のあるものは真偽を判定し指定のないものはtrue
        var bool = {
            blog_id    : op.blog_id     ? checkID(op.blog_id, mtappVars.blog_id)         : true,
            entry_id   : op.entry_id    ? checkID(op.entry_id, mtappVars.entry_id)       : true,
            page_id    : op.page_id     ? checkID(op.page_id, mtappVars.page_id)         : true,
            category_id: op.category_id ? checkID(op.category_id, mtappVars.category_id) : true,
            template_id: op.template_id ? checkID(op.template_id, mtappVars.template_id) : true,
            folder_id  : op.folder_id   ? checkID(op.folder_id, mtappVars.folder_id)     : true,
            asset_id   : op.asset_id    ? checkID(op.asset_id, mtappVars.asset_id)       : true,
            comment_id : op.comment_id  ? checkID(op.comment_id, mtappVars.comment_id)   : true,
            ping_id    : op.ping_id     ? checkID(op.ping_id, mtappVars.ping_id)         : true,
            user_id    : op.user_id     ? checkID(op.user_id, mtappVars.user_id)         : true,
            field_id   : op.field_id    ? checkID(op.field_id, mtappVars.field_id)       : true
        }
        // オプションで指定したタイトルがmtappTitle（titleタグの先頭部分）に含まれているか
        // または、mtappScopeTypeの値がオプションで指定したtypeに含まれている場合は実行
/*
            console.log('bool.blog_id : ' + bool.blog_id);
            console.log('bool.entry_id : ' + bool.entry_id);
            console.log('bool.page_id : ' + bool.page_id);
            console.log('bool.category_id : ' + bool.category_id);
            console.log('bool.template_id : ' + bool.template_id);
            console.log('bool.folder_id : ' + bool.folder_id);
            console.log('bool.asset_id : ' + bool.asset_id);
            console.log('bool.comment_id : ' + bool.comment_id);
            console.log('bool.ping_id : ' + bool.ping_id);
            console.log('bool.user_id : ' + bool.user_id);
            console.log('bool.field_id : ' + bool.field_id);
*/

        if (mtappVars.html_title.indexOf(op.title) != -1
            && op.type.indexOf(mtappVars.scope_type) != -1
            && bool.blog_id
            && bool.entry_id
            && bool.page_id
            && bool.category_id
            && bool.template_id
            && bool.folder_id
            && bool.asset_id
            && bool.comment_id
            && bool.ping_id
            && bool.user_id
            && bool.field_id
        ) {
            return op.onInit.call();
        };
        return;
    };
    $.MTAppIfScreen.defaults = {
        title:  '.', // titleタグの値の「 | Movable Type Pro」の手前部分
        type:   'user,system,website,blog', // 4つのいずれかを指定。複数の場合はカンマで区切る
        blog_id: null, // 複数の場合はカンマ区切りで区切る
        entry_id: null,
        page_id: null,
        category_id: null,
        template_id: null,
        folder_id: null,
        asset_id: null,
        comment_id: null,
        ping_id: null,
        user_id: null,
        field_id: null,
        onInit: function(){ return true; } // 実行したい内容を無名関数内に書く
    };
    // end - $.MTAppIfScreen()

    // -------------------------------------------------
    //  $.MTAppNoScrollRightSidebar();
    // -------------------------------------------------
    $.MTAppNoScrollRightSidebar = function(open_type){
        var type = (open_type == 'close') ? 'no-scroll-right-sidebar' : '';
        $('#content-body')
            .noScroll('#related-content', 'right');
        var span = $('#related-content')
                .addClass(type)
                .children()
                    .addClass('widget-wrapper')
                    .find('div.widget-header')
                        .find('span')
                            .css({cursor:'pointer'});
        if (open_type == 'close') {
            span.click(function(){
                $(this)
                    .closest('div.widget-wrapper')
                        .siblings()
                            .find('div.widget-content').slideUp()
                            .end()
                        .end()
                    .find('div.widget-content').slideToggle();
            });
        } else {
            span.click(function(){
                $(this).parents('div.widget-header').next().slideToggle();
            });
        }
    }

    // end - $.MTAppNoScrollRightSidebar()


    /*
     * jqueryMultiCheckbox.js
     *
     * Copyright (c) 2010 Tomohiro Okuwaki (http://www.tinybeans.net/blog/)
     * Licensed under MIT Lisence:
     * http://www.opensource.org/licenses/mit-license.php
     * http://sourceforge.jp/projects/opensource/wiki/licenses%2FMIT_license
     *
     * Since:   2010-06-22
     * Update:  2011-04-13
     * version: 0.12 for MTAppjQuery.js
     *
     * jQuery 1.3 later (maybe...)
     * 
     */
    $.fn.multicheckbox = function(options){
        var op = $.extend({}, $.fn.multicheckbox.defaults, options);

        return this.each(function(idx){

            var $self = $(this),
                self = $self.get(0);

            var container_class = op.skin ? 'mcb-container mcb-skin-tags' : 'mcb-container';
            $self[op.insert]('<span class="' + container_class+ '">test</span>');
            var $container = (op.insert == 'before') ? $self.prev(): $self.next();

            // label, input:checkbox の挿入
            var mcb_label = function(value, label, bool_checked){
                var checked_class = bool_checked ? ' mcb-label-checked': '';
                var checked_attr = bool_checked ? ' checked="checked"': '';
                return [
                    '<label class="mcb-label' + checked_class + '">',
                        '<input class="mcb-checkbox" type="checkbox" name="' + value + '" value="' + value + '"' + checked_attr + ' />',
                        label,
                    '</label>'
                ].join('');
            }

            var label_html = [],
                checkboxs = [];
            if (typeof(op.label) == 'object') {
                if (op.sort != '') {
                    checkboxs = sortHashKey(op.label, op.sort);
                    for (var i = 0, n = checkboxs.length; i < n; i++) {
                        var key = checkboxs[i];
                        label_html.push(mcb_label(key, op.label[key]));
                    }
                } else {
                    for (var key in op.label) {
                        label_html.push(mcb_label(key, key));
                    }
                }
            } else {
                checkboxs = (op.label == '') ? $self.attr('title').split(',') : op.label.split(',');
                for (var i = 0, n = checkboxs.length; i < n; i++) {
                    checkboxs[i] = $.trim(checkboxs[i]);
                }
                if (op.sort == 'ascend') {
                    checkboxs.sort();
                } else if (op.sort == 'descend') {
                    checkboxs.sort();
                    checkboxs.reverse();
                }
                for (var i = 0, n = checkboxs.length; i < n; i++) {
                    label_html.push(mcb_label(checkboxs[i], checkboxs[i]));
                }
            }
            if (op.add) {
                label_html.push('<input class="mcb-add-item" type="text" value="" />');
            }
            $container.html(label_html.join(''));

            // チェック済みのチェックボックスにチェックを入れる
            var checked = $self.val() ? $self.val().split(',') : [],
                checked_count = checked.length;

            for (var i = 0; i < checked_count; i++) {
                checked[i] = $.trim(checked[i]);
            }

            $container.find('input:checkbox').val(checked).click(checkboxClick);

            $self[op.show]();

            $.data(self, 'mcb-lists', checked);

            // ユーザーが項目を追加できるようにする
            if (op.add) {
                $container.find('input.mcb-add-item')
                    .keydown(function(e){
                        var keycode = e.which || e.keyCode;
                        if (keycode == 13) {
                            var value = $(this).val(),
                                label;
                            if (!value) return;
                            if (value.indexOf(':') > 0) {
                                var obj = value.split(':');
                                value = $.trim(obj[0]);
                                label = $.trim(obj[1]);
                            } else {
                                label = value;
                            }
                            $(this).val('')
                                .before(mcb_label(value, label, true))
                                .prev()
                                    .children('input:checkbox').click(checkboxClick);
                            checked.push(value);
                            $.data(self, 'mcb-lists', checked);
                            $self.val(checked.join(','));
                        }
                    });
            }

            // チェックボックスをクリックしたとき
            function checkboxClick(){
                var checked = $.data(self, 'mcb-lists'),
                    $cb = $(this),
                    value = $cb.val();
                if ($cb.is(':checked')) {
                    checked.push(value);
                    $.data(self, 'mcb-lists', checked);
                    $self.val(checked.join(','));
                    $cb.closest('label').addClass('mcb-label-checked');
                } else {
                    checked = $.grep(checked, function(v, i){
                        return value == v;
                    }, true);
                    $.data(self, 'mcb-lists', checked);
                    $self.val(checked.join(','));
                    $cb.closest('label').removeClass('mcb-label-checked');
                }
            }

            // 連想配列のキーを並べ替える
            function sortHashKey(obj,rule){ // rule = 'ascend','descend'
                var keys = [], values = [];
                for (var key in obj) {
                    keys.push(key);
                }
                switch (rule) {
                    case 'ascend':
                        keys.sort();
                        break;
                    case 'descend':
                        keys.sort();
                        keys.reverse();
                        break;
                    default:
                        keys.sort();
                        break;
                }
                return keys;
            }
        });
    };    
    $.fn.multicheckbox.defaults = {
        show: 'hide', // 'hide' or 'show' 元のテキストフィールドを非表示にするか否か
        label: '', // カンマ区切りの文字列か{'key1':'value1','key2':'value2'}のハッシュ
        insert: 'before', // 'before' or 'after'
        add: false, // ユーザーがチェックボックスを追加できるようにする場合はtrue
        skin: false, // タグデザインを適用する場合は'tags'
        sort: '' // 'ascend'（昇順）,'descend'（降順）
    };
    // end - jqueryMultiCheckbox.js
    
    // -------------------------------------------------
    //  $.MTAppMultiCheckbox(); 2011-01-07 fix
    // -------------------------------------------------
    // http://www.tinybeans.net/blog/2010/07/06-115554.html

    $.MTAppMultiCheckbox = function(options){
        var op = $.extend({}, $.MTAppMultiCheckbox.defaults, options);
        
        var fieldID = (op.custom != 1) ? '#' + op.basename : '#customfield_' + op.basename;
        var optionShow = (op.debug == 0) ? 'hide' : 'show';
        $(fieldID).multicheckbox({show:optionShow,insert:op.insert,add:op.add,skin:op.skin,label:op.label,sort:op.sort});
    };
    $.MTAppMultiCheckbox.defaults = {
        basename: '',
        label:    '',
        insert:   'before', // "before" or "after" 元のテキストエリアの前に挿入するか後ろに挿入するか
        custom:   0,
        add:      0, // ユーザーが追加できるようにする場合は 1
        skin:     'tags', // タグ選択デザインを適用する場合は'tags'
        sort:     "", // "ascend"（昇順）,"descend"（降順）
        debug:    0
    };
    // end - $.MTAppMultiCheckbox()


    // -------------------------------------------------
    //  $(foo).MTAppshowHint(); 2011-01-07 fix
    // -------------------------------------------------
    //
    //  $(foo).MTAppshowHint({
    //      'text' : 'ヒントに表示させたいテキスト'
    //  });
    //
    $.fn.MTAppshowHint = function(options){
        var op = $.extend({}, $.fn.MTAppshowHint.defaults, options);
        var $self = this,
            target = $(op.target),
            balloonId = 'balloon-' + op.targetId,
            balloon = [
            '<div id="' + balloonId + '" class="balloon">',
                '<div class="balloon-content">',
                '</div>',
                '<div class="balloon-arrow">',
                    '<div class="line10"/>',
                    '<div class="line9"/>',
                    '<div class="line8"/>',
                    '<div class="line7"/>',
                    '<div class="line6"/>',
                    '<div class="line5"/>',
                    '<div class="line4"/>',
                    '<div class="line3"/>',
                    '<div class="line2"/>',
                    '<div class="line1"/>',
                '</div>',
            '</div>'
        ];

        var $balloon = $(balloon.join('')).hide().find('.balloon-content').text(op.text).end();
        target.before($balloon);
        var height = '-' + ($balloon.height() + 10) + 'px';
        $balloon.css('margin-top',height);
        
        $self.hover(
            function(){
                $balloon.show();
            },
            function(){
                $balloon.hide();
            }
        );
    };
    $.fn.MTAppshowHint.defaults = {
        target: 'body',
        targetId: '',
        text: ''
    };
    // end - $(foo).MTAppshowHint();


    // -------------------------------------------------
    //  $(foo).MTAppTooltip(); 2011-01-07 fix
    // -------------------------------------------------
    //
    //  ツールチップを表示させたい要素にMTAppTooltip()を実行する
    //  title属性、なければalt属性の値をツールチップで表示する
    //  
    //  $(foo).MTAppTooltip();
    //
    $.fn.MTAppTooltip = function(options){
        var op = $.extend({}, $.fn.MTAppTooltip.defaults, options);
    
        return this.each(function(){
        
            var self = $(this),
                tooltip = $('#mtapp-tooltip'),
                target, tipText;

            if (op.text != '') {
                tipText = op.text;
            } else {
                target = this.title ? 'title' : 'alt',
                tipText = self.attr(target);
            }
            
            self.hover(function(e){
                if (op.text == '') {
                    self.attr(target,'');
                }
                tooltip
                    .stop(true,true)
                    .fadeIn('fast')
                    .text(tipText)
                    .css({
                        position: 'absolute',
                        top: e.pageY - 20,
                        left: e.pageX + 20
                    });
            },function(){
                if (op.text == '') {
                    self.attr(target,tipText);
                }
                tooltip.fadeOut('fast');
            }).mousemove(function(e){
                tooltip.css({
                    top: e.pageY - 20,
                    left: e.pageX + 20
                });
            });
        });
    };
    $.fn.MTAppTooltip.defaults = {
        text: ""
    };
    // end - $(foo).MTAppTooltip();

    // -------------------------------------------------
    //  $.MTAppSetting();
    // -------------------------------------------------
/*
    $.fn.MTAppSetting = function(options){
        var op = $.extend({}, $.fn.MTAppSetting.defaults, options);
    };
    $.fn.MTAppSetting.defaults = {
        foo: null,
        bar: null
    };
*/
    
    // -------------------------------------------------
    //  $.MTAppSettingGroup();
    // -------------------------------------------------
/*
    $.fn.MTAppSettingGroup = function(options){
        var op = $.extend({}, $.fn.MTAppSettingGroup.defaults, options);
    };
    $.fn.MTAppSettingGroup.defaults = {
        fields: null
    };
*/

    // -------------------------------------------------
    //  $.MTAppCustomize();
    // -------------------------------------------------
    $.MTAppCustomize = function(options){
        var op = $.extend({}, $.MTAppCustomize.defaults, options);        
        var opL = op.label,
            opH = op.hint,
            opS = op.show_field,
            opC = op.custom,
            opW = op.widget,
            opE = op.edit,
            opB = opC ? 'customfield_' + op.basename : op.basename,
            $field,
            $label,
            $tab,
            $hover,
            $editImg = $('<img/>')
                .addClass('mtapp-inline-edit')
                .attr({
                    'src': StaticURI + 'images/status_icons/draft.gif',
                    'alt': '編集'
                })
                .click(function(){
                    $(this).parents('div.field-header').next('div.field-content').toggle();
                });

        // basenameが空だったら何もしないよ
        if (opB == '') {
            alert('basenameが設定されていません');
            return false;
        }

        // $field,$labelを取得
        switch (opB) {
            case 'body':
                $field = $('#text-field');
                $tab   = $field.find('#editor-header div.tab:eq(0)');
                $label = $field.find('#editor-header label:eq(0) a');
                $hover = $label;
                break;
            case 'more': 
                $field = $('#text-field');
                $tab   = $field.find('#editor-header div.tab:eq(1)');
                $label = $field.find('#editor-header label:eq(1) a');
                $hover = $label;
                break;
            case 'assets':
                $field = $('#assets-field');
                $label = $field.find('h3.widget-label span');
                $hover = $field;
                break;
            default:
                if (opW) {
                    $field = $('#entry-' + opB + '-widget');
                    $label = $field.find('h2 span');
                } else {
                    $field = $('#' + opB + '-field');
                    $label = $('#' + opB + '-label');
                }
                $hover = $field;
                break;
        }

        // フィールドにクラス名を追加しよう
        if (op.addclass != '') {
            $field.addClass(op.addclass);
        }
        
        // ラベルの変更
        if (opL != '') {
            $label.text(opL);
            if (opB == 'title') $field.find('div.field-header').show();
        }

        // ヒントの表示
        if (opH) $hover.MTAppshowHint({ target: $field, id: opB, text: opH });

        // フィールドの表示・非表示
        if (opS == 'show') {
            $field.removeClass('hidden');
        } else if (opB != 'body' && opB != 'more' && (opS == 0 || opS == 'hide')) {
            $field.addClass('hidden');
        } else if ((opB == 'body' || opB == 'more') && (opS == 0 || opS == 'hide')) {
            $tab.addClass('hidden');
        }

        // テキストフィールドの表示・非表示
        if ((opB == 'body' || opB == 'more') && (op.show_parent == 0 || op.show_parent == 'hide')) {
            $field.css({
                position: 'absolute',
                top: '-9999px',
                left: '-9999px',
                width: '1px',
                height: '1px'
            });
        }

        // 非編集モード
        if (opE && $field.find('div.field-content').length) {
            $label.after($editImg);
            $field.find('div.field-content').hide();
        }
        return $field;
    };
    $.MTAppCustomize.defaults = {
        basename:   '', // ベースネーム（ドキュメント参照）
        label:      '', // 変更後のラベル名
        addclass:   '', // 追加するクラス名
        hint:       '', // ヒントに表示させたいメッセージ
        show_field:  1, // 1: デフォルトのまま, 0: 非表示, 'show': 強制表示, 'hide': 強制表示(= 0)
        show_parent: 1, // 1: デフォルトのまま, 0: 非表示, 'show': 強制表示, 'hide': 強制表示(= 0) (*)basename が body か more のみ。
        custom:      0, // 1: カスタムフィールド
        widget:      0, // 1: ウィジェット
        edit:        0  // 1: 非編集モード
    };
    // end - $.MTAppCustomize()

    // -------------------------------------------------
    //  $.MTAppFieldSort
    // -------------------------------------------------
    $.MTAppFieldSort = function(options){
        var op = $.extend({}, $.MTAppFieldSort.defaults, options);

        var field = op.sort.split(',');
        field.reverse();
        
        if (field.length == 0) return;
        var ID = '#' + op.insertID;
        for (var i = -1, n = field.length; ++i < n;) {
            if (field[i].match(/^c:/)) {
                var fieldID = '#customfield_' + field[i].replace(/^c:/,'') + '-field';
                $(fieldID).prependTo(ID);
            } else {
                var fieldID = '#' + field[i] + '-field';
                $(fieldID).prependTo(ID);
            }
        }
    };
    $.MTAppFieldSort.defaults = {
        sort    : 'title,text,tags,excerpt,keywords',
        insertID: 'main-content-inner'
    };
    // end - $.MTAppFieldSort

    // -------------------------------------------------
    //  $.MTAppMsg
    // -------------------------------------------------
    $.MTAppMsg = function(options){
        var op = $.extend({}, $.MTAppMsg.defaults, options);

        var closeBtn = $('<span class="mt-close-msg close-link clickable icon-remove icon16 action-icon">閉じる</span>');
        var myMsg = $('<div class="msg msg-' + op.type + '"><p class="msg-text">' + op.msg + '</p></div>');

        if (op.type != 'error') {
            myMsg.append(closeBtn);
        }

        if ($('#msg-block').length == 0) {
            $('#page-title').after('<div id="msg-block"></div>');
        }

        $('#msg-block').append(myMsg);
        
        if (op.timeout > 0) setTimeout(function(){myMsg.fadeOut();}, op.timeout);
    };
    $.MTAppMsg.defaults = {
        msg:  '', // 表示するメッセージ
        type: '', // 'info' or 'success' or 'error'
        timeout: 0 // 一定時間経過後に非表示にする場合にミリ秒を指定。0は非表示にしない。
    };
    // end - $.MTAppMsg

    // -------------------------------------------------
    //  $.MTAppSlideMenu
    // -------------------------------------------------
    $.MTAppSlideMenu = function(options){
        var op = $.extend({}, $.MTAppSlideMenu.defaults, options);

        $('ul.mtapp-slidemenu').each(function(){
            var self = $(this);
            var parentLi = self.parent('li');
            self.find('li').each(function(i){
                $(this).addClass('slidemenu_' + i);
            });
            var parentHref = parentLi.find('a').attr('href');
            var parentId = parentHref.replace(/(.*?\?)(blog_id=\d+)(.*)/,'$2');
            parentId = parentId.replace(/=/,'_');
            self.addClass(parentId);
            parentLi.hover(
                function(){
                    var w = $(this).width();
                    $(this).find('ul:eq(0)').css('left',w + 'px').show();
//                    $('#field-convert_breaks').hide();
                },
                function(){
                    $(this).find('ul:eq(0)').hide();
//                    $('#field-convert_breaks').show();
                }
            );
            self.find('li').hover(
                function(){
                    var w = $(this).width();
                    $(this).find('ul:eq(0)').css('left',w + 'px').show();
//                    $('#convert_breaks').hide();
                },
                function(){
                    $(this).find('ul:eq(0)').hide();
//                    $('#convert_breaks').show();
                }
            );
        });
    };
    $.MTAppSlideMenu.defaults = {
        hide: ''
    };
    // end - $.MTAppSlideMenu

    // -------------------------------------------------
    //  $.MTAppInCats()
    // -------------------------------------------------
    $.MTAppInCats = function(options){
        var op = $.extend({}, $.MTAppInCats.defaults, options);

        // 選択されているカテゴリIDを取得
        $('#category-list').find('li').each(function(){
            var catID = $(this).attr('mt:id')
            catsSelected.push(catID);
        });
        
        // オプションで指定したカテゴリIDを取得
        var cats = new Array();
        cats = op.categories.split(',');

        if (catsSelected.length) {    
            // 選択されているカテゴリとオプションで指定したカテゴリが一致したらメソッドを実行
            for (var i=0; i<cats.length; i++) {
                if ($.inArray(cats[i], catsSelected) >= 0) {
                    op.code();
                }
            }
        }
        $('#category-selector-list').find(':checkbox').live('click',function(){
            var catID = $(this).attr('name').replace(/add_category_id_/,'');
            if ($.inArray(catID, cats) >= 0) {
                if ($(this).is(':checked')) {
                    op.code();
                } else {
                    // window.location.reload();
                }
            }
        });
    };
    $.MTAppInCats.defaults = {
        categories: '',
        code      : function(){}
    };
    // end - $.MTAppInCats()

    // -------------------------------------------------
    //  $.MTAppFullscreen()
    // -------------------------------------------------
    $.MTAppFullscreen = function(){
        // Get the action bar buttons
        var actionBtns = new Array();
        $('#entry-publishing-widget .widget-content .actions-bar button').each(function(i){
            actionBtns[i] = $(this).clone(true).addClass('cloneBtns');
        });
        // init
        $('body').prepend('<div id="overlay"></div>');
        var fullBtn = $('<div/>')
            .attr('id','fullBtn')
            .addClass('tab')
            .html('<label><a href="javascript:void(0);">Full</a></label>')
            .toggle(
                function(){
                    var textfieldHeight = $('#text-field').height();
                    var textareaHeight = $('#editor-content-enclosure').height();
                    $('body').css({
                        'overflow':'hidden',
                        'padding-right':'17px'
                    });
                    $('#overlay').fadeIn(function(){
                        $('#text-field').css({
                            'position':'absolute',
                            'z-index':'2000',
                            'top':(getPageScroll()[1] + 8) + 'px',
                            'left':'5%',
                            'width':'90%',
                            'height':(getPageHeight() - 26) + 'px',
                            'margin-left':'0'
                        });
                        $('#editor-content-enclosure, #editor-content-enclosure textarea, #editor-content-enclosure iframe').css({
                            'height':(getPageHeight() - 115) + 'px',
                            'background-color':'#ffffff'
                        });
                        $('button.cloneBtns').show();
                    });
                },
                function(){
                    $('body, #text-field, #editor-content-enclosure, #editor-content-enclosure textarea, #editor-content-enclosure iframe').removeAttr('style');
                    $('#overlay, button.cloneBtns').hide();
                });
        // Add a new tab
        $('#editor-header div:eq(1)').after(actionBtns[0],actionBtns[1],actionBtns[2]).after(fullBtn);
    };
    // end - $.MTAppFullscreen()

    // -------------------------------------------------
    //  $.MTApp1clickRebuild()
    // -------------------------------------------------
    $.MTApp1clickRebuild = function(options){

        // ウェブサイトテンプレートの管理以外なら何もしない
        if($('body#list-template').length == 0) return;
        
        // 「すべて再構築」ボタンとテーブルに再構築アイコンを設置
        $("#index-listing, #archive-listing").each(function(){
            var self = $(this),
                type = {
                    "name": self.find('div.listing-header h2').text(),
                    "id"  : self.attr('id')
                },
                // 公開ボタンを変数に入れておく
                publish = self.find('div.actions-bar button:eq(0)');

            // インデックス、アーカイブテンプレートのすべて再構築ボタンを設置
            self
                .find('div.actions-bar')
                    .find('span:eq(0)')
                        .prepend('<button class="button mtapp-1click-rebuild" title="' + type.name + 'をすべて再構築">すべて再構築</button>')
                        .find('button.mtapp-1click-rebuild')
                            .click(function(){
                                $(this)
                                    .closest('div.actions-bar')
                                    .siblings('table')
                                        .find('input:checkbox').attr('checked','checked');
                                publish.click();
                                return false;
                            });
            // 再構築アイコンをテーブルに挿入
            self
                .find('#' + type.id + '-table')
                    .find('th.cb')
                        .after('<th class="col head rebuild"><span class="col-label">再構築</span></th>')
                    .end()
                    .find('tbody')
                        .find('td.cb')
                            .after('<td class="rebuild"><img class="mtapp-rebuild-icon" src="' + mtappVars.static_plugin_path + 'images/rebuild-mini.png" width="13" height="13" /></td>')
                        .end()
                        .find('img.mtapp-rebuild-icon')
                            .each(function(){
                                var tmplName = $(this).closest('td').next().find('a').text();
                                $(this).attr('title',tmplName + ' を再構築する');
                            })
                            //.MTAppTooltip()
                            .click(function(){
                                $(this)
                                    .closest('td.rebuild')
                                        .prev('td.cb')
                                            .find('input:checkbox')
                                                .attr('checked','checked');
                                publish.click();
                                return false;
                            });
        });
    };
    // end - $.MTApp1clickRebuild()
    
    // -------------------------------------------------
    //  $.MTAppDebug()
    // -------------------------------------------------
    $.MTAppDebug = function(options){
        // var op = $.extend({}, $.MTAppDebug.defaults, options);

        // 共通
        // bodyのID
        var bodyID = $('body').attr('id'),
            bodyClass = $('body').attr('class').replace(/ +/g,'.');
        var pageTitle = $('#page-title').text(),
            pageTitle = (pageTitle != '') ? '// ' +  $.trim(pageTitle) + '<br />': '';
        var a_ = '<a class="mtapp-if-page" href="#" title="if($(\'body#',
            _a = '</a>';
        var mtappVarsStr = [];
        for (var key in mtappVars) {
            mtappVarsStr.push('&nbsp;&nbsp;&nbsp;&nbsp;' + key + ': ' + mtappVars[key]);
        }
        
        var pageInfo = [
            '<span class="mtapp-debug-pageinfo" style="font-family: monospace;">',
                '[このページの情報] <br />',
                '<span>',
                    'body#'+ bodyID + '.' + bodyClass + '<br />',
                    'var blogID = '+ blogID + ', authorID = '+ authorID + '<br />',
                    'var mtappVars = { <br />' + mtappVarsStr.join(',<br />') + '<br />};',
                '</span>',
                '[次の条件に限定する if 文を生成]<br />',
                '<span>',
                    a_ + bodyID +'\').length){}">ページ限定' + _a + ' / ',
                    a_ + bodyID +'\').length && blogID == '+ blogID +'){}">ブログとページ限定' + _a + ' / ',
                    a_ + bodyID +'\').length && blogID == '+ blogID +' && authorID == '+ authorID +'){}">ブログとページとユーザー限定' + _a,
                '</span>',
            '</span>',
        ];
        $.MTAppMsg({
            msg: pageInfo.join(''),
            type: 'info'
        });
        $('a.mtapp-if-page').click(function(e){
            e.preventDefault();
            $.MTAppMsg({
                msg: pageTitle + $(this).attr('title'),
                type: 'success'
            });
        });   

        // ブログ一覧
        if ($('body#list-blog').length) {
            $('#blog-listing-table tbody tr').each(function(){
                var id = $(this).find('td.cb input:checkbox').val();
                $(this).find('td.name').MTAppInsertHtml(id,'[',']');
            });
        }

        // ブログ記事一覧
        // IDを表示、下書きの背景を変更
        if ($('body#list-entry').length) {
            $('#entry-listing-table tbody tr').each(function(){
                var id = $(this).find('td.cb input:checkbox').val();
                $(this).find('td.title').MTAppInsertHtml(id,'[',']');
                if($(this).find('td.status-draft').length){
                    $(this).css({'background':'#FFCBD0'});
                }
            });
        }
        
        // ブログ記事新規作成・更新
        if ($('body#edit-entry').length || $('body#edit-page').length) {
            if ( window.console && window.console.log ) {
                $('input, textarea').live('click', function(){
                    window.console.log($(this).attr('id'));
                });
            }
        }

        // カテゴリ一覧
        // IDを表示
        if ($('body#list-category').length) {
            $('#category-listing-table tbody tr').each(function(){
                var id = $(this).attr('id').replace(/category-/,'');
                $(this).find('td.category div').MTAppInsertHtml(id,'[',']');
            });
        }

        // タグ一覧
        // IDを表示
        if ($('body#list-tag').length) {
            $('#tag-listing-table tbody tr').each(function(){
                var id = $(this).attr('id').replace(/tag-/,'');
                $(this).find('td.name').MTAppInsertHtml(id,'[',']');
            });
        }

        // ウェブページ一覧
        // IDを表示
        if ($('body#list-page').length) {
            $('#page-listing-table tbody tr').each(function(){
                var id = $(this).find('td.cb input:checkbox').val();
                $(this).find('td.title').MTAppInsertHtml(id,'[',']');
            });
        }

        // フォルダ一覧
        // IDを表示
        if ($('body#list-folder').length) {
            $('#folder-listing-table tbody tr').each(function(){
                var id = $(this).find('td.cb input:checkbox').val();
                $(this).find('td:eq(2)').MTAppInsertHtml(id,'[',']');
            });
        }
        // テンプレート一覧
        // IDを表示
        if ($('body#list-template').length) {
            $('#main-content-inner tr').each(function(){
                var id = $(this).find('td.cb input:checkbox').val();
                $(this).find('td.template-name').MTAppInsertHtml(id,'[',']');
            });
        }
    };
/*
    $.MTAppDebug.defaults = {
        foo: null,
        bar: null
    };
*/
    // end - $.MTAppDebug()

    // -------------------------------------------------
    //  $.MTAppCreateLink()
    // -------------------------------------------------
    $.MTAppCreateLink = function(options){
        var op = $.extend({}, $.MTAppCreateLink.defaults, options);
        var cgi = CMSScriptURI;
        switch (op.title) {
            case 'ユーザーダッシュボード':
                return cgi + '?__mode=dashboard';
            case 'ダッシュボード':
                return cgi + '?__mode=dashboard&blog_id=' + op.blog_id;
            default:
                return '';
        }
    };

    $.MTAppCreateLink.defaults = {
        title: '',
        blog_id: 0,
        id: 0
    };


    // -------------------------------------------------
    //  Utility
    // -------------------------------------------------
    $.fn.extend({
        hasClasses: function (selector) {
            if (typeof selector == 'string') {
                selector = /^\./.test(selector) 
                    ? selector.replace(/^\./,'').split('.')
                    : selector.replace(/^ | $/g,'').split(' '); 
            }
            for (var i = -1,j = 0, n = selector.length; ++i < n;) {
                if (this.hasClass(selector[i])) j++;
            }
            return n === j;
        },
        notClasses: function(selector) {
            if (this.hasClasses(selector)) {
                return false;
            } else {
                return true;
            }
        },        
        MTAppInsertHtml: function (html, prefix, suffix){
            prefix = prefix || '';
            suffix = suffix || '';
            return this.each(function(){
                $(this).html(prefix + html + suffix + $(this).html());
            });
        },
        noScroll: function (selector, horizontal){
            var self = $(this).css('position', 'relative'),
                target = self.find(selector).css({'position': 'absolute', 'z-index':99});
                if (horizontal) {
                    target.css(horizontal, 0);
                }
            $(window).scroll(function(){
                var thisTop = $(document).scrollTop() - self.offset().top + 10;
                if (thisTop < 0) {
                    thisTop = 0;
                }
                target.stop().animate(
                    {top: thisTop + 'px'},
                    'fast',
                    'swing'
                );
            });
            return self;
        }
    });
    // end - Utility

})(jQuery);

/*
 * mtEditInput
 * modified by tinybeans
 * Usage:
 *   jQuery('.mt-edit-field').mtEditInput({ edit: '<__trans phrase="Edit">'});
 *
 */
(function($){
    $.fn.MTAppInlineEdit = function(options) {
        var defaults = {
            save: 'Save'
        };
        var opts = $.extend(defaults, options);
        return this.each(function() {
            var id = $(this).attr('id');
            var $elm = $('#'+id);
            var val = ($elm.val() != '') ? $elm.val() : '...';
            var $btn = '<button id="mt-set-' + id + '" class="mt-edit-field-button button">' + opts.edit + '</button>';
            if (opts.always) {
                $elm
                    .before('<span class="' + id + '-text">' + val + '</span>')
                    .after($btn)
                    .hide();
            } else {
                if (val && !$elm.hasClass('show-input')) {
                    $elm
                        .before('<span class="' + id + '-text">' + val + '</span>')
                        .after($btn)
                        .hide();
                }
                if (!val && $elm.hasClass('hide-input')) {
                    $elm
                        .before('<span class="' + id + '-text">...</span>')
                        .after($btn)
                        .hide();
                }
            }
            $('button#mt-set-' + id).click(function() {
                $(this).hide()
                    .prev().show()
                    .prev().hide();
                $('p#' + id + '-warning').show();
                return false;
            });
        });
    };
})(jQuery);

// getPageScroll() by quirksmode.com
function getPageScroll() {
    var xScroll, yScroll;
    if (self.pageYOffset) {
        yScroll = self.pageYOffset;
        xScroll = self.pageXOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {   // Explorer 6 Strict
        yScroll = document.documentElement.scrollTop;
        xScroll = document.documentElement.scrollLeft;
    } else if (document.body) {// all other Explorers
        yScroll = document.body.scrollTop;
        xScroll = document.body.scrollLeft; 
    }
    return new Array(xScroll,yScroll);
}

// Adapted from getPageSize() by quirksmode.com
function getPageHeight() {
    var windowHeight
    if (self.innerHeight) {   // all except Explorer
        windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
        windowHeight = document.documentElement.clientHeight;
    } else if (document.body) { // other Explorers
        windowHeight = document.body.clientHeight;
    } 
    return windowHeight;
}
function setCookie(key, val, days){
    var cookie = escape(key) + "=" + escape(val);
    if(days != null){
        var expires = new Date();
        expires.setDate(expires.getDate() + days);
        cookie += ";expires=" + expires.toGMTString();
    }
    document.cookie = cookie;
}
function getCookie(key) {
    if(document.cookie){
        var cookies = document.cookie.split(";");
        for(var i=0; i<cookies.length; i++){
            var cookie = cookies[i].replace(/\s/g,"").split("=");
            if(cookie[0] == escape(key)){
                return unescape(cookie[1]);
            }
        }
    }
    return "";
}

jQuery(function($){

    // -------------------------------------------------
    //  Favorite Structure ダッシュボード
    // -------------------------------------------------
/*
    if ($("body#dashboard").length > 0 && $("#favorite_blogs").length > 0) {
        $("div.blog-content").each(function(){
            $(this).clone().appendTo("#favorite-structure-container");
        });
    }
*/
    $('#favorite-structure').find('div.favorite-structure-container').hover(
    	function(){
    		$(this).css('backgroundColor','#C2EEB5');
    	},
    	function(){
    		$(this).css('backgroundColor','#F3F3F3');
    	}
    );
});
