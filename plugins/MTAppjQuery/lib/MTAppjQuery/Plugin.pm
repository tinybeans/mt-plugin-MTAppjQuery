package MTAppjQuery::Plugin;
use strict;
use MTAppjQuery::Tmplset;

sub tmpl_source_header {
	my ($cb, $app, $tmpl_ref) = @_;
    my $p = MT->component('mt_app_jquery');

    my $blog_id = 0;
    $blog_id = $app->param('blog_id') || 0;
    my $static_path = $app->static_path;
	my $static_plugin_path = $static_path . 'plugins/MTAppjQuery/'; 
	
	# Get the value of option
	my $op_no_usercss     = $p->get_setting('no_usercss', 0)     || 0;
	my $op_no_mtappjquery = $p->get_setting('no_mtappjquery', 0) || 0;
	my $op_no_userjs      = $p->get_setting('no_userjs', 0)      || 0;
	my $op_no_slidemenu   = $p->get_setting('no_slidemenu', 0)   || 0;
	my $op_sys_jqplugin   = $p->get_setting('sys_jqplugin', 0)   || '';
	
	my $op_active         = $p->get_setting('active', $blog_id)      || 0;
	my $op_usercss        = $p->get_setting('usercss', $blog_id)     || 0;
	my $op_mtappjquery    = $p->get_setting('mtappjquery', $blog_id) || 0;
	my $op_userjs         = $p->get_setting('userjs', $blog_id)      || 0;
	my $op_slidemenu      = $p->get_setting('slidemenu', $blog_id)   || 0;
	my $op_jqplugin       = $p->get_setting('jqplugin', $blog_id)    || '';
	
	if ($blog_id > 0 && $op_active == 0) {
	   return;
	}

	my ($user_css, $set_blog_id, $MTAppjQuery_js, $jquery_plugin, $user_js);
        
    # insert <img/> [start]
    my $container = '<div id="container"';
    my $loading_img = <<___MT___;
<img id="page_loding" src="${static_path}images/indicator.gif" alt="<__trans_section component="mt_app_jquery"><__trans phrase="Page Loading"></__trans_section>" />
$container
___MT___
    $$tmpl_ref =~ s/$container/$loading_img/g;
    # insert <img/> [ end ]

    # Set Slide Menu [start]
    if ($op_no_slidemenu != 1 && ($op_slidemenu == 1 or $blog_id == 0)) {
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
    # Set Slide Menu [ end ]

    if ($op_no_usercss != 1 && ($op_usercss == 1 or $blog_id == 0)) {
        $user_css = <<___MT___;
<mt:setvarblock name="html_head" append="1">
<link rel="stylesheet" href="${static_plugin_path}css/MTAppjQuery.css" type="text/css" />
<link rel="stylesheet" href="${static_plugin_path}css/user.css" type="text/css" />
</mt:setvarblock>
___MT___
    }

	$set_blog_id = <<___MT___;
<script type="text/javascript">
/* <![CDATA[ */
var blogID = '${blog_id}';
var authorID = '<mt:var name="author_id">';
var catsSelected = <mt:if name="selected_category_loop"><mt:var name="selected_category_loop" to_json="1"><mt:else>[]</mt:if>;
var mainCatSelected = <mt:if name="category_id"><mt:var name="category_id"><mt:else>''</mt:if>;
/* ]]> */
</script>
___MT___

    if ($op_no_mtappjquery != 1 && ($op_mtappjquery == 1 or $blog_id == 0)) {
    	$MTAppjQuery_js = <<___MT___;
<script type="text/javascript" src="${static_plugin_path}js/MTAppjQuery.js"></script>
___MT___
    }
    if ($blog_id == 0) {
        $jquery_plugin = $op_sys_jqplugin;
    } else {
        $jquery_plugin = $op_jqplugin || $op_sys_jqplugin;
    }
    
    if ($op_no_userjs != 1 && ($op_userjs == 1 or $blog_id == 0)) {
		$user_js = <<___MT___;
<script type="text/javascript" src="${static_plugin_path}js/user.js"></script>
___MT___
	}

	my $add_html_head = <<___MT___;
$user_css
<mt:setvarblock name="js_include" append="1">
$set_blog_id
$MTAppjQuery_js
$jquery_plugin
$user_js
</mt:setvarblock>
___MT___

	$$tmpl_ref = $add_html_head . $$tmpl_ref;
}

sub tmpl_source_fav_blogs {
	my ($cb, $app, $tmpl_ref) = @_;
    my $fav_blogs_tag_org = MTAppjQuery::Tmplset::fav_blogs_tag_org;
    my $fav_blogs_tag     = MTAppjQuery::Tmplset::fav_blogs_tag;
    $$tmpl_ref =~ s!$fav_blogs_tag_org!$fav_blogs_tag!g;
    
    my $fav_blogs_wdg_close_org = MTAppjQuery::Tmplset::fav_blogs_wdg_close_org;
    my $fav_blogs_wdg_close     = MTAppjQuery::Tmplset::fav_blogs_wdg_close;
    $$tmpl_ref =~ s!$fav_blogs_wdg_close_org!$fav_blogs_wdg_close!g;
}

1;