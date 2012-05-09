package MTAppjQuery::Util;
use strict;
use base 'Exporter';
our @EXPORT_OK = qw(is_user_can create_template get_mt_ts);
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


# Thank you very much!!(@junnamaさんに使って良いと許可頂いた)
# From alfasado/mt-plugin-multi-uploader - GitHub
# https://github.com/alfasado/mt-plugin-multi-uploader/blob/master/plugins/MultiUploader/lib/MultiUploader/Util.pm
sub is_user_can {
    my ( $blog, $user, $permission ) = @_;
    $permission = 'can_' . $permission;
    my $perm = $user->is_superuser;
    unless ( $perm ) {
        if ( $blog ) {
            my $admin = 'can_administer_blog';
            $perm = $user->permissions( $blog->id )->$admin;
            $perm = $user->permissions( $blog->id )->$permission unless $perm;
        } else {
            $perm = $user->permissions()->$permission;
        }
    }
    return $perm;
}

sub create_template {
    my $params = shift;
    unless (ref $params eq 'HASH') {
        return 1;
    }
    my $template = MT::Template->get_by_key({
        identifier => $params->{identifier},
        blog_id => $params->{blog_id},
    });
    my $status;
    unless (defined $template->id) {
        my %values;
        $values{text}    = $params->{text};
        $values{type}    = $params->{type};
        $values{name}    = $params->{name};
        $values{outfile} = $params->{outfile};
        $template->set_values(\%values);
        $template->save or die $template->errstr;
        $status = 'saved';
    } else {
        $status = 'exist';
    }
    return $status;
}

sub get_mt_ts {
    my ($sec, $min, $hour, $mday, $mon, $year, $wday, $yday, $isdst) = localtime();
    $year += 1900;
    $mon += 1;
    return sprintf("%04d%02d%02d%02d%02d%02d", $year, $mon, $mday, $hour, $min, $sec);
}


1;