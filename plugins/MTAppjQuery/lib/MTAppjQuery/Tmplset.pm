package MTAppjQuery::Tmplset;
use strict;
use utf8;

sub s_menu_org {
    my $out = <<'__MT__';
<__trans phrase="System Overview"></a>
                            </li>
__MT__
    return quotemeta($out);
}

sub s_menu {
    my $out = <<'__MT__';
<__trans phrase="System Overview"></a>
<mt:Ignore>システムメニュー挿入[start]</mt:Ignore>
<ul class="mtapp-slidemenu">
    <li class="Websites"><a href="<$mt:var name="script_url"$>?__mode=list_website&amp;blog_id=0"><__trans phrase="Websites"></a>
        <ul>
            <li class="Manage"><a href="<$mt:var name="script_url"$>?__mode=list_website&amp;blog_id=0"><__trans phrase="Manage"></a></li>
            <li class="New"><a href="<$mt:var name="script_url"$>?__mode=view&amp;_type=website&amp;blog_id=0"><__trans phrase="New"></a></li>
        </ul>
    </li>
    <li class="User"><a href="<$mt:var name="script_url"$>?__mode=list_author&amp;blog_id=0"><__trans phrase="User"></a>
        <ul>
            <li class="Manage"><a href="<$mt:var name="script_url"$>?__mode=list_author&amp;blog_id=0"><__trans phrase="Manage"></a></li>
            <li class="New"><a href="<$mt:var name="script_url"$>?__mode=view&amp;_type=author&amp;blog_id=0"><__trans phrase="New"></a></li>
        </ul>
    </li>
    <li class="Design"><a href="<$mt:var name="script_url"$>?__mode=list_template&amp;blog_id=0"><__trans phrase="Design"></a>
        <ul>
            <li class="Templates"><a href="<$mt:var name="script_url"$>?__mode=list_template&amp;blog_id=0"><__trans phrase="Templates"></a></li>
            <li class="Widgets"><a href="<$mt:var name="script_url"$>?__mode=list_widget&amp;blog_id=0"><__trans phrase="Widgets"></a></li>
            <li class="Themes"><a href="<$mt:var name="script_url"$>?__mode=list_theme&amp;blog_id=0"><__trans phrase="Themes"></a></li>
        </ul>
    </li>
    <li class="Custom_Fields"><a href="<$mt:var name="script_url"$>?__mode=list_field&amp;blog_id=0"><__trans_section component="mt_app_jquery"><__trans phrase="Custom Fields"></__trans_section></a>
        <ul>
            <li class="Manage"><a href="<$mt:var name="script_url"$>?__mode=list_field&amp;blog_id=0"><__trans phrase="Manage"></a></li>
            <li class="New"><a href="<$mt:var name="script_url"$>?__mode=view&amp;_type=field&amp;blog_id=0"><__trans phrase="New"></a></li>
        </ul>
    </li>
    <li class="Settings"><a href="<$mt:var name="script_url"$>?__mode=cfg_system_general&amp;blog_id=0"><__trans phrase="Settings"></a>
        <ul>
            <li class="General"><a href="<$mt:var name="script_url"$>?__mode=cfg_system_general&amp;blog_id=0"><__trans phrase="General"></a></li>
            <li class="User"><a href="<$mt:var name="script_url"$>?__mode=cfg_system_users&amp;blog_id=0"><__trans phrase="User"></a></li>
            <li class="Roles"><a href="<$mt:var name="script_url"$>?__mode=list_role&amp;blog_id=0"><__trans phrase="Roles"></a></li>
            <li class="Permissions"><a href="<$mt:var name="script_url"$>?__mode=list_association&amp;blog_id=0"><__trans phrase="Permissions"></a></li>
        </ul>
    </li>
    <li class="Tools"><a href="<$mt:var name="script_url"$>?__mode=search_replace&amp;blog_id=0"><__trans phrase="Tools"></a>
        <ul>
            <li class="Search_Replace"><a href="<$mt:var name="script_url"$>?__mode=search_replace&amp;blog_id=0"><__trans phrase="Search &amp; Replace"></a></li>
            <li class="Plugins"><a href="<$mt:var name="script_url"$>?__mode=cfg_plugins&amp;blog_id=0"><__trans phrase="Plugins"></a></li>
            <li class="Backup"><a href="<$mt:var name="script_url"$>?__mode=start_backup&amp;blog_id=0"><__trans phrase="Backup"></a></li>
            <li class="Restore"><a href="<$mt:var name="script_url"$>?__mode=start_restore&amp;blog_id=0"><__trans phrase="Restore"></a></li>
            <li class="Activity_Log"><a href="<$mt:var name="script_url"$>?__mode=view_log&amp;blog_id=0"><__trans phrase="Activity Log"></a></li>
            <li class="System_Information"><a href="<$mt:var name="script_url"$>?__mode=tools&amp;blog_id=0"><__trans phrase="System Information"></a></li>
        </ul>
    </li>
</ul>
<mt:Ignore>システムメニュー挿入[ end ]</mt:Ignore>
                            </li>
__MT__
    return $out;
}

sub w_menu_org {
    # Confirmed the varsion of 5.0, 5.01, 5.02.
    my $out = <<'__MT__';
<li><mt:if name="fav_website_can_link"><a href="<$mt:var name="mt_url"$>?blog_id=<$mt:var name="fav_website_id"$>&amp;<$mt:var name="return_args" escape="html"$>"></mt:if><mt:var name="fav_website_name" escape="html"><mt:if name="fav_website_can_link"></a></mt:if></li>
__MT__
    return quotemeta($out);
}

sub w_menu {
    my $out = <<'__MT__';
<mt:Ignore>ウェブサイトメニュー挿入[start]</mt:Ignore>
<mt:setvartemplate name="slide_website_menu">
<ul class="mtapp-slidemenu">
    <li class="Blog"><a href="<$mt:var name="script_url"$>?__mode=list_blog&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Blog"></a>
        <ul>
            <li class="Manage"><a href="<$mt:var name="script_url"$>?__mode=list_blog&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Manage"></a></li>
            <li class="New"><a href="<$mt:var name="script_url"$>?__mode=view&amp;_type=blog&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="New"></a></li>
        </ul>
    </li>
    <li class="Entries"><a href="<$mt:var name="script_url"$>?__mode=list_entry&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Entries"></a>
        <ul>
            <li class="Manage"><a href="<$mt:var name="script_url"$>?__mode=list_entry&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Manage"></a></li>
            <li class="Tags"><a href="<$mt:var name="script_url"$>?__mode=list_tag&amp;blog_id=<$mt:var name="loop_curr_id"$>&amp;filter_key=entry"><__trans phrase="Tags"></a></li>
        </ul>
    </li>
    <li class="Pages"><a href="<$mt:var name="script_url"$>?__mode=list_page&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Pages"></a>
        <ul>
            <li class="Manage"><a href="<$mt:var name="script_url"$>?__mode=list_page&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Manage"></a></li>
            <li class="New"><a href="<$mt:var name="script_url"$>?__mode=view&amp;_type=page&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="New"></a></li>
            <li class="Folders"><a href="<$mt:var name="script_url"$>?__mode=list_folder&amp;blog_id=<$mt:var name="loop_curr_id"$>&amp;filter_key=page"><__trans phrase="Folders"></a></li>
            <li class="Tags"><a href="<$mt:var name="script_url"$>?__mode=list_tag&amp;blog_id=<$mt:var name="loop_curr_id"$>&amp;filter_key=page"><__trans phrase="Tags"></a></li>
        </ul>
    </li>
    <li class="Asset"><a href="<$mt:var name="script_url"$>?__mode=list_asset&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Asset"></a>
        <ul>
            <li class="Manage"><a href="<$mt:var name="script_url"$>?__mode=list_asset&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Manage"></a></li>
            <li class="New"><a href="<$mt:var name="script_url"$>?__mode=start_upload&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="New"></a></li>
            <li class="Tags"><a href="<$mt:var name="script_url"$>?__mode=list_tag&amp;blog_id=<$mt:var name="loop_curr_id"$>&amp;filter_key=asset"><__trans phrase="Tags"></a></li>
        </ul>
    </li>
    <li class="Comment"><a href="<$mt:var name="script_url"$>?__mode=list_comment&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Comment"></a>
        <ul>
            <li class="Comment"><a href="<$mt:var name="script_url"$>?__mode=list_comment&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Comment"></a></li>
            <li class="TrackBack"><a href="<$mt:var name="script_url"$>?__mode=list_pings&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="TrackBack"></a></li>
        </ul>
    </li>
    <li class="User"><a href="<$mt:var name="script_url"$>?__mode=list_member&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="User"></a>
        <ul>
            <li class="Manage"><a href="<$mt:var name="script_url"$>?__mode=list_member&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Manage"></a></li>
        </ul>
    </li>
    <li class="Design"><a href="<$mt:var name="script_url"$>?__mode=list_template&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Design"></a>
        <ul>
            <li class="Templates"><a href="<$mt:var name="script_url"$>?__mode=list_template&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Templates"></a></li>
            <li class="Widgets"><a href="<$mt:var name="script_url"$>?__mode=list_widget&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Widgets"></a></li>
            <li class="Styles"><a href="<$mt:var name="script_url"$>?__mode=stylecatcher_theme&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Styles"></a></li>
            <li class="Themes"><a href="<$mt:var name="script_url"$>?__mode=list_theme&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Themes"></a></li>
        </ul>
    </li>
    <li class="Custom_Fields"><a href="<$mt:var name="script_url"$>?__mode=list_field&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans_section component="mt_app_jquery"><__trans phrase="Custom Fields"></__trans_section></a>
        <ul>
            <li class="Manage"><a href="<$mt:var name="script_url"$>?__mode=list_field&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Manage"></a></li>
            <li class="New"><a href="<$mt:var name="script_url"$>?__mode=view&amp;_type=field&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="New"></a></li>
        </ul>
    </li>
    <li class="Settings"><a href="<$mt:var name="script_url"$>?__mode=cfg_prefs&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Settings"></a>
        <ul>
            <li class="General"><a href="<$mt:var name="script_url"$>?__mode=cfg_prefs&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="General"></a></li>
            <li class="Posts"><a href="<$mt:var name="script_url"$>?__mode=cfg_entry&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Posts"></a></li>
            <li class="Feedback"><a href="<$mt:var name="script_url"$>?__mode=cfg_feedback&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Feedback"></a></li>
            <li class="Registration"><a href="<$mt:var name="script_url"$>?__mode=cfg_registration&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Registration"></a></li>
            <li class="Web_Services"><a href="<$mt:var name="script_url"$>?__mode=cfg_web_services&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Web Services"></a></li>
        </ul>
    </li>
    <li class="Tools"><a href="<$mt:var name="script_url"$>?__mode=search_replace&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Tools"></a>
        <ul>
            <li class="Search_Replace"><a href="<$mt:var name="script_url"$>?__mode=search_replace&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Search &amp; Replace"></a></li>
            <li class="Plugins"><a href="<$mt:var name="script_url"$>?__mode=cfg_plugins&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Plugins"></a></li>
            <li class="Export Theme"><a href="<$mt:var name="script_url"$>?__mode=export_theme&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Export Theme"></a></li>
            <li class="Backup"><a href="<$mt:var name="script_url"$>?__mode=start_backup&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Backup"></a></li>
            <li class="Activity_Log"><a href="<$mt:var name="script_url"$>?__mode=view_log&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Activity Log"></a></li>
        </ul>
    </li>
</ul>
</mt:setvartemplate>
<mt:Ignore>ウェブサイトメニュー挿入[ end ]</mt:Ignore>

<mt:Ignore>現在のウェブサイト[start]</mt:Ignore>
<mt:if name="curr_website_id">
<mt:setvarblock name="slide_website_list{$curr_website_id}">
<li class="mtapp-slidemenu-current"><em><a href="<$mt:var name="mt_url"$>?__mode=dashboard&amp;blog_id=<$mt:var name="curr_website_id" setvar="loop_curr_id"$><$mt:var name="loop_curr_id"$>"><mt:var name="curr_website_name" escape="html"></a></em>
<mt:var name="slide_website_menu">
</li>
</mt:setvarblock>
</mt:if>
<mt:Ignore>現在のウェブサイト[ end ]</mt:Ignore>

<mt:Ignore>その他のウェブサイト[start]</mt:Ignore>
<mt:setvarblock name="slide_website_list{$fav_website_id}">
<li><mt:if name="fav_website_can_link"><a href="<$mt:var name="mt_url"$>?__mode=dashboard&amp;blog_id=<$mt:var name="fav_website_id" setvar="loop_curr_id"$><$mt:var name="loop_curr_id"$>"></mt:if><mt:var name="fav_website_name" escape="html"><mt:if name="fav_website_can_link"></a></mt:if>
<mt:var name="slide_website_menu">
</li>
</mt:setvarblock>
<mt:Ignore>その他のウェブサイト[ end ]</mt:Ignore>

<mt:if __last__>
<mt:loop name="slide_website_list" sort_by="key numeric">
<mt:if __first__><ul></mt:if>
<mt:var name="__value__">
<mt:if __last__></ul></mt:if>
</mt:loop>
</mt:if>

</li>
__MT__
    return $out;

}

