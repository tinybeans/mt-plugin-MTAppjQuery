package MTAppjQuery::Tags;
use strict;
use Data::Dumper;

# Function
sub _hdlr_user_file_append_text {
    my ($ctx, $args) = @_;
    return '';
}

sub _hdlr_dumper {
    my ($ctx, $args) = @_;
    my $name = $args->{name};
    return '' if (! $name);
    return Dumper($ctx->{__stash}->{vars}->{$name});
}

# Modifiers
sub _fltr_split {
    my ($str, $arg, $ctx) = @_;
    my @array = split(/$arg/, $str);
    return \@array;
}

sub _fltr_split_format {
    my ($str, $arg, $ctx) = @_;

    unless ($str) {
        return '';
    }
    # $arg = '%1 %2'
    my @array = split(/,/, $str);
    for (my $i = 1; $i <= scalar(@array); $i++) {
        my $pattern = '%'.$i;
        $arg =~ s/$pattern/$array[$i-1]/g;
    }
    $arg =~ s/%\d+//g;
    return $arg;
}

sub _fltr_nengou {
    my ($str, $arg, $ctx) = @_;

    if ($str == '' or $str !~ /^\d{8}$/) {
        return '';
    }
    my ($res, $nengou, $diff);
    if ($str >= 18680125 and $str <= 19120729) {
        $nengou = MT->translate('meiji');
        $diff = 1867;
    } elsif ($str >= 19120730 and $str <= 19261224) {
        $nengou = MT->translate('taisho');
        $diff = 1911;
    } elsif ($str >= 19261225 and $str <= 19890107) {
        $nengou = MT->translate('showa');
        $diff = 1925;
    } elsif ($str >= 19890108) {
        $nengou = MT->translate('heisei');
        $diff = 1988;
    }
    $str =~ s/(\d{4})(\d{2})(\d{2})/$1,$2,$3/;
    my @date = split(/,/, $str);
    $res = $nengou . ($date[0] - $diff) . MT->translate('nen') . $date[1] . MT->translate('gatsu') . $date[2] . MT->translate('nichi');
    return $res;
}

sub _fltr_compress {
  my ($str, $arg, $ctx) = @_;

  # Remove empty lines
  if ($arg == 1) {
    $str =~ s/^\s*\n//gm;
  }
  # Remove empty lines and white spaces of head of a line
  elsif ($arg == 2) {
    $str =~ s/^\s*\n|^\s+//gm;
  }
  # Remove empty lines and white spaces of head of a line and break lines
  elsif ($arg == 3) {
    $str =~ s/^\s*\n|^\s+//gm;
    $str =~ s/\n//g;
  }
  return $str;
}

sub _fltr_json_decode {
    my ($str, $arg, $ctx) = @_;
    return $str unless $arg;
    return MT::Util::from_json($str);
}

1;