package MT::Plugin::MTAppjQuery;
use strict;
use base qw( MT::Plugin );

our $VERSION = '0.2';

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
    blog_config_template => 'blog_config.tmpl',
    system_config_template => 'system_config.tmpl',
    settings    => new MT::PluginSettings([
            ['no_usercss',    {Default => 0,  Scope => 'system'}],
            ['no_userjs',     {Default => 0,  Scope => 'system'}],
            ['no_slidemenu',  {Default => 0,  Scope => 'system'}],
            ['superslidemenu',{Default => 0,  Scope => 'system'}],
            ['sys_jqplugin',  {Default => '<!-- <__trans phrase="JavaScript free area of system"> -->', Scope => 'system'}],
#             ['no_mtappjquery',{Default => 0,  Scope => 'system'}],

            ['active',        {Default => 1,  Scope => 'blog'}],
            ['usercss',       {Default => 1,  Scope => 'blog'}],
            ['userjs',        {Default => 1,  Scope => 'blog'}],
            ['slidemenu',     {Default => 1,  Scope => 'blog'}],
            ['jqplugin',      {Default => '<!-- <__trans phrase="JavaScript free area of website or blog"> -->', Scope => 'blog'}],

            ['jqselectable',  {Default => 0,  Scope => 'blog'}],
#             ['mtappjquery',   {Default => 1,  Scope => 'blog'}],

            # Uploadify
        	['no_uploadify',    {Default => 1, Scope => 'system'}],
        	['active_uploadify',{Default => 1, Scope => 'blog'}],
        	['upload_folder',   {Default => '', Scope => 'blog'}],
        	['img_elm',         {Default => '<img src="__filepath__" alt="__filename__" />', Scope => 'blog'}],
        	['img_elm',         {Default => '<img src="__filepath__" alt="__filename__" />', Scope => 'system'}],
        	['file_elm',        {Default => '<a href="__filepath__">__filename__</a>', Scope => 'blog'}],
        	['file_elm',        {Default => '<a href="__filepath__">__filename__</a>', Scope => 'system'}],
    ]),
});
MT->add_plugin($plugin);

sub init_registry {
    my $plugin = shift;
    $plugin->registry({
        callbacks => {
            'template_source.header' => {
                handler => '$mt_app_jquery::MTAppjQuery::Plugin::cb_tmpl_source_header',
                priority => 10,
            },
            'template_source.footer' => {
                handler => '$mt_app_jquery::MTAppjQuery::Plugin::cb_tmpl_source_footer',
                priority => 10,
            },
            'template_source.favorite_blogs' => '$mt_app_jquery::MTAppjQuery::Plugin::cb_tmpl_source_fav_blogs',
            # 'template_param.favorite_blogs' => '$mt_app_jquery::MTAppjQuery::Plugin::cb_tmpl_param_fav_blogs',
    		'template_param.edit_entry' => '$mt_app_jquery::MTAppjQuery::Plugin::cb_tmpl_param_edit_entry',
            'MT::App::CMS::cms_post_save.entry' => 
                '$mt_app_jquery::MTAppjQuery::Plugin::cb_cms_post_save_entry',
        },
    });
}

1;