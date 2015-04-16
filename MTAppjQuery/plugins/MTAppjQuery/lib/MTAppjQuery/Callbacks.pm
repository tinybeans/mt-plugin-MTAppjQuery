package MTAppjQuery::Callbacks;
use strict;
use utf8;
use MT::Website;
use MT::Blog;
use MT::Util;
use MTAppjQuery::Tmplset;
use MT::Permission;
use MT::Session;
use MT::Log;

sub template_source_dashboard {
    my ($cb, $app, $tmpl_ref) = @_;

    if ($app->request('fresh_login')) {
        my $url = $app->uri(mode => 'dashboard', args => undef);
        $app->redirect($url);
    }
}

sub template_source_header {
    my ($cb, $app, $tmpl_ref) = @_;
    my $version = MT->version_id;
    my $minor_version = $version;
    $minor_version =~ s/^(\d\.\d).*/$1/;
    my $p = MT->component('mt_app_jquery');
    my $blog = $app->blog;
    my $author = $app->user;


    # システム管理者かどうか
    my $is_superuser = 0;
    if ($author->is_superuser) {
        $is_superuser = 1;
    }
    ### 各種情報を取得する
    my $_type   = $app->param('_type') || '_type';
    my $mode    = $app->param('__mode') || '';
    my $id      = $app->param('id') || 0;
    my $blog_id = (defined $blog) ? $blog->id : 0;
    my $author_id = $author->id;
    return unless ($_type =~ m/^\w+$/);
    return unless ($mode =~ m/^\w+$/);
    return unless ($id =~ m/^-?\d+$/);

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

    require MT::Permission;
    require MT::Association;
    require MT::Role;
    ### ログインユーザーのロールを取得する
    my $role_join_terms = {
        author_id => $author_id
    };
    if ($blog_id) {
        $role_join_terms->{blog_id} = $blog_id;
    }
    my @role = MT::Role->load(undef, {
        join => MT::Association->join_on('role_id', $role_join_terms)
    });
    my @role_name;
    foreach my $role (@role) {
        push @role_name, '"' . $role->name . '"';
    }
    my $role_names = join ',', @role_name;

    ### ログインユーザーのパーミッションを取得する
    my $perm_blog_id = $blog_id > 0 ? [0, $blog_id]: 0;
    my @permission = MT::Permission->load({author_id => $author_id});
    my $permissions = '';
    my $permissions_json = '';
    if (scalar @permission > 0) {
        my @perms;
        my %perms;
        foreach my $permission (@permission) {
            if ($permission->permissions) {
                my $perm = $permission->permissions;
                # For mtappVars.author_permissions
                if ($blog_id == 0 or $blog_id == $permission->blog_id) {
                    push @perms, $perm;
                }
                # For mtappVars.author_permissions_json
                $perm =~ s/'//g;
                my @perms_array = split /,/, $perm;
                $perms{'blog:' . $permission->blog_id} = \@perms_array;
            }
        }
        $permissions = join ',', @perms;
        $permissions_json = MT::Util::to_json(\%perms);
    }

    ### 各種パスを取得する（スラッシュで終わる）
    my $static_path        = $app->static_path;
    my $static_plugin_path = $static_path . $p->envelope . '/';

    ### プラグインの設定の値を取得する
    my $scope = (!$blog_id) ? 'system' : 'blog:'.$blog_id;
    my $op_active         = $p->get_config_value('active', $scope);
    return unless $op_active;
    my $op_userjs         = $p->get_config_value('userjs', $scope);
    my $op_userjs_url     = $p->get_config_value('userjs_url', $scope);
    my $op_usercss        = $p->get_config_value('usercss', $scope);
    my $op_usercss_url    = $p->get_config_value('usercss_url', $scope);
    my $op_slidemenu      = $p->get_config_value('slidemenu', $scope) || '0';
    my $op_superslidemenu = $p->get_config_value('superslidemenu', $scope) || '0';
    my $op_jquery_ready     = $p->get_config_value('jquery_ready', $scope);
    my $op_jquery_ready_url = $p->get_config_value('jquery_ready_url', $scope);
    my $op_blogs_json       = $p->get_config_value('blogs_json', 'system');
    my $op_blogs_json_detail= $p->get_config_value('blogs_json_detail', 'system');
    my $op_jqselectable   = 0;#$p->get_config_value('jqselectable', $scope);

    # Free textarea / common
    my $op_common_mtapp_top_head  = $p->get_config_value('common_mtapp_top_head', 'system') || '<!-- mtapp_top_head (common) (MTAppjQuery) -->';
    my $op_common_html_head       = $p->get_config_value('common_html_head', 'system') || '<!-- html_head (common) (MTAppjQuery) -->';
    my $op_common_js_include      = $p->get_config_value('common_js_include', 'system') || '<!-- js_include (common) (MTAppjQuery) -->';
    my $op_common_html_body       = $p->get_config_value('common_html_body', 'system') || '<!-- html_body (common) (MTAppjQuery) -->';
    my $op_common_form_header     = $p->get_config_value('common_form_header', 'system') || '<!-- form_header (common) (MTAppjQuery) -->';
    my $op_common_jq_js_include   = $p->get_config_value('common_jq_js_include', 'system') || '/* (jq_js_includecommon)  (MTAppjQuery) */';
    my $op_common_mtapp_html_foot = $p->get_config_value('common_mtapp_html_foot', 'system') || '<!-- mtapp_html_foot (common) (MTAppjQuery) -->';
    my $op_common_mtapp_end_body  = $p->get_config_value('common_mtapp_end_body', 'system') || '<!-- mtapp_end_body (common) (MTAppjQuery) -->';

    # Free textarea / individual
    my $op_fa_mtapp_top_head  = $p->get_config_value('fa_mtapp_top_head', $scope) || '<!-- mtapp_top_head (MTAppjQuery) -->';
    my $op_fa_html_head       = $p->get_config_value('fa_html_head', $scope) || '<!-- html_head (MTAppjQuery) -->';
    my $op_fa_js_include      = $p->get_config_value('fa_js_include', $scope) || '<!-- js_include (MTAppjQuery) -->';
    my $op_fa_html_body       = $p->get_config_value('fa_html_body', $scope) || '<!-- html_body (MTAppjQuery) -->';
    my $op_fa_form_header     = $p->get_config_value('fa_form_header', $scope) || '<!-- form_header (MTAppjQuery) -->';
    my $op_fa_jq_js_include   = $p->get_config_value('fa_jq_js_include', $scope) || '/* jq_js_include (MTAppjQuery) */';
    my $op_fa_mtapp_html_foot = $p->get_config_value('fa_mtapp_html_foot', $scope) || '<!-- mtapp_html_foot (MTAppjQuery) -->';
    my $op_fa_mtapp_end_body  = $p->get_config_value('fa_mtapp_end_body', $scope) || '<!-- mtapp_end_body (MTAppjQuery) -->';

    # Data API
    my $op_login_with_data_api = $p->get_config_value('login_with_data_api', 'system');
    my $op_use_data_api_js = $p->get_config_value('use_data_api_js', 'system');
    my $op_data_api_version = $p->get_config_value('data_api_version', 'system');

    # Get Data API Session ID
    my $session = $app->session;
    my $data_api_session_id = $session->get('mtapp_data_api_session_id') || '';


    if ($data_api_session_id) {
        &_update_data_api_session_start($session);
    }
    else {
        my $load_session = MT::Session->load({id => $session->id});
        if ($data_api_session_id = $load_session->get('mtapp_data_api_session_id')) {
            $session->set('mtapp_data_api_session_id', $data_api_session_id);
            $session->save;
        }
        else {
            my $username = $app->param('username');
            my $password = $app->param('password');
            if ($username and $password) {
                $data_api_session_id = &_data_api_authentication($username, $password, $session, $op_data_api_version);
            }
        }

    }

    ### ツールチップ用ボックスをページに追加する
    my $preset = <<__MTML__;
    <mt:SetVarBlock name="html_body_footer" append="1">
    <div id="mtapp-loading-image" style="display: none;"><img src="<mt:var name="static_uri">images/indicator.gif" alt="loading"></div>
    <div id="mtapp-tooltip" style="display: none;"></div>
    </mt:SetVarBlock>
__MTML__
    $$tmpl_ref =~ s!(<div id="container")!$preset$1!g;

    ### スライドメニューをセットする（MT5.1未対応、対応予定未定）
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

    ### スーパースライドメニューをセットする（MT5.1未対応、対応予定未定）
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
    }

    ### Set blogs JSON
    my $can_access_blogs_json = '{}';
    if ($op_blogs_json) {
        # Get all permissions that you have.
        my @perms = MT::Permission->load({author_id => $author_id})
            or die "You don't have any permissions.";

        # Get only blog ids from your permissions.
        my @perms_blog_ids;
        foreach my $perm (@perms) {
            push(@perms_blog_ids, $perm->blog_id);
        }

        my @all_websites = MT::Website->load;
        my @all_blogs = MT::Blog->load;
        my $can_access_blogs = {
            'website' => [],
            'blog' => [],
        };
        my $parent_website = {
            # 'website-1' => [ children blogs ],
            # 'website-3' => [ children blogs ],
        };

        # my $parent_website_related = {};
        foreach my $blog (@all_blogs) {
            my $blog_id = $blog->id;
            my $parent_website_key = 'website-' . $blog->parent_id if (defined $blog->parent_id);
            foreach my $perms_blog_id (@perms_blog_ids) {
                if ($is_superuser == 1 or $perms_blog_id eq $blog->id) {
                    # Set into $can_access_blogs
                    my $simple_blog = {};
                    if ($op_blogs_json_detail ne '1') {
                        $simple_blog->{id} = $blog_id;
                        $simple_blog->{name} = $blog->name;
                        push @{$can_access_blogs->{blog}}, $simple_blog;
                        # Set into $parent_website
                        push @{$parent_website->{$parent_website_key}}, $simple_blog;
                    }
                    else {
                        push @{$can_access_blogs->{blog}}, $blog->{column_values};
                        # Set into $parent_website
                        push @{$parent_website->{$parent_website_key}}, $blog->{column_values};
                    }
                    last;
                }
            }
        }
        foreach my $website (@all_websites) {
            my $website_id = $website->id;
            foreach my $perms_blog_id (@perms_blog_ids) {
                if ($is_superuser == 1 or $perms_blog_id eq $website_id) {
                    my $simple_website = {};
                    if ($op_blogs_json_detail ne '1') {
                        $simple_website->{id} = $website_id;
                        $simple_website->{name} = $website->name;
                        $simple_website->{children} = $parent_website->{'website-' . $website_id} || [];
                        push @{$can_access_blogs->{website}}, $simple_website;
                    }
                    else {
                        $website->{column_values}->{children} = $parent_website->{'website-' . $website_id} || [];
                        push @{$can_access_blogs->{website}}, $website->{column_values};
                    }
                    last;
                }
            }
        }

        # To JSON
        $can_access_blogs_json = MT::Util::to_json($can_access_blogs);
    }
    ### jQueryの読み込み前後にmtappVarsとjquery_ready.jsをセットする
    my $mtapp_vars = <<__MTML__;
    <mt:unless name="screen_id">
        <mt:if name="template_filename" like="list_">
            <mt:SetVarBlock name="screen_id">list-<mt:var name="object_type"></mt:SetVarBlock>
        </mt:if>
    </mt:unless>

    <mt:SetVarBlock name="mtapp_html_title"><mt:if name="html_title"><mt:var name="html_title"><mt:else><mt:var name="page_title"></mt:if></mt:SetVarBlock>
    <script type="text/javascript">
    /* <![CDATA[ */
    // 後方互換（非推奨）
    var blogID = ${blog_id},
        authorID = <mt:if name="author_id"><mt:var name="author_id"><mt:else>0</mt:if>,
        ${_type}ID = ${id},
        blogURL = '<mt:if name="blog_url"><mt:var name="blog_url"><mt:else><mt:var name="site_url"></mt:if>',
        mtappURL = '${static_plugin_path}',
        mtappTitle = '<mt:var name="mtapp_html_title" trim="1" replace="'","\'">',
        mtappScopeType = '<mt:var name="scope_type">',
        catsSelected = <mt:if name="selected_category_loop"><mt:var name="selected_category_loop" to_json="1"><mt:else>[]</mt:if>,
        mainCatSelected = <mt:if name="category_id"><mt:var name="category_id"><mt:else>''</mt:if>;

    // 推奨
    var mtappVars = {
        "version" : "${version}",
        "minor_version" : "${minor_version}",
        "debug_mode" : "<mt:Var name="config.DebugMode">",
        "language" : "<mt:Var name="config.DefaultLanguage">",
        "type" : "${_type}",
        "mode" : "${mode}",
        "author_id" : <mt:if name="author_id"><mt:var name="author_id"><mt:else>0</mt:if>,
        "author_name" : "<mt:var name="author_name" encode_js="1">",
        "author_permissions" : [$permissions],
        "author_permissions_json" : $permissions_json,
        "author_roles" : [$role_names],
        "user_name" : "<mt:var name="author_name" encode_js="1">",
        "is_superuser" : $is_superuser,
        "curr_website_id" : <mt:if name="curr_website_id"><mt:var name="curr_website_id"><mt:else>0</mt:if>,
        "blog_id" : ${blog_id},
        "entry_id" : ${entry_id},
        "page_id" : ${page_id},
        "status" : "<mt:Var name="status">",
        "category_id" : ${category_id},
        "template_id" : ${template_id},
        "template_identifier" : '<mt:Var name="identifier">',
        "modified_by" : "<mt:Var name="modified_by">",
        "blog_url" : "<mt:if name="blog_url"><mt:var name="blog_url"><mt:else><mt:var name="site_url"></mt:if>",
        "static_plugin_path" : "${static_plugin_path}",
        "html_title" : "<mt:var name="mtapp_html_title" trim="1" replace='"','\"'>",
        "scope_type" : "<mt:var name="scope_type">",
        "selected_category" : <mt:if name="selected_category_loop"><mt:var name="selected_category_loop" to_json="1" regex_replace='/"/g',''><mt:else>[]</mt:if>,
        "main_category_id" : <mt:if name="category_id"><mt:var name="category_id"><mt:else>0</mt:if>,
        "screen_id" : "<mt:var name="screen_id">",
        "body_class" : [<mt:SetVarBlock name="mtapp_body_class">"<mt:var name="screen_type" default="main-screen"> <mt:if name="scope_type" eq="user">user system<mt:else><mt:var name="scope_type"></mt:if><mt:if name="screen_class"> <mt:var name="screen_class"></mt:if><mt:if name="top_nav_loop"> has-menu-nav</mt:if><mt:if name="related_content"> has-related-content</mt:if><mt:if name="edit_screen"> edit-screen</mt:if><mt:if name="new_object"> create-new</mt:if><mt:if name="loaded_revision"> loaded-revision</mt:if><mt:if name="mt_beta"> mt-beta</mt:if>"</mt:SetVarBlock><mt:var name="mtapp_body_class" regex_replace='/ +/g',' ' regex_replace='/ /g','","'>],
        "template_filename" : '<mt:var name="template_filename">',

        "data_api_session_id": "$data_api_session_id",

        "json_can_create_post_blogs": [<mt:var name="json_can_create_post_blogs">],
        "can_access_blogs_json" : ${can_access_blogs_json}<mt:ignore>,
        "website_json" : [${website_json}],
        "blog_json" : [${blog_json}],
        "perms_json" : [${perms_json}]
        </mt:ignore>
    }
    var mtappL10N = {
        "User_Dashboard" : "<__trans phrase='User Dashboard'>",
        "System" : "<__trans phrase='System'>"
    }
    /* ]]> */
    </script>
