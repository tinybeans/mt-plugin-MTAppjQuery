/*
 * MTAppjQuery.js for MTAppjQuery (Movable Type Plugin)
 *
 * Copyright (c) 2010 Tomohiro Okuwaki (http://www.tinybeans.net/blog/)
 *
 * Since:   2010-06-22
 * Update:  2011-01-27
 * for version: 0.15
 * Comment: 
 * 
 */

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


//
// $.MTAppCustomize()
//
(function($){
    $.MTAppCustomize = function(options){
        var op = $.extend({
            basename:   '',
            label:      '',
            hint:       '',
            show_field:  1,
            custom:      0,
            widget:      0,
            edit:        0
        },options || {});
        
        var fieldID, labelID;
        if (op.basename == '') {
            alert('basenameが設定されていません');
            return false;
        }

        var editImg = $('<img/>')
            .attr({
                'src': StaticURI + 'images/status_icons/draft.gif',
                'alt': '編集'
            })
            .css({
                'verticalAlign':'top',
                'cursor':'pointer'
            })
            .click(function(){
                var fieldHeader = $(this).parents('div.field-header');
                var fieldContent = fieldHeader.next('div.field-content');
                fieldContent.toggle();
            });

        if (op.widget == 0) {

            // jQuery用のIDの生成（デフォルトのフィールドかカスタムフィールドか）
            if (op.custom == 0) {
                if (op.basename == 'body' || op.basename == 'more') {
                    fieldID = '#text-field';
                } else {
                    fieldID = '#' + op.basename + '-field';
                    labelID = '#' + op.basename + '-label';
                }
            } else {
                fieldID = '#customfield_' + op.basename + '-field';
                labelID = '#customfield_' + op.basename + '-label';
            }
                
            $(fieldID).each(function(){
                // body
                if (op.basename == 'body') {
                    if (op.label != '') $('#editor-header label:eq(0) a',this).text(op.label);
                    if (op.hint != '') $('#editor-header div.tab:eq(0) a',this).showHint(op.hint);
                // more
                } else if (op.basename == 'more') {
                    if (op.label != '') $(this).find('#editor-header label:eq(1) a').text(op.label);
                    if (op.hint != '') $('#editor-header div.tab:eq(1) a',this).showHint(op.hint);
                // title
                } else if (op.basename == 'title') {
                    if (op.label != '') $(this).find(labelID).text(op.label);
                    $(this).find('div.field-header').show();
                    if (op.hint != '') $(this).showHint(op.hint);
                    if (op.edit != 0) {
                        if ($('#' + op.basename).val() == '') {
                            $(this).find(labelID).after(editImg);
                            $(this).find('div.field-content').hide();
                        }
                    }
                // other
                } else {
                    if (op.label != '') $(this).find(labelID).text(op.label);
                    if (op.hint != '') $(this).showHint(op.hint);
                    if (op.edit != 0) {
                        if ($('#' + op.basename).val() == '') {
                            $(this).find(labelID).after(editImg);
                            $(this).find('div.field-content').hide();
                        }
                        
                    }
                }
                // show_field
                if (op.show_field == 0) {
                    $(this).addClass('hidden');
                } else if (op.show_field == 1) {
                    $(this).removeClass('hidden');
                }
            });
        } else if (op.widget == 1) {
            // ウィジェット
            // jQuery用のIDの生成（デフォルトのフィールドかカスタムフィールドか）
            if (op.basename == 'assets') {
                fieldID = '#' + op.basename + '-field';
            } else {
                fieldID = '#entry-' + op.basename + '-widget';
            }

            $(fieldID).each(function(){
                if (op.label != '') $('h3.widget-label span',this).text(op.label);
                if (op.hint != '') $(this).showHint(op.hint);
                if (op.show_field == 0) $(this).addClass('hidden');
            });
        }
    }
})(jQuery);

