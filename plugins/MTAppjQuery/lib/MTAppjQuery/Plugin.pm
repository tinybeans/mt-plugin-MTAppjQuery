package MTAppjQuery::Plugin;
use strict;
use utf8;
use MT::Website;
use MT::Blog;
use MT::Util;
use MT::Theme;
use MTAppjQuery::Tmplset;


###
##
#
use MT::Log;
use Data::Dumper;
sub doLog {
    my ($msg, $code) = @_;     return unless defined($msg);
    my $log = MT::Log->new;
    $log->message($msg);
    $log->metadata($code);
    $log->save or die $log->errstr;
}
#
##
###

sub cb_tmpl_source_header {
    my ($cb, $app, $tmpl_ref) = @_;
# my $q = $app->param;
# doLog('$app->param! : '.Dumper($q));
    my $p = MT->component('mt_app_jquery');

    ### 各種情報を取得する
    my $_type       = $app->param('_type') || 'type';
    my $id          = $app->param('id') || 0;
    my $blog_id     = $app->param('blog_id') || 0;
    my $author_id   = $app->user->id;
    # オブジェクトのタイプを判別して各オブジェクトのIDを取得する
    my $entry_id    = $_type eq 'entry' ? $id : 0;
    my $page_id     = $_type eq 'page' ? $id : 0;
    my $category_id = $_type eq 'category' ? $id : 0;
    my $template_id = $_type eq 'template' ? $id : 0;
    my $folder_id   = $_type eq 'folder' ? $id : 0;
    my $asset_id    = $_type eq 'asset' ? $id : 0;
    my $comment_id  = $_type eq 'comment' ? $id : 0;
    my $ping_id     = $_type eq 'ping' ? $id : 0;
    my $user_id     = $_type eq 'author' ? $id : 0; # ログイン中のユーザーは author_id だよ
    my $field_id    = $_type eq 'field' ? $id : 0;

    ### 各種パスを取得する（スラッシュで終わる）
    my $static_path        = $app->static_path;
    my $static_plugin_path = $static_path . $p->envelope . '/';

    ### プラグインの設定の値を取得する
    my $scope = (!$blog_id) ? 'system' : 'blog:'.$blog_id;
    my $op_active         = $p->get_config_value('active', $scope);
    return unless $op_active;
    my $op_usercss        = $p->get_config_value('usercss', $scope);
    my $op_userjs         = $p->get_config_value('userjs', $scope);
    my $op_slidemenu      = $p->get_config_value('slidemenu', $scope);
    my $op_superslidemenu = $p->get_config_value('superslidemenu', $scope);
    my $op_freearea       = $p->get_config_value('jqplugin', $scope);
    my $op_jquery_ready   = $p->get_config_value('jquery_ready', $scope);
    my $op_jqselectable   = $p->get_config_value('jqselectable', $scope);

## debug
my $debug_msg = "blog_id = ${blog_id} のページ";
my $debug_code = <<__DEBUG__;
scope : $scope
op_active : $op_active
op_usercss : $op_usercss
op_userjs : $op_userjs
op_slidemenu : $op_slidemenu
op_superslidemenu : $op_superslidemenu
op_jsfreearea : $op_freearea
op_jqselectable : $op_jqselectable
__DEBUG__
doLog($debug_msg, $debug_code);
## debug

    ### ローディング画像、ツールチップ用ボックスをページに追加する
    my $preset = <<__MTML__;
    <img id="mtapp-loading" src="${static_path}images/indicator.gif" alt="Loading..." />
    <mt:setvarblock name="html_body_footer" append="1">
    <div id="mtapp-tooltip" style="display: none;"></div>
    </mt:setvarblock>
__MTML__
    $$tmpl_ref =~ s!(<div id="container")!$preset$1!g;

    my ($user_css, $set_blog_id, $user_js, $super_slide_menu_js);

    ### jQueryの読み込み直後に実行できるjquery_ready.jsをセットする
    if ($op_jquery_ready) {
        my $load_jquery_min =
        '<script type="text/javascript" src="<$mt:var name="static_uri"$>jquery/jquery.min.js?v=<mt:var name="mt_version_id" escape="URL">"></script>';
        my $load_jquery =
        '<script type="text/javascript" src="<$mt:var name="static_uri"$>jquery/jquery.js?v=<mt:var name="mt_version_id" escape="URL">"></script>';

        my $jquery_ready_min = <<__MTML__;
    $load_jquery_min
    <script type="text/javascript" src="${static_plugin_path}js/jquery_ready.js"></script>
__MTML__

        my $jquery_ready = <<__MTML__;
    $load_jquery
    <script type="text/javascript" src="${static_plugin_path}js/jquery_ready.js"></script>
__MTML__

        $load_jquery_min = quotemeta($load_jquery_min);
        $load_jquery = quotemeta($load_jquery);

        $$tmpl_ref =~ s!$load_jquery_min!$jquery_ready_min!g;
        $$tmpl_ref =~ s!$load_jquery!$jquery_ready!g;
    }


    ### スライドメニューをセットする
    if ($op_slidemenu && !$op_superslidemenu) {
        my $s_menu_org = MTAppjQuery::Tmplset::s_menu_org;
        my $w_menu_org = MTAppjQuery::Tmplset::w_menu_org;
        my $b_menu_org = MTAppjQuery::Tmplset::b_menu_org;
        my $s_menu     = MTAppjQuery::Tmplset::s_menu;
        my $w_menu     = MTAppjQuery::Tmplset::w_menu;
        my $b_menu     = MTAppjQuery::Tmplset::b_menu;
        $$tmpl_ref =~ s!$s_menu_org!$s_menu!g;
        $$tmpl_ref =~ s!$w_menu_org!$w_menu!g;
        $$tmpl_ref =~ s!$b_menu_org!$b_menu!g;
    }

    ### スーパースライドメニューをセットする
    my $website_json = '';
    my $blog_json = '';
    my $perms_json = '';
    if ($op_superslidemenu) {
        my @website = MT::Website->load;
        my @blog = MT::Blog->load;

        require MT::Permission;
        my @perms = MT::Permission->load({author_id => $author_id})
            or die "Author has no permissions for blog";

        my (@website_json, @blog_json, @perms_json);
#         my $user = $app->user;
#         my $author_id = $user->id;
#         my $perms = $user->permissions;
#         doLog($author_id);

        # websiteの内容をJSONに書き出す
        foreach my $website (@website) {
            my %website_date = (
                'id' => $website->id,
                'name' => $website->name,
                'parent_id' => $website->parent_id,
            );
            push @website_json, MT::Util::to_json(\%website_date);
        }
        $website_json = join ",", @website_json;
        doLog($website_json);

        # blogの内容をJSONに書き出す
        foreach my $blog (@blog) {
            my %blog_date = (
                'id' => $blog->id,
                'name' => $blog->name,
                'parent_id' => $blog->parent_id,
            );
            push @blog_json, MT::Util::to_json(\%blog_date);
        }
        $blog_json = join ",", @blog_json;
        doLog($blog_json);

        # permissionの内容をJSONに書き出す
        foreach my $perms (@perms) {
            my %perms_date = (
                'blog_id' => $perms->blog_id,
                'author_id' => $perms->author_id,
                'permissions' => $perms->permissions,
            );
            push @perms_json, MT::Util::to_json(\%perms_date);
        }
        $perms_json = join ",", @perms_json;
        doLog($perms_json);

#         require MT::Permission;
#         my $blog_perms = MT::Permission->load({ blog_id => $blog_id, author_id => $author_id})
#             or die "Author has no permissions for blog";
#         my $out = $blog_perms->can_edit_notifications
#             or die "Author cannot post to blog";
#         doLog('can_edit_notifications : ' . $out);


        ### websiteとblogのjsonを生成
#         my (@websites, @websites_json, @blogs, @blogs_json, $websites_json, $blogs_json);
#         push @websites, MT::Website->load(undef, {unique => 1});
#         push @blogs, MT::Blog->load(undef, {unique => 1});
# 
#         foreach my $website (@websites) {
#             my @theme_thumb = $website->theme
#                 ? $website->theme->thumbnail( size => 'small' )
#                 : MT::Theme->default_theme_thumbnail( size => 'small' );
#             my $websites_hash = $website->column_values;
#             my %website_data = %$websites_hash;
#             $website_data{'theme_thumb'} = $theme_thumb[0];
#             push @websites_json, MT::Util::to_json(\%website_data);
#         }
#         $websites_json = join ",", @websites_json;
# 
#         foreach my $blog (@blogs) {
#             my @theme_thumb = $blog->theme
#                 ? $blog->theme->thumbnail( size => 'small' )
#                 : MT::Theme->default_theme_thumbnail( size => 'small' );
#             my $blogs_hash = $blog->column_values;
#             my %blog_data = %$blogs_hash;
#             $blog_data{'theme_thumb'} = $theme_thumb[0];
#             push @blogs_json, MT::Util::to_json(\%blog_data);
#         }
#         $blogs_json = join ",", @blogs_json;
# 
# # doLog("blogs_json : " . $blogs_json);
# 
#         my $MTAppSuperSlideMenu = MTAppjQuery::Tmplset::MTAppSuperSlideMenu;
#         $super_slide_menu_js = <<__MTML__;
#         <script type="text/javascript">
#         /* <![CDATA[ */
#         var mtapp_websites_json = [${websites_json}];
#         var mtapp_blogs_json = [${blogs_json}];
#         /* ]]> */
#         </script>
#         <script type="text/javascript">
#         ${MTAppSuperSlideMenu}
#         </script>
# __MTML__
    }

    ### user.css をセットする
    if ($op_usercss) {
        $user_css = <<__MTML__;
    <mt:setvarblock name="html_head" append="1">
    <link rel="stylesheet" href="${static_plugin_path}css/user.css" type="text/css" />
    </mt:setvarblock>
__MTML__
    }


    ### ブログIDなどの変数を定義する
    $set_blog_id = <<__MTML__;
    <mt:ignore> screen_id を設定する</mt:ignore>
    <mt:unless name="screen_id">
        <mt:if name="template_filename" like="list_">
            <mt:setvarblock name="screen_id">list-<mt:var name="object_type"></mt:setvarblock>
        </mt:if>
    </mt:unless>

    <script type="text/javascript">
    /* <![CDATA[ */
    // 後方互換（非推奨）
    var blogID = ${blog_id},
        authorID = <mt:if name="author_id"><mt:var name="author_id"><mt:else>0</mt:if>,
        ${_type}ID = ${id},
        blogURL = '<mt:if name="blog_url"><mt:var name="blog_url"><mt:else><mt:var name="site_url"></mt:if>',
        mtappURL = '${static_plugin_path}',
        mtappTitle = '<mt:if name="html_title"><mt:var name="html_title"><mt:else><mt:var name="page_title"></mt:if>',
        mtappScopeType = '<mt:var name="scope_type">',
        catsSelected = <mt:if name="selected_category_loop"><mt:var name="selected_category_loop" to_json="1"><mt:else>[]</mt:if>,
        mainCatSelected = <mt:if name="category_id"><mt:var name="category_id"><mt:else>''</mt:if>;

    // 推奨
    var mtappVars = {
        "author_id" : <mt:if name="author_id"><mt:var name="author_id"><mt:else>0</mt:if>,
        "user_name" : "<mt:var name="author_name" escape="html">",
        "curr_website_id" : <mt:if name="curr_website_id"><mt:var name="curr_website_id"><mt:else>0</mt:if>,
        "blog_id" : ${blog_id},
        "entry_id" : ${entry_id},
        "page_id" : ${page_id},
        "category_id" : ${category_id},
        "template_id" : ${template_id},
        "blog_url" : "<mt:if name="blog_url"><mt:var name="blog_url"><mt:else><mt:var name="site_url"></mt:if>",
        "static_plugin_path" : "${static_plugin_path}",
        "html_title" : "<mt:if name="html_title"><mt:var name="html_title"><mt:else><mt:var name="page_title"></mt:if>",
        "scope_type" : "<mt:var name="scope_type">",
        "selected_category" : <mt:if name="selected_category_loop"><mt:var name="selected_category_loop" to_json="1" regex_replace='/"/g',''><mt:else>[]</mt:if>,
        "main_category_id" : <mt:if name="category_id"><mt:var name="category_id"><mt:else>0</mt:if>,
        "screen_id" : "<mt:var name="screen_id">",
        "body_class" : [<mt:setvarblock name="mtapp_body_class">"<mt:var name="screen_type" default="main-screen"> <mt:if name="scope_type" eq="user">user system<mt:else><mt:var name="scope_type"></mt:if><mt:if name="screen_class"> <mt:var name="screen_class"></mt:if><mt:if name="top_nav_loop"> has-menu-nav</mt:if><mt:if name="related_content"> has-related-content</mt:if><mt:if name="edit_screen"> edit-screen</mt:if><mt:if name="new_object"> create-new</mt:if><mt:if name="loaded_revision"> loaded-revision</mt:if><mt:if name="mt_beta"> mt-beta</mt:if>"</mt:setvarblock><mt:var name="mtapp_body_class" regex_replace='/ +/g',' ' regex_replace='/ /g','","'>],
        "template_filename" : '<mt:var name="template_filename">',
        "website_json" : [${website_json}],
        "blog_json" : [${blog_json}],
        "perms_json" : [${perms_json}]
    }
    /* ]]> */
    </script>
__MTML__

    ### user.jsをセット
    if ($op_userjs) {
        $user_js = <<__MTML__;
    <script type="text/javascript" src="${static_plugin_path}js/user.js"></script>
__MTML__
  }

    ### jQselectableプラグインを利用する
    my $jqselectable = '';
    if ($op_jqselectable) {
       $jqselectable = <<__MTML__;
    <link type="text/css" rel="stylesheet" href="${static_plugin_path}lib/jQselectable/skin/selectable/style.css" />
    <script type="text/javascript" src="${static_plugin_path}lib/jQselectable/js/jQselectable.js"></script>
__MTML__
    }

    ### 各情報をheadにセットする
    my $html_head = '<mt:var name="html_head">';
    my $add_html_head = <<__MTML__;
    <link rel="stylesheet" href="${static_plugin_path}css/MTAppjQuery.css" type="text/css" />
    $user_css

    <mt:setvarblock name="js_include" append="1">
    $set_blog_id
    $jqselectable
    <mt:var name="uploadify_source">
    <script type="text/javascript" src="${static_plugin_path}js/MTAppjQuery.js"></script>
    $op_freearea
    </mt:setvarblock>

    <mt:setvarblock name="mtapp_prepend_footer_js">
    <div id="mtapp-dialog-msg"></div>
    </mt:setvarblock>

    <mt:setvarblock name="mtapp_footer_js">
    $user_js
    $super_slide_menu_js
    </mt:setvarblock>

    $html_head
__MTML__

    $$tmpl_ref =~ s/$html_head/$add_html_head/g;
}