__MTML__

    # Redirect
    if ($op_login_with_data_api) {
        $op_common_js_include .= <<__MTML__;
<script>
var mtappRedirectURL = getCookie('mtappRedirectURL');
if (mtappRedirectURL) {
    setCookie('mtappRedirectURL', '');
    window.location.href = mtappRedirectURL;
}
</script>
__MTML__
    }

    # MT.DataAPI Constructor
    if ($op_use_data_api_js) {
        $mtapp_vars .= <<__MTML__;
    <script type="text/javascript" src="<mt:StaticWebPath>data-api/${op_data_api_version}/js/mt-data-api.min.js"></script>
    <script>
    mtappVars.DataAPI = new MT.DataAPI({
        baseUrl:  '<mt:CGIPath><mt:Var name="config.DataAPIScript">',
        clientId: 'MTAppjQuery-DataAPI'
    });
    </script>
__MTML__
    }

    $mtapp_vars .= <<__MTML__;
    <mt:SetHashVar name="mtappVars">
    <mt:SetVar name="version" value="${version}">
    <mt:SetVar name="minor_version" value="${minor_version}">
    <mt:SetVar name="type" value="${_type}">
    <mt:SetVar name="mode" value="${mode}">
    <mt:SetVar name="entry_id" value="${entry_id}">
    <mt:SetVar name="page_id" value="${page_id}">
    <mt:SetVar name="category_id" value="${category_id}">
    <mt:SetVar name="template_id" value="${template_id}">
    <mt:SetVar name="blog_id" value="${blog_id}">
    <mt:SetVar name="static_plugin_path" value="${static_plugin_path}">
    <mt:SetVar name="is_superuser" value="${is_superuser}">
    </mt:SetHashVar>

    <mt:SetVarBlock name="mtappVars" key="debug_mode"><mt:Var name="config.DebugMode"></mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="language"><mt:Var name="config.DefaultLanguage"></mt:SetVarBlock>

    <mt:SetVarBlock name="mtappVars" key="author_permissions"><mt:SetVarBlock name="_author_permissions">${permissions}</mt:SetVarBlock>,<mt:Var name="_author_permissions" replace="'","">,</mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="author_roles"><mt:SetVarBlock name="_author_roles">${role_names}</mt:SetVarBlock>,<mt:Var name="_author_roles" replace='"',''>,</mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="author_name"><mt:var name="author_name"></mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="user_name"><mt:var name="author_name"></mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="status"><mt:Var name="status"></mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="html_title"><mt:var name="mtapp_html_title" trim="1"></mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="scope_type"><mt:var name="scope_type"></mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="screen_id"><mt:var name="screen_id"></mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="template_filename"><mt:var name="template_filename"></mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="modified_by"><mt:var name="modified_by"></mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="json_can_create_post_blogs"><mt:var name="json_can_create_post_blogs"></mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="can_access_blogs">${can_access_blogs_json}</mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="body_class">,<mt:var name="mtapp_body_class" replace='"','' regex_replace="/ +/g",",">,</mt:SetVarBlock>

    <mt:SetVarBlock name="mtappVars" key="author_id"><mt:if name="author_id"><mt:var name="author_id"><mt:else>0</mt:if></mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="curr_website_id"><mt:if name="curr_website_id"><mt:var name="curr_website_id"><mt:else>0</mt:if></mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="selected_category">,<mt:Loop name="selected_category_loop" glue=","><mt:Var name="__value__"></mt:Loop>,</mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="main_category_id"><mt:if name="category_id"><mt:var name="category_id"><mt:else>0</mt:if></mt:SetVarBlock>
    <mt:SetVarBlock name="mtappVars" key="blog_url"><mt:if name="blog_url"><mt:var name="blog_url"><mt:else><mt:var name="site_url"></mt:if></mt:SetVarBlock>
