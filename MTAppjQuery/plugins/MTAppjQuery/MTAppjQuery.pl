package MT::Plugin::MTAppjQuery;
use strict;
use warnings;
use base qw( MT::Plugin );

our $VERSION = '1.11.5';

my $plugin = MT::Plugin::MTAppjQuery->new({
    id          => 'mt_app_jquery',
    key         => __PACKAGE__,
    name        => 'MTAppjQuery',
    description => '<__trans phrase="Customize the management screen of Movable Type to use jQuery.">',
    version     => $VERSION,
    author_name => 'Tomohiro Okuwaki',
    author_link => 'http://www.tinybeans.net/blog/',
    plugin_link => 'http://www.tinybeans.net/blog/download/mt-plugin/mtapp-jquery.html',
    l10n_class  => 'MTAppjQuery::L10N',
    blog_config_template => 'config_blog.tmpl',
    system_config_template => 'config_system.tmpl',
    settings    => new MT::PluginSettings([
            # Common settings
            ['active',              {Default => '1'}],
            ['userjs',              {Default => '1'}],
            ['userjs_url',          {Default => ''}],
            ['usercss',             {Default => '1'}],
            ['usercss_url',         {Default => ''}],
            ['jquery_ready',        {Default => ''}],
            ['jquery_ready_url',    {Default => ''}],
            ['fa_mtapp_top_head',   {Default => ''}],
            ['fa_html_head',        {Default => ''}],
            ['fa_js_include',       {Default => ''}],
            ['fa_html_body',        {Default => ''}],
            ['fa_form_header',      {Default => ''}],
            ['fa_jq_js_include',    {Default => ''}],
            ['fa_mtapp_html_foot',  {Default => ''}],
            ['fa_mtapp_end_body',   {Default => ''}],

            # Set system scope
            ['use_data_api_js',        {Default => '0', Scope => 'system'}],
            ['data_api_script_url',    {Default => '',  Scope => 'system'}],
            ['data_api_version',       {Default => '',  Scope => 'system'}],
            ['jquery_ready_all',       {Default => '0', Scope => 'system'}],
            ['blogs_json',             {Default => '0', Scope => 'system'}],
            ['blogs_json_detail',      {Default => '0', Scope => 'system'}],

            # Free area common
            ['common_mtapp_top_head',  {Default => '', Scope => 'system'}],
            ['common_html_head',       {Default => '', Scope => 'system'}],
            ['common_js_include',      {Default => '', Scope => 'system'}],
            ['common_html_body',       {Default => '', Scope => 'system'}],
            ['common_form_header',     {Default => '', Scope => 'system'}],
            ['common_jq_js_include',   {Default => '', Scope => 'system'}],
            ['common_mtapp_html_foot', {Default => '', Scope => 'system'}],
            ['common_mtapp_end_body',  {Default => '', Scope => 'system'}],
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
            'MT::App::CMS::template_source.dashboard' => '$mt_app_jquery::MTAppjQuery::Callbacks::template_source_dashboard',
            'MT::App::CMS::template_source.header' => {
                handler => '$mt_app_jquery::MTAppjQuery::Callbacks::template_source_header',
                priority => 10,
            },
            'MT::App::CMS::template_source.footer' => {
                handler => '$mt_app_jquery::MTAppjQuery::Callbacks::template_source_footer',
                priority => 10,
            },
            'MT::App::CMS::template_source.preview_strip' => {
                handler => '$mt_app_jquery::MTAppjQuery::Callbacks::template_source_preview_strip',
                priority => 10,
            },
            'MT::App::CMS::template_source.preview_template_strip' => {
                handler => '$mt_app_jquery::MTAppjQuery::Callbacks::template_source_preview_strip',
                priority => 10,
            },
            'MT::App::CMS::template_source.favorite_blogs' => '$mt_app_jquery::MTAppjQuery::Callbacks::template_source_favorite_blogs',
            'MT::App::CMS::template_source.list_template' => '$mt_app_jquery::MTAppjQuery::Callbacks::template_source_list_template',
            # 'template_param.favorite_blogs' => '$mt_app_jquery::MTAppjQuery::Callbacks::template_param_favorite_blogs',
            'MT::App::CMS::template_param.edit_entry' => '$mt_app_jquery::MTAppjQuery::Callbacks::template_param_edit_entry',
            'MT::App::CMS::template_param.edit_template' => '$mt_app_jquery::MTAppjQuery::Callbacks::template_param_edit_template',
            'MT::App::CMS::template_param.cfg_plugin' => '$mt_app_jquery::MTAppjQuery::Callbacks::template_param_cfg_plugin',
            'MT::App::CMS::cms_post_save.template' => '$mt_app_jquery::MTAppjQuery::Callbacks::cms_post_save_template',
            'save_config_filter' => '$mt_app_jquery::MTAppjQuery::Callbacks::save_config_filter',
            'MT::App::CMS::pre_run' => \&pre_run,
        },
        tags => {
            function => {
                'CreateJSON' => '$mt_app_jquery::MTAppjQuery::Tags::_hdlr_create_json',
                'UserFileAppendText' => '$mt_app_jquery::MTAppjQuery::Tags::_hdlr_user_file_append_text',
                'Dumper' => '$mt_app_jquery::MTAppjQuery::Tags::_hdlr_dumper',
            },
            modifier => {
                'split' => '$mt_app_jquery::MTAppjQuery::Tags::_fltr_split',
                'split_format' => '$mt_app_jquery::MTAppjQuery::Tags::_fltr_split_format',
                'nengou' => '$mt_app_jquery::MTAppjQuery::Tags::_fltr_nengou',
                'compress' => '$mt_app_jquery::MTAppjQuery::Tags::_fltr_compress',
                'remove_host' => '$mt_app_jquery::MTAppjQuery::Tags::_fltr_remove_host',
                'json_decode' => '$mt_app_jquery::MTAppjQuery::Tags::_fltr_json_decode',
            },
        },
        applications => {
            cms => {
                menus => {
                    'design:user_js' => {
                        label             => 'Edit user.js',
                        order             => 20000,
                        mode              => 'edit_user_js',
                        permission        => 'edit_templates',
                        system_permission => 'edit_templates',
                        view              => ['blog', 'website'],
                    },
                    'design:user_js_append' => {
                        label             => 'Edit user.js(append)',
                        order             => 20010,
                        mode              => 'edit_user_js_append',
                        permission        => 'edit_templates',
                        system_permission => 'edit_templates',
                        view              => ['blog', 'website'],
                    },
                    'design:user_css' => {
                        label             => 'Edit user.css',
                        order             => 20100,
                        mode              => 'edit_user_css',
                        permission        => 'edit_templates',
                        system_permission => 'edit_templates',
                        view              => ['blog', 'website'],
                    },
                    'design:user_css_append' => {
                        label             => 'Edit user.css(append)',
                        order             => 20110,
                        mode              => 'edit_user_css_append',
                        permission        => 'edit_templates',
                        system_permission => 'edit_templates',
                        view              => ['blog', 'website'],
                    },
                },
                methods => {
                    'create_user_files'    => '$mt_app_jquery::MTAppjQuery::CMS::create_user_files',
                    'edit_user_js'         => '$mt_app_jquery::MTAppjQuery::CMS::edit_user_js',
                    'edit_user_js_append'  => '$mt_app_jquery::MTAppjQuery::CMS::edit_user_js_append',
                    'edit_user_css'        => '$mt_app_jquery::MTAppjQuery::CMS::edit_user_css',
                    'edit_user_css_append' => '$mt_app_jquery::MTAppjQuery::CMS::edit_user_css_append',
                },
            },
        },
    });
}

sub pre_run {
    my $app = MT->instance;
    my $blog = $app->blog;
    my $blog_id = $blog->{column_values}->{id};
    return unless $blog_id;
    my $menus  = $plugin->registry('applications', 'cms', 'menus');
    require MT::Template;
    # user.js
    my $user_js_name = MT->config->MTAppjQueryUserJSName || 'user.js';
    my $user_js = MT::Template->load({
        name => $user_js_name,
        identifier => 'user_js',
        blog_id => $blog_id,
    });
    unless ($user_js) {
        $menus->{'design:user_js'} = {
            display => 0,
        };
        $menus->{'design:user_js_append'} = {
            display => 0,
        };
    }
    # user.css
    my $user_css_name = MT->config->MTAppjQueryUserCSSName || 'user.css';
    my $user_css = MT::Template->load({
        name => $user_css_name,
        identifier => 'user_css',
        blog_id => $blog_id,
    });
    unless ($user_css) {
        $menus->{'design:user_css'} = {
            display => 0,
        };
        $menus->{'design:user_css_append'} = {
            display => 0,
        };
    }
}

1;
