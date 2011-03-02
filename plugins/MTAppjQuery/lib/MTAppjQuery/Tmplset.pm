package MTAppjQuery::Tmplset;
use strict;

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

sub fav_blogs_tag_org {
    # Confirmed the varsion of 5.0, 5.01, 5.02.
    my $out = '<li class="tab"><a href="#favorite-blog"><__trans phrase="Blogs"></a></li>';
    return quotemeta($out);
}
sub fav_blogs_tag {
    my $out = <<'__MT__';
<li class="tab"><a href="#favorite-blog"><__trans phrase="Blogs"></a></li>
<li class="tab"><a href="#favorite-structure"><__trans_section component="mt_app_jquery"><__trans phrase="structure"></__trans_section></a></li>
__MT__
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
}
1;