__MTML__

    my $target = '<script type="text/javascript" src="<\$mt:var name="static_uri"\$>jquery/jquery\.(min\.)*js\?v=<mt:var name="mt_version_id" escape="URL">"></script>';
    my $jquery_ready_url = $op_jquery_ready_url ? $op_jquery_ready_url : "${static_plugin_path}user-files/jquery_ready.js";
    my $jquery_ready = $op_jquery_ready ? qq(<script type="text/javascript" src="${jquery_ready_url}"></script>) : '';

    $$tmpl_ref =~ s!($target)!$mtapp_vars  $1\n  $jquery_ready!g;

    ### user.jsをセット
    require MT::Template;
    my $user_js_url;
    my $user_js_tmplname = MT->config->MTAppjQueryUserJSName || 'user.js';
    my $user_js_tmpl = MT::Template->load({name => $user_js_tmplname, identifier => 'user_js', blog_id => $blog_id});
    if (defined($user_js_tmpl)) {
        $user_js_url = $blog->site_url . $user_js_tmpl->outfile . '?v=' . $user_js_tmpl->modified_on;
    } elsif ($op_userjs_url ne '') {
        $user_js_url = $op_userjs_url;
    } else {
        $user_js_url = "${static_plugin_path}user-files/user.js";
    }
    my $user_js = ($op_userjs == 1) ? qq(<script type="text/javascript" src="$user_js_url"></script>): '';

    ### user.css をセットする
    my $user_css_url;
    my $user_css_tmplname = MT->config->MTAppjQueryUserCSSName || 'user.css';
    my $user_css_tmpl = MT::Template->load({name => $user_css_tmplname, identifier => 'user_css', blog_id => $blog_id});
    if (defined($user_css_tmpl)) {
        $user_css_url = $blog->site_url . $user_css_tmpl->outfile . '?v=' . $user_css_tmpl->modified_on;
    } elsif ($op_usercss_url ne '') {
        $user_css_url = $op_usercss_url;
    } else {
        $user_css_url = "${static_plugin_path}user-files/user.css";
    }
    my $user_css = ($op_usercss == 1) ? qq(<link rel="stylesheet" href="$user_css_url" type="text/css" />): '';

    ### jQselectableプラグインを利用する
    my $jqselectable = ! $op_jqselectable ? '' : <<__MTML__;
    <link type="text/css" rel="stylesheet" href="${static_plugin_path}lib/jqselectable/style/selectable/style.css" />
    <script type="text/javascript" src="${static_plugin_path}lib/jqselectable/jqselectable.js"></script>