sub b_menu_org {
    # Confirmed the varsion of 5.0, 5.01, 5.02.
    my $out = <<'__MT__';
<li><a href="<$mt:var name="mt_url"$>?blog_id=<$mt:var name="fav_blog_id"$>&amp;<$mt:var name="return_args" escape="html"$>"><mt:var name="fav_blog_name" escape="html"> <span class="parent"><__trans phrase="(on [_1])" params="<mt:var name="fav_parent_name" escape="html" escape="html">"></span></a></li>
__MT__
    return quotemeta($out);
}

sub b_menu {
    my $out = <<'__MT__';
<mt:Ignore>ブログメニュー挿入[start]</mt:Ignore>
<mt:setvartemplate name="slide_blog_menu">
<ul class="mtapp-slidemenu">
    <li class="Entries"><a href="<$mt:var name="script_url"$>?__mode=list_entry&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Entries"></a>
        <ul>
            <li class="Manage"><a href="<$mt:var name="script_url"$>?__mode=list_entry&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Manage"></a></li>
            <li class="New"><a href="<$mt:var name="script_url"$>?__mode=view&amp;_type=entry&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="New"></a></li>
            <li class="Category"><a href="<$mt:var name="script_url"$>?__mode=list_category&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Category"></a></li>
            <li class="Tags"><a href="<$mt:var name="script_url"$>?__mode=list_tag&amp;blog_id=<$mt:var name="loop_curr_id"$>&amp;filter_key=entry"><__trans phrase="Tags"></a></li>
        </ul>
    </li>
    <li class="Pages"><a href="<$mt:var name="script_url"$>?__mode=list_page&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Pages"></a>
        <ul>
            <li class="Manage"><a href="<$mt:var name="script_url"$>?__mode=list_page&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Manage"></a></li>
            <li class="New"><a href="<$mt:var name="script_url"$>?__mode=view&amp;_type=page&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="New"></a></li>
            <li class="Folders"><a href="<$mt:var name="script_url"$>?__mode=list_folder&amp;blog_id=<$mt:var name="loop_curr_id"$>&amp;filter_key=page"><__trans phrase="Folders"></a></li>
            <li class="Tags"><a href="<$mt:var name="script_url"$>?__mode=list_tag&amp;blog_id=<$mt:var name="loop_curr_id"$>&amp;filter_key=page"><__trans phrase="Tags"></a></li>
        </ul>
    </li>
    <li class="Asset"><a href="<$mt:var name="script_url"$>?__mode=list_asset&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Asset"></a>
        <ul>
            <li class="Manage"><a href="<$mt:var name="script_url"$>?__mode=list_asset&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Manage"></a></li>
            <li class="New"><a href="<$mt:var name="script_url"$>?__mode=start_upload&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="New"></a></li>
            <li class="Tags"><a href="<$mt:var name="script_url"$>?__mode=list_tag&amp;blog_id=<$mt:var name="loop_curr_id"$>&amp;filter_key=asset"><__trans phrase="Tags"></a></li>
        </ul>
    </li>
    <li class="Comment"><a href="<$mt:var name="script_url"$>?__mode=list_comment&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Comment"></a>
        <ul>
            <li class="Comment"><a href="<$mt:var name="script_url"$>?__mode=list_comment&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Comment"></a></li>
            <li class="TrackBack"><a href="<$mt:var name="script_url"$>?__mode=list_pings&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="TrackBack"></a></li>
        </ul>
    </li>
    <li class="User"><a href="<$mt:var name="script_url"$>?__mode=list_member&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="User"></a>
        <ul>
            <li class="Manage"><a href="<$mt:var name="script_url"$>?__mode=list_member&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Manage"></a></li>
        </ul>
    </li>
    <li class="Design"><a href="<$mt:var name="script_url"$>?__mode=list_template&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Design"></a>
        <ul>
            <li class="Templates"><a href="<$mt:var name="script_url"$>?__mode=list_template&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Templates"></a></li>
            <li class="Widgets"><a href="<$mt:var name="script_url"$>?__mode=list_widget&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Widgets"></a></li>
            <li class="Styles"><a href="<$mt:var name="script_url"$>?__mode=stylecatcher_theme&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Styles"></a></li>
            <li class="Themes"><a href="<$mt:var name="script_url"$>?__mode=list_theme&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Themes"></a></li>
        </ul>
    </li>
    <li class="Custom_Fields"><a href="<$mt:var name="script_url"$>?__mode=list_field&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans_section component="mt_app_jquery"><__trans phrase="Custom Fields"></__trans_section></a>
        <ul>
            <li class="Manage"><a href="<$mt:var name="script_url"$>?__mode=list_field&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Manage"></a></li>
            <li class="New"><a href="<$mt:var name="script_url"$>?__mode=view&amp;_type=field&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="New"></a></li>
        </ul>
    </li>
    <li class="Settings"><a href="<$mt:var name="script_url"$>?__mode=cfg_prefs&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Settings"></a>
        <ul>
            <li class="General"><a href="<$mt:var name="script_url"$>?__mode=cfg_prefs&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="General"></a></li>
            <li class="Community"><a href="<$mt:var name="script_url"$>?__mode=cfg_community_prefs&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans_section component="mt_app_jquery"><__trans phrase="Community"></__trans_section></a></li>
            <li class="Posts"><a href="<$mt:var name="script_url"$>?__mode=cfg_entry&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Posts"></a></li>
            <li class="Feedback"><a href="<$mt:var name="script_url"$>?__mode=cfg_feedback&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Feedback"></a></li>
            <li class="Registration"><a href="<$mt:var name="script_url"$>?__mode=cfg_registration&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Registration"></a></li>
            <li class="Web_Services"><a href="<$mt:var name="script_url"$>?__mode=cfg_web_services&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Web Services"></a></li>
        </ul>
    </li>
    <li class="Tools"><a href="<$mt:var name="script_url"$>?__mode=search_replace&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Tools"></a>
        <ul>
            <li class="Search_Replace"><a href="<$mt:var name="script_url"$>?__mode=search_replace&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Search &amp; Replace"></a></li>
            <li class="Plugins"><a href="<$mt:var name="script_url"$>?__mode=cfg_plugins&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Plugins"></a></li>
            <li class="Import_Entries"><a href="<$mt:var name="script_url"$>?__mode=start_import&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Import Entries"></a></li>
            <li class="Export_Entries"><a href="<$mt:var name="script_url"$>?__mode=start_export&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Export Entries"></a></li>
            <li class="Export_Theme"><a href="<$mt:var name="script_url"$>?__mode=export_theme&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Export Theme"></a></li>
            <li class="Backup"><a href="<$mt:var name="script_url"$>?__mode=start_backup&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Backup"></a></li>
            <li class="Activity_Log"><a href="<$mt:var name="script_url"$>?__mode=view_log&amp;blog_id=<$mt:var name="loop_curr_id"$>"><__trans phrase="Activity Log"></a></li>
        </ul>
    </li>
</ul>
</mt:setvartemplate>
<mt:Ignore>ブログメニュー挿入[ ent ]</mt:Ignore>

<mt:Ignore>現在のブログ[start]</mt:Ignore>
<mt:if name="curr_blog_id">
<mt:setvarblock name="slide_blog_list{$curr_blog_id}">
<li class="mtapp-slidemenu-current"><em><a href="<$mt:var name="mt_url"$>?__mode=dashboard&amp;blog_id=<$mt:var name="curr_blog_id" setvar="loop_curr_id"$><$mt:var name="loop_curr_id"$>"><mt:var name="curr_blog_name" escape="html"></a></em>
<mt:var name="slide_blog_menu">
</mt:setvarblock>
</mt:if>
<mt:Ignore>現在のブログ[ end ]</mt:Ignore>

<mt:Ignore>その他のブログ[start]</mt:Ignore>
<mt:setvarblock name="slide_blog_list{$fav_blog_id}">
<li><a href="<$mt:var name="mt_url"$>?__mode=dashboard&amp;blog_id=<$mt:var name="fav_blog_id" setvar="loop_curr_id"$><$mt:var name="loop_curr_id"$>"><mt:var name="fav_blog_name" escape="html"> <span class="parent"><__trans phrase="(on [_1])" params="<mt:var name="fav_parent_name" escape="html" escape="html">"></span></a>
<mt:var name="slide_blog_menu">
</mt:setvarblock>
<mt:Ignore>その他のブログ[ end ]</mt:Ignore>

<mt:if __last__>
<mt:loop name="slide_blog_list" sort_by="key numeric">
<mt:if __first__><ul></mt:if>
<mt:var name="__value__">
<mt:if __last__></ul></mt:if>
</mt:loop>
</mt:if>

</li>
__MT__
    return $out;
}