/*
 * jqueryMultiCheckbox.js
 *
 * Copyright (c) 2010 Tomohiro Okuwaki (http://www.tinybeans.net/blog/)
 * Licensed under MIT Lisence:
 * http://www.opensource.org/licenses/mit-license.php
 * http://sourceforge.jp/projects/opensource/wiki/licenses%2FMIT_license
 *
 * Since:   2010-06-22
 * Update:  2010-09-02
 * version: 0.04
 * Comment: :checkbox.val()とlavel.text()を変更可能にした
 *
 * jQuery 1.2 later (maybe...)
 * 
 */
(function($){
    $.fn.multicheckbox = function(options){
        var op = $.extend({
            show  :  'hide',
            label : null,
            insert: 'before'
        },options || {});

        var self = this;

        if (op.show == 'show') {
            self.show();
        } else {
            self.hide();
        }
        var value = self.val();
        var title = '';
        if (op.label == null) {
            title = self.attr('title');
        } else if (typeof(op.label) == 'string') {
            title = op.label;
        } else if (typeof(op.label) == 'object') {
            title = 'object';
        }
        var checked = new Array();
        if (value) {
            checked = value.split(',');
            for (var i = 0, n = checked.length; i < n; i++) {
                checked[i] = $.trim(checked[i]);
            }
        }
        var clickEv = function(){
            var value = self.val();
            var child = $(this).find(':checkbox');
            if (child.is(':checked')) {
                if(value == '') {
                    self.val(child.val() + ',');
                } else {
                    self.val(value + child.val() + ',');
                }
            } else {
                var reg = new RegExp(child.val() + ',','g');
                value = value.replace(reg,'');
                self.val(value);
            }
        }
        var handlerIn = function(){
            var value = self.val();
            self.val(value + ',');
        }
        var handlerOut = function(){
            var value = self.val();
            self.val(value.replace(/^,|,$/g,''));
        }
        var container = $('<span/>').addClass('multicheckbox_container');
        if (title != 'object') {
            var checks = new Array();
            checks = title.split(',');
            for (var j = 0, n = checks.length; j < n; j++) {
                checks[j] = $.trim(checks[j]);
                var check = $('<input/>').attr({'type':'checkbox','value':checks[j]});
                if (checked.length > 0) {
                    for (var k=0; k<checked.length; k++) {
                        if (checks[j] == checked[k]) check.attr('checked',true);
                    }
                }
                if(op.insert == 'before'){
                    self.before(container.append(
                        $('<label/>')
                            .addClass('multicheckbox_label')
                            .text(checks[j])
                            .prepend(check)
                            .click(clickEv)
                            .hover(handlerIn,handlerOut)
                    ));
                } else {
                    self.after(container.append(
                        $('<label/>')
                            .addClass('multicheckbox_label')
                            .text(checks[j])
                            .prepend(check)
                            .click(clickEv)
                            .hover(handlerIn,handlerOut)
                    ));
                }
            }
        } else {
            for (var key in op.label) {
                var check = $('<input/>').attr({'type':'checkbox','value':key});
                if (checked.length > 0) {
                    for (var k=0; k<checked.length; k++) {
                        if (key == checked[k]) check.attr('checked',true);
                    }
                }
                if(op.insert == 'before'){
                    self.before(container.append(
                        $('<label/>')
                            .addClass('multicheckbox_label')
                            .text(op.label[key])
                            .prepend(check)
                            .click(clickEv)
                            .hover(handlerIn,handlerOut)
                    ));
                } else {
                    self.after(container.append(
                        $('<label/>')
                            .addClass('multicheckbox_label')
                            .text(op.label[key])
                            .prepend(check)
                            .click(clickEv)
                            .hover(handlerIn,handlerOut)
                    ));
                }
            }
        }
    }
})(jQuery);

//
// $.MTAppMultiCheckbox()
//
(function($){
    $.MTAppMultiCheckbox = function(options){
        var op = $.extend({
            basename: '',
            label:    '',
            insert:   'before',
            custom:    0,
            debug:     0
        },options || {});
        
        var fieldID = (op.custom != 1) ? '#' + op.basename : '#customfield_' + op.basename;
        var optionShow = (op.debug == 0) ? 'hide' : 'show';
        $(fieldID).multicheckbox({show:optionShow,insert:op.insert,label:op.label});
    }
})(jQuery);

