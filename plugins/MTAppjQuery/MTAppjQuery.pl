package MT::Plugin::MTAppjQuery;
use strict;
use base qw( MT::Plugin );

our $VERSION = '0.15';

my $plugin = MT::Plugin::MTAppjQuery->new({
    id          => 'mt_app_jquery',
    key         => __PACKAGE__,
    name        => 'MTAppjQuery',
    description => '<__trans phrase="JQuery to customize the interface to add.">',
    version     => $VERSION,
    author_name => 'Tomohiro Okuwaki',
    author_link => 'http://www.tinybeans.net/blog/',
    plugin_link => 'http://www.tinybeans.net/blog/download/mt-plugin/mtapp-jquery.html',
    l10n_class  => 'MTAppjQuery::L10N',
    blog_config_template => 'blog_config.tmpl',
    system_config_template => 'system_config.tmpl',
    settings    => new MT::PluginSettings([
            ['no_usercss',    {Default => 0,  Scope => 'system'}],
            ['no_mtappjquery',{Default => 0,  Scope => 'system'}],
            ['no_userjs',     {Default => 0,  Scope => 'system'}],
            ['no_slidemenu',  {Default => 0,  Scope => 'system'}],
            ['sys_jqplugin',  {Default => '', Scope => 'system'}],
            ['active',        {Default => 1,  Scope => 'blog'}],
            ['usercss',       {Default => 1,  Scope => 'blog'}],
            ['mtappjquery',   {Default => 1,  Scope => 'blog'}],
            ['userjs',        {Default => 1,  Scope => 'blog'}],
            ['slidemenu',     {Default => 1,  Scope => 'blog'}],
            ['jqplugin',      {Default => '', Scope => 'blog'}],
    ]),
});
MT->add_plugin($plugin);

sub init_registry {
    my $plugin = shift;
    $plugin->registry({
        callbacks => {
            'template_source.header' => {
                handler => '$mt_app_jquery::MTAppjQuery::Plugin::tmpl_source_header',
                priority => 10,
            },
            'template_source.favorite_blogs' => {
                handler => '$mt_app_jquery::MTAppjQuery::Plugin::tmpl_source_fav_blogs',
            },
        },
    });
}

sub get_setting {
    my $plugin = shift;
    my ($key, $blog_id) = @_;
    my $scope;
    if ($blog_id > 0) {
        $scope = 'blog:'. $blog_id;
    } else {
        $scope = 'system';
    }
    my $value = $plugin->get_config_value($key, $scope);
    return $value;
}

1;