__MTML__

    ### 各情報をheadにセットする
    my $prepend_html_head = <<__MTML__;
    <mt:SetVarBlock name="html_head" append="1">
    <link rel="stylesheet" href="${static_plugin_path}css/MTAppjQuery.css" type="text/css" />
    $user_css
    $op_common_html_head
    $op_fa_html_head
    </mt:SetVarBlock>
    <mt:SetVarBlock name="js_include" append="1">
    $jqselectable
    <mt:var name="uploadify_source">
    <script type="text/javascript" src="${static_plugin_path}js/MTAppjQuery.js"></script>
    $op_common_js_include
    $op_fa_js_include
    </mt:SetVarBlock>
    <mt:SetVarBlock name="html_body" append="1">$op_common_html_body</mt:SetVarBlock>
    <mt:SetVarBlock name="html_body" append="1">$op_fa_html_body</mt:SetVarBlock>
    <mt:SetVarBlock name="form_header" append="1">$op_common_form_header</mt:SetVarBlock>
    <mt:SetVarBlock name="form_header" append="1">$op_fa_form_header</mt:SetVarBlock>
    <mt:SetVarBlock name="jq_js_include" append="1">$op_common_jq_js_include</mt:SetVarBlock>
    <mt:SetVarBlock name="jq_js_include" append="1">$op_fa_jq_js_include</mt:SetVarBlock>
    <mt:SetVarBlock name="mtapp_html_foot" append="1">
    <div id="mtapp-dialog-msg"></div>
    $op_common_mtapp_html_foot
    $op_fa_mtapp_html_foot
    $user_js
    </mt:SetVarBlock>
    <mt:SetVarBlock name="mtapp_end_body" append="1">$op_common_mtapp_end_body</mt:SetVarBlock>