//
// $.MTAppFieldSort
//
(function($){
    $.MTAppFieldSort = function(options){
        var op = $.extend({
            sort    : 'title,text,tags,excerpt,keywords',
            insertID: 'main-content-inner'
        },options || {});
        
        var sort = op.sort;
        var field = sort.split(',');
        field.reverse();
        
        if (field.length == 0) return;
        var ID = '#' + op.insertID;
        for (var i=0; i<field.length; i++) {
            if (field[i].match(/^c:/)) {
                var fieldID = '#customfield_' + field[i].replace(/^c:/,'') + '-field';
                $(fieldID).prependTo(ID);
            } else {
                var fieldID = '#' + field[i] + '-field';
                $(fieldID).prependTo(ID);
            }
        }
    }
})(jQuery);

//
// $.MTAppMsg
//
(function($){
    $.MTAppMsg = function(options){
        var op = $.extend({
            msg:  '',
            type: '' // info/success/error/
        },options || {});
        
        var closeBtn = $('<img/>')
            .addClass('mt-close-msg')
            .attr({
                'alt':'閉じる',
                'src':StaticURI + 'images/icon_close.png'
            });
        var myMsg = $('<div/>')
            .addClass('msg ' + 'msg-' + op.type)
            .html(op.msg)
            .append(closeBtn);
        if ($('#msg-block').length) {
            $('#msg-block').append(myMsg);
        } else {
            $('#page-title').after('<div id="msg-block"/>');
            $('#msg-block').append(myMsg);
        }
    }
})(jQuery);

//
// $.MTAppSlideMenu
//
(function($){
    $.MTAppSlideMenu = function(options){
        var op = $.extend({
            hide: ''
        },options || {});
        
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
    }
})(jQuery);

/*
 * hint tooltip
 * [参考]
 * もっと便利に！jQueryでラクラクサイト制作（実践サンプル付き）
 * 第16回　jQueryで楽々実装できるツールチッププラグインを作ってみよう ｜gihyo.jp … 技術評論社
 * http://gihyo.jp/design/serial/01/jquery-site-production/0016
 * 
 */
jQuery(function($){
    var hintElm = $('<div/>').attr('id','mtapp-hint').hide();
    $('body').append(hintElm);
}); 
(function($){
    $.fn.showHint = function(options){
        $(this).each(function(){
            var self = $(this);
            var hintElm = $('#mtapp-hint');
            
            self.hover(function(e){
                hintElm
                    .stop(true,true)
                    .fadeIn('fast')
                    .text(options)
                    .css({
                        position: 'absolute',
                        top: e.pageY - 45,
                        left: e.pageX + 20
                    })
            },function(){
                hintElm.fadeOut('fast');
            }).mousemove(function(e){
                hintElm.css({
                    top: e.pageY - 45,
                    left: e.pageX + 20
                });
            });
            
        });
    }
})(jQuery);

//
// Fullscreen Text editor
//
(function($){
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
    }
})(jQuery);

//
// Change UI for each category
//
(function($){
    $.MTAppInCats = function(options){
        var op = $.extend({
            categories: '',
            code      : function(){}
        },options || {});

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
    }
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
            if (opts.always) {
                $elm
                    .before('<span class="'+id+'-text"></span>')
                    .after('<button id="mt-set-'+id+'" class="mt-edit-field-button">'+opts.edit+'</button>')
                    .hide();
                $('span.'+id+'-text').text($elm.val());
            } else {
                if ($elm.val() && !$elm.hasClass('show-input')) {
                    $elm
                        .before('<span class="'+id+'-text"></span>')
                        .after('<button id="mt-set-'+id+'" class="mt-edit-field-button">'+opts.edit+'</button>')
                        .hide();
                    $('span.'+id+'-text').text($elm.val());
                }
                if (!$elm.val() && $elm.hasClass('hide-input')) {
                    $elm
                        .before('<span class="'+id+'-text"></span>')
                        .after('<button id="mt-set-'+id+'" class="mt-edit-field-button">'+opts.edit+'</button>')
                        .hide();
                }
            }
            $('button#mt-set-'+id).click(function() {
                $(this).hide();
                $('span.'+id+'-text').hide();
                $('#'+id).show();
                $('p#'+id+'-warning').show();
                return false;
            });
        });
    };
})(jQuery);

