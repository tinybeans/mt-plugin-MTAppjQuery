package MTAppjQuery::Tags;
use strict;

# Function
sub _hdlr_user_file_append_text {
    my ($ctx, $args) = @_;
    return '';
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
        $nengou = '明治';
        $diff = 1867;
    } elsif ($str >= 19120730 and $str <= 19261224) {
        $nengou = '大正';
        $diff = 1911;
    } elsif ($str >= 19261225 and $str <= 19890107) {
        $nengou = '昭和';
        $diff = 1925;
    } elsif ($str >= 19890108) {
        $nengou = '平成';
        $diff = 1988;
    }
    $str =~ s/(\d{4})(\d{2})(\d{2})/$1,$2,$3/;
    my @date = split(/,/, $str);
    $res = $nengou . ($date[0] - $diff) . '年' . $date[1] . '月' . $date[2] . '日';
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

1;