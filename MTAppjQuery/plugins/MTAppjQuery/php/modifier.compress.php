<?php
function smarty_modifier_compress($text, $arg) {
    # Remove empty lines
  if ($arg == 1) {
    $text = preg_replace ('/^\s*\n/m', '', $text);
  }
  # Remove empty lines and white spaces of head of a line
  elseif ($arg == 2) {
    $text = preg_replace ('/^\s*\n|^\s+/m', '', $text);
  }
  # Remove empty lines and white spaces of head of a line and break lines
  elseif ($arg == 3) {
    $text = preg_replace ('/^\s*\n|^\s+/m', '', $text);
    $text = preg_replace ('/\n/', '', $text);
  }
  return $text;
}
?>