sub fav_blogs_tab {
    my ($type) = @_;
    
    # Confirmed the varsion of 5.0, 5.01, 5.02.
    my $before = '<li class="tab"><a href="#favorite-blog"><__trans phrase="Blogs"></a></li>';
    return quotemeta($before) if ($type eq 'before');

    my $after = <<__MT__;
    ${before}
    <li class="tab">
        <a href="#favorite-structure">
            <__trans_section component="mt_app_jquery"><__trans phrase="structure"></__trans_section>
        </a>
    </li>
__MT__
    return $after;
}

sub fav_blogs_wdg_close_org {
    return quotemeta('</mtapp:widget>');
}
sub fav_blogs_wdg_close {
    my $out = <<'__MT__';
<div id="favorite-structure">
<mt:if name="website_object_loop">
    <div id="favorite-website-container" class="blog-container">
    <mt:loop name="website_object_loop">
        <div class="favorite-structure-container">
            <mt:Var name="website_id" setvar="crt_website_id" />
            <div id="website-<mt:var name="website_id">" class="blog-content">
                <div id="website-<mt:var name="website_id">-theme-thumbnail" class="blog-theme-thumbnail picture small">
                    <img src="<mt:var name="website_theme_thumb">" />
                </div>
                <div id="website-<mt:var name="website_id">-meta" class="blog-meta">
                    <h4 id="website-<mt:var name="website_id">-name" class="blog-name"><a href="<mt:var name="script_url">?__mode=dashboard&amp;blog_id=<mt:var name="website_id">"><mt:var name="website_name" escape="html"></a></h4>
                    <p id="website-<mt:var name="website_id">-link" class="blog-link"><a href="<mt:var name="website_url">"><mt:var name="website_url"></a></p>
        <mt:if name="website_description">
                    <div id="website-<mt:var name="website_id">-description" class="blog-description">
                        <mt:var name="website_description" remove_html="1">
                    </div>
        </mt:if>
                    <ul id="website-<mt:var name="website_id">-control" class="blog-control">
                        <li>
        <mt:if name="can_access_to_blog_list">
                            <a href="<mt:var name="script_url">?__mode=list_blog&amp;blog_id=<mt:var name="website_id">"><__trans phrase="[quant,_1,blog,blogs]" params="<mt:var name="website_blog_count">"></a>
        <mt:else>
                            <__trans phrase="[quant,_1,blog,blogs]" params="<mt:var name="website_blog_count">">
        </mt:if>
                        </li>
                        <li>
        <mt:if name="can_access_to_page_list">
                            <a href="<mt:var name="script_url">?__mode=list_page&amp;blog_id=<mt:var name="website_id">&amp;filter_key=my_posts_on_this_context"><__trans phrase="[quant,_1,page,pages]" params="<mt:var name="website_page_count">"></a>
        <mt:else>
                            <__trans phrase="[quant,_1,page,pages]" params="<mt:var name="website_page_count">">
        </mt:if>
                        </li>
                        <li>
        <mt:if name="can_access_to_comment_list">
                            <a href="<mt:var name="script_url">?__mode=list_comment&amp;blog_id=<mt:var name="website_id">&amp;filter_key=my_posts_on_this_context"><__trans phrase="[quant,_1,comment,comments]" params="<mt:var name="website_comment_count">"></a>
        <mt:else>
                            <__trans phrase="[quant,_1,comment,comments]" params="<mt:var name="website_comment_count">">
        </mt:if>
                        </li>
        <mt:if name="can_access_to_template_list">
                        <li>
                            <a href="<mt:var name="script_url">?__mode=list_template&amp;blog_id=<mt:var name="website_id">"><__trans phrase="Templates"></a>
                        </li>
        </mt:if>
        <mt:if name="can_access_to_blog_setting_screen">
                        <li>
                            <a href="<mt:var name="script_url">?__mode=cfg_prefs&amp;blog_id=<mt:var name="website_id">"><__trans phrase="Settings"></a>
                        </li>
        </mt:if>
                        <li>
                            <a href="<mt:var name="script_url">?__mode=search_replace&amp;blog_id=<mt:var name="website_id">"><__trans phrase="Search"></a>
                        </li>
                    </ul>
                    <ul id="website-<mt:var name="website_id">-action" class="blog-action">
        <mt:if name="can_create_new_page">
                        <li><a class="button" href="<mt:var name="script_url">?__mode=view&_type=page&amp;blog_id=<mt:var name="website_id">"><__trans phrase="New Page"></a></li>
        </mt:if>
        <mt:if name="can_create_blog">
                        <li><a class="button" href="<mt:var name="script_url">?__mode=view&_type=blog&amp;blog_id=<mt:var name="website_id">"><__trans phrase="New Blog"></a></li>
        </mt:if>
                    </ul>
                <!-- /.blog-meta -->
                </div>
            <!-- /.blog-content -->
            </div>

            <mt:if name="blog_object_loop">
            <div class="favorite-structure-blog-container">
                <mt:loop name="blog_object_loop">
                    <mt:if name="website_id" eq="$crt_website_id">
                    <div id="blog-<mt:var name="blog_id">-content" class="blog-content structure-blog">
                        <div id="blog-<mt:var name="blog_id">-theme-thumbnail" class="blog-theme-thumbnail picture small">
                            <img src="<mt:var name="blog_theme_thumb">" />
                        </div>
                        <div id="blog-<mt:var name="blog_id">-meta" class="blog-meta">
                            <h4 id="blog-<mt:var name="blog_id">-name" class="blog-name">
                                <a href="<mt:var name="script_url">?__mode=dashboard&amp;blog_id=<mt:var name="blog_id">"><mt:var name="blog_name" escape="html"></a>
                                <span class="parent-website">(<mt:if name="can_access_to_website"><a href="<mt:var name="script_url">?__mode=dashboard&amp;blog_id=<mt:var name="website_id">"><mt:var name="website_name" escape="html"></a><mt:else><mt:var name="website_name" escape="html"></mt:if>)</span>
                            </h4>
                            <p id="blog-<mt:var name="blog_id">-link" class="blog-link"><a href="<mt:var name="blog_url">"><mt:var name="blog_url"></a></p>
                <mt:if name="blog_description">
                            <div id="blog-<mt:var name="blog_id">-description" class="blog-description">
                                <mt:var name="blog_description" remove_html="1">
                            </div>
                </mt:if>
                            <ul id="blog-<mt:var name="blog_id">-control" class="blog-control">
                                <li>
                <mt:if name="can_access_to_entry_list">
                                    <a href="<mt:var name="script_url">?__mode=list_entry&amp;blog_id=<mt:var name="blog_id">&amp;filter_key=my_posts_on_this_context"><__trans phrase="[quant,_1,entry,entries]" params="<mt:var name="blog_entry_count">"></a>
                <mt:else>
                                    <__trans phrase="[quant,_1,entry,entries]" params="<mt:var name="blog_entry_count">">
                </mt:if>
                                </li>
                                <li>
                <mt:if name="can_access_to_page_list">
                                    <a href="<mt:var name="script_url">?__mode=list_page&amp;blog_id=<mt:var name="blog_id">&amp;filter_key=my_posts_on_this_context"><__trans phrase="[quant,_1,page,pages]" params="<mt:var name="blog_page_count">"></a>
                <mt:else>
                                    <__trans phrase="[quant,_1,page,pages]" params="<mt:var name="blog_page_count">">
                </mt:if>
                                </li>
                                <li>
                <mt:if name="can_access_to_comment_list">
                                    <a href="<mt:var name="script_url">?__mode=list_comment&amp;blog_id=<mt:var name="blog_id">&amp;filter_key=my_posts_on_this_context"><__trans phrase="[quant,_1,comment,comments]" params="<mt:var name="blog_comment_count">"></a>
                <mt:else>
                                    <__trans phrase="[quant,_1,comment,comments]" params="<mt:var name="blog_comment_count">">
                </mt:if>
                                </li>
                <mt:if name="can_access_to_template_list">
                                <li>
                                    <a href="<mt:var name="script_url">?__mode=list_template&amp;blog_id=<mt:var name="blog_id">"><__trans phrase="Template"></a>
                                </li>
                </mt:if>
                <mt:if name="can_access_to_blog_setting_screen">
                                <li>
                                    <a href="<mt:var name="script_url">?__mode=cfg_prefs&amp;blog_id=<mt:var name="blog_id">"><__trans phrase="Settings"></a>
                                </li>
                </mt:if>
                                <li>
                                    <a href="<mt:var name="script_url">?__mode=search_replace&amp;blog_id=<mt:var name="blog_id">"><__trans phrase="Search"></a>
                                </li>
                            </ul>
                <mt:if name="can_create_new_entry">
                            <ul id="blog-<mt:var name="blog_id">-action" class="blog-action">
                                <li><a class="button" href="<mt:var name="script_url">?__mode=view&amp;_type=entry&amp;blog_id=<mt:var name="blog_id">"><__trans phrase="New Entry"></a></li>
                            </ul>
                </mt:if>
                        <!-- /.blog-meta -->
                        </div>
                    <!-- /.blog-content.structure-blog -->
                    </div>
                    </mt:if>
                </mt:loop>
            <!-- /.favorite-structure-blog-container -->
            </div>
            <mt:else>
                <mtapp:statusmsg
                    id="zero-state"
                    class="info zero-state">
                    <__trans phrase="No blog could be found.">
                </mtapp:statusmsg>
            </mt:if>
            <mt:if name="has_more_blogs">
                <div class="select-blog">
                    <a href="<mt:var name="script_url">?__mode=dialog_select_weblog&amp;return_args=__mode=dashboard&amp;select_favorites=1" class="mt-open-dialog"><__trans phrase="Select another blog..."></a>
                </div>
            </mt:if>
        <!-- /.favorite-structure-container -->
        </div>
    </mt:loop>
    <!-- /#favorite-website-container -->
    </div>
<mt:else>
    <mtapp:statusmsg
        id="zero-state"
        class="info zero-state">
        <__trans phrase="No website could be found. [_1]" params="<mt:if name="can_create_website"><a href="<$mt:var name="mt_url"$>?__mode=view&amp;_type=website&amp;blog_id=0"><__trans phrase="Create a new"></a></mt:if>">
    </mtapp:statusmsg>
</mt:if>
<mt:if name="has_more_websites">
    <div class="select-website">
        <a href="<mt:var name="script_url">?__mode=dialog_select_website&amp;return_args=__mode=dashboard&amp;select_favorites=1" class="mt-open-dialog"><__trans phrase="Select another website..."></a>
    </div>
</mt:if>
<!-- /.favorite-structure -->
</div>
</mtapp:widget>
__MT__
    return $out;
}

