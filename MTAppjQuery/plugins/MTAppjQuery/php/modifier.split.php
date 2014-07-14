<?php
function smarty_modifier_split($text, $arg) {
    if (empty($text)) {
        return "";
    }
    return explode($arg, $text);
}
?>