sub cb_tmpl_source_footer {
    my ($cb, $app, $tmpl_ref) = @_;
    my $target = '</body>';
    my $replace = <<__MTML__;
    <mt:var name="mtapp_prepend_footer_js">
    <mt:var name="mtapp_footer_js">
    <script type="text/javascript">
    /* <![CDATA[ */
    (function(\$){
        <mt:var name="mtapp_footer_jq">
        jQuery('#mtapp-loading').hide();
        jQuery('#container').css('visibility','visible');
    })(jQuery);
    /* ]]> */
    </script>
    <mt:var name="mtapp_end_body">
    $target
__MTML__
    $$tmpl_ref =~ s!$target!$replace!;
}

sub cb_tmpl_source_fav_blogs {
    my ($cb, $app, $tmpl_ref) = @_;

# my $user = $app->user;
# my $perms = $user->permissions( 12 );
# doLog('$user : '.Dumper($user->__meta));

    ### class="parent-website-n"を付与
    my $classname = 'class="blog-content"';
    my $new_classname = 'class="blog-content parent-website-<mt:if name="blog_id"><mt:var name="website_id"><mt:else>0</mt:if>"';
    $$tmpl_ref =~ s!$classname!$new_classname!g;

    ### 構造タブを追加
    my $fav_blogs_tab_org = MTAppjQuery::Tmplset::fav_blogs_tab('before');
    my $fav_blogs_tab     = MTAppjQuery::Tmplset::fav_blogs_tab('after');
    $$tmpl_ref =~ s!$fav_blogs_tab_org!$fav_blogs_tab!g;

    ### 構造タブの中身を入れる
    my $fav_blogs_wdg_close_org = MTAppjQuery::Tmplset::fav_blogs_wdg_close_org;
    my $fav_blogs_wdg_close     = MTAppjQuery::Tmplset::fav_blogs_wdg_close;
    $$tmpl_ref =~ s!$fav_blogs_wdg_close_org!$fav_blogs_wdg_close!g;

}