__MTML__

    # Data API AccessToken
    if ($op_login_with_data_api) {
        $prepend_html_head .= <<__MTML__;
<mt:SetVarBlock name="mtapp_end_body" append="1">
<script>
jQuery.ajax({
    url: '<mt:CGIPath><mt:Var name="config.DataAPIScript">/v2/token',
    type: 'POST',
    dataType: 'json',
    headers: {
        'X-MT-Authorization': 'MTAuth sessionId=' + mtappVars.data_api_session_id
    }
}).done(function(data){
    if (mtappVars.DataAPI instanceof MT.DataAPI) {
        mtappVars.DataAPI.storeTokenData(data);
    }
    var accessToken = data.accessToken;
    var sessionId = data.sessionId;
    var token = 'MTAuth accessToken=' + accessToken;
    jQuery.ajax({
        url: '<mt:CGIPath><mt:Var name="config.DataAPIScript">/v2/users/me',
        type: 'GET',
        dataType: 'json',
        headers: {
            'X-MT-Authorization': token
        }
    }).done(function(response) {
        if (response.error) {
            if (response.error.code === 401) {
                window.location.href = mtappVars.DataAPI.getAuthorizationUrl(location.href);
                return;
            }
            jQuery.errorMessage('Getting user', 'response.error.message', 'alert');
            return;
        }
        var user = response;
        jQuery(document).triggerHandler('DataAPIReady', [user, accessToken, sessionId]);
    });

}).fail(function(response){
    if (this.console && typeof console.log != 'undefined'){
        console.log(response);
    }
    //window.location.href = mtappVars.DataAPI.getAuthorizationUrl(location.href);
});

mtappVars.redirectLogin = function(){
    setCookie('mtappRedirectURL', location.href);
    window.location.href = '<mt:CGIPath><mt:Var name="config.AdminScript">?__mode=logout';
};
</script>
</mt:SetVarBlock>
__MTML__
    }

    $prepend_html_head .= <<__MTML__;
    <mt:SetVarBlock name="mtapp_end_body" append="1">$op_fa_mtapp_end_body</mt:SetVarBlock>
