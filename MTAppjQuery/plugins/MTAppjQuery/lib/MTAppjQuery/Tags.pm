package MTAppjQuery::Tags;
use strict;
use warnings;
use MT::Util qw(remove_html);
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
    my $fields = $args->{fields} || 'title,text,text_more,keywords,tags,categories';

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

    # Get totalResults
    my $model = $args->{model} || 'entry';
    my $total_results = MT->model($model)->count($term, undef);

    # Set arguments
    my $arguments = undef;
    if ($args->{offset}) {
        $arguments->{offset} = $args->{offset};
    }
    if ($args->{limit}) {
        $arguments->{limit} = $args->{limit};
    }
    $arguments->{sort} = $args->{sort_by} || 'authored_on';
    $arguments->{direction} = $args->{sort_order} || 'descend';


    my @entries = MT->model($model)->load($term, $arguments);

    my @items;
    my $no_array = $args->{no_array};
    if ($no_array == 1) {
        $no_array = ',';
    }
    foreach my $entry (@entries) {
        my $item = {};
        foreach my $field (split(/,/, $args->{fields})) {
            # tags
            if ($field eq 'tags') {
                my @tags = $entry->get_tags;
                my @sanitized_tags;
                if ($args->{remove_html}) {
                    for (my $i = 0; $i <= $#tags; $i++){
                        my $html_removed_tag = remove_html($tags[$i]);
                        if ($html_removed_tag) {
                            push(@sanitized_tags, $html_removed_tag);
                        }
                    }
                }
                if (!@sanitized_tags) {
                    push @sanitized_tags, @tags;
                }
                if (@sanitized_tags and $no_array) {
                    $item->{tags} = $no_array . join($no_array, @sanitized_tags) . $no_array;
                }
                elsif (@sanitized_tags) {
                    $item->{tags} = \@sanitized_tags;
                }
                else {
                    $item->{tags} = '';
                }
            }
            # categories
            elsif ($field eq 'categories') {
                my $categories = $entry->categories;
                my @categories_label;
                if (@$categories) {
                    foreach my $category (@$categories) {
                        if ($args->{remove_html}) {
                            my $html_removed_category = remove_html($category->label);
                            if ($html_removed_category) {
                                push(@categories_label, $html_removed_category);
                            }
                        }
                        else {
                            push(@categories_label, $category->label);
                        }
                    }
                    if (@categories_label and $no_array) {
                        $item->{categories} = $no_array . join($no_array, @categories_label) . $no_array;
                    }
                    elsif (@categories_label) {
                        $item->{categories} = \@categories_label;
                    }
                    else {
                        $item->{categories} = '';
                    }
                }
            }
            # category
            elsif ($field eq 'category') {
                my $category = $entry->category;
                if ($category) {
                    if ($args->{remove_html}) {
                        $item->{category} = remove_html($category->label);
                    }
                    else {
                        $item->{category} = $category->label;
                    }
                }
                else {
                    $item->{category} = '';
                }
            }
            else {
                my $field_key = $field;
                $field_key =~ s/^field\./field_/;
                if ($args->{remove_html}) {
                    $item->{$field_key} = remove_html($entry->$field) || '';
                }
                else {
                    $item->{$field_key} = $entry->$field || '';
                }
            }
        }
        push(@items, $item);
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
    $str =~ s/^[\s\t]*\n//gm;
  }
  # Remove empty lines and white spaces of head of a line
  elsif ($arg == 2) {
    $str =~ s/^[\s\t]*\n|^[\s\t]+//gm;
  }
  # Remove empty lines and white spaces of head of a line and break lines
  elsif ($arg == 3) {
    $str =~ s/^[\s\t]*\n|^[\s\t]+//gm;
    $str =~ s/\n//g;
  }
  return $str;
}

sub _fltr_remove_host {
    my ($str, $arg, $ctx) = @_;
    return $str unless $arg;
    $str =~ s/https?:\/\/[^\/\s'"]*\/?/\//g;
    return $str;
}

sub _fltr_json_decode {
    my ($str, $arg, $ctx) = @_;
    return $str unless $arg;
    return '' unless $str;
    return MT::Util::from_json($str);
}

1;