# sub cb_tmpl_param_fav_blogs {
#     my ($cb, $app, $param, $tmpl) = @_;
#     $param->{'blogs_json'} = ('あ','い','う');
# }

sub cb_tmpl_param_edit_entry {
    my ($cb, $app, $param, $tmpl) = @_;
# doLog(Dumper($param));
    ### $app->
    my $host        = $app->{__host};
    my $static_path = $app->static_path;

    ### $param->
    my $blog_id   = $param->{blog_id} || 0;
    my $blog_url  = $param->{blog_url} || '';
    my $blog_path = $blog_url;
       $blog_path =~ s!^$host|\/$!!g;
# doLog('$blog_path : '.$blog_path.'  $blog_url : '.$blog_url);

    ### $p->
    my $p = MT->component('mt_app_jquery');
    my $scope = (!$blog_id) ? 'system' : 'blog:'.$blog_id;
    my $active_uploadify = $p->get_config_value('active_uploadify', $scope);
    return unless $active_uploadify;
    my $img  = &_config_replace($p->get_config_value('img_elm', $scope));
    my $file = &_config_replace($p->get_config_value('file_elm', $scope));

    ### Variable
    my $static_plugin_path = $static_path . $p->{envelope} . '/';

    ### SetVar(param)
    $param->{blog_path} = $blog_path;
    $param->{upload_folder} = $p->get_config_value('upload_folder', $scope);
    $param->{static_plugin_path} = $static_plugin_path;
    $param->{uploadify_source} = <<__MTML__;
    <link href="${static_plugin_path}lib/uploadify/css/uploadify.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="${static_plugin_path}lib/uploadify/scripts/swfobject.js"></script>
    <script type="text/javascript" src="${static_plugin_path}lib/uploadify/scripts/jquery.uploadify.v2.1.0.js"></script>
__MTML__

    ### Add uploadify-widget
    my $host_node = $tmpl->getElementById('entry-status-widget');
    my $new_node = $tmpl->createElement('app:widget',
        {
            id    => 'uploadify-widget',
            label => '<__trans_section component="mt_app_jquery"><__trans phrase="A multiple file upload"></__trans_section>',
        }
    );
    my $inner_html = MTAppjQuery::Tmplset::uploadify_widget_innerHTML;
    $inner_html =~ s!__IMAGES__!$img!g;
    $inner_html =~ s!__FILES__!$file!g;
    $new_node->innerHTML($inner_html);
    $tmpl->insertAfter($new_node, $host_node);

    ### Add asset_uploadify
    $host_node = $tmpl->getElementById('keywords');
    $new_node = $tmpl->createElement('app:Setting',
        {
            id    => 'asset_uploadify',
            label => '<__trans_section component="mt_app_jquery"><__trans phrase="A multiple file upload"></__trans_section>',
            label_class => 'top_label',
        }
    );
    $inner_html = <<__MTML__;
    <input type="text" name="asset_uploadify" id="asset_uploadify" value="<mt:var name="asset_uploadify">" class="full-width" mt:watch-change="1" />
__MTML__
    $new_node->innerHTML($inner_html);
# 最後にコメント外す
#     $new_node->setAttribute('class','hidden');
    $tmpl->insertAfter($new_node, $host_node);

    ### Add asset_uploadify_meta
    $new_node = $tmpl->createElement('app:Setting',
        {
            id    => 'asset_uploadify_meta',
            label => '<__trans_section component="mt_app_jquery"><__trans phrase="A multiple file upload meta"></__trans_section>',
            label_class => 'top_label',
        }
    );
    $inner_html = <<__MTML__;
    <input type="text" name="asset_uploadify_meta" id="asset_uploadify_meta" value="<mt:var name="asset_uploadify_meta">" class="full-width" mt:watch-change="1" />
__MTML__
    $new_node->innerHTML($inner_html);
# 最後にコメント外す
#     $new_node->setAttribute('class','hidden');
    $tmpl->insertAfter($new_node, $host_node);

# doLog('End cb_tmpl_param_edit_entry!');

}

