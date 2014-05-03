<?php
function smarty_function_mtdumper ($args, &$ctx) {
    $name = $args['name'];
    if (! $name) {
        return '';
    }
    var_dump($ctx->__stash['vars'][$name]);
}
?>