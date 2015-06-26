package MTAppjQuery::Tags;
use strict;
use Data::Dumper;

sub plugin {
    return MT->component('mt_app_jquery');
}

sub _sanitize_key {
    my ($key) = @_;
    $key =~ s/\s//g;
    return $key;
}

# Function
sub _hdlr_create_json {
    my ($ctx, $args) = @_;

    my $plugin = plugin();
    unless ($args->{fields}) {
        return $ctx->error($plugin->translate('The [_1] modifier is required.', 'fields'));
    }

    my $blog_id = $ctx->stash('blog_id');
    my $json = {
        items => [],
    };

    my @include_blogs = $args->{include_blogs} ? split(/,/, $args->{include_blogs}) : ($blog_id);

    # Set terms
    my $term = {
        blog_id => \@include_blogs,
    };
    unless ($args->{include_draft}) {
        $term->{status} = MT::Entry::RELEASE();
    }

    # Set arguments
    my $arguments = undef;
    if ($args->{offset}) {
        $arguments->{offset} = $args->{offset};
    }
    if ($args->{limit}) {
        $arguments->{limit} = $args->{limit};
    }
    if ($args->{sort_by}) {
        $arguments->{sort} = $args->{sort_by};
    }
    if ($args->{sort_order}) {
        $arguments->{direction} = $args->{sort_order};
    }

    my $tag = $ctx->stash('tag');
    my $model = '';
    if ($tag eq 'EntryCreateJSON') {
        $model = 'entry';
    }

    my @entries = MT->model($model)->load($term, $arguments);

    my @items;
    my $total_results = 0;
    my $array_join = $args->{array_join};
    if ($array_join == 1) {
        $array_join = ',';
    }
    foreach my $entry (@entries) {
        my $item = {};
        foreach my $field (split(/,/, $args->{fields})) {
            # tags
            if ($field eq 'tags') {
                my @tags = $entry->get_tags;
                if (@tags and $array_join) {
                    $item->{tags} = $array_join . join($array_join, @tags) . $array_join;
                }
                elsif (@tags) {
                    $item->{tags} = \@tags;
                }
            }
            # categories
            elsif ($field eq 'categories') {
                my $categories = $entry->categories;
                my @categories_label;
                if (@$categories) {
                    foreach my $category (@$categories) {
                        push(@categories_label, $category->label);
                    }
                    if (@categories_label and $array_join) {
                        $item->{categories} = $array_join . join($array_join, @categories_label) . $array_join;
                    }
                    elsif (@categories_label) {
                        $item->{categories} = \@categories_label;
                    }
                }
            }
            # category
            elsif ($field eq 'category') {
                my $category = $entry->category;
                if ($category) {
                    $item->{category} = $category->label;
                }
            }
            else {
                my $field_key = $field;
                $field_key =~ s/^field\./field_/;
                $item->{$field_key} = $entry->$field || '';
            }
        }
        push(@items, $item);
        $total_results++;
    }

    $json->{totalResults} = $total_results;
    $json->{items} = \@items;
    require JSON;
    return JSON::to_json($json);
}

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