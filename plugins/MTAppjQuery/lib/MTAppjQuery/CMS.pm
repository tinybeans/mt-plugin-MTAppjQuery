package MTAppjQuery::CMS;
use strict;
use warnings;
use MT::Util qw(format_ts);
use MTAppjQuery::Util qw(is_user_can create_template get_mt_ts);

sub create_user_files {
    my $app = shift;
    $app->validate_magic or return $app->trans_error('Permission denied.');
    if (my $blog = $app->blog) {
        unless (is_user_can($blog, $app->user, 'edit_templates')) {
            return $app->trans_error('Permission denied.');
        }
        my ($tmplname, $create_date, $content, %search, %params, %return_params);
        my $ts = get_mt_ts();
        require MT::Template;
        # Create user.js
        $tmplname = MT->config->MTAppjQueryUserJSName || 'user.js';
        $create_date = format_ts('%Y-%m-%d', $ts, $blog);
        $content = <<"__USER_JS__";
/*
 * $tmplname
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
            name => $tmplname,
            identifier => 'user_js',
            blog_id => $blog->id,
        );
        %params = (
            identifier => 'user_js',
            blog_id => $blog->id,
            text => $content,
            type => 'index',
            name => $tmplname,
            outfile => 'user.js',
        );
        $return_params{'user_js_status'} = create_template(\%search, \%params);

        #Create user.css
        $tmplname = MT->config->MTAppjQueryUserCSSName || 'user.css';
        $create_date = format_ts('%Y-%m-%d', $ts, $blog);
        $content = <<"__USER_CSS__";
/*
 * $tmplname
 *
 * Since:   $create_date
 * Update:  <mt:Date format="%Y-%m-%d">
 *
 */
__USER_CSS__
        %search = (
            name => $tmplname,
            identifier => 'user_css',
            blog_id => $blog->id,
        );
        %params = (
            identifier => 'user_css',
            blog_id => $blog->id,
            text => $content,
            type => 'index',
            name => $tmplname,
            outfile => 'user.css',
        );
        $return_params{'user_css_status'} = create_template(\%search, \%params);
        $app->add_return_arg(%return_params);
    }
    $app->call_return();
}

1;