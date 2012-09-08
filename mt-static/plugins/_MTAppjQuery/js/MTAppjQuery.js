/*
 * MTAppjQuery.js
 *
 * Copyright (c) Tomohiro Okuwaki (http://www.tinybeans.net/blog/)
 *
 * Since:   2010-06-22
 * Update:  2012-03-02
 * for version: 0.2x
 *
 */
(function($){

    if (typeof mtappVars !== 'object') return;
    // -------------------------------------------------
    //  $.MTAppNoScrollRightSidebar();
    //
    //  Description:
    //    右サイドバーのウィジェットをスクロールに追随するようにする。
    //
    //  Usage:
    //    $.MTAppNoScrollRightSidebar(open_type);
    //
    //  Param:
    //    open_type: {Boolean} true=ウィジェットを閉じた状態にする。
    // -------------------------------------------------
    $.MTAppNoScrollRightSidebar = function(open_type){
        var type = (open_type) ? 'no-scroll-right-sidebar' : '';
        $('#content-body').noScroll('#related-content', 'right');
        var span = $('#related-content')
                .addClass(type)
                .children()
                    .addClass('widget-wrapper')
                    .find('div.widget-header')
                        .find('span')
                            .css({cursor:'pointer'});
        if (open_type) {
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
     * Copyright (c) Tomohiro Okuwaki (http://www.tinybeans.net/blog/)
     * Licensed under MIT Lisence:
     * http://www.opensource.org/licenses/mit-license.php
     * http://sourceforge.jp/projects/opensource/wiki/licenses%2FMIT_license
     *
     * Since:   2010-06-22
     * Update:  2012-03-05
     * version: 0.13
     *
     * jQuery 1.3 later (maybe...)
     *
     */
    $.fn.multicheckbox = function(options){
        var op = $.extend({}, $.fn.multicheckbox.defaults, options);

        return this.each(function(idx){

            var self = this, $self = $(this), selfVals = (this.value !== '') ? this.value.split(','): [];
            var checked = [];
            if (selfVals.length > 0) {
                for (var i = 0, n = selfVals.length; i < n; i++) {
                    selfVals[i] = $.trim(selfVals[i]);
                    checked[i] = $.trim(selfVals[i]);
                }
            }
            var containerClass = (op.skin === 'tags') ? 'mcb-container mcb-skin-tags' : 'mcb-container';
            var $container = $('<span class="' + containerClass+ '">test</span>');
            $self[op.insert]($container);

            var labels = [], checkboxs = [];
            // labelオプションがオブジェクトの場合
            if (typeof op.label === 'object') {
                if (op.sort === '') {
                    for (var key in op.label) {
                        var boolCheck = boolCheckSplice(key, selfVals);
                        labels.push(makeLabel(key, op.label[key], boolCheck));
                    }
                } else {
                    checkboxs = sortHashKey(op.label, op.sort);
                    for (var i = 0, n = checkboxs.length; i < n; i++) {
                        var key = checkboxs[i];
                        var boolCheck = boolCheckSplice(key, selfVals);
                        labels.push(makeLabel(key, op.label[key], boolCheck));
                    }
                }
            // labelオプションがカンマ区切りのテキストもしくは空の場合
            } else if (typeof op.label === 'string') {
                checkboxs = (op.label === '') ? $self.attr('title').split(',') : op.label.split(',');
                if (checkboxs.length === 1 && checkboxs[0] === '') {
                    checkboxs = [];
                }
                for (var i = 0, n = checkboxs.length; i < n; i++) {
                    checkboxs[i] = $.trim(checkboxs[i]);
                }
                if (op.sort == 'ascend') {
                    checkboxs.sort();
                } else if (op.sort === 'descend') {
                    checkboxs.sort();
                    checkboxs.reverse();
                }
                for (var i = 0, n = checkboxs.length; i < n; i++) {
                    var boolCheck = boolCheckSplice(checkboxs[i], selfVals);
                    labels.push(makeLabel(checkboxs[i], checkboxs[i], boolCheck));
                }
            }
            if (selfVals.length > 0) {
                for (var i = 0, n = selfVals.length; i < n; i++) {
                    labels.push(makeLabel(selfVals[i], selfVals[i], true));
                }
            }
            // addオプションがtrueの場合（ユーザー追加可能の場合）
            if (op.add && op.skin == false) {
                labels.push('<input class="mcb-add-item" type="text" value="+" />');
            } else if (op.add) {
                labels.push('<input class="mcb-add-item" type="text" value="" />');
            }
            $container
                .html(labels.join(''))
                .find('input:checkbox')
                    .bind('click', checkboxClick);

            $self[op.show]();

            $.data(self, 'mcb-lists', checked);

            // ユーザーが項目を追加できるようにする
            if (op.add) {
                $container.find('input.mcb-add-item')
                    .focus(function(){
                        if ($(this).val() === '+' && op.skin == false) $(this).val('');
                    })
                    .blur(function(){
                        if ($(this).val() === '' && op.skin == false) $(this).val('+');
                    })
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
                                .before(makeLabel(value, label, true))
                                .prev()
                                    .children('input:checkbox').click(checkboxClick);
                            var checked = $.data(self, 'mcb-lists');
                            checked.push(value);
                            $.data(self, 'mcb-lists', checked);
                            $self.val(checked.join(','));
                            return false;
                        }
                    });
            }

            function boolCheckSplice(key, arry){
                var idx = $.inArray(key, arry);
                if (idx >= 0) {
                    arry.splice(idx, 1);
                    return true;
                } else {
                    return false;
                }
            }

            // label, input:checkbox の挿入
            function makeLabel(value, label, bool_checked){
                var classname = bool_checked ? ' mcb-label-checked': '';
                var checked = bool_checked ? ' checked="checked"': '';
                return [
                    '<label class="mcb-label' + classname + '">',
                        '<input class="mcb-checkbox" type="checkbox" value="' + value + '"' + checked + ' />',
                        label,
                    '</label>'
                ].join('');
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
            function sortHashKey(obj, rule){ // rule = 'ascend','descend'
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
    //  $.MTAppMultiCheckbox();
    //
    //  Description:
    //    テキストフィールドをマルチチェックボックスにする。
    //    http://www.tinybeans.net/blog/2010/07/06-115554.html
    //
    //  Usage:
    //    $.MTAppMultiCheckbox(options);
    //
    //  Options:
    //    basename: {String} 各フォーム要素のベースネーム
    //    label: {String, Object} カンマ区切りの文字列か{'key1':'value1','key2':'value2'}のハッシュ
    //    insert: {String} 元のテキストエリアの前に挿入するか('before')、後ろに挿入するか('after')
    //    custom: {boolean} カスタムフィールドの場合(true)
    //    add: {boolean} ユーザーが項目を追加できるようにする(true)
    //    skin: {String} タグデザインを適用する('tags')
    //    sort: {String} 昇順('ascend')、降順('descend')
    //    debug: {boolean} 元のテキストフィールドを表示にする(true)か表示しないか(false)
    // -------------------------------------------------
    $.MTAppMultiCheckbox = function(options){
        var op = $.extend({}, $.MTAppMultiCheckbox.defaults, options);

        var fieldID = (op.custom) ? '#customfield_' + op.basename: '#' + op.basename;
        var optionShow = (op.debug) ? 'show' : 'hide';
        $(fieldID).multicheckbox({
            show: optionShow,
            insert: op.insert,
            add: op.add,
            skin: op.skin,
            label: op.label,
            sort: op.sort
        });
    };
    $.MTAppMultiCheckbox.defaults = {
        basename: '',
        label: '',
        insert: 'before',
        custom: false,
        add: false,
        skin: '',
        sort: '',
        debug: false
    };
    // end - $.MTAppMultiCheckbox()


    /*
     * jquery.MTAppDynamicSelect.js
     *
     * Copyright (c) Tomohiro Okuwaki (http://www.tinybeans.net/blog/)
     * Licensed under MIT Lisence:
     * http://www.opensource.org/licenses/mit-license.php
     * http://sourceforge.jp/projects/opensource/wiki/licenses%2FMIT_license
     *
     * Since:   2012-02-24
     * Update:  2012-03-01
     * version: 0.2
     * 
     */
    $.fn.MTAppDynamicSelect = function(options){
        var op = $.extend({}, $.fn.MTAppDynamicSelect.defaults, options);
        return this.each(function(){
            var $self = $(this);
            var selfVal = $self.val() ? $self.val() : '';
            if (!op.debug) {
                $self.hide();
            }

            var options = [];
            var selected = '';
            var exist = false;
            if (typeof op.text == 'string') {
                var items = op.text.split(',');
                if (!op.separateMode && $.inArray(selfVal, items) < 0) {
                    items.unshift(selfVal);
                }
                for (var i = 0, n = items.length; i < n; i++) {
                    var attr = separate(items[i]);
                    if (selfVal == attr[0]) {
                        selected = ' selected="selected"';
                    } else {
                        selected = '';
                    }
                    options.push('<option value="' + attr[0] + '"' + selected + '>' + attr[1] + '</option>');
                }
            } else if (typeof op.text == 'object') {
                for (var key in op.text) {
                    options.push('<optgroup label="' + key + '">');
                    for (var i = 0, n = op.text[key].length; i < n; i++) {
                        var attr = separate(op.text[key][i]);
                        if (selfVal == attr[0]) {
                            selected = ' selected="selected"';
                            exist = true;
                        } else {
                            selected = '';
                        }
                        options.push('<option value="' + attr[0] + '"' + selected + '>' + attr[1] + '</option>');
                    }
                    options.push('</optgroup>');
                }
                if (selfVal && !exist) {
                    options.unshift('<optgroup label="' + op.initGroupName + '"><option value="' + selfVal + '">' + selfVal + '</option></optgroup>');
                }
            }
            var select = [
                '<select class="dynamic_select">',
                    options.join(''),
                    '<option value="_add_">' + op.addText + '</option>',
                '</select>'
            ];
            var $select = $(select.join('')).change(function(){
                if ($(this).val() === '_add_') {
                    var $option = $(this).find('option');
                    var size = $option.size();
                    var additon = prompt(op.promptMsg,'');
                    $self.val(additon);
                    $option.eq(size-1).before('<option value="' + additon + '" selected="selected">' + additon + '</option>');
                } else {
                    $self.val($(this).val());
                }
            });
            if (op.separateMode) {
                $select.find('option').last().remove();
            }
            $self.after($select);

            function separate (str) {
                var array = [];
                if (str.match(/([^|]+)\|([^|]+)/)) {
                    array[0] = RegExp.$1;
                    array[1] = RegExp.$2;
                } else {
                    array[0] = str;
                    array[1] = str;
                }
                return array;
            }
        });
    };    
    $.fn.MTAppDynamicSelect.defaults = {
        debug: false,
        text: '', // カンマ区切りの文字列か連想配列と配列の入れ子。value|labelと分けることも可能（要separateMode: true）。
        addText: '項目を追加する',
        promptMsg: '追加する項目名を入力',
        initGroupName: '選択中アイテム',
        separateMode: false
    };
    // end - $(foo).MTAppDynamicSelect()


    /*
     * jquery.MTAppFieldSplit.js
     *
     * Copyright (c) Tomohiro Okuwaki (http://www.tinybeans.net/blog/)
     * Licensed under MIT Lisence:
     * http://www.opensource.org/licenses/mit-license.php
     * http://sourceforge.jp/projects/opensource/wiki/licenses%2FMIT_license
     *
     * Since:   2012-03-01
     * Update:  2012-03-01
     * version: 0.1
     * 
     */
    $.fn.MTAppFieldSplit = function(options){
        var op = $.extend({}, $.fn.MTAppFieldSplit.defaults, options);
        return this.each(function(){
            var $self = $(this);
            var separator = op.separator;
            var addClass = (op.addClass !== '') ? ' class="' + op.addClass + '"': '';
            var splitCount = op.splitCount > 1 ? op.splitCount: 2;
            var selfVal = $self.val() ? $self.val().split(op.separator) : [];

            if (!op.debug) {
                $self.hide();
            }

            var input = [];
            var value = '';
            var placeholder = '';
            for (var i = 0; i < splitCount; i++) {
                value = (selfVal[i]) ? selfVal[i] : '';
                placeholder = (op.placeholder[i]) ? op.placeholder[i] : '';
                input.push('<input type="text"' + addClass + ' value="' + value + '" placeholder="' + placeholder + '" style="margin-right:' + op.interval + '" />');
                value = '';
            }
            var $span = $('<span>' + input.join('') + '</span>').children().each(function(){
                $(this).blur(function(){
                    var values = [];
                    $(this).siblings().andSelf().each(function(){
                        values.push($(this).val());
                    });
                    $self.val(values.join(separator));
                });
            }).end();
            $self.after($span);
        });
    };    
    $.fn.MTAppFieldSplit.defaults = {
        debug: false,
        splitCount: 2,
        placeholder: [],
        interval: '5px',
        addClass: '',
        separator: ','
    };
    // end - $(foo).MTAppFieldSplit()


    // -------------------------------------------------
    //  $.MTAppKeyboardShortcut();
    //
    //  Description:
    //    一覧画面でj, k, xのキーボード・ショートカットが使える。
    //
    //  Usage:
    //    $.MTAppKeyboardShortcut();
    //
    // -------------------------------------------------
    $.MTAppKeyboardShortcut = function(){
        if (mtappVars.screen_id === 'list-template') return;
        $(window).bind('listReady', function(){
            var keyOn = true;
            var keyIdx = null;
            var tr = $('table.listing-table tbody tr');
            var trCount = tr.length;
            if (trCount < 1) return;
            $(':text')
                .focus(function(){
                    keyOn = false;
                })
                .blur(function(){
                    keyOn = true;
                });
            $(window).keyup(function(e){
                if (!keyOn) return;
                var key = e.which;
                if (keyIdx == null) {
                    keyIdx = 0;
                    tr.eq(keyIdx).addClass('keyboard-selected');
                    autoScroll(tr.eq(keyIdx).offset());
                    return;
                }
                switch (key) {
                    case 74://j
                        tr.eq(keyIdx).removeClass('keyboard-selected');
                        keyIdx++;
                        if (keyIdx >= trCount) {
                            keyIdx = trCount - 1;
                        }
                        autoScroll(tr.eq(keyIdx).offset(), tr.eq(keyIdx).height(), 'down');
                        tr.eq(keyIdx).addClass('keyboard-selected');
                        break;
                    case 75://k
                        tr.eq(keyIdx).removeClass('keyboard-selected');
                        keyIdx--;
                        if (keyIdx < 1) {
                            keyIdx = 0;
                        }
                        autoScroll(tr.eq(keyIdx).offset(), tr.eq(keyIdx).height(), 'up');
                        tr.eq(keyIdx).addClass('keyboard-selected');
                        break;
                    case 88://x
                        tr.eq(keyIdx).toggleClass('selected').find(':checkbox').click();
                        break;
                }
            });
            $('table.listing-table tr').hover(
                function(){
                    $(this).addClass('hover-selected');
                },
                function(){
                    $(this).removeClass('hover-selected');
                });

            function autoScroll(pos, height, direction, speed) {
                var winS = $(window).scrollTop();
                var winH = $(window).height();
                var sTop = 0;
                if (height > winH) {
                    sTop = pos.top;
                } else {
                    switch (direction) {
                        case 'down':
                            sTop = winS + winH - height;
                            if (pos.top < winS + winH - height) return;
                            break;
                        case 'up':
                            sTop = winS - winH + height;
                            if (pos.top > winS) return;
                            break;
                    }
                }
                speed = speed || 200;
                $('html,body').animate({
                    scrollTop: sTop,
                    scrollLeft: pos.left
                },{
                    easing: "linear",
                    duration: speed
                });
            }
        });
    };
    // end - $.MTAppKeyboardShortcut()


    // -------------------------------------------------
    //  $(foo).MTAppshowHint();
    //
    //  Description:
    //    要素にマウスオーバーしたときに、要素上部に吹き出しスタイルでテキストを表示する。
    //    吹き出しは$(foo)内にprependされる。
    //
    //  Usage:
    //    $(foo).MTAppshowHint(options);
    //
    //  Options:
    //    text: {String} ヒントの吹き出しに表示させるテキスト
    // -------------------------------------------------
    $.fn.MTAppshowHint = function(options){
        var op = $.extend({}, $.fn.MTAppshowHint.defaults, options);
        return this.each(function(idx){
            var balloon = [
                    '<div class="balloon" style="visibility: hidden;">',
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
                ],
                $balloon = $(this).prepend(balloon.join(''))
                                  .find('div.balloon')
                                      .find('div.balloon-content').text(op.text)
                                      .end(),
                height = '-' + ($balloon.outerHeight() + 10) + 'px';

            $balloon.css('margin-top', height);

            $(this).hover(
                function(){
                    $balloon.css('visibility','visible');
                },
                function(){
                    $balloon.css('visibility','hidden');
                }
            );
        });
    };
    $.fn.MTAppshowHint.defaults = {
        text: ''
    };
    // end - $(foo).MTAppshowHint();


    // -------------------------------------------------
    //  $(foo).MTAppTooltip();
    //
    //  Description:
    //    指定した要素にマウスオーバーするとカーソルに追随するツールチップを表示する。
    //
    //  Usage:
    //  　$(foo).MTAppTooltip(options);
    //    ツールチップを表示させたい要素にMTAppTooltip()を実行する。
    //    textオプション、title属性、alt属性の値の優先順位でツールチップで表示する。
    //
    //  Options:
    //    text: {String} ツールチップに表示させるテキスト
    // -------------------------------------------------
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
        text: ''
    };
    // end - $(foo).MTAppTooltip();


    // -------------------------------------------------
    //  $(foo).MTAppSuggest();
    //
    //  Description:
    //    
    //
    //  Usage:
    //  　$(input:text).MTAppSuggest(options);
    //
    //  Options:
    //    list: {Array} 候補になる用語の配列
    // -------------------------------------------------
    $.fn.MTAppSuggest = function(options){
        var op = $.extend({}, $.fn.MTAppSuggest.defaults, options);

        return this.each(function(){
            var $self = $(this);
            var rand = '' + Math.random();
            rand = rand.replace('.','');
            var suggestionId = 'suggestion-' + rand;
            var completionId = 'completion-' + rand;
            $.data(this, 'suggestList', op.list);
            var list = '<div class="field-suggestion" id="' + suggestionId + '" style="display:none;"><div class="field_completion" id="' + completionId + '"></div></div>';
            $self
                .closest('div.field').css('overflow','visible')
                .end()
                .after(list);
            var outerElm = document.getElementById(suggestionId);
            var innerElm = document.getElementById(completionId);
            $self
                .blur(function(){
                    outerElm.style.display = 'none';
                })
                .keydown(function(e){
                    if (e.which == 13) { // Enter
                        var $highlight = $(innerElm).children('.complete-highlight');
                        if ($highlight.size() > 0) {
                            var v = $self.val().replace(/(, )?([^,]*)$/,'$1');
                            $self.val(v + $highlight.text() + ', ');
                        }
                        outerElm.style.display = 'none';
                        return false;
                    }
                })
                .keyup(function(e){
                    switch (e.which) {
                        case 40: // down
                            var $highlight = $(innerElm).children('.complete-highlight');
                            if ($highlight[0].nextSibling) {
                                $highlight.removeClass('complete-highlight').addClass('complete-none').next().addClass('complete-highlight');
                            }
                            return false;
                        case 38: // up
                            var $highlight = $(innerElm).children('.complete-highlight');
                            if ($highlight[0].previousSibling) {
                                $highlight.removeClass('complete-highlight').addClass('complete-none').prev().addClass('complete-highlight');
                            }
                            return false;
                        default:
                            var contain = [];
                            var first = true;
                            var v = $(this).val().match(/(?:, )?([^,]*)$/)[1];
                            if (v !== '') {
                                for (var i = 0, n = op.list.length; i < n; i++) {
                                    if (op.list[i].indexOf(v) >= 0) {
                                        if (first) {
                                            contain.push('<div class="complete-highlight">' + op.list[i] + '</div>');
                                            first = false;
                                            outerElm.style.display = 'block';
                                        } else {
                                            contain.push('<div class="complete-none">' + op.list[i] + '</div>');
                                        }
                                    }
                                }
                                innerElm.innerHTML = contain.join('');
                                if (contain.length == 0) {
                                    outerElm.style.display = 'none';
                                }
                            } else {
                                outerElm.style.display = 'none';
                            }
                            break;
                    } // switch
                }); // keyup
                return false;
            }); // each
    };
    $.fn.MTAppSuggest.defaults = {
        list: []
    };
    // end - $(foo).MTAppSuggest();


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
    //
    //  Description:
    //    主にブログ記事・ウェブページの編集画面の各フィールドをカスタマイズする。
    //
    //  Usage:
    //    $.MTAppCustomize(options);
    //
    //  Options:
    //    basename: {String} 各フォーム要素のベースネーム
    //    label: {String} 変更後のラベル名
    //    add_class: {String} 追加するクラス名
    //    hint: {String} ヒントに表示させたいメッセージ
    //    show_field: {String}  強制表示('show')、強制表示('hide')(注:basename が body か more の場合はタブの表示制御）
    //    show_parent: {String}  強制表示('show')、強制非表示('hide') (注:show_parent は、basename が body か more のみ）
    //    custom: {Boolean} カスタムフィールドの場合 true
    //    widget: {Boolean} ウィジェットの場合 true
    //    edit: {Boolean} 非編集モードにする場合 true
    // ---------------------------------------------------------------------
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
                $label = $field.find('h2 span');
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
        if (op.add_class != '') {
            $field.addClass(op.add_class);
        }

        // ラベルの変更
        if (opL != '') {
            $label.text(opL);
            if (opB == 'title') {
                $field.find('div.field-header').show().end()
                      .find('#title').attr('placeholder', opL);
            }
        }

        // フィールドの表示・非表示
        if (opS == 'show') {
            $field.removeClass('hidden');
        } else if (opS == 'hide' && opB != 'body' && opB != 'more') {
            $field.addClass('hidden');
        } else if (opS == 'hide' && (opB == 'body' || opB == 'more')) {
            $label.closest('div.tab').addClass('hidden');
        }

        // テキストフィールドの表示・非表示
        if ((opB == 'body' || opB == 'more') && op.show_parent == 'hide') {
            $field.css({
                position: 'absolute',
                top: '-9999px',
                left: '-9999px',
                width: '1px',
                height: '1px'
            });
        } else if ((opB == 'body' || opB == 'more') && op.show_parent == 'show') {
            $field.removeAttr('style');
        }

        // ヒントの表示
        if (opH) $field.MTAppshowHint({ text: opH });

        // 非編集モード
        if (opE && $field.find('div.field-content').length) {
            $label.after($editImg);
            $field.find('div.field-content').hide();
        }
        return $field;
    };
    $.MTAppCustomize.defaults = {
        basename: '',
        label: '',
        addclass: '',
        hint: '',
        show_field: '',
        show_parent: '',
        custom: false,
        widget: false,
        edit: false
    };
    // end - $.MTAppCustomize()


    // -------------------------------------------------
    //  $.MTAppFieldSort();
    //
    //  Description:
    //    フィールドを並べ替える。カスタムフィールドは対応、ウィジェットは未対応。
    //
    //  Usage:
    //    $.MTAppFieldSort(options);
    //
    //  Options:
    //    sort: {String} 上からの並び順通りにbasenameをカンマ区切りで並べる。カスタムフィールドはbasenameの先頭にはc:を付与。
    //    insert_id: {String} フィールドを包含する要素のid属性の値
    // -------------------------------------------------
    $.MTAppFieldSort = function(options){
        var op = $.extend({}, $.MTAppFieldSort.defaults, options);

        var field = op.sort.split(',').reverse();
        var l = field.length;
        if (l == 0) return;
        var containerId = (op.insert_id !== 'sortable') ? op.insert_id: op.insertID;
        var container = document.getElementById(containerId);
        for (var i = 0; i < l; i++) {
            var id = $.trim(field[i]).replace(/^c:/,'customfield_') + '-field';
            if (document.getElementById(id)) {
                var elm = document.getElementById(id);
                container.insertBefore(elm, container.firstChild);
                $(elm).removeClass('hidden').show();
            } else if (window.console) {
                console.log('#' + id + ' が見つかりません');
            }
        }
    };
    $.MTAppFieldSort.defaults = {
        sort: 'title,text,tags,excerpt,keywords',
        insert_id: 'sortable',
        insertID: 'sortable' // 後方互換（非推奨）
    };
    // end - $.MTAppFieldSort


    // -------------------------------------------------
    //  $.MTAppTabs();
    //
    //  Description:
    //    ブログ記事編集画面のフィールドをタブで表示する。
    //
    //  Usage:
    //    $.MTAppTabs(options);
    //
    //  Options:
    //    basename: {Object} タブにするフィールドを指定する。書式=>{'basename':'タブ名'}
    //              カスタムフィールドの場合は「cf_basename」のように接頭辞「 cf_ 」を付ける。
    //              ex. {'title':'タイトル','keywords':'キーワード','cf_price','価格'}
    //    pointer: {String} タブを挿入する起点となるノードのセレクタ。ex. #title-field
    //    pointer_basename: {String} タブを挿入する起点となるノードのbasename。ex. title
    //    insert: {String} 起点となるノードの前に挿入（before）するか後ろに挿入（after）するか。
    // -------------------------------------------------
    $.MTAppTabs = function(options){
        var op = $.extend({}, $.MTAppTabs.defaults, options);

        if (op.basename == null) return;
        var selector;
        if (op.pointer != '') {
            selector = op.pointer;
        } else if (op.pointer_basename != '') {
            selector = '#' + getFieldID(op.pointer_basename);
        } else {
            return;
        }
        var div = [
            '<div class="mtapp-tabs-container">',
                '<ul class="mtapp-tabs-navi"></ul>',
            '</div>'
        ];
        var container = $(selector)[op.insert](div.join('')).next('.mtapp-tabs-container');
        var ids = [];
        var li = [];
        for (var basename in op.basename) {
            var id = '#' + getFieldID(basename);
            ids.push(id);
            li.push('<li><a href="' + id + '">' + op.basename[basename] + '</a></li>');
        }
        var $elms = $(ids.join(','));
        $elms.removeClass('sort-enabled').find('div.field-header').addClass('hidden');
        container
            .append($elms)
            .find('.mtapp-tabs-navi').html(li.join(''));
        container.tabs();
    };
    $.MTAppTabs.defaults = {
        basename: null,
        pointer: '', // #title-field などのセレクタ
        pointer_basename: '', // title などのベースネーム
        insert: 'after', // before or after
    };
    // end - $.MTAppTabs


    // -------------------------------------------------
    //  $.MTAppMsg();
    //
    //  Description:
    //    画面上部にMTデフォルトの形式のメッセージを表示する。
    //
    //  Usage:
    //    $.MTAppMsg(options);
    //
    //  Options:
    //    msg: {String} 表示するメッセージ
    //    type: {String} 'info' or 'success' or 'error'
    //    parent: {Boolean} p.msg-text で包含しない場合(true)
    //    timeout: {Number} 一定時間経過後に非表示にする場合にミリ秒を指定。0は非表示にしない。
    // ---------------------------------------------------------------------
    $.MTAppMsg = function(options){
        var op = $.extend({}, $.MTAppMsg.defaults, options);

        var myMsg = [
            '<div class="msg msg-' + op.type + '">',
                '<p class="msg-text">',
                    op.msg,
                '</p>',
                '<span class="mt-close-msg close-link clickable icon-remove icon16 action-icon">閉じる</span>',
            '</div>'
        ];

        if (op.parent) {
            myMsg[1] = '';
            myMsg[3] = '';
        }

        if (op.type == 'error') {
            myMsg[4] = '';
        }

        var msgBlock = $('#msg-block');

        if (msgBlock.length == 0) {
            $('#content-header').append('<div id="msg-block"></div>');
        }

        var $myMsg = $(myMsg.join(''));

        $('#msg-block').append($myMsg);

        if (op.timeout > 0) {
            setTimeout(function(){
                $myMsg.fadeOut();
            }, op.timeout);
        }
    };
    $.MTAppMsg.defaults = {
        msg: '',
        type: '',
        parent: false,
        timeout: 0
    };
    // end - $.MTAppMsg();


    // ---------------------------------------------------------------------
    //  $.MTAppDialogMsg();
    //
    //  Description:
    //    ダイアログメッセージを表示する。（jquery.ui）
    //
    //  Usage:
    //    $.MTAppDialogMsg(options);
    //
    //  Options:
    //    title: {String} ダイアログのタイトル
    //    content: {String} ダイアログのコンテンツ
    //    hide_effect: {String} 閉じる時のエフェクト 'explode', 'slide', 'drop'など
    // ---------------------------------------------------------------------

    $.MTAppDialogMsg = function(options){
        var op = $.extend({}, $.MTAppDialogMsg.defaults, options);

        $('#mtapp-dialog-msg')
            .html(op.content)
            .dialog({
                autoOpen: false,
                modal: true,
                title: op.title,
                hide: op.hide_effect
            });
        $('#mtapp-dialog-msg').dialog('open');
    };
    $.MTAppDialogMsg.defaults = {
        title: 'メッセージ',
        content: 'Movable Typeへようこそ！',
        hide_effect: ''
    };
    // end - $.MTAppDialogMsg();


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
    //  $.MTAppInCats();
    //
    //  Description:
    //    カテゴリごとに条件分岐させる。
    //
    //  Usage:
    //    $.MTAppInCats(options);
    //
    //  Options:
    //    categories: {String} カテゴリIDを指定。複数の場合はカンマ区切り
    //    code: {Function} 実行したいスクリプトを無名関数内に記述
    // -------------------------------------------------
    $.MTAppInCats = function(options){
        var op = $.extend({}, $.MTAppInCats.defaults, options);

        // オプションで指定したカテゴリIDを取得
        var cats = [];
        cats = op.categories.split(',');
        for (var i = 0, n = cats.length; i < n; i++) {
            cats[i] = Number($.trim(cats[i]));
        }

        var selected_category_length = mtappVars.selected_category.length;

        if (selected_category_length > 0) {
            // 選択されているカテゴリとオプションで指定したカテゴリが一致したらメソッドを実行
            for (var i = 0; i < selected_category_length; i++) {
                if ($.inArray(mtappVars.selected_category[i], cats) >= 0) {
                    op.code();
                    return mtappVars.selected_category[i];
                }
            }
        }

        $('#category-selector-list').find('input:checkbox').live('click', function(){
            var cat_id = Number($(this).attr('name').replace(/add_category_id_/,''));
            if ($(this).is(':checked') && $.inArray(cat_id, cats) >= 0) {
                op.code();
                return cat_id;
            } else {
                // window.location.reload();
            }
        });
    };
    $.MTAppInCats.defaults = {
        categories: '',
        code: function(){ return; }
    };
    // end - $.MTAppInCats();


    // -------------------------------------------------
    //  $.MTAppFullscreen()
    // -------------------------------------------------
    $.MTAppFullscreen = function(){
        // Get the action bar buttons
        var actionBtns = [];
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
    //  $.MTApp1clickRebuild();
    //
    //  Description:
    //    テンプレートの管理画面でワンクリックで再構築できるようになる。
    //
    //  Usage:
    //    $.MTApp1clickRebuild();
    // -------------------------------------------------
    $.MTApp1clickRebuild = function(options){

        // ウェブサイトテンプレートの管理以外なら何もしない
        if (mtappVars.screen_id != 'list-template') return;

        // 「すべて再構築」ボタンとテーブルに再構築アイコンを設置
        $("#index-listing, #archive-listing").each(function(){
            var self = $(this),
                type = {
                    "name": self.find('div.listing-header h2').text(),
                    "id"  : self.attr('id')
                },
                // 公開ボタンを変数に入れておく
                publish = self.find('div.button-actions:eq(0) button:eq(0)');

            // インデックス、アーカイブテンプレートのすべて再構築ボタンを設置
            self
                .find('div.button-actions')
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
                        .insertListingColum('after', 'th', '再構築', 'rebuild')
                    .end()
                    .find('tbody')
                        .find('td.cb')
                            .insertListingColum('after', 'td', '<img class="mtapp-rebuild-icon" src="' + mtappVars.static_plugin_path + 'images/rebuild.png" width="13" height="13" />', 'rebuild')
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
    //
    //  Description:
    //    ページの情報や各種一覧でIDを表示する。
    //
    //  Usage:
    //    $.MTAppDebug();
    //
    //  Options:
    //    id: {Boolean} IDをテーブルに表示する場合はtrue
    // -------------------------------------------------
    $.MTAppDebug = function(options){
        var op = $.extend({}, $.MTAppDebug.defaults, options);

        // Show the page information
        var body = $('body'),
            bodyID = body.attr('id'),
            bodyID = (bodyID != '') ? '#' + bodyID: '',
            bodyClass = body.attr('class').replace(/ +/g,'.');

        var mtappVarsStr = [];
        for (var key in mtappVars) {
            var value = '';
            if (typeof mtappVars[key] == 'string') {
                value = '"' + mtappVars[key] + '"';
            } else if ($.isArray(mtappVars[key])) {
                value = (typeof mtappVars[key][0] == 'string') ?
                        '["'+ mtappVars[key].join('", "') +'"]':
                        '['+ mtappVars[key].join(', ') +']';
            } else {
                value = mtappVars[key];
            }
            mtappVarsStr.push('&nbsp;&nbsp;&nbsp;&nbsp;' + key + ': ' + value);
        }

        var pageInfo = [
            '<p id="mtapp-debug-tools" class="msg-text">',
                '<a id="mtapp-debug-pageinfo-title" href="javascript:void(0);" class="button">このページの情報</a>',
                '<a href="javascript:void(0);" class="button" id="mtapp-show-basename">ベースネームを表示（メインカラム）</a>',
            '</p>',
            '<p id="mtapp-debug-pageinfo-content" class="msg-text">',
                'body'+ bodyID + '.' + bodyClass + '<br />',
                'var mtappVars = { <br />' + mtappVarsStr.join(',<br />') + '<br />};',
            '</p>'
        ];
        $.MTAppMsg({
            msg: pageInfo.join(''),
            type: 'info',
            parent: true
        });
        $('#mtapp-debug-pageinfo-title').click(function(){
            $('#mtapp-debug-pageinfo-content').slideToggle();
        });
        $('#mtapp-show-basename').click(function(){
            var fieldSort = [];
            $('#main-content')
                .find('div.field:visible').each(function(){
                    var basename = $(this).attr('id').replace(/-field$/,'');
                    fieldSort.push(basename);
                    $(this).before('<input type="text" value="' + basename + '" />');
                })
                .end()
                .prepend($.MTAppMakeField({
                    label: '現在の並び順（MTAppFieldSort用）<a href="#" id="mtapp-customfield-c" class="button">「c:」に置換</a>',
                    content: '<textarea id="mtapp-fieldsort" class="text high">' + fieldSort.join(',') + '</textarea>'
                }))
                .find('#mtapp-customfield-c').click(function(){
                    var v = $('#mtapp-fieldsort').val().replace(/customfield_/g,'c:');
                    $('#mtapp-fieldsort').val(v);
                    return false;
                });
        });

        // [ブログ記事の管理]
        if (mtappVars.screen_id == 'list-entry') {
            //  下書きの背景を変更
            $(window).bind('listReady', function(){
                $('#entry-table').find('span.draft').closest('tr').css({'background':'#FFCBD0'});
            });
        }

        // [カテゴリの管理] [フォルダの管理]
        if (mtappVars.template_filename == 'list_category') {
            // IDを表示
            $(window).bind('listReady', function(){
                $('#root').find('div').each(function(){
                    var id = $(this).attr('id');
                    $(this).MTAppshowHint({text: 'ID: ' + id});
                });
            });
        }

        // [テンプレートの管理] [ウィジェットの管理]
        if (op.id && mtappVars.template_filename == 'list_template' || mtappVars.template_filename == 'list_widget') {
            $('table.listing-table')
                .find('th.cb').each(function(){
                    $(this).insertListingColum('after', 'th', 'ID', 'id num');
                }).end()
                .find('td.cb').each(function(){
                    var id = $(this).find('input:checkbox').val();
                    $(this).insertListingColum('after', 'td', id, 'id num');
                });
        }

        // list_common.tmplのリスト画面で表示オプションにIDがないページ
        if (op.id && mtappVars.template_filename == 'list_common' && !$('#disp_cols label:contains("ID")').length) {
            // IDを表示
            $(window).bind('listReady', function(){
                $('table.listing-table').find('tr').each(function(){
                    var id = $(this).attr('id');
                    $(this)
                        .find('th.cb').insertListingColum('after', 'th', 'ID', 'id num').end()
                        .find('td.cb').insertListingColum('after', 'td', id, 'id num');
                });
            });
        }

    };
    $.MTAppDebug.defaults = {
        id: false
    };
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

    // ---------------------------------------------------------------------
    //  $.fn.MTAppFancyListing();
    //
    //  Description:
    //    iframeで指定したファイルを読み込みます。
    //    jQueryプラグインのFancybox(http://fancybox.net/)が必要です。
    //    またあらかじめ読み込む一覧をインデックステンプレートで作成しておく必要があります。
    //
    //  Usage:
    //    $('input:text').MTAppFancyListing(options);
    //
    //  Options:
    //    url: {String} iframeに読み込むサイト内のページ
    //    text: {String} ボタンに表示するテキスト
    //    type: {String} button（ボタンを表示） or focus（input:textをフォーカスで起動） or input（入力可能＋ボタン）
    //    setting: {Object} fancyboxに渡すオブジェクト
    // ---------------------------------------------------------------------

    $.fn.MTAppFancyListing = function(options){
        var op = $.extend({}, $.fn.MTAppFancyListing.defaults, options);
        var path =  mtappVars.static_plugin_path;
        var head = [
            '<link rel="stylesheet" href="' + path + 'lib/fancybox/jquery.fancybox-1.3.4.css" />',
            '<script type="text/javascript" src="' + path + 'lib/fancybox/jquery.fancybox-1.3.4.pack.js"></script>'
        ];
        if (typeof this.fancybox != 'function') {
            $('head').append(head.join(''));
        }
        return this.each(function(){
            var $self = $(this);
            var selfVal = $self.val() ? $self.val(): '';
            var hidden = !selfVal ? ' hidden': '';
            $self.after('<a class="button" href="' + op.url + '">' + op.text + '</a>')
                .after('<span style="margin-right:5px;" class="' + hidden + '">' + selfVal + '</span>');
            var $fancyBtn = $self.next().next();
            var $span = $self.next();
            switch (op.type) {
                case 'input':
                    $span.hide();
                    break;
                case 'button':
                    $self.hide();
                    break;
                case 'focus':
                    $fancyBtn.hide();
                    $span.hide();
                    $self.focus(function(){
                        $fancyBtn.click();
                    });
                    break;
            }
            if (op.setting === null) {
                $fancyBtn.fancybox({
                    'width'         : '70%',
                    'height'        : '90%',
                    'autoScale'     : false,
                    'transitionIn'  : 'none',
                    'transitionOut' : 'none',
                    'type'          : 'iframe',
                    'onCleanup'     : function(){
                        var $iframe = $('#fancybox-frame').contents();
                        var cancel_check = $iframe.find('#cancel_check').is(':checked');
                        if (cancel_check) {
                            return true;
                        } else {
                            var $checked = $iframe.find('input:radio:checked');
                            if ($checked.size()) {
                                var v = $checked.val();
                                $self.focus().val(v).next().removeClass('hidden').text(v);
                            } else {
                                return true;
                            }
                        }
                        return true;
                    }
                });
            } else {
                $fancyBtn.fancybox(op.setting);
            }
        });
    };
    $.fn.MTAppFancyListing.defaults = {
        url: '/',
        text: '一覧から選択',
        type: 'button', // button or focus or input
        setting: null
    };
    // end - $.fn.MTAppFancyListing()

    // ---------------------------------------------------------------------
    //  $.fn.MTAppCheckCategoryCount();
    //
    //  Description:
    //
    //    必要な数のカテゴリが選択されているかチェックする。
    //    チェックされていなければ false を返す。
    //
    //  Usage:
    //    $(selector).MTAppCheckCategoryCount(options);
    //
    //  Options:
    //    required_count: {Number} 必須選択の数(required_idsが優先される)
    //    required_ids: {String} 必須カテゴリIDをカンマ区切り
    //    title: {String} ダイアログボックスのタイトル
    //    content: {String} ダイアログボックスの本文
    // ---------------------------------------------------------------------

    $.fn.MTAppCheckCategoryCount = function(options){
        var op = $.extend({}, $.fn.MTAppCheckCategoryCount.defaults, options);
        return this.click(function(){

            var cat_selector = $('#category-selector'),
                cat_selector_list = $('#category-selector-list'),
                match_count = 0;
            if (op.required_ids != '') {
                var ids = ',' + op.required_ids + ',',
                    ids_array = op.required_ids.split(','),
                    ids_count = ids_array.length;
                if (cat_selector.is(':visible')) {
                    cat_selector_list.find('input:checkbox:checked').each(function(){
                        var name = $(this).attr('name').replace(/add_category_id_/,''),
                            reg = new RegExp(name, 'g');
                        if (reg.exec(ids)) {
                            match_count++;
                        }
                    });
                } else {
                    for (var i = 0, n = mtappVars.selected_category.length; i < n; i++) {
                        var reg = new RegExp(mtappVars.selected_category[i], 'g');
                        if (reg.exec(ids)) {
                            match_count++;
                        }
                    }
                }
                if (ids_count == match_count) {
                    return true;
                } else {
                    $.MTAppDialogMsg({
                        title: op.title,
                        content: op.content
                    });
                    return false;
                }
            } else {
                var checked_count = (cat_selector.is(':visible')) ?
                                    cat_selector_list.find('input:checkbox:checked').length:
                                    mtappVars.selected_category.length;
                if (op.required_count <= checked_count) {
                    return true;
                } else {
                    $.MTAppDialogMsg({
                        title: op.title,
                        content: op.content
                    });
                    return false;
                }
            }
        });
    };
    $.fn.MTAppCheckCategoryCount.defaults = {
        required_count: 0,
        required_ids: '',
        title: 'エラー',
        content: '必要な数のカテゴリが選択されていません。'
    };
    // end - $.fn.MTAppCheckCategoryCount()


    // -------------------------------------------------
    //  $(foo).MTAppInlineEdit();
    //
    //  Description:
    //    input:text, textareaをインラインエディットモードにする。
    //
    //  Usage:
    //    $(foo).MTAppInlineEdit(options);
    //
    //  Options:
    //    edit: {String} インラインエディットモードを切り替えるボタンのテキスト
    //    always: {Boolean} 常にインラインエディットモードにする場合(true)
    // -------------------------------------------------
    $.fn.MTAppInlineEdit = function(options) {
        var op = $.extend({}, $.fn.MTAppInlineEdit.defaults, options);
        return this.each(function(){
            var self = $(this),
                val = self.val(),
                $btn = $('<button class="mt-edit-field-button button">' + op.edit + '</button>').click(function(){
                    $(this).hide()
                        .prev().show()
                            .prev().hide();
                    return false;
                });
            if (op.always) {
                val = (val != '') ? val: '...';
                self.before('<span>' + val + '</span>')
                    .after($btn)
                    .hide();
            } else if (val != '') {
                self.before('<span>' + val + '</span>')
                    .after($btn)
                    .hide();
            }
        });
    };
    $.fn.MTAppInlineEdit.defaults = {
        edit: '編集',
        always: false
    };
    // end - $(foo).MTAppInlineEdit();


    // -------------------------------------------------
    //  $.MTAppEnableUploadify();
    //
    //  Description:
    //    ブログ記事編集画面の複数ファイルアップロード機能（ベータ版）を有効にする。
    //
    //  Usage:
    //    $.MTAppEnableUploadify(options);
    //
    //  Options:
    //    enable: {Boolean} 有効にする（true）、無効にする（false）
    // -------------------------------------------------
    $.MTAppEnableUploadify = function(options){
        var op = $.extend({}, $.MTAppEnableUploadify.defaults, options);

        if (mtappVars.screen_id != 'list-plugins') return;
        $('#uploadify-container').show()
    };
    $.MTAppEnableUploadify.defaults = {
        enable: false
    };
    // end - $.MTAppEnableUploadify();


    // -------------------------------------------------
    //  $(foo).MTAppTabSpace();
    //
    //  Description:
    //    textareaでタブキーが押されたときに、スペースなどの文字列を挿入する
    //
    //  Usage:
    //    $(foo).MTAppTabSpace(options);
    //
    //  Options:
    //    text: {String} タブキーが押されたときに入力される文字列。初期値は半角スペース4つ。
    // -------------------------------------------------
    $.fn.MTAppTabSpace = function(options) {
        var op = $.extend({}, $.fn.MTAppTabSpace.defaults, options);
        return this.each(function(){
            $(this).keydown(function(e){
                var keycode = e.which || e.keyCode;
                if (keycode == 9) {
                    $(this).insertAtCaret(op.text);
                    return false;
                }
            });
        });
    };
    $.fn.MTAppTabSpace.defaults = {
        text: '    '
    };
    // end - $(foo).MTAppTabSpace();


    // -------------------------------------------------
    //  $.MTAppRemoveVal();
    //
    //  Description:
    //    ブログ記事・ウェブページ編集画面のメインカラムのinput:text, textareaにクリアボタンを付ける。
    //
    //  Usage:
    //    $.MTAppRemoveVal();
    // -------------------------------------------------
    $.MTAppRemoveVal = function(options) {
        if (mtappVars.screen_id == 'edit-entry' || mtappVars.screen_id == 'edit-page') {
            $('#sortable div.field-content').find('input:text,textarea').filter(':visible').each(function(){
                var self = $(this),
                    self_width = self.outerWidth(),
                    self_height = self.outerHeight(),
                    pos_left = self_width - 18,
                    pos_top = (self_height - 16) / 2 + 16;
                self.after('<span class="remove-val" style="left:' + pos_left + 'px; top: -' + pos_top + 'px;">クリア</span>')
                    .next('span.remove-val')
                        .click(function(){
                            self.val('');
                        });
            });
        }
    };
    // end - $.MTAppRemoveVal();

    // -------------------------------------------------
    //  $(foo).MTAppRemoveVal();
    //
    //  Description:
    //    指定したinput:textにクリアボタンを付ける。
    //
    //  Usage:
    //    $(foo).MTAppRemoveVal();
    // -------------------------------------------------
    $.fn.MTAppRemoveVal = function(options) {
        return this.each(function(){
            var self = $(this),
                self_width = self.outerWidth(),
                self_height = self.outerHeight(),
                pos_left = self_width - 18,
                pos_top = (self_height - 16) / 2 + 16;
            self.after('<span class="remove-val" style="left:' + pos_left + 'px; top: -' + pos_top + 'px;">クリア</span>')
                .next('span.remove-val')
                    .click(function(){
                        self.val('');
                    });
        });
    };
    // end - $(foo).MTAppRemoveVal();


    // -------------------------------------------------
    //  $(foo).MTAppNumChecker();
    //
    //  Description:
    //    全角数字を半角に変換、半角数字以外の文字を削除、最小値・最大値の設定など
    //
    //  Usage:
    //    $(foo).MTAppNumChecker(options);
    //
    //  Options:
    //    min: {Number} 最小値
    //    max: {Number} 最大値
    //    min_msg: {String} 最小値よりも小さかったときのアラートメッセージ
    //    max_msg: {String} 最大値よりも大きかったときのアラートメッセージ
    //    allow: {Reg} 置換しない文字を正規表現で指定
    //    zero_pad: {Boolean} 先頭の0を残す場合はtrue
    //    target: {String} numberを指定すると数字の置換のみの動作となる
    //    trim: {Boolean} 前後のスペースをトリムしないときはfalse
    //    hyphen: {Boolean} ハイフンを常に半角にする場合はtrue
    // -------------------------------------------------
    $.fn.MTAppNumChecker = function(options) {
        var op = $.extend({}, $.fn.MTAppNumChecker.defaults, options);
        return this.each(function(){
            $(this)
                .after('<span class="mun_msg" style="display:none;color:red;font-weight:bold;"></span>')
                .keyup(function(e){
                    if (e.which == 37 || e.which == 39) return;
                    var self = $(this);
                    var text = self.val();
                    if (op.trim) {
                        text = $.trim(text);
                    }
                    text = text
                        .replace(/０/g, '0')
                        .replace(/１/g, '1')
                        .replace(/２/g, '2')
                        .replace(/３/g, '3')
                        .replace(/４/g, '4')
                        .replace(/５/g, '5')
                        .replace(/６/g, '6')
                        .replace(/７/g, '7')
                        .replace(/８/g, '8')
                        .replace(/９/g, '9');
                    if (op.hyphen) {
                        text = text.replace(/ー|—/g,'-');
                    }
                    if (op.target === 'number' && op.zero_pad) {
                        self.val(text);
                    } else if (op.target === 'number') {
                        self.val(text.replace(/^0+/g, ''));
                    } else if (op.zero_pad) {
                        var reg = RegExp('[^0-9' + op.allow + ']', 'g');
                        self.val(text.replace(reg, ''));
                    } else {
                        var reg = RegExp('^0|[^0-9' + op.allow + ']', 'g');
                        self.val(text.replace(reg, ''));
                    }
                    var span = $(this).next('span.mun_msg');
                    var num = Number(text.replace(/^0|[^0-9]/g, ''));
                    if (num < op.min) {
                        span.text(op.min_msg).show();
                    } else if (num > op.max) {
                        span.text(op.max_msg).show();
                    } else {
                        span.text('').hide();
                    }
                })
        });
    };
    $.fn.MTAppNumChecker.defaults = {
        min: 0,
        max: 10000000000000000000,
        min_msg: '値が小さすぎます。',
        max_msg: '値が大きすぎます。',
        allow: '',
        zero_pad: false,
        target: '',
        trim: true,
        hyphen: false
    };
    // end - $(foo).MTAppNumChecker();


    // -------------------------------------------------
    //  $(foo).MTAppTaxAssist();
    //
    //  Description:
    //    入力された数値から税込み価格、税抜き価格を算出する
    //
    //  Usage:
    //    $(foo).MTAppTaxAssist(options);
    //
    //  Options:
    //    rate: {Number} 消費税率
    //    fraction: {String} 端数処理 => floor（切り捨て）、ceil（切り上げ）、round（四捨五入）
    // -------------------------------------------------
    $.fn.MTAppTaxAssist = function(options) {
        var op = $.extend({}, $.fn.MTAppTaxAssist.defaults, options);
        var tax_button = [
            '<span class="taxes_included button" title="金額から税込み価格を計算する">税込み</span>',
            '<span class="after_taxes button" title="金額から税抜き価格を計算する">税抜き</span>'
        ];
        return this.each(function(){
            var self = $(this);
            $(this)
                .after(tax_button.join(''))
                .next()
                    .click(function(){
                        $(this).addClass('clicked');
                        var val = Number(self.val()) * 1.05;
                        self.val(fraction(val));
                    })
                .next()
                    .click(function(){
                        $(this).addClass('clicked');
                        var val = Number(self.val()) / 1.05;
                        self.val(fraction(val));
                    });
        });
        function fraction(num){
            if (op.fraction == 'floor') {
                return Math.floor(num);
            } else if (op.fraction == 'ceil') {
                return Math.ceil(num);
            } else if (op.fraction == 'round') {
                return Math.round(num);
            } else {
                return num;
            }
        }
    };
    $.fn.MTAppTaxAssist.defaults = {
        rate: 0.05,
        fraction: 'floor' // floor（切り捨て）、ceil（切り上げ）、round（四捨五入）
    };
    // end - $(foo).MTAppTaxAssist();


    // -------------------------------------------------
    //  $('input:text').MTAppDateAssist();
    //
    //  Description:
    //    今日、明日、明後日をワンクリックで入力する
    //
    //  Usage:
    //    $('input:text').MTAppDateAssist();
    //
    //  Options:
    //    gengo: {Boolean} 元号表記にする（ex. 平成24年03月24日）
    // -------------------------------------------------
    $.fn.MTAppDateAssist = function(options) {
        var op = $.extend({}, $.fn.MTAppDateAssist.defaults, options);
        var d = new Date(),
            ms = d.getTime();

        var buttons = [
            '<span class="day_0 button">今日</span>',
            '<span class="day_1 button">明日</span>',
            '<span class="dai_2 button">明後日</span>'
        ];

        return this.each(function(){
            var self = $(this);
            self.after(buttons.join(''))
                .next()
                    .click(function(){
                        self.val(getDateItem(ms, op.gengo));
                    })
                .next()
                    .click(function(){
                        self.val(getDateItem(ms + 86400000, op.gengo));
                    })
                .next()
                    .click(function(){
                        self.val(getDateItem(ms + 172800000, op.gengo));
                    });
        });
        function getDateItem(ms, gengo){
            var d = new Date();
            d.setTime(ms);
            if (gengo) {
                var y = d.getFullYear() - 1988;
                return '平成' + y + '年' + $.digit(d.getMonth() + 1) + '月' + $.digit(d.getDate()) + '日';
            } else {
                return d.getFullYear() + '-' + $.digit(d.getMonth() + 1) + '-' + $.digit(d.getDate());
            }
        }
    };
    $.fn.MTAppDateAssist.defaults = {
        gengo: false
    };
    // end - $(foo).MTAppDateAssist();


    // -------------------------------------------------
    //  $.MTAppSortableBatchEdit();
    //
    //  Description:
    //    ブログ記事・ウェブページ一括編集画面をソート可能にして、日付を自動変更する
    //
    //  Usage:
    //    $.MTAppSortableBatchEdit(options);
    //
    //  Options:
    //    target: 自動変更する日付の種類を指定。公開日'created_on'または更新日'modified_on'
    //    date_change: 日付の自動変更を無効にする（並び替えのみ有効にする）
    // -------------------------------------------------
    $.MTAppSortableBatchEdit = function(options){
        var op = $.extend({}, $.MTAppSortableBatchEdit.defaults, options);

        if (mtappVars.screen_id.indexOf('batch-edit-') < 0) return;
        $('#' + mtappVars.screen_id.replace(/batch-edit-/,'') + '-listing-table')
            .find('tr')
                .css({'cursor':'move'})
            .end()
            .find('tbody')
                .sortable({
                    items: 'tr',
                    cursor: 'move',
                    placeholder: 'mtapp-state-highlight',
                    start: function(ev, ui){
                        $(ui.placeholder).height($(ui.item).height());
                    },
                    sort: function(ev, ui){
                        ui.item.css({
                            'background-color': '#F6F1E1',
                            'border': '1px solid #CACACA'
                        });
                    },
                    stop: function(ev, ui){
                        ui.item.css({
                            'background-color': 'inherit',
                            'border': 'none'
                        });
                    },
                    update: function(ev, ui){
                        if (! op.date_change) return;
                        if (op.target == 'created_on' || op.target == 'modified_on') {
                            // 公開日か更新日か
                            var n = op.target == 'created_on' ? 0 : 1;
                            var input = ui.item.find('td.datetime:eq(' + n + ') input:text');
                            var curr_dateitem = input.val(),
                                next_dateitem = ui.item.next().find('td.datetime:eq(' + n + ') input:text').val(),
                                prev_dateitem = ui.item.prev().find('td.datetime:eq(' + n + ') input:text').val();
                            var curr_date = getDateObj(curr_dateitem),
                                next_date = getDateObj(next_dateitem),
                                prev_date = getDateObj(prev_dateitem);
                            var curr_getTime = curr_date ? curr_date.getTime() : 0,
                                next_getTime = next_date ? next_date.getTime() : 0,
                                prev_getTime = prev_date ? prev_date.getTime() : 0;

                            var new_getTime = 0;
                            if (next_getTime && prev_getTime) {
                                new_getTime = Math.floor( (prev_getTime + next_getTime) / 2 );
                            } else if (next_getTime == 0 || prev_getTime == 0) {
                                new_getTime = (next_getTime + prev_getTime) * 2 - curr_getTime;
                            }

                            curr_date.setTime(new_getTime);
                            var ymd = [
                                    curr_date.getFullYear(),
                                    $.digit(curr_date.getMonth() + 1),
                                    $.digit(curr_date.getDate())
                                ],
                                hms = [
                                    $.digit(curr_date.getHours()),
                                    $.digit(curr_date.getMinutes()),
                                    $.digit(curr_date.getSeconds())
                                ];
                            input.val(ymd.join('-') + ' ' + hms.join(':'));
                        }
                    }
                });

        function getDateObj(dateitem){
            if (! dateitem) return null;
            var _d = dateitem.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
            var d = new Date();
            d.setFullYear(_d[1]);
            d.setMonth(_d[2] - 1);
            d.setDate(_d[3]);
            d.setHours(_d[4]);
            d.setMinutes(_d[5]);
            d.setSeconds(_d[6]);
            return d;
        }
    };
    $.MTAppSortableBatchEdit.defaults = {
        target: 'created_on', // created_on, modified_on
        date_change: true
    };
    // end - $.MTAppSortableBatchEdit();


    // -------------------------------------------------
    //  $.MTAppBatchEditCategory();
    //
    //  Description:
    //    ブログ記事・ウェブページ一括編集画面をソート可能にして、日付を自動変更する
    //
    //  Usage:
    //    $.MTAppBatchEditCategory();
    //
    //  Options:
    //    text: {String} ボタンに表示するテキスト
    // -------------------------------------------------
    $.MTAppBatchEditCategory = function(options){
        var op = $.extend({}, $.MTAppBatchEditCategory.defaults, options);

        if (mtappVars.screen_id.indexOf('batch-edit-') < 0) return;
        var text = (mtappVars.screen_id == 'batch-edit-entry') ? 'カテゴリ' + op.text: 'フォルダ' + op.text;
        var $select = $('td.category').find('select');
        var $select_clone = $select.eq(0).clone().attr('id', 'mtapp_clone_select').css('margin-right','5px');
        var $btn = $('<button class="button" title="' + text + '">' + text + '</button>').click(function(){
            var value = $('#mtapp_clone_select').val();
            $select.each(function(){
                $(this).val(value);
            });
            return false;
        });
        $('#actions-bar-top')
            .find('button.primary')
                .after($btn)
                .after($select_clone);
    };
    $.MTAppBatchEditCategory.defaults = {
        text: 'をまとめて変更'
    };
    // end - $.MTAppBatchEditCategory();


    // -------------------------------------------------
    //  $(foo).MTAppNbspGUI();
    //
    //  Description:
    //    「1項目ごとに改行してください」をGUIで実現する
    //
    //  Usage:
    //    $(foo).MTAppNbspGUI(options);
    //
    //  Options:
    //    wrapper_class: {Array} ['main-class', 'sub-class']
    //    input_class: {Array} ['main-class', 'sub-class']
    //    add_class: {Array} ['main-class', 'sub-class']
    //
    // -------------------------------------------------
    $.fn.MTAppNbspGUI = function(options) {
        var op = $.extend({}, $.fn.MTAppNbspGUI.defaults, options);
        return this.each(function(){
            var self = $(this).hide();
            var self_id = self.attr('id')
            var self_value = self.val().split('\n');

            var input = [];
            for (var i = 0, n = self_value.length; i < n; i++) {
                input.push(item(self_value[i]));
            }
            self.after(input.join(''));

            $('span.' + op.add_class[0]).live('click', function(){
                $(this).parent().after(item(''));
            });

            $('input.' + op.input_class[0]).live('blur', function(){
                var text = [];
                var inputs = $('input.' + op.input_class[0]);
                var inputs_count = inputs.length;
                inputs.each(function(){
                    if ($(this).val() != '') {
                        text.push($(this).val());
                    } else if (inputs_count > 1) {
                        $(this).parent().remove();
                    }
                });
                self.val(text.join("\n"));
            });

            function item (val) {
                return [
                    '<span class="' + op.wrapper_class.join(' ') + '">',
                        '<input type="text" class="' + op.input_class.join(' ') + '" value="' + val + '" />',
                        '<span class="' + op.add_class.join(' ') + '">追加</span>',
                    '</span>'
                ].join('');
            }

        });
    };
    $.fn.MTAppNbspGUI.defaults = {
        wrapper_class: ['mtapp-nbsp-gui-item'],
        input_class: ['mtapp-nbsp-gui-input','text','full'],
        add_class: ['mtapp-nbsp-gui-add']
    };
    // end - $(foo).MTAppNbspGUI();


    // -------------------------------------------------
    //  $.MTAppDuplicate();
    //
    //  Description:
    //    ブログ記事またはウェブページを複製する
    //
    //  Usage:
    //    $.MTAppDuplicate();
    //
    //  Options:
    //    change_blog: {Boolean} ブログの変更を可能にする（true）、不可にする（false）
    //
    // -------------------------------------------------
    $.MTAppDuplicate = function(options) {
        var op = $.extend({}, $.MTAppDuplicate.defaults, options);

        var dupl_btn = [
            '<div class="delete-action">',
                '<a id="mtapp_duplicate_button" href="javascript:void(0)" title="複製">複製</a>',
            '</div>'
        ];
        var dupl_blogs = [];
        if (mtappVars.json_can_create_post_blogs) {
            var blog_id = mtappVars.blog_id;
            for (var i = 0, n = mtappVars.json_can_create_post_blogs.length; i < n; i++) {
                var id = mtappVars.json_can_create_post_blogs[i]['id'];
                var name = mtappVars.json_can_create_post_blogs[i]['name'];
                var selected = (id == blog_id) ? ' selected="selected"': ''
                dupl_blogs.push('<option' + selected + ' value="' + id + '">' + name + '</option>');
            }
        }
        var dupl_ops = (op.change_blog) ? [
            '<div class="field field-top-label" id="duplicate_options-field">',
                '<div class="field-header">',
                    '<label>ブログの変更</label>',
                '</div>',
                '<div class="field-content">',
                    '<select class="full" id="duplicate_blog_id">',
                        dupl_blogs.join(''),
                    '</select>',
                '</div>',
            '</div>'
        ]: [''];

        var $deleteAction = $('#related-content').find('div.widget-content').find('div.delete-action');
        if ($deleteAction.size() > 0) {
            $deleteAction.before(dupl_btn.join('') + dupl_ops.join(''));
        } else {
            $('#related-content').find('div.actions-bar').find('button').each(function(){
                var text = $(this).text();
                if (text.indexOf('削除') >= 0) {
                    $(this).closest('.actions-bar').after(dupl_btn.join('') + dupl_ops.join(''));
                }
            });
        }

        $('#mtapp_duplicate_button').click(function(){
            var $this = $(this);
            $('#main').find('form').find('input:hidden').each(function(){
                var name = $(this).attr('name');
                switch (name) {
                    case 'id':
                        $(this).after('<input type="hidden" name="author_id" value="' + mtappVars.author_id + '" />').remove();
                        break;
                    case 'blog_id':
                        var v = (op.change_blog) ? $('#duplicate_blog_id').val(): $(this).val();
                        $(this).val(v);
                        break;
                    case 'return_args':
                        var v = $(this).val().replace(/&amp;id=[0-9]+|&id=[0-9]+/,'');
                        $(this).val(v);
                        break;
                    case 'status':
                        var v = 1;
                        $(this).val(v);
                        break;
                }
            });
            $this.parent().prev().find('button.primary').click();
        });
    };
    $.MTAppDuplicate.defaults = {
        change_blog: false
    };
    // end - $.MTAppDuplicate();


    // -------------------------------------------------
    //  $.MTAppMakeField();
    //
    //  Description:
    //    メインカラムのフィールドを生成します。
    //
    //  Usage:
    //    $.MTAppMakeField(options);
    //
    //  Options:
    //    label: {String} ラベル部分のテキスト、HTML
    //    content: {String} コンテンツ部分のテキスト、HTML
    //
    // -------------------------------------------------
    $.MTAppMakeField = function(options) {
        var op = $.extend({}, $.MTAppMakeField.defaults, options);
        return [
            '<div class="field field-top-label">',
                '<div><label>' + op.label + '</label></div>',
                '<div class="field-content">',
                op.content,
                '</div>',
            '</div>'
        ].join('');
    };
    $.MTAppMakeField.defaults = {
        label: '',
        content: ''
    };
    // end - $.MTAppMakeField();


    // -------------------------------------------------
    //  $.MTAppMakeWidget();
    //
    //  Description:
    //    右サイトバーのウィジェットを生成します。
    //
    //  Usage:
    //    $.MTAppMakeWidget(options);
    //
    //  Options:
    //    label: {String} ラベル部分のテキスト、HTML
    //    content: {String} コンテンツ部分のテキスト、HTML
    //    action: {String} アクション部分のテキスト、HTML
    //    footer: {String} フッター部分のテキスト、HTML
    //
    // -------------------------------------------------
    $.MTAppMakeWidget = function(options) {
        var op = $.extend({}, $.MTAppMakeWidget.defaults, options);
        return [
            '<div class="widget">',
                '<div class="widget-header">',
                    '<div class="widget-action">' + op.action + '</div>',
                    '<div class="widget-label">',
                        '<h2><span>' + op.label + '</span></h2>',
                    '</div>',
                '</div>',
                '<div class="widget-content">' + op.content + '</div>',
                '<div class="widget-footer">' + op.footer + '</div>',
            '</div>'
        ].join('');
    };
    $.MTAppMakeWidget.defaults = {
        label: '',
        content: '',
        action: '',
        footer: ''
    };
    // end - $.MTAppMakeWidget();


    // -------------------------------------------------
    //  Utilities
    //
    //  $(foo).hasClasses(classes);
    //
    //    Description:
    //      classesで指定したクラス名が設定されている場合はtrueを返す。
    //    Param:
    //      classes: {String} カンマ区切りの文字列
    //
    //  $(foo).notClasses(classes);
    //
    //    Description:
    //      classesで指定したクラス名が設定されていない場合はtrueを返す。
    //    Param:
    //      classes: {String} カンマ区切りの文字列
    //
    //  $(foo).noScroll(selector, horizontal);
    //
    //    Description:
    //      $(foo)の子要素である$(selector)をスクロールに追随させる。
    //    Param:
    //      selector: {String} jQueryセレクタ
    //      horizontal: {String} $(selector)のpositionプロパティに{horizontal: 0}を付与
    //
    //
    //  $.digit(num, space);
    //
    //    Description:
    //      numが一桁の場合は、頭に0または半角スペースを付与
    //    Param:
    //      num: {Number} 数字
    //      space: {Boolean} 半角スペースを付与する場合(true)
    // -------------------------------------------------
    $.fn.extend({
        hasClasses: function (classes) {
            if (typeof classes == 'string') {
                classes = /^\./.test(classes)
                    ? classes.replace(/^\./,'').split('.')
                    : classes.replace(/^ | $/g,'').split(' ');
            }
            for (var i = -1,j = 0, n = classes.length; ++i < n;) {
                if (this.hasClass(classes[i])) j++;
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
        },
        insertListingColum: function(position, element, html, classname){
            return this.each(function(){
                var elem = '';
                classname = classname ? ' ' + classname : '';
                if (element == 'th') {
                    elem = '<th class="col head' + classname + '"><span class="col-label">' + html + '</span></th>';
                } else if (element == 'td') {
                    elem = '<td class="col' + classname + '">' + html + '</td>';
                }
                $(this)[position](elem);
            });
        },
        insertAtCaret: function(text) {
            return this.each(function(){
                var self = $(this)[0];
                self.focus();
                if ($.browser.msie) {
                    var range = document.selection.createRange();
                    range.text = text;
                    range.select();
                } else {
                    var val = self.value,
                        beforeCaret = self.selectionStart,
                        afterCaret = beforeCaret + text.length;
                    self.value = val.substr(0, beforeCaret) + text + val.substr(beforeCaret);
                    self.setSelectionRange(afterCaret, afterCaret);
                }
            });
        }
    });

    $.extend({
        // 1桁の整数の場合、頭に0を付ける
        digit: function(num, space) {
            var prefix = (space) ? ' ' : '0';
            num += '';
            return (num.length < 2) ? prefix + num: num;
        },
        // 指定した桁数に満たない場合は頭を0で埋める
        zeroPad: function(num, pad) {
            num = num.toString();
            while (num.length < pad) {
                num = '0' + num;
            }
            return num;
        },
        // 全角数字を半角数字に変換し、半角数字以外は削除する。
        toInt: function(str, loose) {
            str = str.replace(/０/g, '0')
                .replace(/１/g, '1')
                .replace(/２/g, '2')
                .replace(/３/g, '3')
                .replace(/４/g, '4')
                .replace(/５/g, '5')
                .replace(/６/g, '6')
                .replace(/７/g, '7')
                .replace(/８/g, '8')
                .replace(/９/g, '9');
            if (!loose) {
                str = str.replace(/\D/g, '');
            }
            return str;
        }
    });

    function getFieldID(basename) {
        return basename.replace(/\s/g,'').replace(/^c:/,'customfield_').replace(/^cf_/,'customfield_') + '-field';
    }

    // end - Utility

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
    //  <body>にブログIDとユーザーIDのクラス名を付与
    // -------------------------------------------------
    $('body').addClass('blog-id-' + mtappVars.blog_id + ' author-id-' + mtappVars.author_id);

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