//
// Debug mode
//
(function($){
    $.MTAppDebug = function(options){
/*
        var op = $.extend({
        },options || {});
*/
        // 共通
        // bodyのID
        var bodyID = $('body').attr('id');
        var pageTitle = '' + $.trim($('#page-title').text());
        if(pageTitle){
            pageTitle = '// ' + pageTitle + '<br />';
        }
        var pageInfo = $('<span class="mtapp-debug-block">body#'+ bodyID +', blogID='+ blogID + ', authorID='+ authorID +'</span>');
        var onlyP = 
            $('<a class="mtapp-if-page" href="#" title="if($(\'body#'+ bodyID +'\').length){}">[Only this page]</a>');
        var onlyPB = 
            $('<a class="mtapp-if-page" href="#" title="if($(\'body#'+ bodyID +'\').length && blogID == '+ blogID +'){}">[Only this page and blog]</a>');
        var onlyPBA = 
            $('<a class="mtapp-if-page" href="#" title="if($(\'body#'+ bodyID +'\').length && blogID == '+ blogID +' && authorID == '+ authorID +'){}">[Only this page and blog and author]</a>');
        pageInfo.append(onlyP,onlyPB,onlyPBA);
        $('#header').prepend(pageInfo);     
        $('a.mtapp-if-page').click(function(e){
            e.preventDefault();
            var text = $(this).attr('title');
            $.MTAppMsg({
                msg: pageTitle + text,
                type: 'success'
            });
        });   

        // ブログ一覧
        if ($('body#list-blog').length) {
            $('#blog-listing-table tbody tr').each(function(){
                var bID = $(this).find('td.cb :checkbox').val();
                $(this).find('td.name').prepend('<span class="mtapp-debug-inline">'+ bID +'</span>');
            });
        }

        // ブログ記事一覧
        // IDを表示
        if ($('body#list-entry').length) {
            $('#entry-listing-table tbody tr').each(function(){
                var eID = $(this).find('td.cb :checkbox').val();
                $(this).find('td.title').prepend('<span class="mtapp-debug-inline">'+ eID +'</span>');
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
                var catID = $(this).attr('id');
                catID = catID.replace(/category-/,'');
                $(this).find('td.category div').prepend('<span class="mtapp-debug-inline">'+ catID +'</span>');
            });
        }

        // タグ一覧
        // IDを表示
        if ($('body#list-tag').length) {
            $('#tag-listing-table tbody tr a.edit-link').each(function(){
                var tagID = $(this).attr('id');
                tagID = tagID.replace(/tag-link-/,'');
                $(this).before('<span class="mtapp-debug-inline">'+ tagID +'</span>');
            });
        }

        // ウェブページ一覧
        // IDを表示
        if ($('body#list-page').length) {
            $('#page-listing-table tbody tr').each(function(){
                var pageID = $(this).find('td.cb :checkbox').val();
                $(this).find('td.title').prepend('<span class="mtapp-debug-inline">'+ pageID +'</span>');
            });
        }

        // フォルダ一覧
        // IDを表示
        if ($('body#list-folder').length) {
            $('#folder-listing-table tbody tr').each(function(){
                var pageID = $(this).find('td.cb :checkbox').val();
                $(this).find('td:eq(2)').prepend('<span class="mtapp-debug-inline">'+ pageID +'</span>');
            });
        }

    }
})(jQuery);

jQuery(function($){

    //
    // Favorite Structure ダッシュボード
    //
    $('#favorite-structure').find('div.favorite-structure-container').hover(
    	function(){
    		$(this).css('backgroundColor','#C2EEB5');
    	},
    	function(){
    		$(this).css('backgroundColor','#F3F3F3');
    	}
    );
});
