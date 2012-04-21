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
            ['usercss',       {Default => 1,  Scope => 'system'}],
            ['userjs',        {Default => 1,  Scope => 'system'}],
            ['slidemenu',     {Default => 1,  Scope => 'system'}],
            ['superslidemenu',{Default => 0,  Scope => 'system'}],
            ['jqplugin',      {Default => '<!-- <__trans phrase="JavaScript free area of system"> -->', Scope => 'system'}],
            ['jquery_ready',  {Default => 0,  Scope => 'system'}],

            ['jqselectable',  {Default => 0,  Scope => 'system'}],

            # Set blog scope
            ['active',        {Default => 1,  Scope => 'blog'}],
            ['usercss',       {Default => 1,  Scope => 'blog'}],
            ['userjs',        {Default => 1,  Scope => 'blog'}],
            ['slidemenu',     {Default => 0,  Scope => 'blog'}],
            ['superslidemenu',{Default => 0,  Scope => 'blog'}],
            ['jqplugin',      {Default => '<!-- <__trans phrase="JavaScript free area of website or blog"> -->', Scope => 'blog'}],
            ['jquery_ready',  {Default => 0,  Scope => 'blog'}],

            ['jqselectable',  {Default => 0,  Scope => 'blog'}],

            # Uploadify
            ['active_uploadify',{Default => 0,  Scope => 'blog'}],
            ['upload_folder',   {Default => '', Scope => 'blog'}],
            ['img_elm',         {Default => '<img src="__filepath__" alt="__filename__" />', Scope => 'blog'}],
            ['file_elm',        {Default => '<a href="__filepath__">__filename__</a>', Scope => 'blog'}],
    ]),
});
MT->add_plugin($plugin);

sub init_registry {
    my $plugin = shift;
    $plugin->registry({
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
            # 'template_param.favorite_blogs' => '$mt_app_jquery::MTAppjQuery::Callbacks::template_param_favorite_blogs',
            'MT::App::CMS::template_param.edit_entry' => '$mt_app_jquery::MTAppjQuery::Callbacks::template_param_edit_entry',
            'MT::App::CMS::cms_post_save.entry' => '$mt_app_jquery::MTAppjQuery::Callbacks::cms_post_save_entry',
            'MT::App::CMS::cms_post_save.page' => '$mt_app_jquery::MTAppjQuery::Callbacks::cms_post_save_entry',
        },
        tags => {
            modifier => {
                'split_format' => '$mt_app_jquery::MTAppjQuery::Tags::_fltr_split_format',
                'nengou' => '$mt_app_jquery::MTAppjQuery::Tags::_fltr_nengou',
            }
        }
    });
}

1;