sub MTAppSuperSlideMenu {
    my $out = <<'__MT__';
(function($){
    var websites = [], // 単純に配列でリストアップする
        blogs = {}; // 親ウェブサイトIDをキー、その子ブログの配列を値とするオブジェクト

    // ブログ一覧を出力する
    for (var i = -1, n = mtapp_blogs_json.length; ++i < n;) {
        var parent_id = "w" + mtapp_blogs_json[i].parent_id,
            blog_id = mtapp_blogs_json[i].id;
        if (blogs[parent_id]) {
            blogs[parent_id] += 
                "<li class='blog'>" + 
                    "<a href='" + $.MTAppCreateLink({title:'ダッシュボード',blog_id:blog_id}) + "'>" + 
                        mtapp_blogs_json[i].name + 
                    "</a>" + 
                    createBlogMenu(blog_id) + 
                "</li>";
        } else {
            blogs[parent_id] = 
                "<li class='blog'>" + 
                    "<a href='" + $.MTAppCreateLink({title:'ダッシュボード',blog_id:blog_id}) + "'>" + 
                        mtapp_blogs_json[i].name + 
                    "</a>" + 
                    createBlogMenu(blog_id) + 
                "</li>";
        }
    }

    // ウェブサイト一覧を出力する
    for (var i = -1, n = mtapp_websites_json.length; ++i < n;) {
        var website_id = mtapp_websites_json[i].id;
        var currentClass = (website_id == <mt:if name="curr_website_id"><mt:var name="curr_website_id"><mt:else>0</mt:if>) ? " mtapp-slidemenu-current" : "";
        var child_blogs = blogs["w" + website_id] ? blogs["w" + website_id] : "";
        websites.push(
            "<li class='website mtapp-superslide" + currentClass + "'>" + 
                "<a href='" + $.MTAppCreateLink({title:'ダッシュボード',blog_id:website_id}) + "'>" + 
                    mtapp_websites_json[i].name + 
                "</a>" + 
                createWebsiteMenu(website_id, child_blogs) + 
            "</li>"
        );
    }

    websites.sort();
    $(function(){
        $("#selector-nav").find("li.system-overview").append(createSystemMenu()).find("li").andSelf()
            .hover(
                function(){
                    var self = $(this);
                    var w = self.width();
                    var bgColor = "#383C3C";
                    self.css("background-color",bgColor).find("ul:first").css("left", w).show();
                },
                function(){
                    var self = $(this);
                    self.find("ul:first").hide();
                    if (!self.hasClass("mtapp-slidemenu-current")) {
                        self.css("background-color","transparent");
                    }
                }
            );
        $("#fav-website-list").addClass("super-slide-menu").html(websites.join(""))
            .find("li")
                .hover(
                    function(){
                        var self = $(this);
                        var w = self.width();
                        var bgColor = self.hasClass("blog") ? "#5C909B":"#839B5C";
                        self.css("background-color",bgColor).find("ul:first").css("left", w).show();
                    },
                    function(){
                        var self = $(this);
                        self.find("ul:first").hide();
                        if (!self.hasClass("mtapp-slidemenu-current")) {
                            self.css("background-color","transparent");
                        }
                    }
                );
        $('#fav-blog-list, #create-blog-action').hide();
    });
    
    // ウェブサイトの各種メニューを表示
    function createWebsiteMenu(id, child_blogs){
        return [
        '<ul class="mtapp-slidemenu">',
            '<li class="Blog"><a href="' + CMSScriptURI + '?__mode=list_blog&amp;blog_id=' + id + '"><__trans phrase="Blog"></a>',
                '<ul>',
                    child_blogs,
                    '<li class="New"><a href="' + CMSScriptURI + '?__mode=view&amp;_type=blog&amp;blog_id=' + id + '"><__trans phrase="New"></a></li>',
                '</ul>',
            '</li>',
            '<li class="Entries"><a href="' + CMSScriptURI + '?__mode=list_entry&amp;blog_id=' + id + '"><__trans phrase="Entries"></a>',
                '<ul>',
                    '<li class="Manage"><a href="' + CMSScriptURI + '?__mode=list_entry&amp;blog_id=' + id + '"><__trans phrase="Manage"></a></li>',
                    '<li class="Tags"><a href="' + CMSScriptURI + '?__mode=list_tag&amp;blog_id=' + id + '&amp;filter_key=entry"><__trans phrase="Tags"></a></li>',
                '</ul>',
            '</li>',
            '<li class="Pages"><a href="' + CMSScriptURI + '?__mode=list_page&amp;blog_id=' + id + '"><__trans phrase="Pages"></a>',
                '<ul>',
                    '<li class="Manage"><a href="' + CMSScriptURI + '?__mode=list_page&amp;blog_id=' + id + '"><__trans phrase="Manage"></a></li>',
                    '<li class="New"><a href="' + CMSScriptURI + '?__mode=view&amp;_type=page&amp;blog_id=' + id + '"><__trans phrase="New"></a></li>',
                    '<li class="Folders"><a href="' + CMSScriptURI + '?__mode=list_folder&amp;blog_id=' + id + '&amp;filter_key=page"><__trans phrase="Folders"></a></li>',
                    '<li class="Tags"><a href="' + CMSScriptURI + '?__mode=list_tag&amp;blog_id=' + id + '&amp;filter_key=page"><__trans phrase="Tags"></a></li>',
                '</ul>',
            '</li>',
            '<li class="Asset"><a href="' + CMSScriptURI + '?__mode=list_asset&amp;blog_id=' + id + '"><__trans phrase="Asset"></a>',
                '<ul>',
                    '<li class="Manage"><a href="' + CMSScriptURI + '?__mode=list_asset&amp;blog_id=' + id + '"><__trans phrase="Manage"></a></li>',
                    '<li class="New"><a href="' + CMSScriptURI + '?__mode=start_upload&amp;blog_id=' + id + '"><__trans phrase="New"></a></li>',
                    '<li class="Tags"><a href="' + CMSScriptURI + '?__mode=list_tag&amp;blog_id=' + id + '&amp;filter_key=asset"><__trans phrase="Tags"></a></li>',
                '</ul>',
            '</li>',
            '<li class="Comment"><a href="' + CMSScriptURI + '?__mode=list_comment&amp;blog_id=' + id + '"><__trans phrase="Comment"></a>',
                '<ul>',
                    '<li class="Comment"><a href="' + CMSScriptURI + '?__mode=list_comment&amp;blog_id=' + id + '"><__trans phrase="Comment"></a></li>',
                    '<li class="TrackBack"><a href="' + CMSScriptURI + '?__mode=list_pings&amp;blog_id=' + id + '"><__trans phrase="TrackBack"></a></li>',
                '</ul>',
            '</li>',
            '<li class="User"><a href="' + CMSScriptURI + '?__mode=list_member&amp;blog_id=' + id + '"><__trans phrase="User"></a>',
                '<ul>',
                    '<li class="Manage"><a href="' + CMSScriptURI + '?__mode=list_member&amp;blog_id=' + id + '"><__trans phrase="Manage"></a></li>',
                '</ul>',
            '</li>',
            '<li class="Design"><a href="' + CMSScriptURI + '?__mode=list_template&amp;blog_id=' + id + '"><__trans phrase="Design"></a>',
                '<ul>',
                    '<li class="Templates"><a href="' + CMSScriptURI + '?__mode=list_template&amp;blog_id=' + id + '"><__trans phrase="Templates"></a></li>',
                    '<li class="Widgets"><a href="' + CMSScriptURI + '?__mode=list_widget&amp;blog_id=' + id + '"><__trans phrase="Widgets"></a></li>',
                    '<li class="Styles"><a href="' + CMSScriptURI + '?__mode=stylecatcher_theme&amp;blog_id=' + id + '"><__trans phrase="Styles"></a></li>',
                    '<li class="Themes"><a href="' + CMSScriptURI + '?__mode=list_theme&amp;blog_id=' + id + '"><__trans phrase="Themes"></a></li>',
                '</ul>',
            '</li>',
            '<li class="Custom_Fields"><a href="' + CMSScriptURI + '?__mode=list_field&amp;blog_id=' + id + '"><__trans_section component="mt_app_jquery"><__trans phrase="Custom Fields"></__trans_section></a>',
                '<ul>',
                    '<li class="Manage"><a href="' + CMSScriptURI + '?__mode=list_field&amp;blog_id=' + id + '"><__trans phrase="Manage"></a></li>',
                    '<li class="New"><a href="' + CMSScriptURI + '?__mode=view&amp;_type=field&amp;blog_id=' + id + '"><__trans phrase="New"></a></li>',
                '</ul>',
            '</li>',
            '<li class="Settings"><a href="' + CMSScriptURI + '?__mode=cfg_prefs&amp;blog_id=' + id + '"><__trans phrase="Settings"></a>',
                '<ul>',
                    '<li class="General"><a href="' + CMSScriptURI + '?__mode=cfg_prefs&amp;blog_id=' + id + '"><__trans phrase="General"></a></li>',
                    '<li class="Posts"><a href="' + CMSScriptURI + '?__mode=cfg_entry&amp;blog_id=' + id + '"><__trans phrase="Posts"></a></li>',
                    '<li class="Feedback"><a href="' + CMSScriptURI + '?__mode=cfg_feedback&amp;blog_id=' + id + '"><__trans phrase="Feedback"></a></li>',
                    '<li class="Registration"><a href="' + CMSScriptURI + '?__mode=cfg_registration&amp;blog_id=' + id + '"><__trans phrase="Registration"></a></li>',
                    '<li class="Web_Services"><a href="' + CMSScriptURI + '?__mode=cfg_web_services&amp;blog_id=' + id + '"><__trans phrase="Web Services"></a></li>',
                '</ul>',
            '</li>',
            '<li class="Tools"><a href="' + CMSScriptURI + '?__mode=search_replace&amp;blog_id=' + id + '"><__trans phrase="Tools"></a>',
                '<ul>',
                    '<li class="Search_Replace"><a href="' + CMSScriptURI + '?__mode=search_replace&amp;blog_id=' + id + '"><__trans phrase="Search &amp; Replace"></a></li>',
                    '<li class="Plugins"><a href="' + CMSScriptURI + '?__mode=cfg_plugins&amp;blog_id=' + id + '"><__trans phrase="Plugins"></a></li>',
                    '<li class="Export Theme"><a href="' + CMSScriptURI + '?__mode=export_theme&amp;blog_id=' + id + '"><__trans phrase="Export Theme"></a></li>',
                    '<li class="Backup"><a href="' + CMSScriptURI + '?__mode=start_backup&amp;blog_id=' + id + '"><__trans phrase="Backup"></a></li>',
                    '<li class="Activity_Log"><a href="' + CMSScriptURI + '?__mode=view_log&amp;blog_id=' + id + '"><__trans phrase="Activity Log"></a></li>',
                '</ul>',
            '</li>',
        '</ul>'].join("");
    };

    // ブログの各種メニューを作成
    function createBlogMenu(id){
        return [
            '<ul>',
                '<li class="blog Entries"><a href="' + CMSScriptURI + '?__mode=list_entry&amp;blog_id=' + id + '"><__trans phrase="Entries"></a>',
                    '<ul>',
                        '<li class="blog Manage"><a href="' + CMSScriptURI + '?__mode=list_entry&amp;blog_id=' + id + '"><__trans phrase="Manage"></a></li>',
                        '<li class="blog New"><a href="' + CMSScriptURI + '?__mode=view&amp;_type=entry&amp;blog_id=' + id + '"><__trans phrase="New"></a></li>',
                        '<li class="blog Category"><a href="' + CMSScriptURI + '?__mode=list_category&amp;blog_id=' + id + '"><__trans phrase="Category"></a></li>',
                        '<li class="blog Tags"><a href="' + CMSScriptURI + '?__mode=list_tag&amp;blog_id=' + id + '&amp;filter_key=entry"><__trans phrase="Tags"></a></li>',
                    '</ul>',
                '</li>',
                '<li class="blog Pages"><a href="' + CMSScriptURI + '?__mode=list_page&amp;blog_id=' + id + '"><__trans phrase="Pages"></a>',
                    '<ul>',
                        '<li class="blog Manage"><a href="' + CMSScriptURI + '?__mode=list_page&amp;blog_id=' + id + '"><__trans phrase="Manage"></a></li>',
                        '<li class="blog New"><a href="' + CMSScriptURI + '?__mode=view&amp;_type=page&amp;blog_id=' + id + '"><__trans phrase="New"></a></li>',
                        '<li class="blog Folders"><a href="' + CMSScriptURI + '?__mode=list_folder&amp;blog_id=' + id + '&amp;filter_key=page"><__trans phrase="Folders"></a></li>',
                        '<li class="blog Tags"><a href="' + CMSScriptURI + '?__mode=list_tag&amp;blog_id=' + id + '&amp;filter_key=page"><__trans phrase="Tags"></a></li>',
                    '</ul>',
                '</li>',
                '<li class="blog Asset"><a href="' + CMSScriptURI + '?__mode=list_asset&amp;blog_id=' + id + '"><__trans phrase="Asset"></a>',
                    '<ul>',
                        '<li class="blog Manage"><a href="' + CMSScriptURI + '?__mode=list_asset&amp;blog_id=' + id + '"><__trans phrase="Manage"></a></li>',
                        '<li class="blog New"><a href="' + CMSScriptURI + '?__mode=start_upload&amp;blog_id=' + id + '"><__trans phrase="New"></a></li>',
                        '<li class="blog Tags"><a href="' + CMSScriptURI + '?__mode=list_tag&amp;blog_id=' + id + '&amp;filter_key=asset"><__trans phrase="Tags"></a></li>',
                    '</ul>',
                '</li>',
                '<li class="blog Comment"><a href="' + CMSScriptURI + '?__mode=list_comment&amp;blog_id=' + id + '"><__trans phrase="Comment"></a>',
                    '<ul>',
                        '<li class="blog Comment"><a href="' + CMSScriptURI + '?__mode=list_comment&amp;blog_id=' + id + '"><__trans phrase="Comment"></a></li>',
                        '<li class="blog TrackBack"><a href="' + CMSScriptURI + '?__mode=list_pings&amp;blog_id=' + id + '"><__trans phrase="TrackBack"></a></li>',
                    '</ul>',
                '</li>',
                '<li class="blog User"><a href="' + CMSScriptURI + '?__mode=list_member&amp;blog_id=' + id + '"><__trans phrase="User"></a>',
                    '<ul>',
                        '<li class="blog Manage"><a href="' + CMSScriptURI + '?__mode=list_member&amp;blog_id=' + id + '"><__trans phrase="Manage"></a></li>',
                    '</ul>',
                '</li>',
                '<li class="blog Design"><a href="' + CMSScriptURI + '?__mode=list_template&amp;blog_id=' + id + '"><__trans phrase="Design"></a>',
                    '<ul>',
                        '<li class="blog Templates"><a href="' + CMSScriptURI + '?__mode=list_template&amp;blog_id=' + id + '"><__trans phrase="Templates"></a></li>',
                        '<li class="blog Widgets"><a href="' + CMSScriptURI + '?__mode=list_widget&amp;blog_id=' + id + '"><__trans phrase="Widgets"></a></li>',
                        '<li class="blog Styles"><a href="' + CMSScriptURI + '?__mode=stylecatcher_theme&amp;blog_id=' + id + '"><__trans phrase="Styles"></a></li>',
                        '<li class="blog Themes"><a href="' + CMSScriptURI + '?__mode=list_theme&amp;blog_id=' + id + '"><__trans phrase="Themes"></a></li>',
                    '</ul>',
                '</li>',
                '<li class="blog Custom_Fields"><a href="' + CMSScriptURI + '?__mode=list_field&amp;blog_id=' + id + '"><__trans_section component="mt_app_jquery"><__trans phrase="Custom Fields"></__trans_section></a>',
                    '<ul>',
                        '<li class="blog Manage"><a href="' + CMSScriptURI + '?__mode=list_field&amp;blog_id=' + id + '"><__trans phrase="Manage"></a></li>',
                        '<li class="blog New"><a href="' + CMSScriptURI + '?__mode=view&amp;_type=field&amp;blog_id=' + id + '"><__trans phrase="New"></a></li>',
                    '</ul>',
                '</li>',
                '<li class="blog Settings"><a href="' + CMSScriptURI + '?__mode=cfg_prefs&amp;blog_id=' + id + '"><__trans phrase="Settings"></a>',
                    '<ul>',
                        '<li class="blog General"><a href="' + CMSScriptURI + '?__mode=cfg_prefs&amp;blog_id=' + id + '"><__trans phrase="General"></a></li>',
                        '<li class="blog Community"><a href="' + CMSScriptURI + '?__mode=cfg_community_prefs&amp;blog_id=' + id + '"><__trans_section component="mt_app_jquery"><__trans phrase="Community"></__trans_section></a></li>',
                        '<li class="blog Posts"><a href="' + CMSScriptURI + '?__mode=cfg_entry&amp;blog_id=' + id + '"><__trans phrase="Posts"></a></li>',
                        '<li class="blog Feedback"><a href="' + CMSScriptURI + '?__mode=cfg_feedback&amp;blog_id=' + id + '"><__trans phrase="Feedback"></a></li>',
                        '<li class="blog Registration"><a href="' + CMSScriptURI + '?__mode=cfg_registration&amp;blog_id=' + id + '"><__trans phrase="Registration"></a></li>',
                        '<li class="blog Web_Services"><a href="' + CMSScriptURI + '?__mode=cfg_web_services&amp;blog_id=' + id + '"><__trans phrase="Web Services"></a></li>',
                    '</ul>',
                '</li>',
                '<li class="blog Tools"><a href="' + CMSScriptURI + '?__mode=search_replace&amp;blog_id=' + id + '"><__trans phrase="Tools"></a>',
                    '<ul>',
                        '<li class="blog Search_Replace"><a href="' + CMSScriptURI + '?__mode=search_replace&amp;blog_id=' + id + '"><__trans phrase="Search &amp; Replace"></a></li>',
                        '<li class="blog Plugins"><a href="' + CMSScriptURI + '?__mode=cfg_plugins&amp;blog_id=' + id + '"><__trans phrase="Plugins"></a></li>',
                        '<li class="blog Import_Entries"><a href="' + CMSScriptURI + '?__mode=start_import&amp;blog_id=' + id + '"><__trans phrase="Import Entries"></a></li>',
                        '<li class="blog Export_Entries"><a href="' + CMSScriptURI + '?__mode=start_export&amp;blog_id=' + id + '"><__trans phrase="Export Entries"></a></li>',
                        '<li class="blog Export_Theme"><a href="' + CMSScriptURI + '?__mode=export_theme&amp;blog_id=' + id + '"><__trans phrase="Export Theme"></a></li>',
                        '<li class="blog Backup"><a href="' + CMSScriptURI + '?__mode=start_backup&amp;blog_id=' + id + '"><__trans phrase="Backup"></a></li>',
                        '<li class="blog Activity_Log"><a href="' + CMSScriptURI + '?__mode=view_log&amp;blog_id=' + id + '"><__trans phrase="Activity Log"></a></li>',
                    '</ul>',
                '</li>',
            '</ul>'
        ].join("");
    };

    // システムの各種メニューを作成
    function createSystemMenu(){
        return [
            '<ul>',
                '<li class="Websites"><a href="' + CMSScriptURI + '?__mode=list_website&amp;blog_id=0"><__trans phrase="Websites"></a>',
                    '<ul>',
                        '<li class="Manage"><a href="' + CMSScriptURI + '?__mode=list_website&amp;blog_id=0"><__trans phrase="Manage"></a></li>',
                        '<li class="New"><a href="' + CMSScriptURI + '?__mode=view&amp;_type=website&amp;blog_id=0"><__trans phrase="New"></a></li>',
                    '</ul>',
                '</li>',
                '<li class="User"><a href="' + CMSScriptURI + '?__mode=list_author&amp;blog_id=0"><__trans phrase="User"></a>',
                    '<ul>',
                        '<li class="Manage"><a href="' + CMSScriptURI + '?__mode=list_author&amp;blog_id=0"><__trans phrase="Manage"></a></li>',
                        '<li class="New"><a href="' + CMSScriptURI + '?__mode=view&amp;_type=author&amp;blog_id=0"><__trans phrase="New"></a></li>',
                    '</ul>',
                '</li>',
                '<li class="Design"><a href="' + CMSScriptURI + '?__mode=list_template&amp;blog_id=0"><__trans phrase="Design"></a>',
                    '<ul>',
                        '<li class="Templates"><a href="' + CMSScriptURI + '?__mode=list_template&amp;blog_id=0"><__trans phrase="Templates"></a></li>',
                        '<li class="Widgets"><a href="' + CMSScriptURI + '?__mode=list_widget&amp;blog_id=0"><__trans phrase="Widgets"></a></li>',
                        '<li class="Themes"><a href="' + CMSScriptURI + '?__mode=list_theme&amp;blog_id=0"><__trans phrase="Themes"></a></li>',
                    '</ul>',
                '</li>',
                '<li class="Custom_Fields"><a href="' + CMSScriptURI + '?__mode=list_field&amp;blog_id=0"><__trans_section component="mt_app_jquery"><__trans phrase="Custom Fields"></__trans_section></a>',
                    '<ul>',
                        '<li class="Manage"><a href="' + CMSScriptURI + '?__mode=list_field&amp;blog_id=0"><__trans phrase="Manage"></a></li>',
                        '<li class="New"><a href="' + CMSScriptURI + '?__mode=view&amp;_type=field&amp;blog_id=0"><__trans phrase="New"></a></li>',
                    '</ul>',
                '</li>',
                '<li class="Settings"><a href="' + CMSScriptURI + '?__mode=cfg_system_general&amp;blog_id=0"><__trans phrase="Settings"></a>',
                    '<ul>',
                        '<li class="General"><a href="' + CMSScriptURI + '?__mode=cfg_system_general&amp;blog_id=0"><__trans phrase="General"></a></li>',
                        '<li class="User"><a href="' + CMSScriptURI + '?__mode=cfg_system_users&amp;blog_id=0"><__trans phrase="User"></a></li>',
                        '<li class="Roles"><a href="' + CMSScriptURI + '?__mode=list_role&amp;blog_id=0"><__trans phrase="Roles"></a></li>',
                        '<li class="Permissions"><a href="' + CMSScriptURI + '?__mode=list_association&amp;blog_id=0"><__trans phrase="Permissions"></a></li>',
                    '</ul>',
                '</li>',
                '<li class="Tools"><a href="' + CMSScriptURI + '?__mode=search_replace&amp;blog_id=0"><__trans phrase="Tools"></a>',
                    '<ul>',
                        '<li class="Search_Replace"><a href="' + CMSScriptURI + '?__mode=search_replace&amp;blog_id=0"><__trans phrase="Search &amp; Replace"></a></li>',
                        '<li class="Plugins"><a href="' + CMSScriptURI + '?__mode=cfg_plugins&amp;blog_id=0"><__trans phrase="Plugins"></a></li>',
                        '<li class="Backup"><a href="' + CMSScriptURI + '?__mode=start_backup&amp;blog_id=0"><__trans phrase="Backup"></a></li>',
                        '<li class="Restore"><a href="' + CMSScriptURI + '?__mode=start_restore&amp;blog_id=0"><__trans phrase="Restore"></a></li>',
                        '<li class="Activity_Log"><a href="' + CMSScriptURI + '?__mode=view_log&amp;blog_id=0"><__trans phrase="Activity Log"></a></li>',
                        '<li class="System_Information"><a href="' + CMSScriptURI + '?__mode=tools&amp;blog_id=0"><__trans phrase="System Information"></a></li>',
                    '</ul>',
                '</li>',
            '</ul>'
        ].join("");
    };

    function digit(n){
        return n < 10 ? "0" + n : n.toString();
    }
})(jQuery);
__MT__
    return $out;
}