sub cb_cms_post_save_entry {
    my ($cb, $app, $obj, $orig_obj) = @_;

    require MT::Asset;
    require MT::ObjectAsset;
# doLog('Start cb_cms_post_save_entry!');
# doLog('========= $obj [start] ==========');
doLog(Dumper($obj));
# doLog('========= $obj [ end ] ==========');
    ### $app->
    my $blog_id = $app->param('blog_id') || 0;
doLog('blog_id from param: '.$app->param('blog_id'));
    my $q = $app->param;

    ### $obj->
    my $entry_id = $obj->id;
doLog('entry_id : '.$entry_id);

    ### $p-> ($plugin->)
    my $p = MT->component('mt_app_jquery');
    my $scope = (!$blog_id) ? 'system' : 'blog:'.$blog_id;
    my $active_uploadify = $p->get_config_value('active_uploadify', $scope);
    return unless $active_uploadify;

    my $asset_uploadify = $q->param('asset_uploadify');
    my $asset_uploadify_meta = $q->param('asset_uploadify_meta');

    my $headers = [
        'queue_id',
        'asset_blog_id',
        'asset_class',
        'asset_created_by',
        #'asset_created_on',
        'asset_file_ext',
        'asset_file_name',
        'asset_file_path',
        'asset_label',
        'asset_mime_type',
        #'asset_modified_on',
        'asset_url'
    ];
    my $headers_meta = ['queue_id','image_width','image_height'];

    my $assets = _parse($asset_uploadify, $headers);
    my $assets_meta = _parse($asset_uploadify_meta, $headers_meta);

# doLog('ループ前の$assets : '.Dumper($assets));
# doLog('ループ前の$assets_meta : '.Dumper($assets_meta));

    foreach my $asset (@$assets) {
        my $obj = MT::Asset::Image->new;
# doLog('ループ中の$assets : '.Dumper($asset));
        $obj->blog_id($blog_id);
        $obj->label($asset->{asset_label});
        $obj->url($asset->{asset_url});
        $obj->file_path($asset->{asset_file_path});
        $obj->file_name($asset->{asset_file_name});
        $obj->file_ext($asset->{asset_file_ext});
        $obj->mime_type($asset->{asset_mime_type});
        $obj->class($asset->{asset_class});
        $obj->created_by($asset->{asset_created_by});
        foreach my $asset_meta (@$assets_meta) {
            if ($asset_meta->{queue_id} == $asset->{queue_id}) {
# doLog('ループ中の$assets_meta : '.Dumper($asset_meta));
                $obj->image_width($asset_meta->{image_width});
                $obj->image_height($asset_meta->{image_height});
            }
        }
        $obj->save or die 'Failed to save the item.';
    }
    my @saved_assets = MT::Asset::Image->load({
        blog_id => $blog_id,
    });
    my @curt_post_assets_id = ();
    foreach my $saved_asset (@saved_assets) {
        my $saved_asset_id = $saved_asset->id;
        my $saved_asset_filename = $saved_asset->file_name;
        foreach my $asset (@$assets) {
            if ($saved_asset_filename eq $asset->{asset_file_name}) {
                push(@curt_post_assets_id, $saved_asset_id);
            }
        }
    }
# doLog('@curt_post_assets_id : '.Dumper(@curt_post_assets_id));

    foreach my $asset_id (@curt_post_assets_id) {
        my $obj_asset = MT::ObjectAsset->new;
        $obj_asset->blog_id($blog_id);
        $obj_asset->asset_id($asset_id);
        $obj_asset->object_ds('entry');
        $obj_asset->object_id($entry_id);
# doLog('===== $obj_asset->save 直前 =====');
        $obj_asset->save or die 'Failed to save the objectasset.';
    }
# doLog('End cb_cms_post_save_entry!');
}

sub _config_replace {
    my ($str) = @_;
    $str =~ s!__filepath__!' + fileObj.filePath.replace(/\\/\\//g,"/") + '!g;
    $str =~ s!__filename__!' + fileObj.name + '!g;
    return $str;
}

sub _parse {
    # http://d.hatena.ne.jp/perlcodesample/touch/20080621/1214058703
    my ($text, $headers) = @_;

    my @lines = split('\|', $text);

    my $items_hash_list = [];
    foreach my $line (@lines){
        my @items = split(',', $line);
        my %items_hash = ();
        @items_hash{ @{ $headers } } = @items;
        push @{ $items_hash_list },{ %items_hash };
    }
    wantarray ? return @{ $items_hash_list } : return $items_hash_list;
}

1;