__MTML__

    $$tmpl_ref =~ s/(<head>)/$1\n$op_common_mtapp_top_head\n$op_fa_mtapp_top_head/g;
    $$tmpl_ref =~ s/(<mt:var name="html_head">)/$prepend_html_head\n$1/g;
}

sub template_source_footer {
    my ($cb, $app, $tmpl_ref) = @_;
    my $replace = <<'__MTML__';
    <mt:var name="mtapp_html_foot">
    <mt:var name="mtapp_end_body">
__MTML__
    $$tmpl_ref =~ s!(</body>)!$replace$1!;
}

sub template_source_favorite_blogs {
    my ($cb, $app, $tmpl_ref) = @_;
    my $version = MT->version_id;

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
    my $fav_blogs_wdg_close     = MTAppjQuery::Tmplset::fav_blogs_wdg_close($version);
    $$tmpl_ref =~ s!$fav_blogs_wdg_close_org!$fav_blogs_wdg_close!g;

}

sub template_source_preview_strip {
    &template_source_header(@_);
    &template_source_footer(@_);
}

sub template_source_list_template {
    my ($cb, $app, $tmpl_ref) = @_;
    my $plugin = MT->component('mt_app_jquery');
    my $blog = $app->blog;
    my $blog_id = $blog ? $blog->id : 0;
    my $user_js = MT->config->MTAppjQueryUserJSName || 'user.js';
    my $user_css = MT->config->MTAppjQueryUserCSSName || 'user.css';
    my $FQDN = $app->base;
    my $url = $FQDN . $app->uri(
        mode => 'create_user_files',
        args => {blog_id => $blog_id, return_args => '__mode=list_template&amp;blog_id=' . $blog_id});
    my $label = $plugin->translate('Install [_1] and  [_2]', $user_js, $user_css);
    my $widget = <<__MTML__;
    <mtapp:widget
        id="mtappjq-links"
        label="MTAppjQuery <__trans phrase="Actions">">
        <ul>
            <li><a href="$url" class="icon-left icon-related">$label</a></li>
        </ul>
    </mtapp:widget>
__MTML__
    my $target = <<'__MTML__';
<mtapp:widget
        id="useful-links"
__MTML__
    my $target_reg = quotemeta($target);
    $$tmpl_ref =~ s/$target_reg/$widget$target/;
}

# sub template_param_favorite_blogs {
#     my ($cb, $app, $param, $tmpl) = @_;
#     $param->{'blogs_json'} = ('あ','い','う');
# }