sub uploadify_widget_innerHTML {
    my $out = <<'__MT__';
    <input id="uploadify" type="file" />
    <div id="fileQueue"></div>
    <div id="upload_files"></div>
    <mt:setvarblock name="jq_js_include" append="1">
    /*
    Uploadify v2.1.0
    Release Date: August 24, 2009
    Modified by Tomohiro Okuwaki (2010-04-12)
    
    Copyright (c) 2009 Ronnie Garcia, Travis Nickels
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
    */
    
    if(jQuery)(
        function(jQuery){
            jQuery.extend(jQuery.fn,{
                uploadify:function(options) {
                    jQuery(this).each(function(){
                        settings = jQuery.extend({
                            id             : jQuery(this).attr('id'), // The ID of the object being Uploadified
                            uploader       : 'uploadify.swf', // The path to the uploadify swf file
                            script         : 'uploadify.php', // The path to the uploadify backend upload script
                            expressInstall : null, // The path to the express install swf file
                            folder         : '', // The path to the upload folder
                            height         : 30, // The height of the flash button
                            width          : 110, // The width of the flash button
                            cancelImg      : 'cancel.png', // The path to the cancel image for the default file queue item container
                            wmode          : 'opaque', // The wmode of the flash file
                            scriptAccess   : 'sameDomain', // Set to "always" to allow script access across domains
                            fileDataName   : 'Filedata', // The name of the file collection object in the backend upload script
                            method         : 'POST', // The method for sending variables to the backend upload script
                            queueSizeLimit : 999, // The maximum size of the file queue
                            simUploadLimit : 1, // The number of simultaneous uploads allowed
                            queueID        : false, // The optional ID of the queue container
                            displayData    : 'percentage', // Set to "speed" to show the upload speed in the default queue item
                            onInit         : function() {}, // Function to run when uploadify is initialized
                            onSelect       : function() {}, // Function to run when a file is selected
                            onQueueFull    : function() {}, // Function to run when the queue reaches capacity
                            onCheck        : function() {}, // Function to run when script checks for duplicate files on the server
                            onCancel       : function() {}, // Function to run when an item is cleared from the queue
                            onError        : function() {}, // Function to run when an upload item returns an error
                            onProgress     : function() {}, // Function to run each time the upload progress is updated
                            onComplete     : function() {}, // Function to run when an upload is completed
                            onAllComplete  : function() {}  // Functino to run when all uploads are completed
                        }, options);
                    var pagePath = location.pathname;
                    pagePath = pagePath.split('/');
                    pagePath.pop();
                    pagePath = pagePath.join('/') + '/';
                    var data = {};
                    data.uploadifyID = settings.id;
                    data.pagepath = pagePath;
                    if (settings.buttonImg) data.buttonImg = escape(settings.buttonImg);
                    if (settings.buttonText) data.buttonText = escape(settings.buttonText);
                    if (settings.rollover) data.rollover = true;
                    data.script = settings.script;
                    data.folder = escape(settings.folder);
                    if (settings.scriptData) {
                        var scriptDataString = '';
                        for (var name in settings.scriptData) {
                            scriptDataString += '&' + name + '=' + settings.scriptData[name];
                        }
                        data.scriptData = escape(scriptDataString.substr(1));
                    }
                    data.width          = settings.width;
                    data.height         = settings.height;
                    data.wmode          = settings.wmode;
                    data.method         = settings.method;
                    data.queueSizeLimit = settings.queueSizeLimit;
                    data.simUploadLimit = settings.simUploadLimit;
                    if (settings.hideButton)   data.hideButton   = true;
                    if (settings.fileDesc)     data.fileDesc     = settings.fileDesc;
                    if (settings.fileExt)      data.fileExt      = settings.fileExt;
                    if (settings.multi)        data.multi        = true;
                    if (settings.auto)         data.auto         = true;
                    if (settings.sizeLimit)    data.sizeLimit    = settings.sizeLimit;
                    if (settings.checkScript)  data.checkScript  = settings.checkScript;
                    if (settings.fileDataName) data.fileDataName = settings.fileDataName;
                    if (settings.queueID)      data.queueID      = settings.queueID;
                    if (settings.onInit() !== false) {
                        jQuery(this).css('display','none');
                        jQuery(this).after('<div id="' + jQuery(this).attr('id') + 'Uploader"></div>');
                        swfobject.embedSWF(settings.uploader, settings.id + 'Uploader', settings.width, settings.height, '9.0.24', settings.expressInstall, data, {'quality':'high','wmode':settings.wmode,'allowScriptAccess':settings.scriptAccess});
                        if (settings.queueID == false) {
                            jQuery("#" + jQuery(this).attr('id') + "Uploader").after('<div id="' + jQuery(this).attr('id') + 'Queue" class="uploadifyQueue"></div>');
                        }
                    }
                    if (typeof(settings.onOpen) == 'function') {
                        jQuery(this).bind("uploadifyOpen", settings.onOpen);
                    }
                    jQuery(this).bind("uploadifySelect", {'action': settings.onSelect, 'queueID': settings.queueID}, function(event, ID, fileObj) {
                        if (event.data.action(event, ID, fileObj) !== false) {
                            var byteSize = Math.round(fileObj.size / 1024 * 100) * .01;
                            var suffix = 'KB';
                            if (byteSize > 1000) {
                                byteSize = Math.round(byteSize *.001 * 100) * .01;
                                suffix = 'MB';
                            }
                            var sizeParts = byteSize.toString().split('.');
                            if (sizeParts.length > 1) {
                                byteSize = sizeParts[0] + '.' + sizeParts[1].substr(0,2);
                            } else {
                                byteSize = sizeParts[0];
                            }
                            if (fileObj.name.length > 20) {
                                fileName = fileObj.name.substr(0,20) + '...';
                            } else {
                                fileName = fileObj.name;
                            }
                            queue = '#' + jQuery(this).attr('id') + 'Queue';
                            if (event.data.queueID) {
                                queue = '#' + event.data.queueID;
                            }
                            // modified by Tomohiro Okuwaki [start]
                            var _id = {
                                'id'      : jQuery(this).attr('id') + ID,
                                'selector': "'#" + jQuery(this).attr('id') + "'"
                            };
                            var innerHtml = [
                                '<div id="' + _id['id'] + '" class="uploadifyQueueItem">',
                                    '<div class="cancel">',
                                        '<a href="javascript:jQuery(' + _id['selector'] + ').uploadifyCancel(\'' + ID + '\')">',
                                            '<img src="' + settings.cancelImg + '" border="0" />',
                                        '</a>',
                                    '</div>',
                                    '<span class="fileName">' + fileName + ' (' + byteSize + suffix + ')</span><span class="percentage"></span>',
                                    '<div class="uploadifyProgress">',
                                        '<div id="' + _id['id'] + 'ProgressBar" class="uploadifyProgressBar"><!--Progress Bar--></div>',
                                    '</div>',
                                '</div>'
                            ];
                            jQuery(queue).append(innerHtml.join(''));
                            // modified by Tomohiro Okuwaki [ end ]
    
                        }
                    });
                    if (typeof(settings.onSelectOnce) == 'function') {
                        jQuery(this).bind("uploadifySelectOnce", settings.onSelectOnce);
                    }
                    jQuery(this).bind("uploadifyQueueFull", {'action': settings.onQueueFull}, function(event, queueSizeLimit) {
                        if (event.data.action(event, queueSizeLimit) !== false) {
                            alert('The queue is full.  The max size is ' + queueSizeLimit + '.');
                        }
                    });
                    jQuery(this).bind("uploadifyCheckExist", {'action': settings.onCheck}, function(event, checkScript, fileQueueObj, folder, single) {
                        var postData = new Object();
                        postData = fileQueueObj;
                        // modified by Tomohiro Okuwaki [start]
                        if (folder.match(/^\//) || folder.match(/^http/)) {
                            postData.folder = folder;                   
    
                        } else {
                            postData.folder = pagePath + folder;                    
                        }
                        // modified by Tomohiro Okuwaki [ end ]
                        if (single) {
                            for (var ID in fileQueueObj) {
                                var singleFileID = ID;
                            }
                        }
                        jQuery.post(checkScript, postData, function(data) {
                            var eventID = '#' + jQuery(event.target).attr('id') + 'Uploader';
                            for(var key in data) {
                                // modified by Tomohiro Okuwaki [start]
                                if (data[key]['ext'] == 'deny') {
                                    alert(data[key]['name'] + 'はアップロードが許可されていないファイルです。');
                                    jQuery(eventID)[0].cancelFileUpload(key, true,true);
                                    continue;
                                }
                                if (data[key]['exist'] == 1) {
                                    var replaceFile = confirm(data[key]['name'] + " はすでに存在します。上書きしてよろしいですか？");
                                    if (!replaceFile) {
                                        jQuery(eventID)[0].cancelFileUpload(key, true, true);
                                        continue;
                                    }
                                }
                                // modified by Tomohiro Okuwaki [ end ]
                            }
                            if (single) {
                                jQuery(eventID)[0].startFileUpload(singleFileID, true);
                            } else {
                                jQuery(eventID)[0].startFileUpload(null, true);
                            }
                        }, "json");
                    });
                    jQuery(this).bind("uploadifyCancel", {'action': settings.onCancel}, function(event, ID, fileObj, data, clearFast) {
                        if (event.data.action(event, ID, fileObj, data, clearFast) !== false) {
                            var fadeSpeed = (clearFast == true) ? 0 : 250;
                            jQuery("#" + jQuery(this).attr('id') + ID).fadeOut(fadeSpeed, function() { jQuery(this).remove() });
                        }
                    });
                    if (typeof(settings.onClearQueue) == 'function') {
                        jQuery(this).bind("uploadifyClearQueue", settings.onClearQueue);
                    }
                    var errorArray = [];
                    jQuery(this).bind("uploadifyError", {'action': settings.onError}, function(event, ID, fileObj, errorObj) {
                        if (event.data.action(event, ID, fileObj, errorObj) !== false) {
                            var fileArray = new Array(ID, fileObj, errorObj);
                            errorArray.push(fileArray);
                            jQuery("#" + jQuery(this).attr('id') + ID + " .percentage").text(" - " + errorObj.type + " Error");
                            jQuery("#" + jQuery(this).attr('id') + ID).addClass('uploadifyError');
                        }
                    });
                    jQuery(this).bind("uploadifyProgress", {'action': settings.onProgress, 'toDisplay': settings.displayData}, function(event, ID, fileObj, data) {
                        if (event.data.action(event, ID, fileObj, data) !== false) {
                            jQuery("#" + jQuery(this).attr('id') + ID + "ProgressBar").css('width', data.percentage + '%');
                            if (event.data.toDisplay == 'percentage') displayData = ' - ' + data.percentage + '%';
                            if (event.data.toDisplay == 'speed') displayData = ' - ' + data.speed + 'KB/s';
                            if (event.data.toDisplay == null) displayData = ' ';
                            jQuery("#" + jQuery(this).attr('id') + ID + " .percentage").text(displayData);
                        }
                    });
                    jQuery(this).bind("uploadifyComplete", {'action': settings.onComplete}, function(event, ID, fileObj, response, data) {
                        if (event.data.action(event, ID, fileObj, unescape(response), data) !== false) {
                            // modified by Tomohiro Okuwaki [Completed => 完了]
                            jQuery("#" + jQuery(this).attr('id') + ID + " .percentage").text(' - 完了');
                            jQuery("#" + jQuery(this).attr('id') + ID).fadeOut(250, function() { jQuery(this).remove()});
                        }
                    });
                    if (typeof(settings.onAllComplete) == 'function') {
                        jQuery(this).bind("uploadifyAllComplete", {'action': settings.onAllComplete}, function(event, uploadObj) {
                            if (event.data.action(event, uploadObj) !== false) {
                                errorArray = [];
                            }
                        });
                    }
                });
            },
            uploadifySettings:function(settingName, settingValue, resetObject) {
                var returnValue = false;
                jQuery(this).each(function() {
                    if (settingName == 'scriptData' && settingValue != null) {
                        if (resetObject) {
                            var scriptData = settingValue;
                        } else {
                            var scriptData = jQuery.extend(settings.scriptData, settingValue);
                        }
                        var scriptDataString = '';
                        for (var name in scriptData) {
                            scriptDataString += '&' + name + '=' + escape(scriptData[name]);
                        }
                        settingValue = scriptDataString.substr(1);
                    }
                    returnValue = document.getElementById(jQuery(this).attr('id') + 'Uploader').updateSettings(settingName, settingValue);
                });
                if (settingValue == null) {
                    if (settingName == 'scriptData') {
                        var returnSplit = unescape(returnValue).split('&');
                        var returnObj   = new Object();
                        for (var i = 0; i < returnSplit.length; i++) {
                            var iSplit = returnSplit[i].split('=');
                            returnObj[iSplit[0]] = iSplit[1];
                        }
                        returnValue = returnObj;
                    }
                    return returnValue;
                }
            },
            uploadifyUpload:function(ID) {
                jQuery(this).each(function() {
                    document.getElementById(jQuery(this).attr('id') + 'Uploader').startFileUpload(ID, false);
                });
            },
            uploadifyCancel:function(ID) {
                jQuery(this).each(function() {
                    document.getElementById(jQuery(this).attr('id') + 'Uploader').cancelFileUpload(ID, true, false);
                });
            },
            uploadifyClearQueue:function() {
                jQuery(this).each(function() {
                    document.getElementById(jQuery(this).attr('id') + 'Uploader').clearFileUploadQueue(false);
                });
            }
        })
    })(jQuery);

    var uploadifyOnError = function (event,queueID,fileObj,errorObj){
        alert('<__trans_section component="mt_app_jquery"><__trans phrase="You can upload up to 1MB file."></__trans_section>');
    }
    var uploadifyOnComplete = function (event,queueID,fileObj){
        var file_name = fileObj.name;
        var file_ext  = file_name.match(/(\.)([a-zA-Z]+)$/);
            file_ext  = file_ext[2].toLowerCase();
        var file_path = '<mt:if name="upload_folder">/<mt:var name="upload_folder"></mt:if>/' + file_name;
        var mime_type = '';
        switch (file_ext) {
            case 'css'    : mime_type = 'text/css'; break;
            case 'html'   : mime_type = 'text/html'; break;
            case 'mtml'   : mime_type = 'text/html'; break;
            case 'xhtml'  : mime_type = 'application/xhtml+xml'; break;
            case 'htm'    : mime_type = 'text/html'; break;
            case 'txt'    : mime_type = 'text/plain'; break;
            case 'rtx'    : mime_type = 'text/richtext'; break;
            case 'tsv'    : mime_type = 'text/tab-separated-values'; break;
            case 'csv'    : mime_type = 'text/csv'; break;
            case 'hdml'   : mime_type = 'text/x-hdml; charset=Shift_JIS'; break;
            case 'xml'    : mime_type = 'application/xml'; break;
            case 'atom'   : mime_type = 'application/atom+xml'; break;
            case 'rss'    : mime_type = 'application/rss+xml'; break;
            case 'rdf'    : mime_type = 'application/rdf+xml'; break;
            case 'xsl'    : mime_type = 'text/xsl'; break;
            case 'mpeg'   : mime_type = 'video/mpeg'; break;
            case 'mpg'    : mime_type = 'video/mpeg'; break;
            case 'mpe'    : mime_type = 'video/mpeg'; break;
            case 'qt'     : mime_type = 'video/quicktime'; break;
            case 'avi'    : mime_type = 'video/x-msvideo'; break;
            case 'movie'  : mime_type = 'video/x-sgi-movie'; break;
            case 'mov'    : mime_type = 'video/quicktime'; break;
            case 'ice'    : mime_type = 'x-conference/x-cooltalk'; break;
            case 'svr'    : mime_type = 'x-world/x-svr'; break;
            case 'vrml'   : mime_type = 'x-world/x-vrml'; break;
            case 'wrl'    : mime_type = 'x-world/x-vrml'; break;
            case 'vrt'    : mime_type = 'x-world/x-vrt'; break;
            case 'spl'    : mime_type = 'application/futuresplash'; break;
            case 'js'     : mime_type = 'application/javascript'; break;
            case 'json'   : mime_type = 'application/json'; break;
            case 'hqx'    : mime_type = 'application/mac-binhex40'; break;
            case 'doc'    : mime_type = 'application/msword'; break;
            case 'pdf'    : mime_type = 'application/pdf'; break;
            case 'ai'     : mime_type = 'application/postscript'; break;
            case 'eps'    : mime_type = 'application/postscript'; break;
            case 'ps'     : mime_type = 'application/postscript'; break;
            case 'rtf'    : mime_type = 'application/rtf'; break;
            case 'ppt'    : mime_type = 'application/vnd.ms-powerpoint'; break;
            case 'xls'    : mime_type = 'application/vnd.ms-excel'; break;
            case 'dcr'    : mime_type = 'application/x-director'; break;
            case 'dir'    : mime_type = 'application/x-director'; break;
            case 'dxr'    : mime_type = 'application/x-director'; break;
            case 'dvi'    : mime_type = 'application/x-dvi'; break;
            case 'gtar'   : mime_type = 'application/x-gtar'; break;
            case 'gzip'   : mime_type = 'application/x-gzip'; break;
            case 'latex'  : mime_type = 'application/x-latex'; break;
            case 'lzh'    : mime_type = 'application/x-lha'; break;
            case 'swf'    : mime_type = 'application/x-shockwave-flash'; break;
            case 'sit'    : mime_type = 'application/x-stuffit'; break;
            case 'tar'    : mime_type = 'application/x-tar'; break;
            case 'tcl'    : mime_type = 'application/x-tcl'; break;
            case 'tex'    : mime_type = 'application/x-texinfo'; break;
            case 'texinfo': mime_type = 'application/x-texinfo'; break;
            case 'texi'   : mime_type = 'application/x-texi'; break;
            case 'src'    : mime_type = 'application/x-wais-source'; break;
            case 'zip'    : mime_type = 'application/zip'; break;
            case 'au'     : mime_type = 'audio/basic'; break;
            case 'snd'    : mime_type = 'audio/basic'; break;
            case 'midi'   : mime_type = 'audio/midi'; break;
            case 'mid'    : mime_type = 'audio/midi'; break;
            case 'kar'    : mime_type = 'audio/midi'; break;
            case 'mpga'   : mime_type = 'audio/mpeg'; break;
            case 'mp2'    : mime_type = 'audio/mpeg'; break;
            case 'mp3'    : mime_type = 'audio/mpeg'; break;
            case 'ra'     : mime_type = 'audio/x-pn-realaudio'; break;
            case 'ram'    : mime_type = 'audio/x-pn-realaudio'; break;
            case 'rm'     : mime_type = 'audio/x-pn-realaudio'; break;
            case 'rpm'    : mime_type = 'audio/x-pn-realaudio-plugin'; break;
            case 'wav'    : mime_type = 'audio/x-wav'; break;
            case 'png'    : mime_type = 'image/png'; break;
            case 'gif'    : mime_type = 'image/gif'; break;
            case 'jpg'    : mime_type = 'image/jpeg'; break;
            case 'jpeg'   : mime_type = 'image/jpeg'; break;
            case 'jpe'    : mime_type = 'image/jpeg'; break;
            case 'bmp'    : mime_type = 'image/x-ms-bmp'; break;
            case 'tiff'   : mime_type = 'image/tiff'; break;
            case 'tif'    : mime_type = 'image/tiff'; break;
            case 'ico'    : mime_type = 'image/vnd.microsoft.icon'; break;
            case 'pnm'    : mime_type = 'image/x-portable-anymap'; break;
            case 'ras'    : mime_type = 'image/x-cmu-raster'; break;
            case 'pnm'    : mime_type = 'image/x-portable-anymap'; break;
            case 'pbm'    : mime_type = 'image/x-portable-bitmap'; break;
            case 'pgm'    : mime_type = 'image/x-portable-graymap'; break;
            case 'ppm'    : mime_type = 'image/x-portable-pixmap'; break;
            case 'rgb'    : mime_type = 'image/x-rgb'; break;
            case 'xbm'    : mime_type = 'image/x-xbitmap'; break;
            case 'xpm'    : mime_type = 'image/x-pixmap'; break;
            case 'xwd'    : mime_type = 'image/x-xwindowdump'; break;

        }
        if (mime_type.match(/^image/)) {
            // jQuery('#editor-content-textarea:visible').insertAtCaret('__IMAGES__' + "\n");
            jQuery('textarea.last_focus').insertAtCaret('__IMAGES__' + "\n");
            var img = jQuery('__IMAGES__').attr('id',queueID).addClass('mtapp-uploadify-thumb');
            var cancel = jQuery('<img class="mtapp-uploadify-cancel" src="' + settings.cancelImg + '" border="0" />').click(function(){
                var thumb = jQuery(this).prev();
                var thumb_id = thumb.attr('id');
                var asset_uploadify = jQuery('#asset_uploadify').val();
                var reg = new RegExp(thumb_id + '[^\|]+', 'g');
                jQuery('#asset_uploadify').val(asset_uploadify.replace(reg,'').replace(/\|+/,'|').replace(/^\||\|$/,''));
                thumb.remove();
                jQuery(this).remove();
            });
            jQuery("#entry-uploadify-widget").find('div.widget-content').append(img, cancel);
        } else {
            // jQuery('#editor-content-textarea:visible').insertAtCaret('__FILES__' + "\n");
            jQuery('textarea.last_focus').insertAtCaret('__FILES__' + "\n");
        }
        var asset = [
            queueID,
            '<mt:var name="blog_id">',
            'image',
            '<mt:var name="author_id">',
//                'asset_created_on',
            file_ext,
            file_name,
            '%r' + file_path,
            file_name,
            mime_type,
//                'asset_modified_on',
            '%r' + file_path
        ];
        var asset_uploadify_value = jQuery.trim(jQuery('#asset_uploadify').val());
        if (asset_uploadify_value != '') {
            jQuery('#asset_uploadify').val(asset_uploadify_value + '|' + asset);
        } else {
            jQuery('#asset_uploadify').val(asset);
        }
        setCookie('asset_uploadify',jQuery('#asset_uploadify').val() , 1);
        jQuery.MTAppMsg({
            msg:  '記事を保存してください。',
            type: 'success'
        });

    }
    jQuery('textarea').blur(function(){
        jQuery('textarea.last_focus').removeClass('last_focus');
        jQuery(this).addClass('last_focus');
    });
    jQuery("#uploadify").uploadify({
        'uploader'   : '<mt:var name="static_plugin_path">lib/uploadify/scripts/uploadify.swf',
        'script'     : '<mt:var name="static_plugin_path">lib/uploadify/scripts/uploadify.php',
        'checkScript': '<mt:var name="static_plugin_path">lib/uploadify/scripts/check.php',
        'cancelImg'  : '<mt:var name="static_plugin_path">lib/uploadify/cancel.png',
        'folder'     : '<mt:var name="blog_path"><mt:if name="upload_folder">/<mt:var name="upload_folder"></mt:if>',
        'sizeLimit'  : '1000000',
        'buttonText' : '<__trans_section component="mt_app_jquery"><__trans phrase="Select files"></__trans_section>',
        'queueID'    : 'fileQueue',
        'auto'       : true,
        'multi'      : true,
        'onError'    : uploadifyOnError,
        'onComplete' : uploadifyOnComplete
    });
    jQuery(':submit').click(function(){
        var asset_meta = '';
        jQuery("img.uploadify_image").each(function(){
            asset_meta += jQuery(this).attr('id') + ',';
            asset_meta += '0,';
            asset_meta += '0';
            asset_meta += '|';
        });
        jQuery("#asset_uploadify_meta").val(asset_meta.replace(/\|$/,''));
        setCookie('asset_uploadify_meta',jQuery('#asset_uploadify_meta').val() , 1);
    });
    jQuery("#asset_uploadify_").val(getCookie('asset_uploadify'));
    jQuery("#asset_uploadify_meta").val(getCookie('asset_uploadify_meta'));
    </mt:setvarblock>    
__MT__
    return $out;
}

1;