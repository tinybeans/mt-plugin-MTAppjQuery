<?php
function smarty_modifier_json_decode($text, $arg) {
    if (! $arg) {
        return $text;
    }
    elseif ($arg == 2) {
        $assoc = true;
    }
    else {
        $assoc = false;
    }
    return json_decode($text, $assoc);
}
?>
