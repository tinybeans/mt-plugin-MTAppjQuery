package MTAppjQuery::CMS;
use strict;
use warnings;
use MT::Util qw(format_ts);
use MTAppjQuery::Util qw(is_user_can create_template get_mt_ts);

###
##
#
use MT::Log;
use Data::Dumper;
sub doLog {
    my ($msg) = @_;     return unless defined($msg);
    my $log = MT::Log->new;
    $log->message($msg) ;
    $log->save or die $log->errstr;
}
#
##
###

sub create_user_files {
    my $app = shift;
    $app->validate_magic or
        return $app->trans_error('Permission denied.');
#     require File::Spec;
#     my $do = 1;
    if (my $blog = $app->blog) {
        unless (is_user_can($blog, $app->user, 'edit_templates')) {
            return $app->trans_error('Permission denied.');
        }
#         if (! make_dir( File::Spec->catdir( site_path( $blog ), 'templates_c' ) ) ) {
#             $do = 0;
#         }
#         if (! make_dir( File::Spec->catdir( site_path( $blog ), 'cache' ) ) ) {
#             $do = 0;
#         }
#         if (! powercms_files_dir() ) {
#             $do = 0;
#         }
        my ($filename, $create_date, $content, %search, %params, %return_params);
        my $ts = get_mt_ts();
        require MT::Template;
        # Create user.js
        $filename = MT->config->MTAppjQueryUserJS || 'user.js';
        $create_date = format_ts('%Y-%m-%d', $ts, $blog);
        $content = <<"__USER_JS__";
/*
 * $filename
 *
 * Since:   $create_date
 * Update:  <mt:Date format="%Y-%m-%d">
 *
 */
(function(\$){
// ここに処理を書きます
})(jQuery);
__USER_JS__
        %search = (
            identifier => 'user_js',
            blog_id => $blog->id,
        );
        %params = (
            identifier => 'user_js',
            blog_id => $blog->id,
            text => $content,
            type => 'index',
            name => $filename,
            outfile => $filename,
        );
        $return_params{'user_js_status'} = create_template(\%search, \%params);

        #Create user.css
        $filename = MT->config->MTAppjQueryUserCSS || 'user.css';
        $create_date = format_ts('%Y-%m-%d', $ts, $blog);
        $content = <<"__USER_CSS__";
/*
 * $filename
 *
 * Since:   $create_date
 * Update:  <mt:Date format="%Y-%m-%d">
 *
 */
__USER_CSS__
        %search = (
            identifier => 'user_css',
            blog_id => $blog->id,
        );
        %params = (
            identifier => 'user_css',
            blog_id => $blog->id,
            text => $content,
            type => 'index',
            name => $filename,
            outfile => $filename,
        );
        $return_params{'user_css_status'} = create_template(\%search, \%params);
#         my $template = MT::Template->get_by_key({identifier => 'user_js', blog_id => $blog->id});
#         doLog(defined $template->id);
#         unless (defined $template->id) {
#             my %values;
#             $values{text} = 'unko';
#             $values{type} = 'index';
#             $values{name} = 'user.js';
#             $template->set_values(\%values);
#             doLog(Dumper($template));
#             $template->save or die $template->errstr;
#         }
#         $template = MT::Template->get_by_key({identifier => 'user_css', blog_id => $blog->id});
#         doLog(defined $template->id);
#         unless (defined $template->id) {
#             my %values;
#             $values{text} = 'unko';
#             $values{type} = 'index';
#             $values{name} = 'user.css';
#             $template->set_values(\%values);
#             doLog(Dumper($template));
#             $template->save or die $template->errstr;
#         }
#         $template{'user_js'} = MT::Template->load({ blog_id => $blog->id, outfile => $filename{'user_js'} });
#         unless (defined($template{'user_js'})) {
#             doLog('undef');
#         }
#         $template{'unko'} = MT::Template->load({ blog_id => $blog->id, outfile => 'index.html' });
#         doLog(Dumper($template{'unko'}));

#         if (! $bootstrapper ) {
#             my %template = (
#                 dynamic_mtml_bootstrapper => {
#                     name => 'DynamicMTML Bootstrapper',
#                     path => 'mtview_php.tmpl',
#                     type => 'index',
#                     outfile => $mtview,
#                     rebuild_me => 1,
#                     build_type => 1,
#                 },
#             );
#             if (! register_templates_to( $blog->id, $plugin_dynamicmtml, \%template ) ) {
#                 $do = 0;
#             }
#         }
#         my $htacess = MT::Template->load( { blog_id => $blog->id,
#                                             outfile => '.htaccess' } );
#         if (! $htacess ) {
#             my %template = (
#                 dynamic_mtml_htaccess => {
#                     name => 'DynamicMTML .htaccess',
#                     path => '_htaccess.tmpl',
#                     type => 'index',
#                     outfile => '.htaccess',
#                     rebuild_me => 1,
#                     build_type => 1,
#                     identifier => 'htaccess',
#                 },
#             );
#             if (! register_templates_to( $blog->id, $plugin_dynamicmtml, \%template ) ) {
#                 $do = 0;
#             }
#         }
#         return 'is_user_can = ' . is_user_can($blog, $app->user, 'edit_templates'). ', time = ' . time . ', OK!'
        $app->add_return_arg(%return_params);
    }
#     if ( $do ) {
#     } else {
#         $app->add_return_arg( not_installed_dynamicmtml => 1 );
#     }
    $app->call_return();
}


1;