sub template_param_edit_entry {
    my ($cb, $app, $param, $tmpl) = @_;
    ### $app->
    my $host        = $app->{__host};
    my $static_path = $app->static_path;
    my $blog = $app->blog;
    my $user = $app->user;

    ### 新規作成権限のあるブログ一覧を出力
    my @blog = MT::Blog->load;
    my @blog_json;

    # blogの内容をJSONに書き出す
    foreach my $blog (@blog) {
        next if (! &is_user_can($blog, $user, 'create_post'));
        my %blog_date = (
            'id' => $blog->id,
            'name' => $blog->name,
        );
        push @blog_json, MT::Util::to_json(\%blog_date);
    }
    $param->{json_can_create_post_blogs} = join ",", @blog_json;

    if (&is_user_can($blog, $user, 'upload')) {
        ### $param->
        my $blog_id   = $param->{blog_id} || 0;
        my $blog_url  = $param->{blog_url} || '';
        my $blog_path = $blog_url;
           $blog_path =~ s!^$host|\/$!!g;

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
__MTML__

        ### Add uploadify-widget
        my $host_node = $tmpl->getElementById('entry-status-widget');
        my $new_node = $tmpl->createElement('app:widget',
            {
                id    => 'entry-uploadify-widget',
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
        $new_node->setAttribute('class','hidden');
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
        $new_node->setAttribute('class','hidden');
        $tmpl->insertAfter($new_node, $host_node);
    };

}

sub template_param_edit_template {
    my ($cb, $app, $param, $tmpl) = @_;
    my $identifier = $param->{identifier} || '';
    my $index_identifiers = $param->{index_identifiers};
    my $identifier_match = 0;
    foreach my $index_identifier (@$index_identifiers) {
        if ($index_identifier->{key} eq $identifier) {
            $identifier_match = 1;
            last;
        }
    }
    if ($identifier eq 'user_js' or $identifier eq 'user_css') {
        push(@$index_identifiers, {
            'label' => 'user.js',
            'selected' => $identifier eq 'user_js',
            'key' => 'user_js'
        },{
            'label' => 'user.css',
            'selected' => $identifier eq 'user_css',
            'key' => 'user_css'
        });
    }
    elsif (!$identifier_match) {
        push(@$index_identifiers, {
            'label' => $identifier,
            'selected' => 1,
            'key' => $identifier
        });
    }
}

sub cms_post_save_entry {
    my ($cb, $app, $obj, $orig_obj) = @_;

    my $blog = $app->blog;
    my $user = $app->user;

    return if (! &is_user_can($blog, $user, 'upload'));

    require MT::Asset;
    require MT::ObjectAsset;

    ### $app->
    my $blog_id = $blog->id || 0;

    ### $obj->
    my $entry_id = $obj->id;

    ### $p-> ($plugin->)
    my $p = MT->component('mt_app_jquery');
    my $scope = (!$blog_id) ? 'system' : 'blog:'.$blog_id;
    my $active_uploadify = $p->get_config_value('active_uploadify', $scope);
    return unless $active_uploadify;

    my $asset_uploadify = $app->param('asset_uploadify');
    my $asset_uploadify_meta = $app->param('asset_uploadify_meta');

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

    foreach my $asset (@$assets) {
        my $obj = MT::Asset::Image->new;
        $obj->blog_id($blog_id) or return;
        $obj->label($asset->{asset_label}) or return;
        $obj->url($asset->{asset_url}) or return;
        $obj->file_path($asset->{asset_file_path}) or return;
        $obj->file_name($asset->{asset_file_name}) or return;
        $obj->file_ext($asset->{asset_file_ext}) or return;
        $obj->mime_type($asset->{asset_mime_type}) or return;
        $obj->class($asset->{asset_class}) or return;
        $obj->created_by($asset->{asset_created_by}) or return;
        foreach my $asset_meta (@$assets_meta) {
            if ($asset_meta->{queue_id} == $asset->{queue_id}) {
                $obj->image_width($asset_meta->{image_width}) or return;
                $obj->image_height($asset_meta->{image_height}) or return;
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

    foreach my $asset_id (@curt_post_assets_id) {
        my $obj_asset = MT::ObjectAsset->new;
        $obj_asset->blog_id($blog_id);
        $obj_asset->asset_id($asset_id);
        $obj_asset->object_ds('entry');
        $obj_asset->object_id($entry_id);
        $obj_asset->save or die 'Failed to save the objectasset.';
    }
}

sub cms_post_save_template {
    my ($eh, $app, $obj, $orig_obj) = @_;
    my $identifier_custom = $app->param('identifier_custom');
    $obj->identifier($identifier_custom) if $identifier_custom;
    $obj->save;
}

sub save_config_filter {
    my ($cb, $plugin, $data, $scope) = @_;
    my $jquery_ready_all = $data->{jquery_ready_all};
    if ($jquery_ready_all eq '1') {
        my $jquery_ready = $data->{jquery_ready};
        my $jquery_ready_url = $data->{jquery_ready_url};

        require MT::Blog;
        my @blogs = MT::Blog->load();
        foreach my $blog (@blogs) {
            $plugin->set_config_value('jquery_ready', $jquery_ready, 'blog:'.$blog->id);
            $plugin->set_config_value('jquery_ready_url', $jquery_ready_url, 'blog:'.$blog->id);
        }

        require MT::Website;
        my @websites = MT::Website->load();
        foreach my $website (@websites) {
            $plugin->set_config_value('jquery_ready', $jquery_ready, 'blog:'.$website->id);
            $plugin->set_config_value('jquery_ready_url', $jquery_ready_url, 'blog:'.$website->id);
        }
    }
    return 1;
}

sub session_post_save {
    my ($cb, $obj, $original) = @_;


    my $p = MT->component('mt_app_jquery');
    my $op_login_with_data_api = $p->get_config_value('login_with_data_api', 'system');

    return unless $op_login_with_data_api;
    if ($obj->data =~ m/MTAppjQuery-DataAPI/i) {
        $obj->set('mtapp_data_api_session_id', $obj->id);
        $obj->save;
        return 1;
    }
    my $kind = $obj->kind || '';
    return unless $kind eq 'US';

    my $data_api_session_id = $obj->get('mtapp_data_api_session_id') || '';
    if ($data_api_session_id) {
        &_update_data_api_session_start($obj);
        return;
    }

    my $data_api_version = $p->get_config_value('data_api_version', 'system');
    my $username = MT->instance->param('username');
    my $password = MT->instance->param('password');

    &_data_api_authentication($username, $password, $obj, $data_api_version);

}

sub _update_data_api_session_start {
    my ($sess) = @_;

    my $data_api_session_id = $sess->get('mtapp_data_api_session_id')
        or return;

    my $sess = MT::Session->load({id => $data_api_session_id});


    $sess->start(time);
    $sess->save;
    my $sess2 = MT::Session->load({id => $data_api_session_id});

}

sub _data_api_authentication {
    my ($username, $password, $sess, $data_api_version) = @_;

    require LWP::UserAgent;
    require HTTP::Request::Common;

    my $clientId = 'MTAppjQuery-DataAPI';

    # Post Data
    my %postdata = (
        'username' => $username,
        'password' => $password,
        'clientId' => $clientId,
    );

    # Endpoint
    my $dat_api_script = MT->config->CGIPath . MT->config->DataAPIScript;
    if ($dat_api_script !~ /^http/) {
        $dat_api_script = MT->instance->base . $dat_api_script;
    }
    my $endpoint = $dat_api_script . '/' . $data_api_version . '/authentication';

    # Request
    my $request = HTTP::Request::Common::POST($endpoint, [%postdata]);
    $request->referer(MT->instance->base);
    $request->header('content-type' => 'application/x-www-form-urlencoded');


    # UserAagent
    my $ua = LWP::UserAgent->new;
    $ua->timeout(30);
    $ua->agent($clientId);

    # POST
    my $response = $ua->request($request);

    # Success
    if ($response->is_success) {
        my $content = $response->decoded_content;
        require JSON;
        my $json = JSON::decode_json($content);
        my $sessionId = $json->{sessionId} || '';
        my $accessToken = $json->{accessToken} || '';
        my $expiresIn = $json->{expiresIn} || '';
        my $remember = $json->{remember} || '';
        $sess->set('mtapp_data_api_session_id', $sessionId);
        $sess->save;
        return $sessionId;
    }
    # Error
    else {
        MT->log('MTAppjQuery HTTP POST error code: ' . $response->code);
        MT->log('MTAppjQuery HTTP POST error message: ' . $response->message);
    }
}

sub _config_replace {
    my ($str) = @_;
    return '' if (! $str);
    $str =~ s!__filepath__!' + fileObj.filePath.replace(/\\/\\//g,"/") + '!g;
    $str =~ s!__filename__!' + fileObj.name + '!g;
    return $str;
}

# http://d.hatena.ne.jp/perlcodesample/touch/20080621/1214058703
sub _parse {
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

# Thank you very much!!
# From alfasado/mt-plugin-multi-uploader - GitHub
# https://github.com/alfasado/mt-plugin-multi-uploader/blob/master/plugins/MultiUploader/lib/MultiUploader/Util.pm
sub is_user_can {
    my ( $blog, $user, $permission ) = @_;
    $permission = 'can_' . $permission;
    my $perm = $user->is_superuser;
    unless ( $perm ) {
        if ( $blog ) {
            my $admin = 'can_administer_blog';
            $perm = $user->permissions( $blog->id )->$admin;
            $perm = $user->permissions( $blog->id )->$permission unless $perm;
        } else {
            $perm = $user->permissions()->$permission;
        }
    }
    return $perm;
}

1;