package MTAppjQuery::Tags;
use strict;

# Modifiers
sub _fltr_split_format {
    my ($str, $arg, $ctx) = @_;

    # $arg = '%1 %2'
    my @array = split(/,/, $str);
    for (my $i = 1; $i <= scalar(@array); $i++) {
        my $pattern = '%'.$i;
        $arg =~ s/$pattern/$array[$i-1]/g;
    }
    return $arg;
}

1;