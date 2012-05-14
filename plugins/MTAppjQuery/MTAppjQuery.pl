package MT::Plugin::MTAppjQuery;
use strict;
use base qw( MT::Plugin );

our $VERSION = '0.27';

my $plugin = MT::Plugin::MTAppjQuery->new({
    id          => 'mt_app_jquery',
    key         => __PACKAGE__,
    name        => 'MTAppjQuery',
    description => '<__trans phrase="Customize the management screen of MT5.1 to use jQuery.">',
    version     => $VERSION,
    author_name => 'Tomohiro Okuwaki',
    author_link => 'http://www.tinybeans.net/blog/',
    plugin_link => 'http://www.tinybeans.net/blog/download/mt-plugin/mtapp-jquery.html',
    l10n_class  => 'MTAppjQuery::L10N',
    blog_config_template => 'config.tmpl',
    system_config_template => 'config.tmpl',
    settings    => new MT::PluginSettings([
            # Set system scope
            ['active',        {Default => 1,  Scope => 'system'}],
            ['userjs',        {Default => 1,  Scope => 'system'}],
            ['userjs_url',    {Default => '', Scope => 'system'}],
            ['usercss',       {Default => 1,  Scope => 'system'}],
            ['usercss_url',   {Default => '', Scope => 'system'}],
            #['slidemenu',     {Default => 0,  Scope => 'system'}],
            #['superslidemenu',{Default => 0,  Scope => 'system'}],
            ['jquery_ready',  {Default => 0,  Scope => 'system'}],

            ['jqselectable',  {Default => 0,  Scope => 'system'}],

            # Set blog scope
            ['active',        {Default => 1,  Scope => 'blog'}],
            ['userjs',        {Default => 1,  Scope => 'blog'}],
            ['userjs_url',    {Default => '', Scope => 'blog'}],
            ['usercss',       {Default => 1,  Scope => 'blog'}],
            ['usercss_url',   {Default => '', Scope => 'blog'}],
            #['slidemenu',     {Default => 0,  Scope => 'blog'}],
            #['superslidemenu',{Default => 0,  Scope => 'blog'}],
            ['jquery_ready',  {Default => 0,  Scope => 'blog'}],

            ['jqselectable',  {Default => 0,  Scope => 'blog'}],

            # Free area
            ['fa_mtapp_top_head',  {Default => '', Scope => 'system'}],
            ['fa_html_head',       {Default => '', Scope => 'system'}],
            ['fa_js_include',      {Default => '', Scope => 'system'}],
            ['fa_html_body',       {Default => '', Scope => 'system'}],
            ['fa_form_header',     {Default => '', Scope => 'system'}],
            ['fa_jq_js_include',   {Default => '', Scope => 'system'}],
            ['fa_mtapp_html_foot', {Default => '', Scope => 'system'}],
            ['fa_mtapp_end_body',  {Default => '', Scope => 'system'}],

            ['fa_mtapp_top_head',  {Default => '', Scope => 'blog'}],
            ['fa_html_head',       {Default => '', Scope => 'blog'}],
            ['fa_js_include',      {Default => '', Scope => 'blog'}],
            ['fa_html_body',       {Default => '', Scope => 'blog'}],
            ['fa_form_header',     {Default => '', Scope => 'blog'}],
            ['fa_jq_js_include',   {Default => '', Scope => 'blog'}],
            ['fa_mtapp_html_foot', {Default => '', Scope => 'blog'}],
            ['fa_mtapp_end_body',  {Default => '', Scope => 'blog'}],
            
            # Uploadify
            #['active_uploadify',{Default => 0,  Scope => 'blog'}],
            #['upload_folder',   {Default => '', Scope => 'blog'}],
            #['img_elm',         {Default => '<img src="__filepath__" alt="__filename__" />', Scope => 'blog'}],
            #['file_elm',        {Default => '<a href="__filepath__">__filename__</a>', Scope => 'blog'}],
    ]),
});
MT->add_plugin($plugin);

sub init_registry {
    my $plugin = shift;
    $plugin->registry({
        config_settings => {
            'MTAppjQueryUserJSName' => {
                default => 'user.js',
            },
            'MTAppjQueryUserCSSName' => {
                default => 'user.css',
            },
        },
        callbacks => {
            'MT::App::CMS::template_source.header' => {
                handler => '$mt_app_jquery::MTAppjQuery::Callbacks::template_source_header',
                priority => 10,
            },
            'MT::App::CMS::template_source.footer' => {
                handler => '$mt_app_jquery::MTAppjQuery::Callbacks::template_source_footer',
                priority => 10,
            },
            'MT::App::CMS::template_source.favorite_blogs' => '$mt_app_jquery::MTAppjQuery::Callbacks::template_source_favorite_blogs',
            'MT::App::CMS::template_source.list_template' => '$mt_app_jquery::MTAppjQuery::Callbacks::template_source_list_template',
            # 'template_param.favorite_blogs' => '$mt_app_jquery::MTAppjQuery::Callbacks::template_param_favorite_blogs',
            'MT::App::CMS::template_param.edit_entry' => '$mt_app_jquery::MTAppjQuery::Callbacks::template_param_edit_entry',
            'MT::App::CMS::template_param.edit_template' => '$mt_app_jquery::MTAppjQuery::Callbacks::template_param_edit_template',
            'MT::App::CMS::cms_post_save.entry' => '$mt_app_jquery::MTAppjQuery::Callbacks::cms_post_save_entry',
            'MT::App::CMS::cms_post_save.page' => '$mt_app_jquery::MTAppjQuery::Callbacks::cms_post_save_entry',
        },
        tags => {
            modifier => {
                'split_format' => '$mt_app_jquery::MTAppjQuery::Tags::_fltr_split_format',
                'nengou' => '$mt_app_jquery::MTAppjQuery::Tags::_fltr_nengou',
            }
        },
        applications => {
            cms => {
                methods => {
                    'create_user_files' => '$mt_app_jquery::MTAppjQuery::CMS::create_user_files',
                }
            }
        }
    });
}

1;