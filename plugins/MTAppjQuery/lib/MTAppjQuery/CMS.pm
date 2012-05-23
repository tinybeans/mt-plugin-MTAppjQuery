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
<mt:UserFileAppendText>
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
<mt:UserFileAppendText>
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

sub edit_user_js {
    my $app = shift;
    my $name = MT->config->MTAppjQueryUserJSName || 'user.js';
    my $ident = 'user_js';
    _go_user_files($app, $name, $ident);
}

sub edit_user_css {
    my $app = shift;
    my $name = MT->config->MTAppjQueryUserCSSName || 'user.css';
    my $ident = 'user_css';
    _go_user_files($app, $name, $ident);
}

sub edit_user_js_append {
    my $app = shift;
    my $type = $app->cookie_val('mtappVars_type');
    my $scope_type = $app->cookie_val('mtappVars_scope_type');
    my $screen_id = $app->cookie_val('mtappVars_screen_id');
    my $name = MT->config->MTAppjQueryUserJSName || 'user.js';
    my $ident = 'user_js';
    my $append = <<__EOF__;

if (mtappVars.screen_id == '$screen_id' && mtappVars.scope_type == '$scope_type' && mtappVars.type == '$type') {
    
}
__EOF__
    _go_user_files($app, $name, $ident, $append);
}

sub edit_user_css_append {
    my $app = shift;
    my $type = $app->cookie_val('mtappVars_type');
    my $scope_type = $app->cookie_val('mtappVars_scope_type');
    my $screen_id = $app->cookie_val('mtappVars_screen_id');
    my $name = MT->config->MTAppjQueryUserCSSName || 'user.css';
    my $ident = 'user_css';
    my $append = <<__EOF__;

body#$screen_id.$scope_type {
    
}
__EOF__
    _go_user_files($app, $name, $ident, $append);
}

sub _go_user_files {
    my ($app, $name, $ident, $append) = @_;
    my %return_params;
    if (my $blog = $app->blog) {
        unless (is_user_can($blog, $app->user, 'edit_templates')) {
            return $app->trans_error('Permission denied.');
        }
        require MT::Template;
        my $template = MT::Template->load({
            name => $name,
            identifier => $ident,
            blog_id => $blog->id,
        });
        if (defined $template) {
            if ($append) {
                my $text = $template->text;
                if ($text =~ /(<\$?mt:?UserFileAppendText\$?>)/i) {
                    $text =~ s/(<\$?mt:?UserFileAppendText\$?>)/$append$1/i;
                } else {
                    $text .= $append;
                }
                $template->text($text);
                $template->save or die 'Failed to save the template.';
            }
            %return_params = (
                __mode => 'view',
                _type => 'template',
                id => $template->id,
                blog_id => $blog->id,
            );
        } else {
            %return_params = (
                __mode => 'list_template',
                blog_id => $blog->id,
                no_such_template => 1, 
            );
        }
        $app->add_return_arg(%return_params);
    } else {
        %return_params = (
            __mode => 'list_template',
            blog_id => $blog->id,
            no_such_template => 1, 
        );
    }
    $app->call_return();
}

1;