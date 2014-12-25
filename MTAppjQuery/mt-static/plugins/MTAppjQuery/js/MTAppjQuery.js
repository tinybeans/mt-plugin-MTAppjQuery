/*
 * MTAppjQuery.js
 *
 * Copyright (c) Tomohiro Okuwaki (http://www.tinybeans.net/blog/)
 *
 * Since:   2010-06-22
 * Update:  2014-09-19
 *
 */
;(function($){

    if (typeof mtappVars !== 'object') return;
    mtappVars.adminScript = location.href.replace(/\?.*/, '');

    // -------------------------------------------------
    //  $(foo).MTAppJSONTable();
    //
    //  Description:
    //    fooに指定したtextareaを表形式の入力欄にし、表に入力された値をJSONで元のtextareaに保存します。
    //
    //  Usage:
    //    $(foo).MTAppJSONTable(options);
    //
    //    このメソッドで扱えるJSONのフォーマットは下記の通りです。
    //    {"items":[
    //        {"key1": "value1", "key2": "value2", "key3": "value3"},
    //        {"key1": "value1", "key2": "value2", "key3": "value3"},
    //        {"key1": "value1", "key2": "value2", "key3": "value3"}
    //    ]}
    //
    // -------------------------------------------------
    $.fn.MTAppJSONTable = function(options){
        var op = $.extend({}, $.fn.MTAppJSONTable.defaults, options);

        var l10n = {};
        if (mtappVars.language === 'ja') {
            l10n.addRow = '行を追加';
            l10n.addColumn = '列を追加';
            l10n.clearData = '削除';
            l10n.addColumnProperty = 'プロパティ名（例：title）';
            l10n.addColumnPropertyDisplayName = 'プロパティ表示名（例：タイトル）';
            l10n.cellMerge = 'セルを結合';
            l10n.cellMergeApply = '結合を適用';
            l10n.colspanValueIs = '結合する列の数';
            l10n.rowspanValueIs = '結合する行の数';
            l10n.failedSelect = '連続したセルを選択してください';
        }
        else {
            l10n.addRow = 'Add a row';
            l10n.addColumn = 'Add a column';
            l10n.clearData = 'Delete';
            l10n.addColumnProperty = 'Property Name (e.g. title)';
            l10n.addColumnPropertyDisplayName = 'Property Display Name (e.g. Title)';
            l10n.cellMerge = 'Merge cells';
            l10n.cellMergeApply = 'Apply merge';
            l10n.colspanValueIs = 'The value of colspan:';
            l10n.rowspanValueIs = 'The value of rowspan:';
            l10n.failedSelect = 'Failed to select';
        }

        // Auto settings
        if (op.clear) {
            op.listingCheckbox = true;
        }

        return this.each(function(){

            var $this = $(this);
            if (!op.debug) {
                $this.hide();
            }
            var jsonStr = $this.val();
            var json = null;
            if (/^\{/.test(jsonStr)) {
                try {
                    json = JSON.parse(jsonStr);
                }
                catch(e) {
                    alert(e.message);
                }
            }
            else {
                if (op.items === null) {
                    json = {};
                    json[op.itemsRootKey] = [];
                }
                else {
                    json = op.items;
                }
            }
            if (json === null) {
                return;
            }

            // Check the order of properties
            var order = op.headerOrder;
            if ($.isArray(order) && order.length === 0) {
                alert('Error in .MTAppJSONTable: The "order" option is required.');
                return;
            }

            var items = json[op.itemsRootKey];
            if (items.length === 0) {
                items[0] = {};
                for (var i = 0, l = order.length; i < l; i++) {
                    items[0][order[i]] = '';
                }
            }

            op.items = items;

            var tmpl = {};

            tmpl.caption = '<caption>[#= caption #]</caption>';

            tmpl.header = [
                '<thead>',
                  '<tr>',
                      '[# if (sortable) { #]',
                      '<td class="jsontable-sort-handle">&nbsp;</td>',
                      '[# } #]',
                      // op.clear == true
                      '[# if (listingCheckbox) { #]',
                      '<th class="jsontable-cb-cell">&nbsp;</th>',
                      '[# } #]',
                      '[# for (var i = 0, l = headerOrder.length; i < l; i++) { #]',
                      '<th class="[#= headerOrder[i] #]" data-name="[#= headerOrder[i] #]">[#= header[headerOrder[i]] #]</th>',
                      '[# } #]',
                  '</tr>',
                '</thead>'
            ].join("\n");

            tmpl.footer = [
                '<tfoot>',
                  '<tr>',
                      '[# if (sortable) { #]',
                      '<td class="jsontable-sort-handle">&nbsp;</td>',
                      '[# } #]',
                      '[# if (listingCheckbox) { #]',
                      '<th class="jsontable-cb-cell">&nbsp;</th>',
                      '[# } #]',
                      '[# for (var i = 0, l = headerOrder.length; i < l; i++) { #]',
                      '<th class="[#= headerOrder[i] #]" data-name="[#= headerOrder[i] #]">[#= header[headerOrder[i]] #]</th>',
                      '[# } #]',
                  '</tr>',
                '</tfoot>'
            ].join("\n");

            tmpl.tbodyTopPlain = [
                '<tr class="odd">',
                    '[# if (sortable) { #]',
                    '<td class="jsontable-sort-handle">&nbsp;</td>',
                    '[# } #]',
                    '[# if (listingCheckbox) { #]',
                    '<td class="jsontable-cb-cell">',
                        '[# if (listingCheckboxType === "radio") { #]',
                        '<input type="radio" name="jsontable-radio" class="jsontable-cb">',
                        '[# } else { #]',
                        '<input type="checkbox" class="jsontable-cb">',
                        '[# } #]',
                    '</td>',
                    '[# } #]',
                    '[# for (var x = 0, y = headerOrder.length; x < y; x++) { #]',
                    '<td class="[#= headerOrder[x] #]" data-name="[#= headerOrder[x] #]">',
                        '[# if (inputType === "input") { #]',
                            '<input class="jsontable-input" type="text" data-name="[#= headerOrder[x] #]" value="">',
                        '[# } else if (inputType === "textarea") { #]',
                            '<textarea class="jsontable-input" data-name="[#= headerOrder[x] #]"></textarea>',
                        '[# } #]',
                    '</td>',
                    '[# } #]',
                '</tr>'
            ].join("");

            tmpl.tbodyTop = [
                '<tbody>',
                    '[# for (var i = 0, l = items.length; i < l; i++) { #]',
                    '[# if (i % 2 === 0) { #]',
                    '<tr class="even">',
                    '[# } else { #]',
                    '<tr class="odd">',
                    '[# } #]',
                        '[# if (sortable) { #]',
                        '<td class="jsontable-sort-handle">&nbsp;</td>',
                        '[# } #]',
                        '[# if (listingCheckbox) { #]',
                        '<td class="jsontable-cb-cell">',
                            '[# if (listingCheckboxType === "radio") { #]',
                            '<input type="radio" name="jsontable-radio" class="jsontable-cb">',
                            '[# } else { #]',
                            '<input type="checkbox" class="jsontable-cb">',
                            '[# } #]',
                        '</td>',
                        '[# } #]',
                        '[# for (var x = 0, y = headerOrder.length; x < y; x++) { #]',
                            '[# if (!items[i].hasOwnProperty(headerOrder[x])) { continue; } #]',
                        '<td class="[#= headerOrder[x] #]" data-name="[#= headerOrder[x] #]"',
                            '[# if (listingTargetKey && listingTargetKey === headerOrder[x]) { #]',
                                '[# if (listingTargetEscape) { #]',
                                 'data-value="[#= encodeURIComponent(items[i][headerOrder[x]]) #]"',
                                 '[# } else { #]',
                                 'data-value="[#= items[i][headerOrder[x]] #]"',
                                 '[# } #]',
                             '[# } #]',
                             // Cell Merge
                             '[# if (items[i].hasOwnProperty(headerOrder[x] + "_colspan")) { #]',
                                'colspan="[#= items[i][headerOrder[x] + "_colspan"] #]"',
                             '[# } #]',
                             '[# if (items[i].hasOwnProperty(headerOrder[x] + "_rowspan")) { #]',
                                'rowspan="[#= items[i][headerOrder[x] + "_rowspan"] #]"',
                             '[# } #]',
                        '>',
                            '[# if (edit) { #]',
                                '[# if (inputType === "input") { #]',
                                    '<input class="jsontable-input" type="text" data-name="[#= headerOrder[x] #]" value="[#= items[i][headerOrder[x]] #]">',
                                '[# } else if (inputType === "textarea") { #]',
                                    '<textarea class="jsontable-input" data-name="[#= headerOrder[x] #]">[#= items[i][headerOrder[x]] #]</textarea>',
                                '[# } #]',
                            '[# } else { #]',
                                '<span class="jsontable-input-data">[#= items[i][headerOrder[x]] #]</span>',
                                '[# if (listingTargetKey && listingTargetKey === headerOrder[x]) { #]',
                                    '<textarea class="jsontable-input-hidden hidden" data-name="[#= headerOrder[x] #]">[#= items[i][headerOrder[x]] #]</textarea>',
                                '[# } #]',
                            '[# } #]',
                        '</td>',
                        '[# } #]',
                    '</tr>',
                    '[# } #]',
                '</tbody>'
            ].join("");

            tmpl.tbodyLeftPlain = [
                '<td class="[#= headerOrder #] item-[#= i #] last-child" data-item-index="[#= i #]" data-name="[#= headerOrder #]">',
                    '[# if (inputType === "input") { #]',
                        '<input class="jsontable-input" type="text" data-name="[#= headerOrder #]" value="">',
                    '[# } else if (inputType === "textarea") { #]',
                        '<textarea class="jsontable-input" data-name="[#= headerOrder #]"></textarea>',
                    '[# } #]',
                '</td>'
            ].join("");

            tmpl.tbodyLeft = [
                '<tbody>',
                    '[# if (listingCheckbox) { #]',
                    '<tr class="jsontable-clear-row">',
                        '[# if (header) { #]',
                        '<th class="jsontable-cb-cell">&nbsp;</th>',
                        '[# } #]',
                        '[# for (var i = 0, l = items.length; i < l; i++) { #]',
                        '<td class="jsontable-cb-cell item-[#= i #]" data-item-index="[#= i #]">',
                            '<input type="checkbox" class="jsontable-cb">',
                        '</td>',
                        '[# } #]',
                    '</tr>',
                    '[# } #]',
                    '[# for (var x = 0, y = headerOrder.length; x < y; x++) { #]',
                    '<tr class="[#= headerOrder[x] #]" data-name="[#= headerOrder[x] #]">',
                        '[# for (var i = 0, l = items.length; i < l; i++) { #]',
                            '[# if (!items[i].hasOwnProperty(headerOrder[x])) { continue; } #]',
                        '<td class="[#= headerOrder[x] #] item-[#= i #]" data-item-index="[#= i #]" data-name="[#= headerOrder[x] #]"',
                            // Cell Merge
                            '[# if (items[i].hasOwnProperty(headerOrder[x] + "_colspan")) { #]',
                               'colspan="[#= items[i][headerOrder[x] + "_colspan"] #]"',
                            '[# } #]',
                            '[# if (items[i].hasOwnProperty(headerOrder[x] + "_rowspan")) { #]',
                               'rowspan="[#= items[i][headerOrder[x] + "_rowspan"] #]"',
                            '[# } #]',
                        '>',
                            '[# if (edit) { #]',
                                '[# if (inputType === "input") { #]',
                                    '<input class="jsontable-input" type="text" data-name="[#= headerOrder[x] #]" value="[#= items[i][headerOrder[x]] #]">',
                                '[# } else if (inputType === "textarea") { #]',
                                    '<textarea class="jsontable-input" data-name="[#= headerOrder[x] #]">[#= items[i][headerOrder[x]] #]</textarea>',
                                '[# } #]',
                            '[# } else { #]',
                                '<span class="jsontable-input-data">[#= items[i][headerOrder[x]] #]</span>',
                                '[# if (listingTargetKey && listingTargetKey === headerOrder[x]) { #]',
                                    '<textarea class="jsontable-input-hidden hidden" data-name="[#= headerOrder[x] #]">[#= items[i][headerOrder[x]] #]</textarea>',
                                '[# } #]',
                            '[# } #]',
                        '</td>',
                        '[# } #]',
                    '</tr>',
                    '[# } #]',
                '</tbody>'
            ].join("");

            tmpl.buttons = [
                '<div class="add-btn">',
                    '[# if (add && headerPosition === "top") { #]',
                    '<a href="#" class="button jsontable-add jsontable-add-row">' + l10n.addRow + '</a>',
                    '[# } #]',
                    '[# if (add && headerPosition === "left") { #]',
                    '<a href="#" class="button jsontable-add jsontable-add-column">' + l10n.addColumn + '</a>',
                    '[# } #]',
                    '[# if (cellMerge) { #]',
                    '<a href="#" class="button jsontable-cellMerge">' + l10n.cellMerge + '</a>',
                    '[# } #]',
                    '[# if (clear) { #]',
                    '<a href="#" class="button jsontable-clear">' + l10n.clearData + '</a>',
                    '[# } #]',
                    '[# if (optionButtons) { #]',
                        '[# for (var i = 0, l = optionButtons.length; i < l; i++) { #]',
                        '<a href="#" class="button [#= optionButtons[i].classname #]">[#= optionButtons[i].text #]</a>',
                        '[# } #]',
                    '[# } #]',
                '</div>'
            ].join("");

            tmpl.container = [
                '<div class="mtapp-json-table">',
                    '<table class="jsontable-table" border="1">',
                        // caption
                        '[# if (typeof caption === "string") { #]',
                            '[#= context.include("caption") #]',
                        '[# } #]',

                        // header
                        '[# if (header && headerPosition === "top") { #]',
                            '[#= context.include("header") #]',
                        '[# } #]',

                        // footer
                        '[# if (header && headerPosition === "top" && footer) { #]',
                            '[#= context.include("footer") #]',
                        '[# } #]',

                        // tbody
                        '[# if (items.length > 0) { #]',
                            '[# if (headerPosition === "top") { #]',
                                '[#= context.include("tbodyTop") #]',
                            '[# } else if (headerPosition === "left") { #]',
                                '[#= context.include("tbodyLeft") #]',
                            '[# } #]',
                        '[# } #]',

                    '</table>',

                    '[# if (add || clear || optionButtons) { #]',
                        '[#= context.include("buttons") #]',
                    '[# } #]',

                '</div>'
            ].join("\n");

            // Build HTML and insert a table.
            var tableHtml = Template.process('container', op, tmpl);
            $(this).after(tableHtml);

            var $container = $this.next('div');
            var $table = $container.children('table');

            // If the "headerPosition" option is "left", insert th to tr.
            if (op.header && op.headerPosition === 'left') {
                $table.find('tr').not('.jsontable-clear-row').each(function(){
                    var dataName = $(this).attr('data-name');
                    $(this).prepend('<th class="' + dataName + '" data-name="' + dataName + '">' + op.header[dataName] + '</th>');
                });
            }

            // Click checkboxes for deleting data
            if (op.listingCheckbox) {
                if (op.headerPosition === 'top') {
                    $table.on('click', 'input.jsontable-cb', function(){
                        var $tr = $(this).parent().parent().toggleClass('jsontable-selected-data');
                        if (op.cbAfterSelectRow !== null && typeof op.cbAfterSelectRow === 'function') {
                            op.cbAfterSelectRow({name: 'cbAfterSelectRow'}, $tr, $(this).is(':checked'));
                        }
                    });
                }
                else if (op.headerPosition === 'left') {
                    $table.on('click', 'input.jsontable-cb', function(){
                        var itemIndex = $(this).parent().attr('data-item-index');
                        var $td = $table.find('.item-' + itemIndex).toggleClass('jsontable-selected-data');
                        if (op.cbAfterSelectColumn !== null && typeof op.cbAfterSelectColumn === 'function') {
                            op.cbAfterSelectColumn({name: 'cbAfterSelectColumn'}, $td, $(this).is(':checked'));
                        }
                    });
                }
            }

            // Add a row or column
            if (op.add || op.clear) {
                $container.on('click', 'div.add-btn a', function(){
                    if ($(this).hasClass('jsontable-add-row')) {
                        var plainTr = Template.process('tbodyTopPlain', op, tmpl);
                        $table.find('tbody').append(plainTr);
                        if (op.cbAfterAdd !== null && typeof op.cbAfterAdd === 'function') {
                            op.cbAfterAdd({name: 'cbAfterAdd'}, $container);
                        }
                    }
                    else if ($(this).hasClass('jsontable-add-column')) {
                        var headerOrderClone = $.extend(true, [], op.headerOrder);
                        var inputType = op.inputType;
                        var dataItemIndex = 0;
                        $table.find('td:last-child').each(function(){
                            var idx = $(this).index();
                            if (idx > dataItemIndex) {
                                dataItemIndex = idx;
                            }
                        });
                        $table.find('tr').each(function(){
                            var $td = $(this).children(':last-child').removeClass('last-child').clone().removeClass(function(index, classname) {
                                return (classname.match(/\bitem-\d+/g) || []).join(' ');
                            });
                            if ($(this).hasClass('jsontable-clear-row')) {
                                $td.attr('data-item-index', dataItemIndex).addClass('item-' + dataItemIndex);
                            }
                            else {
                                var data = {
                                    headerOrder: headerOrderClone.shift(),
                                    inputType: inputType,
                                    i: dataItemIndex
                                };
                                $td = Template.process('tbodyLeftPlain', data, tmpl);
                            }
                            if (op.cbBeforeAdd !== null && typeof op.cbBeforeAdd === 'function') {
                                op.cbBeforeAdd({name: 'cbBeforeAdd', type: 'column'}, $td);
                            }
                            $(this).append($td);
                        });
                        if (op.cbAfterAdd !== null && typeof op.cbAfterAdd === 'function') {
                            op.cbAfterAdd({name: 'cbAfterAdd'}, $container);
                        }
                    }
                    else if ($(this).hasClass('jsontable-clear')) {
                        $table.find('.jsontable-selected-data').remove();
                    }
                    else if ($(this).hasClass('jsontable-cellMerge')) {
                        $(this).toggleClass('primary');
                        var firstSelect = true;
                        var selectMergedCell = function(e){
                            var $td = $(this);
                            var $tr = $td.parent();
                            var tdIndex = $td.index();
                            $td.toggleClass('merge-target');
                            firstSelect = false;
                        };
                        // Select merged cells
                        if ($(this).hasClass('primary')) {
                            // Clear classes
                            $table.find('td.merge-target').removeClass('merge-target');
                            $(this).text(l10n.cellMergeApply);
                            $table.on('click', 'td', selectMergedCell);
                        }
                        // Apply merge
                        else {
                            $(this).text(l10n.cellMerge);
                            $table.off('click', 'td');
                            var $mergeTarget = $table.find('td.merge-target');
                            var firstCell = {}, firstLine = {}, firstLineLastCell = {},
                                lastCell  = {}, lastLine  = {};
                            firstCell.obj = $mergeTarget.first();
                            firstCell.idx = firstCell.obj.index();
                            firstLine.obj = firstCell.obj.parent();
                            firstLine.idx = firstLine.obj.index();
                            firstLineLastCell.obj = firstLine.obj.children('.merge-target').last();
                            firstLineLastCell.idx = firstLineLastCell.obj.index();
                            lastCell.obj = $mergeTarget.last();
                            lastCell.idx = lastCell.obj.index();
                            lastLine.obj = lastCell.obj.parent();
                            lastLine.idx = lastLine.obj.index();
                            var colspan = firstLine.obj.children('.merge-target').length;
                            var rowspan = lastLine.idx - firstLine.idx + 1;
                            // Check existed colspan values
                            var existedColspan = 0;
                            firstLine.obj.children('.merge-target').filter('[colspan]').each(function(){
                                existedColspan += Number($(this).attr('colspan'));
                            });
                            if (existedColspan) {
                                colspan += (existedColspan - 1);
                            }
                            if (colspan > 1) {
                                firstCell.obj.attr('colspan', colspan);
                            }
                            if (rowspan > 1) {
                                firstCell.obj.attr('rowspan', rowspan);
                            }
                            $table.find('td.merge-target').not(':first').remove();
                        }
                        $table.toggleClass('jsontable-cell-merge');
                    }
                    return false;
                });
            }

            // Save values edited by user
            if (op.edit) {
                $('form[method="post"]').on('submit', function(){
                    var result = $.fn.MTAppJSONTable.save(op.headerPosition, op.itemsRootKey, $table, ':not(".hidden")');
                    $this.val(result);
                });
            }
            if (op.sortable && op.headerPosition === 'top') {
                $table.sortable({
                    items: 'tr',
                    cursor: 'move'
                });
            }
            if (op.cbAfterBuild !== null && typeof op.cbAfterBuild === 'function') {
                op.cbAfterBuild({name: 'cbAfterBuild'}, $container);
            }
        });
    };
    $.fn.MTAppJSONTable.save = function(headerPosition, itemsRootKey, $table, filter){
        var values = '';
        var itemsArray = [];
        if (typeof filter !== 'string') {
            filter = '';
        }
        if (headerPosition === 'top') {
            $table.find('tbody tr' + filter).each(function(){
                var item = {};
                $(this).find('.jsontable-input').each(function(){
                    var v = $(this).val();
                    item[$(this).attr('data-name')] = v;

                    // cellMerge
                    if ($(this).parent().attr('colspan')) {
                        item[$(this).attr('data-name') + '_colspan'] = $(this).parent().attr('colspan');
                    }
                    if ($(this).parent().attr('rowspan')) {
                        item[$(this).attr('data-name') + '_rowspan'] = $(this).parent().attr('rowspan');
                    }

                    values += v;
                });
                itemsArray.push(JSON.stringify(item));
            });
        }
        else if (headerPosition === 'left') {
            var $tr = $table.find('tr' + filter);
            var textareaCount = $tr.last().find('.jsontable-input').length;
            var itemsArrayObj = [];
            for (var i = 0; i < textareaCount; i++) {
                itemsArrayObj.push({});
            }
            $tr.each(function(i){
                $(this).find('.jsontable-input').each(function(j){
                    var v = $(this).val();
                    var idx = $(this).parent().attr('data-item-index');
                    itemsArrayObj[idx][$(this).attr('data-name')] = v;

                    // cellMerge
                    if ($(this).parent().attr('colspan')) {
                        itemsArrayObj[idx][$(this).attr('data-name') + '_colspan'] = $(this).parent().attr('colspan');
                    }
                    if ($(this).parent().attr('rowspan')) {
                        itemsArrayObj[idx][$(this).attr('data-name') + '_rowspan'] = $(this).parent().attr('rowspan');
                    }

                    values += v;
                });
            });
            for (var i = 0; i < textareaCount; i++) {
                itemsArray.push(JSON.stringify(itemsArrayObj[i]));
            }
        }
        return (values !== '') ? '{"' + itemsRootKey + '":[' + itemsArray.join(',') + ']}' : '';
    };
    $.fn.MTAppJSONTable.defaults = {
        inputType: 'textarea', // 'textarea' or 'input'
        caption: null, // String: Table caption
        header: null, // Object: Table header
        headerOrder: [], // Array: Order of table header
        headerPosition: 'top', // 'top' or 'left'
        footer: false, // If you use the table footer, set true.
        items: null, // Array include Object
        itemsRootKey: 'items', // String: The root key of items
        edit: true, // Disable table
        add: false, // true: A user can add rows or columns.
        clear: true, // false: Hide a delete button.
        cellMerge: false,
        sortable: false,
        listingCheckbox: false, // or true
        listingCheckboxType: 'checkbox', // or 'radio'
        listingTargetKey: null, // String: Target key  which is saved value when listing mode is applied
        listingTargetEscape: false, // Boolean: encodeURIComponent(target value)
        optionButtons: null, // [{classname:"classname", text:"button text"}]
        // Callbacks
        cbAfterBuild: null,
        cbBeforeAdd: null,
        cbAfterAdd: null,
        cbAfterSelectRow: null,
        cbAfterSelectColumn: null,

        debug: false // true: show the original textarea.
    };
    // end - $.fn.MTAppJSONTable()


    // -------------------------------------------------
    //  $(foo).MTAppListing();
    //
    //  Description:
    //    Ajaxで読み込んだJSONをテーブルにしてダイアログで表示する
    //
    //  Usage:
    //    $(foo).MTAppListing(options);
    //
    // -------------------------------------------------
    $.fn.MTAppListing = function(options){
        var op = $.extend({}, $.fn.MTAppListing.defaults, options);

        /* ==================================================
            L10N
        ================================================== */
        var l10n = {};
        if (mtappVars.language === 'ja') {
            l10n.title = '項目を選択';
            l10n.search = '検索';
            l10n.reset = 'リセット';
            l10n.cancel = 'キャンセル';
            l10n.select = '選択';
            l10n.selectedItems = '選択された項目';
            l10n.returnDialogTop = 'ダイアログのトップへ戻る';
        }
        else {
            l10n.title = 'Select items';
            l10n.search = 'Search';
            l10n.reset = 'Reset';
            l10n.cancel = 'Cancel';
            l10n.select = 'Select';
            l10n.selectedItems = 'Selected items';
            l10n.returnDialogTop = 'Dialog top';
        }
        /*  L10N  */

        /* ==================================================
            Template
        ================================================== */
        var tmpl = {};
        tmpl.dialog = [
            '<div class="mtapplisting-container">',
                '<img class="mtapplisting-indicator hidden" src="' + StaticURI + 'images/indicator.gif">',
                '<div class="mtapplisting-content hidden">',
                    '<div class="mtapplisting-content-header">',
                        '<h1 class="title page">[#= dialog.title #]</h1>',
                    '</div>',
                    '<div class="mtapplisting-content-body">',
                        '<textarea id="mtapplisting-textarea1" class="mtapplisting-dummy-textarea hidden"></textarea>',
                        '<div class="mtapplisting-search">',
                            '<input id="mtapplisting-text-filter" type="text" class="text med" value="" placeholder="' + l10n.search + '">',
                            '<input id="mtapplisting-text-search" type="image" src="' + StaticURI + '/images/search-submit-dialog.png">',
                            '<a id="mtapplisting-search-reset" href="#" class="search-reset">' + l10n.reset + '</a>',
                        '</div>',
                        '<textarea id="mtapplisting-textarea2" class="mtapplisting-dummy-textarea hidden"></textarea>',
                    '</div>',
                '</div>',
                '<div class="mtapplisting-actions actions-bar hidden">',
                    '<a href="#" id="mtapplisting-dialog-ok" class="action button primary close ok">OK</a>',
                    '<a href="#" id="mtapplisting-dialog-cansel" class="action button cancel">' + l10n.cancel + '</a>',
                    '<a href="#" id="mtapplisting-dialog-top">' + l10n.returnDialogTop + '</a>',
                '</div>',
            '</div>',
            ''
        ].join('');
        /*  Template  */

        /* ==================================================
            Insert a button to open dialog window
            and Initialization
        ================================================== */
        var $dialog = $('#mtapplisting-dialog');
        if (!$dialog.length) {
            var dialogHTML =
                '<div id="mtapplisting-dialog"></div>' +
                '<div id="mtapplisting-overlay"></div>';
            $('body').append(dialogHTML);
            $dialog = $('#mtapplisting-dialog');
        }
        /*  Insert a button to open dialog window  */

        /* ==================================================
            Bind events to the dialog
        ================================================== */
        if (!$dialog.hasClass('bind-event')) {
            $dialog
                .addClass('bind-event')
                // Cancel Button
                .on('click', '#mtapplisting-dialog-cansel', function(e){
                    $(e.delegateTarget).html('').removeClass('mt-dialog').hide();
                    $('#mtapplisting-overlay').removeClass('mt-dialog-overlay').removeClass('overlay').hide();
                    return false;
                })
                // OK Button
                .on('click', '#mtapplisting-dialog-ok', function(e){
                    var triggerId = $(e.delegateTarget).data('triggerId');
                    if (!triggerId) {
                        return false;
                    }

                    // Save selected values
                    var values = [];
                    var $tbody = $('#mtapplisting-tbody1');
                    var $tr = $tbody.children('tr');
                    if ($tr.length) {
                        var targetKey = $tbody.data('target-key');
                        $tr.each(function(){
                            values.push($(this).find('td.' + targetKey + ' textarea.jsontable-input-hidden').val());
                        });
                    }
                    if (values.length > 1) {
                        $('#' + triggerId).val(',' + values.join(',') + ',');
                    }
                    else {
                        $('#' + triggerId).val(values[0]);
                    }

                    // Reset trigger
                    $(e.delegateTarget).data('triggerId', '');
                    // Close the dialog
                    $(this).next().trigger('click');
                    return false;
                })
                .on('click', '#mtapplisting-text-search', function(e){
                    var v = $('#mtapplisting-text-filter').val();
                    $('#mtapplisting-tbody2 tr').each(function(){
                        var html = this.innerHTML;
                        var reg = new RegExp(v, 'i');
                        if (reg.test(html)) {
                            $(this).removeClass('hidden');
                        }
                        else {
                            $(this).addClass('hidden');
                        }
                    });
                    return false;
                })
                .on('keypress', '#mtapplisting-text-filter', function(e){
                    if (e.which == 13 || op.incrementalSearch) {
                        $(this).next().trigger('click');
                    }
                })
                .on('click', '#mtapplisting-search-reset', function(e){
                    $('#mtapplisting-text-filter').val('');
                    $('#mtapplisting-text-search').trigger('click');
                    return false;
                })
                .on('click', '#mtapplisting-dialog-top', function(e){
                    $(e.delegateTarget)
                        .find('div.mtapplisting-container')
                        .animate({scrollTop: 0}, 600, 'swing');
                    return false;
                });
        }
        /*  Bind events to the dialog  */


        return this.each(function(){

            var $this = $(this);

            /* ==================================================
                Set IDs
            ================================================== */
            var $thisId = $this.attr('id');
            if (!$thisId) {
                $thisId = Math.floor(Math.random() * 10000000000000000).toString(36);
                $this.attr('id', $thisId);
            }
            var tbodyId1 = 'mtapplisting-' + $thisId + '1';
            var tbodyId2 = 'mtapplisting-' + $thisId + '2';
            /*  Set IDs  */

            $this
                .after('<a href="#" class="button">' + l10n.select + '</a>')
                .next('a')
                /* ==================================================
                    Event of opening the dialog window
                ================================================== */
                .on('click', function(){ // Don't use ".mtDialog()"

                    // Set the trigger id
                    var $dialog = $('#mtapplisting-dialog').addClass('mt-dialog');
                    $dialog.data('triggerId', $thisId);

                    // Show the overlay
                    $('#mtapplisting-overlay').addClass('mt-dialog-overlay').addClass('overlay').css({minHeight: $(document).height()}).show();

                    // MTAppListing template
                    var tmplData = {
                        dialog: {
                            title: op.dialogTitle
                        }
                    };
                    var html = Template.process('dialog', tmplData, tmpl);

                    // Append MTAppListing template to the dialog, and show the dialog
                    $dialog
                        .html(html)
                        .children('.mtapplisting-container')
                            .height($(window).height() - 110)
                        .end()
                        .show();

                    // Hide the indicator
                    var $indicator = $dialog.find('img.mtapplisting-indicator').removeClass('hidden');

                    // Options for ajax
                    var ajaxOptions = {
                        dataType: op.dataType,
                        url: op.url,
                        data: op.data
                    };

                    // Get JSON by ajax
                    $.ajax(ajaxOptions).done(function(response){

                        // Process the response
                        if (op.cbProcessResponse !== null && typeof op.cbProcessResponse === 'function') {
                            response = op.cbProcessResponse({name: 'cbProcessResponse'}, response);
                        }

                        // Show the dialog content
                        $indicator.addClass('hidden');
                        $dialog.find('div.mtapplisting-content').removeClass('hidden').next().removeClass('hidden');

                        // Dummy textarea1 options
                        op.jsontable.caption = l10n.selectedItems;
                        op.jsontable.headerPosition = 'top';
                        op.jsontable.footer = false;
                        op.jsontable.items = null;
                        op.jsontable.edit = false;
                        op.jsontable.add = false;
                        op.jsontable.clear = false;
                        op.jsontable.listingCheckbox = true;
                        op.jsontable.listingTargetKey = op.jsontable.listingTargetKey || 'id';
                        op.jsontable.cbAfterSelectRow = function(cb, $tr, checked){
                            if (!checked) {
                                $tr.prependTo('#mtapplisting-tbody2');
                            }
                        };
                        op.jsontable.cbAfterBuild = function(cb, $container){
                            $container.find('tbody').attr('id', 'mtapplisting-tbody1');
                        };
                        $('#mtapplisting-textarea1').MTAppJSONTable(op.jsontable);
                        $('#mtapplisting-tbody1')
                            /*.hide()*/
                            .data('target-key', op.jsontable.listingTargetKey)
                            .html('')
                            .sortable({
                                items: 'tr',
                                cursor: 'move',
                                placeholder: 'mtapp-state-highlight'
                            });

                        // Dummy textarea2 options
                        // The following options have be already set at dummy1
                            // op.jsontable.headerPosition = 'top';
                            // op.jsontable.edit = false;
                            // op.jsontable.add = false;
                            // op.jsontable.clear = false;
                            // op.jsontable.listingCheckbox = true;
                            // op.jsontable.listingTargetKey = op.jsontable.listingTargetKey || 'id';
                        op.jsontable.caption = null; // overwrite
                        op.jsontable.footer = true; // overwrite
                        op.jsontable.items = response; // overwrite
                        op.jsontable.cbAfterSelectRow = function(cb, $tr, checked){  // overwrite
                            $('#mtapplisting-textarea1').next().show();
                            if (checked) {
                                $tr.find('td').each(function(){
                                    var w = $(this).width();
                                    $(this).width(w + 'px');
                                });
                                $tr.appendTo('#mtapplisting-tbody1');
                            }
                        };
                        op.jsontable.cbAfterBuild = function(cb, $container){ // overwrite
                            $container.find('tbody').attr('id', 'mtapplisting-tbody2');
                            var savedValue = $this.val().replace(/^,|,$/g, '').split(',');
                            for (var i = 0, l = savedValue.length; i < l; i++) {
                                $('td[data-value="' + savedValue[i].replace(/\s*/g, '') + '"]').parent().find('td:first-child input.jsontable-cb').trigger('click');
                            }
                        };

                        $('#mtapplisting-textarea2').MTAppJSONTable(op.jsontable);
                    });

                    return false;
                });
                /*  Event of opening the dialog window  */
        });
    };
    $.fn.MTAppListing.defaults = {
        dialogTitle: '', // Type the title of dialog window
        url: null, // Data API Script URL (ex)http://your-host/mt/mt-data-api.cgi/v1/sites/1/entries
        data: null, // PlainObject: Data to be sent to the server.
        dataType: 'json', // Set this value to ajax options
        incrementalSearch: true, // Set true if you wont to do incremental search
        cbProcessResponse: null, // Process the response
        jsontable: null // Set options for MTAppJSONTable
    };
    // end - $.fn.MTAppListing()

    // -------------------------------------------------
    //  $.MTAppGetCategoryName();
    //
    //  Description:
    //    記事の編集画面ではカテゴリ名を、ウェブページの編集画面ではフォルダ名を取得できます
    //
    //  Usage:
    //    $.MTAppGetCategoryName();
    //
    //  Options:
    //    categories: {Array} MT.App.categoryListを渡します
    //    id: {Number} 調べたいカテゴリidを渡します
    //    field: {String} label or basename
    // -------------------------------------------------
    $.MTAppGetCategoryName = function(options){
        var op = $.extend({}, $.MTAppGetCategoryName.defaults, options);

        if ($.varType(op.categories) !== 'array' || op.id == 0 || ! /^\d+$/.test(op.id)) {
            return;
        }
        for (var i = 0, l = op.categories.length; i < l; i++) {
            if (op.categories[i].id == op.id) {
                return op.categories[i][op.field];
            }
        }
    };
    $.MTAppGetCategoryName.defaults = {
        categories: null,
        id: 0,
        field: 'label'
    };
    // end - $.MTAppGetCategoryName()

    // -------------------------------------------------
    //  $.MTAppSlideMenuV2();
    //
    //  Description:
    //    ログイン中のユーザーがアクセス可能なウェブサイトとブログをすべてスライドメニューで出力します
    //
    //  Usage:
    //    $.MTAppSlideMenuV2(Options);
    //
    //  Options:
    //    moveCreationMenu: {Boolean} ウェブサイト・ブログの作成リンクを「新規作成」に移動
    //    hidePermissionMsg: {Boolean} 「アクセス権がありません。システム管理者へ連絡してください。」メッセージを非表示
    // -------------------------------------------------
    $.MTAppSlideMenuV2 = function(options){
        var op = $.extend({}, $.MTAppSlideMenuV2.defaults, options);

        if (typeof mtappVars.can_access_blogs_json.website === 'undefined' || !/^6\.0/.test(mtappVars.minor_version)) return;

        var crtUrl = location.href;

        var makeScopeSelectorLi = function (obj) {
            if (typeof obj.child === 'undefined') {
                obj.child = '';
            }
            if (typeof obj.dataBlogId === 'undefined') {
                obj.dataBlogId = 0;
            }
            return '<li><a href="' + obj.link + '" class="scope-link" data-blog-id="' + obj.dataBlogId + '">' + obj.text + '</a>' + obj.child + '</li>';
        };
        var typeScopeList = function (type, content, style) {
            style = (typeof style === 'undefined') ? '': ' style="' + style + '"';
            return [
                '<div class="scope-list ' + type + '"' + style + '>',
                    '<ul>',
                        content,
                    '</ul>',
                '</div>'
            ].join('');
        };

        var li = {};

        li.system = [];
        li.system.push(
            makeScopeSelectorLi({
                link: mtappVars.adminScript + '?__mode=dashboard',
                text: mtappL10N.User_Dashboard
            })
        );
        if (mtappVars.is_superuser) {
            li.system.push(
                makeScopeSelectorLi({
                    link: mtappVars.adminScript + '?blog_id=0&__mode=dashboard',
                    text: mtappL10N.System
                })
            );
        }

        var scopeSelectorWidth = $('#scope-selector').width();
        li.website = [];
        for (var i = 0, l = mtappVars.can_access_blogs_json.website.length; i < l; i++) {
            var blogs = mtappVars.can_access_blogs_json.website[i].children;
            var blogUl = '';
            if (blogs.length > 0) {
                var blogLi = '';
                for (var x = 0, y = blogs.length; x < y; x++) {
                    var blog = {
                        link: mtappVars.adminScript + '?blog_id=' + blogs[x].id + '&__mode=dashboard',
                        dataBlogId: blogs[x].id,
                        text: blogs[x].name
                    }
                    blogLi += makeScopeSelectorLi(blog);
                }
                blogUl = typeScopeList('blog', blogLi, 'width:' + scopeSelectorWidth + 'px;');
            }
            var website = {
                link: mtappVars.adminScript + '?blog_id=' + mtappVars.can_access_blogs_json.website[i].id + '&__mode=dashboard',
                dataBlogId: mtappVars.can_access_blogs_json.website[i].id,
                text: mtappVars.can_access_blogs_json.website[i].name,
                child: blogUl
            };
            li.website.push(
                makeScopeSelectorLi(website)
            );
        }

        // Move menus of creating website/blog
        $('#fav-actions').width($('#fav-actions').width());

        var makeFavActionLi = function (obj) {
            return '<li id="fav-action-' + obj.type + '"><a href="' + obj.link + '" class="fav-action-link">' + obj.text + '</a></li>';
        };

        var $createWebsite = $('#create-website-action a');
        var $createBlog = $('#create-blog-action a');

        var creationMenus = '';
        if ($createWebsite.length > 0) {
            var createWebsiteAttr = {
                type: 'website',
                link: $createWebsite.attr('href'),
                text: $createWebsite.text()
            };
            if (op.moveCreationMenu) {
                creationMenus = makeFavActionLi(createWebsiteAttr);
            }
            else {
                li.system.push(makeScopeSelectorLi(createWebsiteAttr));
            }
        }
        if ($createBlog.length > 0) {
            var createBlogAttr = {
                type: 'blog',
                link: $createBlog.attr('href'),
                text: $createBlog.text()
            };
            if (op.moveCreationMenu) {
                creationMenus = makeFavActionLi(createBlogAttr);
            }
            else {
                li.system.push(makeScopeSelectorLi(createBlogAttr));
            }
        }
        if (creationMenus) {
            $('#fav-actions-list').append(creationMenus);
        }

        var scopeList = [];
        scopeList.push(
            typeScopeList('system', li.system.join(''))
        );
        scopeList.push(
            typeScopeList('website', li.website.join(''))
        );
        $('#scope-selector').html('<ul id="mtapp-slidemenu-v2">' + scopeList.join('') + '</ul>');

        // Attach an event handler function for events to the elements
        $('#mtapp-slidemenu-v2 div.scope-list').not('.system').on('click', 'a', function(e){
            e.preventDefault();
            var blogId = $(this).data('blogId');
            crtUrl = location.href;
            crtUrl = crtUrl.replace(/&saved[^=]*=1/g, '');
            if (crtUrl.indexOf('blog_id=') != -1) {
                crtUrl = crtUrl.replace(/blog_id=\d+/, 'blog_id=' + blogId);
            }
            else {
                crtUrl += '&blog_id=' + blogId;
            }
            location.href = crtUrl;
        });
        $('#mtapp-slidemenu-v2 div.scope-list.website li').on({
            mouseenter: function(){
                $(this).find('div.scope-list.blog').fadeIn('fast');
            },
            mouseleave: function(){
                $(this).find('div.scope-list.blog').fadeOut();
            }
        });

        if (op.hidePermissionMsg && crtUrl.indexOf('permission=1') != -1) {
            $('#permissions.msg-error').hide();
        }
    };
    $.MTAppSlideMenuV2.defaults = {
        moveCreationMenu: false,
        hidePermissionMsg: false
    };
    // end - $.MTAppSlideMenuV2()

    // -------------------------------------------------
    //  $.MTAppNoScrollRightSidebar();
    //
    //  Description:
    //    右サイドバーのウィジェットをスクロールに追随するようにする。
    //
    //  Usage:
    //    $.MTAppNoScrollRightSidebar(Options);
    //
    //  Options:
    //    closeMode: {Boolean} true=ウィジェットを閉じた状態にする。
    //    openSelector: {String} closeMode が true の場合で、空いた状態にしておきたいウィジェットのIDセレクタ
    // -------------------------------------------------
    $.MTAppNoScrollRightSidebar = function(options){
        var op = $.extend({}, $.MTAppNoScrollRightSidebar.defaults, options);

        if ($('#related-content').length < 1) return;
        var type = (op.closeMode) ? 'no-scroll-right-sidebar' : '';
        var $header = $('#related-content')
                .noScroll({'right': 0}, '#container')
                .addClass(type)
                .children()
                    .addClass('widget-wrapper')
                    .find('div.widget-header');
        if (op.closeMode) {
            $header.css({cursor:'pointer'});
            if (op.openSelector !== '') {
                $(op.openSelector).find('div.widget-content').show();
            }
            $header.click(function(){
                $(this)
                    .closest('div.widget-wrapper')
                        .siblings()
                            .find('div.widget-content').slideUp()
                            .end()
                        .end()
                    .find('div.widget-content').slideToggle();
            });
        } else {
            $header.click(function(){
                $(this).parents('div.widget-header').next().slideToggle();
            });
        }
    };
    $.MTAppNoScrollRightSidebar.defaults = {
        closeMode: false, // ウィジェットを閉じた状態にする場合はtrue
        openSelector: ''
    };
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
     * Update:  2014-04-22
     * version: 0.2.1
     *
     * jQuery 1.7 later (maybe...)
     *
     */
    $.fn.multicheckbox = function(options){
        var op = $.extend({}, $.fn.multicheckbox.defaults, options);

        return this.each(function(idx){

            var $this = $(this);
            var savedItems = this.value ? trimComma(this.value).split(",") : [];
            var labelType = $.varType(op.label);
            var labels = [];
            var items = [];

            var containerClass = (op.skin !== '') ? 'mcb-container mcb-skin-' + op.skin : 'mcb-container';
            var $container = $('<span class="' + containerClass+ '"></span>');
            switch (op.insert) {
                case 'after':
                    $this.after($container);
                    break;
                default:
                    $this.before($container);
                    break;
            }

            if (labelType === 'object') {
                if (op.sort === '') {
                    for (var key in op.label) {
                        labels.push(makeLabel(op.label[key], key));
                    }
                } else {
                    var keys = sortHashKey(op.label, op.sort);
                    for (var i = 0, n = keys.length; i < n; i++) {
                        labels.push(makeLabel(op.label[keys[i]], keys[i]));
                    }
                }
            }
            else if (labelType === 'string' || labelType === 'array') {
                switch (labelType) {
                    case 'string':
                        if (op.label === '') {
                            items = $this.attr('title') ? trimComma($this.attr('title')).split(',') : [];
                        }
                        else {
                            items = trimComma(op.label).split(',');
                        }
                        op.label = $.merge([], items);
                        break;
                    case 'array':
                        items = $.merge([], op.label);
                        break;
                }
                if (savedItems.length > 0 && op.add) {
                    for (var i = 0, n = savedItems.length; i < n; i++) {
                        if ($.inArray(savedItems[i], op.label) === -1) {
                            items.push(savedItems[i]);
                        }
                    }
                }
                if (op.sort == 'ascend') {
                    items.sort();
                }
                else if (op.sort === 'descend') {
                    items.sort();
                    items.reverse();
                }
                for (var i = 0, n = items.length; i < n; i++) {
                    labels.push(makeLabel(items[i], items[i]));
                }
                if (op.add) {
                    labels.push('<input class="mcb-add-item" type="text" value="">');
                }
            }
            $container
                .html(labels.join(''))
                .on('click', 'input:checkbox', function(e){
                    var checkbox = e.target;
                    var checkValues = [];
                    $container
                        .find('label').removeClass('mcb-label-checked')
                        .end()
                        .find(':checked').each(function(){
                            checkValues.push(this.value);
                            $(this).parent().addClass('mcb-label-checked');
                        });
                    $this.val(checkValues.join(','));
                });
            if (savedItems.length > 0) {
                $container.find(':checkbox').each(function(){
                    var v = this.value;
                    if ($.inArray(v, savedItems) !== -1) {
                        $(this).prop('checked', true).parent().addClass('mcb-label-checked');
                    }
                })
            }

            switch (op.show) {
                case 'show':
                    $this.show();
                    break;
                default:
                    $this.hide();
            }

            if (op.add) {
                $container.find('input.mcb-add-item')
                    .on('keypress', function(e){
                        var keycode = e.which || e.keyCode;
                        if (keycode == 13) {
                            var value = $(this).val();
                            var label = '';
                            if (!value) return false;
                            label = value;
                            $(this).val('')
                                .before(makeLabel(value, label))
                                .prev().children('input:checkbox').click();
                            return false;
                        }
                        return true;
                    });
            }
            function makeLabel(label, value){
                // var classname = boolChecked ? ' mcb-label-checked': '';
                // var checked = boolChecked ? ' checked="checked"': '';
                return [
                    '<label class="mcb-label">',
                        '<input class="mcb-checkbox" type="checkbox" value="' + value + '" />',
                        label,
                    '</label>'
                ].join('');
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

            function trimComma(str){
                return str.replace(/^ | $/g, '').replace(/ *, */g, ',');
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
        return $(fieldID + '-field');
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
            var option_add = op.dynamic ? '<option value="_add_">' + op.addText + '</option>': '';
            var select = [
                '<select class="dynamic_select">',
                    options.join(''),
                    option_add,
                '</select>'
            ];
            var $select = $(select.join('')).change(function(){
                if ($(this).val() === '_add_') {
                    var $option = $(this).find('option');
                    var size = $option.size();
                    var addition = prompt(op.promptMsg,'');
                    if (addition) {
                        $self.val(addition);
                        $option.eq(size-1).before('<option value="' + addition + '" selected="selected">' + addition + '</option>');
                    } else {
                        $(this).val($self.val());
                    }
                } else {
                    $self.val($(this).val());
                }
                if (op.selected && typeof op.selected === 'function') {
                    op.selected($self.val());
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
        dynamic: true,
        text: '', // カンマ区切りの文字列か連想配列と配列の入れ子。value|labelと分けることも可能（要separateMode: true）。
        addText: '項目を追加する',
        promptMsg: '追加する項目名を入力',
        initGroupName: '選択中アイテム',
        separateMode: false,
        selected: null
    };
    // end - $(foo).MTAppDynamicSelect()


    // -------------------------------------------------
    //  $(foo).MTAppMultiForm();
    //
    //  Description:
    //    指定した要素をチェックボックスかドロップダウンリストに変更する。いずれも multiple 対応。
    //
    //  Usage:
    //  　$(foo).MTAppTooltip(options);
    //
    //  Options:
    //    debug: {Boolean} true を設定すると元のフィールドを表示
    //    type: {String} 'checkbox', 'radio', 'select', 'select.multiple' のいずれか
    //    items: {Array} 生成する項目を配列で設定
    //    styles: {String} type: 'select.multiple' の場合のみ有効。select[multiple]の高さ調整に。
    // -------------------------------------------------
    $.fn.MTAppMultiForm = function(options){
        var op = $.extend({}, $.fn.MTAppMultiForm.defaults, options);
        return this.each(function(idx){
            if (!op.type || op.items.length == 0) return;
            var $this = (op.debug) ? $(this) : $(this).hide();

            var thisVal = $this.val();
            var thisData = (thisVal) ? thisVal.split(',') : [];
            for (var i = 0, l = thisData.length; i < l; i++) {
                thisData[i] = thisData[i].replace(/^\s+|\s+$/, '');
            }
            var thisId = $this.attr('id') ? 'mtappmltform-' + $this.attr('id') : '';
            if (thisId == '') {
                var rand = '' + Math.random();
                rand = rand.replace('.','');
                thisId = 'mtappmltform-' + op.type.replace('.multiple', '') + '-' + rand;
            }

            var _html = ['<span id="' + thisId + '" class="mtappmultiform mtappmultiform-' + op.type.replace('.', '-') + '">'];
            switch (op.type) {
                case 'checkbox':
                    for (var i = 0, l = op.items.length; i < l; i++) {
                        var checked = ($.inArray(op.items[i], thisData) > -1) ? ' checked' : '';
                        _html.push('<label><input type="checkbox" value="' + op.items[i] + '"' + checked + '>' + op.items[i] + '</label>');
                    }
                    _html.push();
                    break;
                case 'radio':
                    for (var i = 0, l = op.items.length; i < l; i++) {
                        var checked = ($.inArray(op.items[i], thisData) > -1) ? ' checked' : '';
                        _html.push('<label><input type="radio" name="' + thisId + '-item" value="' + op.items[i] + '"' + checked + '>' + op.items[i] + '</label>');
                    }
                    _html.push();
                    break;
                case 'select':
                    _html.push('<select>');
                    for (var i = 0, l = op.items.length; i < l; i++) {
                        var selected = ($.inArray(op.items[i], thisData) > -1) ? ' selected' : '';
                        _html.push('<option value="' + op.items[i] + '"' + selected + '>' + op.items[i] + '</option>');
                    }
                    _html.push('</select>');
                    break;
                case 'select.multiple':
                    _html.push('<select multiple="multiple" style="' + op.styles + '">');
                    for (var i = 0, l = op.items.length; i < l; i++) {
                        var selected = ($.inArray(op.items[i], thisData) > -1) ? ' selected' : '';
                        _html.push('<option value="' + op.items[i] + '"' + selected + '>' + op.items[i] + '</option>');
                    }
                    _html.push('</select>');
                    break;
            }
            _html.push('</span>');

            $this.after(_html.join(''));

            var $span = $('#' + thisId);
            // $span.find('input.default-checked').prop('checked', true);
            // $span.find('option.default-selected').prop('selected', true);
            if ($span.hasClass('mtappmultiform-radio') || $span.hasClass('mtappmultiform-checkbox')) {
                $span.find('input').click(function(){
                    thisData = [];
                    $span.find('input:checked').each(function(){
                        thisData.push($(this).val());
                    });
                    $this.val(thisData.join(','));
                });
            } else if ($span.hasClass('mtappmultiform-select') || $span.hasClass('mtappmultiform-select-multiple')) {
                $span.find('select').change(function(){
                    thisData = [];
                    $(this).find('option:selected').each(function(){
                        thisData.push($(this).val());
                    });
                    $this.val(thisData.join(','));
                });
            }
        });
    };
    $.fn.MTAppMultiForm.defaults = {
        debug: false,
        type: '', // 'checkbox', 'radio', 'select', 'select.multiple' のいずれか
        items: [],
        styles: 'height: auto;'
    };
    // end - $(foo).MTAppMultiForm()


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
            var splitCount = op.splitCount > 1 ? op.splitCount: 2;
            var selfVal = $self.val() ? $self.val().split(op.separator) : [];

            if (!op.debug) {
                $self.hide();
            }

            var input = [];
            var value = '', placeholders = '', styles = '', classes = '';
            op.placeholders = op.placeholder ? op.placeholder : op.placeholders;
            for (var i = 0; i < splitCount; i++) {
                value = (selfVal[i]) ? selfVal[i] : '';
                placeholders = (op.placeholders[i]) ? op.placeholders[i] : '';
                styles = (op.styles[i]) ? op.styles[i] : '';
                classes = (op.classes[i]) ? op.classes[i] : '';
                input.push('<input type="text" class="' + op.addClass + classes + '"" value="' + value + '" placeholder="' + placeholders + '" style="' + styles + '" />');
                value = '';
            }
            var $span = $('<span class="mtapp-fieldsplit">' + input.join('') + '</span>').children().each(function(){
                $(this)
                    .blur(function(){
                        var values = [];
                        $(this).siblings().andSelf().each(function(){
                            values.push($(this).val());
                        });
                        $self.val(values.join(separator));
                    })
                    .keydown(function(e){
                        if (e.which == 13) {
                            var values = [];
                            $(this).siblings().andSelf().each(function(){
                                values.push($(this).val());
                            });
                            $self.val(values.join(separator));
                        }
                    });
            }).end();
            $self.after($span);
        });
    };
    $.fn.MTAppFieldSplit.defaults = {
        debug: false,
        splitCount: 2,
        placeholders: [],
        styles: [],
        classes: [],
        addClass: '',// 後方互換
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
    //    html: {String} ヒントの吹き出しに表示させるテキスト
    // -------------------------------------------------
    $.fn.MTAppshowHint = function(options){
        var op = $.extend({}, $.fn.MTAppshowHint.defaults, options);
        return this.each(function(idx){
            if (op.text && op.html === "") {
                op.html = op.text;
            }
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
                                      .find('div.balloon-content').html(op.html)
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
        html: ''
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
    //    html: {String} ツールチップに表示させるテキスト
    // -------------------------------------------------
    $.fn.MTAppTooltip = function(options){
        var op = $.extend({}, $.fn.MTAppTooltip.defaults, options);

        return this.each(function(){

            if (op.text && op.html === "") {
                op.html = op.text;
            }
            var self = $(this),
                tooltip = $('#mtapp-tooltip'),
                target, tipText;

            if (op.html != '') {
                tipText = op.html;
            } else {
                target = this.title ? 'title' : 'alt',
                tipText = self.attr(target);
            }

            self.hover(function(e){
                if (op.html == '') {
                    self.attr(target,'');
                }
                tooltip
                    .stop(true,true)
                    .fadeIn('fast')
                    .html(tipText)
                    .css({
                        position: 'absolute',
                        top: e.pageY - 20,
                        left: e.pageX + 20
                    });
            },function(){
                if (op.html == '') {
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
        html: ''
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
            $(innerElm).on('click', 'div', function(){
                var v = $self.val().replace(/(, )?([^,]*)$/,'$1');
                $self.val(v + $(this).text() + ', ');
            });
            $self
                .blur(function(){
                    setTimeout(function _hide(){
                        outerElm.style.display = 'none';
                    }, 100);
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
    //    addClass: {String} 追加するクラス名
    //    hint: {String} ヒントに表示させたいメッセージ
    //    showField: {String}  強制表示('show')、強制表示('hide')(注:basename が body か more の場合はタブの表示制御）
    //    showParent: {String}  強制表示('show')、強制非表示('hide') (注:showParent は、basename が body か more のみ）
    //    custom: {Boolean} カスタムフィールドの場合 true
    //    widget: {Boolean} ウィジェットの場合 true
    //    edit: {Boolean} 非編集モードにする場合 true
    // ---------------------------------------------------------------------
    $.MTAppCustomize = function(options){
        var op = $.extend({}, $.MTAppCustomize.defaults, options);
        var opL = op.label,
            opH = op.hint,
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
        if (op.add_class) op.addClass = op.add_class;
        if (op.add_class) op.addClass = op.addclass;
        if (op.addClass != '') {
            $field.addClass(op.addClass);
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
        var opS = op.show_field ? op.show_field: op.showField;
        if (opS == 'show') {
            $field.removeClass('hidden');
            if (opB == 'body' || opB == 'more') {
                $label.closest('div.tab').removeClass('hidden');
            }
        } else if (opS == 'hide' && opB != 'body' && opB != 'more') {
            $field.addClass('hidden');
        } else if (opS == 'hide' && (opB == 'body' || opB == 'more')) {
            $label.closest('div.tab').addClass('hidden');
        }

        // テキストフィールドの表示・非表示
        op.showParent = op.show_parent ? op.show_parent: op.showParent;
        if ((opB == 'body' || opB == 'more') && op.showParent == 'hide') {
            $field.css({
                position: 'absolute',
                top: '-9999px',
                left: '-9999px',
                width: '1px',
                height: '1px'
            });
        } else if ((opB == 'body' || opB == 'more') && op.showParent == 'show') {
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
        addClass: '',
        hint: '',
        showField: '',
        showParent: '',
        custom: false,
        widget: false,
        edit: false
    };
    // end - $.MTAppCustomize()

    // -------------------------------------------------
    //  $.MTAppGetLabel();
    //
    //  Description:
    //    現在のページのlabel要素のテキストとそのlabel要素を指定するセレクタを$.MTAppMsg()で表示する
    //
    //  Usage:
    //    $.MTAppGetLabel();
    // -------------------------------------------------
    $.MTAppGetLabel = function(text){
        var res = [];
        var tagNames = text.split(",");
        for (var i = 0, l = tagNames.length; i < l; i++) {
            makeOptions($.trim(tagNames[i]));
        }
        $.MTAppMsg({
            msg: res.join(",<br />"),
            type: "success"
        });
        function makeOptions(tagName) {
            $(tagName).each(function(idx){
                var text = $(this).text();
                var id = $(this).attr("id");
                var selector = "";
                if (id) {
                    selector = "#" + id;
                }
                else if ($(this).attr("for")) {
                    selector =  "label[for='" + $(this).attr("for") + "']";
                }
                else {
                    var parentId = $(this).closest("[id]").attr("id");
                    selector = "#" + parentId;
                    switch (parentId) {
                        case "entry-pref-field-list":
                        case "metadata_fields-field":
                            selector += " " + tagName + ":contains('" + $.trim(text) + "')";
                            break;
                        default:
                            $(selector).find(tagName).each(function(idx){
                                if ($(this).text() === text) {
                                    selector += " " + tagName + ":eq(" + idx + ")";
                                }
                            });
                            break;
                    }
                }
                res.push('["' + selector + '", "' + text + '", "' + text + '"]');
            });
        }
    };
    // end - $.MTAppGetLabel

    // -------------------------------------------------
    //  $.MTAppSetLabel();
    //
    //  Description:
    //    現在のページのlabel要素のテキストをセットする
    //
    //  Usage:
    //    $.MTAppSetLabel([
    //        ["セレクタ", "旧テキスト", "新テキスト"]
    //    ]);
    // -------------------------------------------------
    $.MTAppSetLabel = function(array){
        for (var i = 0, n = array.length; i < n; i++) {
            var exp = new RegExp(array[i][1], "g");
            var element = $(array[i][0])[0];
            textNodeRewrite(element, array[i][1], array[i][2]);
            if (array[i][0] === '#title-label') {
                $('#title').attr('placeholder', array[i][2]);
            }
        }
        function textNodeRewrite(element, pattan, replacement) {
            var children = element.childNodes;
            for (var i = 0, l = children.length; i < l; i++) {
                if (children[i].nodeType == 1) {
                    textNodeRewrite(children[i], pattan, replacement);
                }
                else if (children[i].nodeType == 3 && children[i].nodeValue.indexOf(pattan) > -1) {
                    children[i].nodeValue = children[i].nodeValue.replace(pattan, replacement);
                }
            }
        }
    };
    // end - $.MTAppSetLabel

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
    //    insertId: {String} フィールドを包含する要素のid属性の値
    //    otherFieldHide: {Boolean} trueにすると並び順を指定したフィールド以外のフィールドを非表示する。
    //    debug: {Boolean} trueにすると並び順に指定したフィールドがない場合はコンソールに通知する。
    // -------------------------------------------------
    $.MTAppFieldSort = function(options){
        var op = $.extend({}, $.MTAppFieldSort.defaults, options);

        var field = op.sort.split(',').reverse();
        var l = field.length;
        if (l == 0) return;
        var containerId = 'sortable';
        if (op.insertID !== 'sortable') {
            containerId = op.insertID;
        } else if (op.insert_id !== 'sortable') {
            containerId = op.insert_id;
        }
        var container = document.getElementById(containerId);
        if (!container) return;
        if (op.otherFieldHide) {
            $(container).find('div.field').addClass('hidden');
            $('#quickpost').addClass('hidden');
        }
        for (var i = 0; i < l; i++) {
            var id = $.trim(field[i]).replace(/^c:/,'customfield_') + '-field';
            if (document.getElementById(id)) {
                var elm = document.getElementById(id);
                container.insertBefore(elm, container.firstChild);
                $(elm).removeClass('hidden').show();
            }
            if (op.debug && window.console) {
                console.log('#' + id + ' が見つかりません');
            }
        }
    };
    $.MTAppFieldSort.defaults = {
        sort: 'title,text,tags,excerpt,keywords',
        insertID: 'sortable',
        insert_id: 'sortable',// Deprecated
        otherFieldHide: false,
        debug: false
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
    //    pointerBasename: {String} pointerを指定しない場合は、pointerBasenameに
    //                      タブを挿入する起点となるノードのbasenameを指定できる。ex. title
    //    insert: {String} 起点となるノードの前に挿入（before）するか後ろに挿入（after）するか。
    // -------------------------------------------------
    $.MTAppTabs = function(options){
        var op = $.extend({}, $.MTAppTabs.defaults, options);

        if (op.basename == null) return;
        op.pointerBasename = (op.pointer_basename && !op.pointerBasename) ? op.pointer_basename : op.pointerBasename;
        var selector;
        if (op.pointer != '') {
            selector = op.pointer;
        }
        else if (op.pointerBasename != '') {
            selector = '#' + getFieldID(op.pointerBasename);
            if (!$(selector).length) return;
        }
        else {
            return;
        }
        var div = [
            '<div class="mtapp-tabs-container">',
                '<ul class="mtapp-tabs-navi" style="position:relative;z-index:9999;">',
                '</ul>',
            '</div>'
        ];
        var container;
        if (op.insert == 'before') {
            container = $(selector).before(div.join('')).prev('.mtapp-tabs-container');
        }
        else if (op.insert == 'after') {
            container = $(selector).after(div.join('')).next('.mtapp-tabs-container');
        }
        else {
            return;
        }
        var ids = [];
        var li = [];
        for (var basename in op.basename) {
            var _id = '#' + getFieldID(basename);
            ids.push(_id);
            li.push('<li><a href="' + _id + '">' + op.basename[basename] + '</a></li>');
        }
        var $elms = $(ids.join(','));
        $elms.removeClass('sort-enabled hidden').find('div.field-header').addClass('hidden');
        $('body').addClass('mtapp-tabs');
        container
            .append($elms)
            .find('.mtapp-tabs-navi').html(li.join(''));
        container.tabs();
    };
    $.MTAppTabs.defaults = {
        basename: null,
        pointer: '', // #title-field などのセレクタ
        pointerBasename: '', // title などのベースネーム
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

        var $msgBlock = $('#msg-block').append($myMsg);

        if (mtappVars.template_filename === 'dialog/asset_list') {
            $msgBlock.on('click', '.mt-close-msg', function(){
                $(this).parent('.msg').remove();
            });
        }

        if (op.timeout > 0) {
            var animation = (op.animation === 'slideUp') ? 'slideUp' : 'fadeOut';
            setTimeout(function(){
                if (animation === 'slideUp') {
                    $myMsg.slideUp();
                } else {
                    $myMsg.fadeOut();
                }
            }, op.timeout);
        }
    };
    $.MTAppMsg.defaults = {
        msg: '',
        type: 'info',
        parent: false,
        timeout: 0,
        animation: 'fadeOut'
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
    //    width: {Number} ダイアログの横幅（初期値 'auto'）pxの単位は不要。
    //    height: {Number} ダイアログの高さ（初期値 'auto'）pxの単位は不要。
    //    modal: {Boolean} true を設定するとモーダルダイアログになります。
    //    hideEffect: {String} 閉じる時のエフェクト 'explode', 'slide', 'drop'
    // ---------------------------------------------------------------------

    $.MTAppDialogMsg = function(options){
        var op = $.extend({}, $.MTAppDialogMsg.defaults, options);

        op.hideEffect = op.hide_effect ? op.hide_effect : op.hideEffect;
        $('#mtapp-dialog-msg')
            .html(op.content)
            .dialog({
                autoOpen: false,
                modal: true,
                title: op.title,
                width: op.width,
                height: op.height,
                modal: op.modal,
                hide: op.hideEffect
            });
        $('#mtapp-dialog-msg').dialog('open');
    };
    $.MTAppDialogMsg.defaults = {
        title: 'メッセージ',
        content: 'Movable Typeへようこそ！',
        width: 'auto',
        height: 'auto',
        modal: false,
        hideEffect: ''
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
    //  $.MTAppOtherTypeCategories();
    //
    //  Description:
    //    記事カテゴリ選択のUIをラジオボタンまたはドロップダウンリストに変更する。
    //
    //  Usage:
    //    $.MTAppOtherTypeCategories(options);
    //
    //  Options:
    //    type: {String} 'radio'（ラジオボタン） or 'select'（ドロップダウンリスト）
    //    label: {String} ウィジェットのタイトルバーに表示されるラベル
    //    lanotSelectedTextbel: {String} 未選択状態にするための要素のラベル
    //    debug: {Boolean} trueにすると元のカテゴリウィジェットが表示される
    // -------------------------------------------------
    $.MTAppOtherTypeCategories = function(options){
        var op = $.extend({}, $.MTAppOtherTypeCategories.defaults, options);

        if (mtappVars.type === 'entry' || mtappVars.screen_id === 'edit-entry') {
            var newCategoryWidgetType = op.type;
            var newCategoryWidgetHtml = $.MTAppMakeWidget({
                label: op.label,
                content: '<div id="other-type-category-list"></div>'
            });
            $('#category-field').after(newCategoryWidgetHtml);
            var $anotherCategoryList = $('#other-type-category-list');
            $(window).load(function(){
                if (!op.debug) {
                    $('#category-field').addClass('mtapp-other-type-categories');
                }
                var radioCatList = [];
                $('#category-selector-list div.list-item').each(function(i){
                    var categoryIds = $('#category-ids').val();
                    var $div = $(this).children().children('div');
                    var catLabel = $div.text().replace(/\s/g, '');
                    var catId = $div.children('input').attr('name');
                    var _html = [];
                    if (catId) {
                        catId = catId.match(/[0-9]+$/)[0];
                    }
                    else {
                        return true;
                    }
                    switch (newCategoryWidgetType) {
                        case 'radio':
                            var AttrDefChecked = categoryIds ? '': ' checked="checked"';
                            var AttrChecked = (categoryIds == catId) ? ' checked="checked"': '';
                            if (i == 0) {
                                _html.push('<label for="another-cat-0"><input id="another-cat-0" type="radio" name="other-type-category" value=""' + AttrDefChecked + '>' + op.notSelectedText+ '</label>');
                            }
                            _html.push('<label for="another-cat-' + catId + '"><input id="another-cat-' + catId + '" type="radio" name="other-type-category" value="' + catId + '"' + AttrChecked + '>' + catLabel + '</label>');
                            break;
                        case 'select':
                            var AttrDefSelected = categoryIds ? '': ' selected';
                            var AttrSelected = (categoryIds == catId) ? ' selected': '';
                            if (i == 0) {
                                _html.push('<select name="other-type-category"><option value=""' + AttrDefSelected + '>未選択</option>');
                            }
                            _html.push('<option value="' + catId + '"' + AttrSelected + '>' + catLabel + '</option>');
                            break;
                        default: return false;
                    }
                    radioCatList.push(_html.join(''));
                });
                switch (newCategoryWidgetType) {
                    case 'radio':
                        $anotherCategoryList.html(radioCatList.join(''));
                        $anotherCategoryList
                            .find('input[name="other-type-category"]')
                            .on('click', function(){
                                if ($(this).is(':checked')) {
                                    $('#category-ids').val($(this).val());
                                }
                                else {
                                    $('#category-ids').val('');
                                }
                            });
                        break;
                    case 'select':
                        $anotherCategoryList.html(radioCatList.join('') + '</select>');
                        $anotherCategoryList
                            .find('select')
                            .on('change', function(){
                                $('#category-ids').val($(this).find('option:selected').val());
                            });
                        break;
                }
            });
        }
    };
    $.MTAppOtherTypeCategories.defaults = {
        type: 'radio', // or 'select'
        label: 'カテゴリ',
        notSelectedText: '未選択',
        debug: false
    };
    // end - $.MTAppOtherTypeCategories();


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
            .css({
                'margin-right': '4px',
                'margin-left': '4px'
            })
            .html('<label><a href="javascript:void(0);">Full</a></label>')
            .toggle(
                function(){
                    var textfieldHeight = $('#text-field').height();
                    var textareaHeight = $('#editor-content-enclosure').height();
                    $('body').css({
                        'overflow':'hidden',
                        'padding-right':'17px'
                    });
                    $('#overlay')
                        .height($(document).height())
                        .fadeIn(function(){
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
    //  $.MTAppHasCategory();
    //
    //  Description:
    //
    //    必要な数のカテゴリや指定したIDのカテゴリが選択されているかチェックし、選択されていない場合はエラーダイアログを表示する。
    //
    //  Usage:
    //    $.MTAppHasCategory(options);
    //
    //  Options:
    //    requiredIds: {String} 必須カテゴリIDをカンマ区切り
    //    requiredCount: {Number} 必須選択の数
    //    idErrorTitle: {String} 'エラー',
    //    idErrorContent: {String} '必須カテゴリが選択されていません。'
    //    countErrorTitle: {String} 'エラー',
    //    countErrorContent: {String} '必要な数のカテゴリが選択されていません。'
    // ---------------------------------------------------------------------

    $.MTAppHasCategory = function(options){
        var op = $.extend({}, $.MTAppHasCategory.defaults, options);
        var $form = $('form#entry_form');
        if ($form.length < 1) return;
        var type = mtappVars.type;
        if (!(type == 'entry' || type == 'page')) return;
        var reqCats = (op.requiredIds) ? op.requiredIds.split(',') : [];
        $form.on('click', ':submit.primary', function(){
            var categoryIds = $("input[name='category_ids']").val() ? $("input[name='category_ids']").val().split(',') : [];
            var count = 0;
            var eerror = false;
            if (reqCats.length) {
                for (var i = 0, l = reqCats.length; i < l; i++) {
                    if ($.inArray(reqCats[i], categoryIds) == -1) {
                        $.MTAppDialogMsg({
                            title: op.idErrorTitle,
                            content: op.idErrorContent,
                            modal: true
                        });
                        $form.find('button:submit:disabled').prop('disabled', false);
                        return false;
                    }
                }
            }
            if (op.requiredCount && op.requiredCount > categoryIds.length) {
                $.MTAppDialogMsg({
                    title: op.countErrorTitle,
                    content: op.countErrorContent,
                    modal: true
                });
                $form.find('button:submit:disabled').prop('disabled', false);
                return false;
            }
        });
    };
    $.MTAppHasCategory.defaults = {
        requiredIds: '',
        requiredCount: 0,
        idErrorTitle: 'エラー',
        idErrorContent: '必須カテゴリが選択されていません。',
        countErrorTitle: 'エラー',
        countErrorContent: '必要な数のカテゴリが選択されていません。'
    };
    // end - $.MTAppHasCategory()


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
                            .prev().show().addClass('edited')
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
    //  $(foo).MTAppRemoveVal();
    //
    //  Description:
    //    指定したinput:text, textareaにクリアボタンを付ける。
    //
    //  Usage:
    //    $(foo).MTAppRemoveVal();
    // -------------------------------------------------
    $.fn.MTAppRemoveVal = function() {
        return this.each(function(){
            var $this = $(this).css('padding-right', '16px').wrap('<div class="mtapp-remove-val" />');
            var $wrap = $this.parent().css('position', 'relative');
            var outerH = $wrap.outerHeight(),
                posTop = outerH / 2 - 7;
            $wrap.append('<img class="mtapp-remove-val-btn" alt="" src="' + mtappVars.static_plugin_path + 'images/cancel-gray.png" style="top: ' + posTop + 'px;" />')
                .children('img').click(function(){
                    $this.val('').focus();
                });
        });
    };
    // end - $(foo).MTAppRemoveVal();


    // -------------------------------------------------
    //  $.MTAppRemoveVal();
    //
    //  Description:
    //    ブログ記事・ウェブページ編集画面のメインカラムのinput:text, textareaにクリアボタンを付ける。
    //
    //  Usage:
    //    $.MTAppRemoveVal();
    // -------------------------------------------------
    $.MTAppRemoveVal = function() {
        if (mtappVars.screen_id == 'edit-entry' || mtappVars.screen_id == 'edit-page') {
            $('#sortable div.field-content').find('input:text,textarea').filter(':visible').MTAppRemoveVal();
        }
    };
    // end - $.MTAppRemoveVal();


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
    //    minMsg: {String} 最小値よりも小さかったときのアラートメッセージ
    //    maxMsg: {String} 最大値よりも大きかったときのアラートメッセージ
    //    zeroPad: {Boolean} 先頭の0を残す場合はtrue
    // -------------------------------------------------
    $.fn.MTAppNumChecker = function(options) {
        var op = $.extend({}, $.fn.MTAppNumChecker.defaults, options);
        op.minMsg = op.minMsg ? op.minMsg : op.min_msg;
        op.maxMsg = op.maxMsg ? op.maxMsg : op.max_msg;
        op.zeroPad = op.zeroPad ? op.zeroPad : op.zero_pad;
        return this.each(function(){
            $(this)
                .after('<span class="mun_msg" style="display:none;color:red;font-weight:bold;"></span>')
                .blur(function(){
                    var $this = $(this);
                    var text = $this.val() + '';
                    text = $.toInt(text, true).replace(/．|。/g, '.').replace(/，|、/g, ',').replace(/ー|ｰ|−|—/g,'-');
                    text = $.trim(text);
                    if (!op.zeroPad) {
                        text = text.replace(/^0+/g, '');
                    }
                    var num = 0;
                    if (op.min !== -9999999999 || op.max !== 9999999999) {
                        var span = $this.next('span');
                        num = Number(text.replace(/^0+/g, '').replace(/(.+)-+(.*)/g, '$1$2').replace(/[^0-9\-\.]/g, ''));
                    }
                    if (op.min !== -9999999999 && op.max !== 9999999999) {
                        if (op.min > num) {
                            span.text(op.minMsg).show();
                        }
                        else if (op.max < num) {
                            span.text(op.maxMsg).show();
                        }
                        else {
                            span.text('').hide();
                        }
                    }
                    else if (op.min !== -9999999999 && op.max === 9999999999) {
                        if (op.min > num) {
                            span.text(op.minMsg).show();
                        } else {
                            span.text('').hide();
                        }
                    }
                    else if (op.min === -9999999999 && op.max !== 9999999999) {
                        if (op.max < num) {
                            span.text(op.maxMsg).show();
                        } else {
                            span.text('').hide();
                        }
                    }
                $this.val(text);
                })
        });
    };
    $.fn.MTAppNumChecker.defaults = {
        min: -9999999999,
        max: 9999999999,
        minMsg: '値が小さすぎます。',
        maxMsg: '値が大きすぎます。',
        zeroPad: false
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
    //    rate: {Number} 消費税率（例）5%の時は0.05と書く
    //    rounding: {String} 端数処理 => floor（切り捨て）、ceil（切り上げ）、round（四捨五入）
    // -------------------------------------------------
    $.fn.MTAppTaxAssist = function(options) {
        var op = $.extend({}, $.fn.MTAppTaxAssist.defaults, options);
        var roundingType = op.rounding ? op.rounding : op.fraction;
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
                        var val = Number(self.val()) * (1 + op.rate);
                        self.val(rounding(val, roundingType));
                    })
                .next()
                    .click(function(){
                        $(this).addClass('clicked');
                        var val = Number(self.val()) / (1 + op.rate);
                        self.val(rounding(val, roundingType));
                    });
        });
        function rounding(num, roundingType){
            switch (roundingType) {
                case 'floor':
                    num = Math.floor(num);
                    break;
                case 'ceil':
                    num = Math.ceil(num);
                    break;
                case 'round':
                    num = Math.round(num);
                    break;
            }
            return num;
        }
    };
    $.fn.MTAppTaxAssist.defaults = {
        rate: 0.05,
        rounding: 'floor', // floor（切り捨て）、ceil（切り上げ）、round（四捨五入）
        fraction: 'floor' // rounding の後方互換
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
    //    target: {String} 自動変更する日付の種類を指定。公開日'created_on'または更新日'modified_on'
    //    update: {Function} 並べ替えが完了したときのイベントを設定。
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
                        if (typeof op.update == 'function') {
                            op.update(ev, ui);
                        } else if (op.target == 'created_on' || op.target == 'modified_on') {
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
        update: null
    };
    // end - $.MTAppSortableBatchEdit();


    // -------------------------------------------------
    //  $.MTAppBatchEditCategory();
    //
    //  Description:
    //    ブログ記事・ウェブページ一括編集画面でカテゴリやフォルダをまとめて変更する
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
    //  $(foo).MTAppLineBreakField();
    //
    //  Description:
    //    「1項目ごとに改行してください」をGUIで実現します。(MT5.2 later)
    //
    //  Usage:
    //    $(foo).MTAppLineBreakField(options);
    //
    //  Options:
    //    input_class: {String} 'sub-class1 sub-class2'
    //
    // -------------------------------------------------
    $.fn.MTAppLineBreakField = function(options) {
        var op = $.extend({}, $.fn.MTAppLineBreakField.defaults, options);

        var inputClass = op.inputClass ? op.inputClass : op.input_class;
        var isSortable = op.sortable;
        return this.each(function(){
            var $this = $(this).hide();
            var this_id = $this.attr('id')
            var this_value = $this.val().split('\n');
            var $fieldContent = $this.parent();

            var input = [];
            for (var i = 0, n = this_value.length; i < n; i++) {
                input.push(item(this_value[i]));
            }
            $this.after(input.join(''));

            $fieldContent
                .on('click', 'img.mtapp-linebreak-field-add', function(){
                    $(this).parent().parent().after(item('')).next().children().children().focus();
                })
                .on('blur', 'input.mtapp-linebreak-field-input', function(){
                    var text = [];
                    var inputs = $fieldContent.find('input.mtapp-linebreak-field-input');
                    var inputs_count = inputs.length;
                    inputs.each(function(){
                        if ($(this).val() != '') {
                            text.push($(this).val());
                        } else if (inputs_count > 1) {
                            $(this).parent().parent().remove();
                        }
                    });
                    $this.val(text.join("\n"));
                })
                .on('keydown', 'input.mtapp-linebreak-field-input', function(e){
                    var keycode = e.which || e.keyCode;
                    if (keycode == 13) {
                        $(this).blur().next().click();
                        return false;
                    }
                });
            if (isSortable) {
                $fieldContent.addClass('mtapp-sortable').sortable({
                    update: function(e, ui){
                        $(ui.item).find('input').blur();
                    }
                });
            }

            function item (val) {
                return [
                    '<span class="mtapp-linebreak-field-item">',
                        '<span class="mtapp-linebreak-field-item-inner">',
                            '<input type="text" class="mtapp-linebreak-field-input ' + inputClass + '" value="' + val + '" />',
                            '<img class="mtapp-linebreak-field-add" src="' + mtappVars.static_plugin_path + 'images/plus-circle.png" alt="plus" />',
                        '</span>',
                    '</span>'
                ].join('');
            }

        });
    };
    $.fn.MTAppLineBreakField.defaults = {
        inputClass: 'text full',
        sortable: true
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
    //    id: {String} フィールドのID。自動で -field が付与される。
    //    label: {String} ラベル部分のテキスト、HTML
    //    content: {String} コンテンツ部分のテキスト、HTML
    //    hint: {String} コンテンツのヒント部分のテキスト、HTML
    //
    // -------------------------------------------------
    $.MTAppMakeField = function(options) {
        var op = $.extend({}, $.MTAppMakeField.defaults, options);
        var id = op.id ? ' id="' + op.id + '-field"' : '';
        var hint = op.hint ? '<div class="hint">' + op.hint + '</div>' : '';
        return [
            '<div' + id + ' class="field field-top-label sort-enabled">',
                '<div class="field-header"><label>' + op.label + '</label></div>',
                '<div class="field-content">',
                op.content + hint,
                '</div>',
            '</div>'
        ].join('');
    };
    $.MTAppMakeField.defaults = {
        id: '',
        label: '',
        content: '',
        hint: ''
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
    //  $.MTAppGroupFilter(); (for PowerCMS)
    //
    //  Description:
    //    PowerCMSのグループ作成画面の左のカラムに検索フィルター機能を追加します。
    //
    //  Usage:
    //    $.MTAppGroupFilter(options);
    //
    // -------------------------------------------------
    $.MTAppGroupFilter = function(options) {
        if (!/group$/.test(mtappVars.screen_id) || $('#filter-select').length == 0) return;
        $('#filter-select').append('<input type="search" value="" id="mtapp-group-filter" placeholder="filter...">');
        $('#mtapp-group-filter').keyup(function(){
            var reg = new RegExp($(this).val(), 'i');
            $('#item-left div.object-listing-content li > span').each(function(){
                if (reg.test($(this).text())) {
                    $(this).parent().removeClass('hidden');
                } else {
                    $(this).parent().addClass('hidden');
                }
            });
        });
    };
    // end - $.MTAppGroupFilter();


    // -------------------------------------------------
    //  $.MTAppSnippetHelper(); (for PowerCMS)
    //
    //  Description:
    //    PowerCMSのスニペット・カスタムフィールドの新規作成を手助けする。
    //
    //  Usage:
    //    $.MTAppSnippetHelper();
    //
    // -------------------------------------------------
    // $.MTAppSnippetHelper = function(options) {
    //     if (mtappVars.screen_id != 'edit_field') return;
    //     var $helperBtn = $('<button class="button" id="mtapp-snippet-helper-action">スニペットヘルパー ON</button>').click(function(){
    //         $(this).addClass('hidden');
    //         _snippetHelper();
    //         if ($('#default:visible').length > 0) {
    //             _defaultHelper();
    //         }
    //         return false;
    //     });
    //     var type = $('#type').val();
    //     if (type == 'snippet') {
    //         $('#type-field div.field-content').append($helperBtn);
    //     } else {
    //         $('#type').change(function(){
    //             var _type = $(this).find('option:selected').val();
    //             if (_type == 'snippet') {
    //                 $('#type-field div.field-content').append($helperBtn);
    //             }
    //         });
    //     }

    //     function _snippetHelper() {
    //         var $options = $('#options').after('<button class="button" id="mtapp-snippet-make-options">連番オプション作成</button>');
    //         $('#mtapp-snippet-make-options').click(function(){
    //             var res = [];
    //             var optionsArry = $options.val().split(',');
    //             for (var i = 0, l = optionsArry.length; i < l; i++) {
    //                 optionsArry[i] = optionsArry[i].replace(/_[0-9]+$/, '');
    //             }
    //             optionsArry = $.unique(optionsArry);
    //             var to = prompt('連番の個数はいくつですか？', 10);
    //             for (var i = 0, l = optionsArry.length; i < l; i++) {
    //                 for (var x = 0; x < to; x++) {
    //                     res.push(optionsArry[i] + '_' + x);
    //                 }
    //             }
    //             $options.val(res.join(','));
    //             return false;
    //         });
    //     }
    //     function _defaultHelper() {
    //         var $options = $('#options');
    //         var $default = $('#default').after('<button class="button" id="mtapp-snippet-make-default">連番系ひな形作成</button>');
    //         $('#mtapp-snippet-make-default').click(function(){
    //             var resHasValue = '';
    //             var optionsCount = 0;
    //             var optionsAll = $options.val().split(',');
    //             var optionsFirst = optionsAll[0].replace(/_[0-9]+$/, '');
    //             var basename = $('#basename').val();
    //             var optionsUnique = [];
    //             for (var i = 0, l = optionsAll.length; i < l; i++) {
    //                 if (optionsAll[i].indexOf(optionsFirst) > -1) {
    //                     optionsCount++;
    //                 }
    //                 optionsUnique[i] = optionsAll[i].replace(/_[0-9]+$/, '');
    //             }
    //             optionsUnique = $.unique(optionsUnique);

    //             // for (var i = 0, l = optionsAll.length; i < l; i++) {
    //             //     res.push('<mt:SetVarBlock name="' + basename + '" key="' + optionsAll[i] + '"><mt:Var name="' + optionsAll[i] + '" /></mt:SetVarBlock>');
    //             // }
    //             var defaultVal = $default.val();
    //             if (defaultVal && confirm('現在の既定値を上書きしますか？')) {
    //                 var res = [];
    //                 var separator = "\n";

    //                 res.push('<div id="' + basename + '">');
    //                 for (var i = 0; i < optionsCount; i++) {
    //                     res.push([
    //                         '<div class="mtapp-sortable-item">',
    //                         '  <div class="mtapp-sortable-item-header"></div>',
    //                         '  <div class="mtapp-sortable-item-header">'
    //                     ].join(separator));
    //                     for (var x = 0, y = optionsUnique.length; x < y; x++) {
    //                         res.push('    <input type="text" id="' + optionsUnique[x] + '_' + i + '" name="' + optionsUnique[x] + '_' + i + '" value="<mt:Var name="' + optionsUnique[x] + '_' + i + '">">');
    //                     }
    //                     res.push([
    //                         '  </div>',
    //                         '</div>'
    //                     ].join(separator));
    //                 }
    //                 res.push('</div>');

    //                 // res.push('<mt:For var="i" from="0" to="' + (optionsCount - 1) + '">');
    //                 // for (var i = 0, l = optionsAll.length; i < l; i++) {
    //                 //     // res.push('<mt:SetVarBlock name="v_' + optionsAll[i] + '">' + optionsAll[i] + '_<mt:Var name="i" /></mt:SetVarBlock>');
    //                 //     var innerHTML = [
    //                 //     ];
    //                 //     res.push(innerHTML.join(''));
    //                 //     // resHasValue += '<mt:Var name="$v_' + optionsAll[i] + '">';
    //                 // }
    //                 // res.push('<mt:SetVarBlock name="has_value">' + resHasValue + '</mt:SetVarBlock>');
    //                 // res.push('<mt:If name="i" eq="0"><mt:SetVar name="has_value" value="1" /></mt:If>');
    //                 // res.push('</mt:For>');
    //                 $default.val(res.join(separator));
    //             }
    //             return false;
    //         });
    //     }
    // };
    // end - $.MTAppSnippetHelper();


    // -------------------------------------------------
    //  $(foo).MTAppSortableSnippet(); (for PowerCMS)
    //
    //  Description:
    //    「1項目ごとに改行してください」をGUIで実現します。(MT5.2 later)
    //
    //  Usage:
    //    $(foo).MTAppSortableSnippet(options);
    //
    //  Options:
    //    input_class: {String} 'sub-class1 sub-class2'
    //
    // -------------------------------------------------
    // $.fn.MTAppSortableSnippet = function(options) {
    //     var op = $.extend({}, $.fn.MTAppSortableSnippet.defaults, options);

    //     return this.each(function(){
    //         var $this = $(this);
    //         var $sortableItem = $this
    //             .find('.mtapp-sortable-item').css({
    //                 position: 'relative',
    //                 marginBottom: '10px',
    //                 paddingLeft: '20px'
    //             })
    //             .each(function(){
    //                 $(this)
    //                     .find('.mtapp-sortable-item-header')
    //                     .append('<img src="' + mtappVars.static_plugin_path + 'images/arrow-move.png" style="cursor:move;position:absolute;top:3px;left:0;">');
    //             });
    //         var $addBtn = $('<div style="text-align:right;"><button class="button" data-count="1">追加</button></div>')
    //             .find('button')
    //             .click(function(){
    //                 var $hiddenItem = $sortableItem.filter('.hidden:first').removeClass('hidden');
    //                 if ($hiddenItem.next('.mtapp-sortable-item').length == 0) {
    //                     $(this).addClass('hidden');
    //                 }
    //                 return false;
    //             })
    //             .end();
    //         $this.append($addBtn);
    //         $this.sortable({
    //             items: '.mtapp-sortable-item',
    //             cursor: 'move',
    //             stop: function(ev, ui){
    //                 $(ui.item).siblings().andSelf().each(function(i){
    //                     $(this).find('.mtapp-item-data').each(function(){
    //                         var n = this.name.replace(/(.+_)[0-9]+$/, '$1' + i);
    //                         $(this).attr('name', n);
    //                     });
    //                 });
    //             }
    //         });
    //     });
    // };
    // $.fn.MTAppSortableSnippet.defaults = {
    //     limit: 10
    // };
    // end - $(foo).MTAppSortableSnippet();


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
    //  $(foo).noScroll(styles, containerSelector);
    //
    //    Description:
    //      $(foo)をスクロールに追随させる。
    //    Param:
    //      styles: {Object} $(foo)に設定するCSSがある場合はObjectで設定する
    //      containerSelector: $(foo)の最上位の親要素のセレクタを指定。
    //                         $(foo)の高さがウィンドウよりも大きい場合に無限スクロールになってしまうのを防ぐ。
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
        noScroll: function (styles, containerSelector){
            if (this.length < 1) return;
            var $this = this;
            if (containerSelector) {
                $(containerSelector).css('overflow-y', 'hidden');
            }
            var $parent = $this.parent().css('position', 'relative');
            var parentHeight = $parent.height();
            $parent.height(parentHeight);
            $this.css({'position': 'absolute', 'z-index': 99});
            if (styles) {
                $this.css(styles);
            }
            $(window).scroll(function(){
                var thisTop = $(document).scrollTop() - $parent.offset().top + 10;
                if (thisTop < 0) {
                    thisTop = 0;
                }
                $this.stop().animate(
                    {top: thisTop + 'px'},
                    'fast',
                    'swing'
                );
            });
            return $this;
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
        toInt: function(str, allow) {
            str = str + "";
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
            if (!allow) {
                str = str.replace(/\D/g, '');
            }
            return str;
        },
        // 変数の型を調べる(jQuery 1.9.1 later => jQuery.type)
        varType: function(obj) {
            return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
        },
        // 数字を3桁ごとにカンマで区切る
        numberFormat: function(num) {
            num = '' + num;
            var numArray = (num.indexOf('.') !== -1) ? num.split('.') : [num];
            numArray[0] = numArray[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            return numArray.join('.');
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

    // cookieにページを判別する情報を保存
    setCookie('mtappVars_type', mtappVars.type, 30);
    setCookie('mtappVars_scope_type', mtappVars.scope_type, 30);
    setCookie('mtappVars_screen_id', mtappVars.screen_id, 30);

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
