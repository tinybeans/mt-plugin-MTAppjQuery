<?php
function smarty_modifier_nengou($str, $arg) {
    if (empty($str) or !preg_match('/\d{8}/', $str)) {
        return "";
    }
    $res = '';
    $nengou = '';
    $diff = 0;
    if ($str >= 18680125 and $str <= 19120729) {
        $nengou = '明治';
        $diff = 1867;
    } elseif ($str >= 19120730 and $str <= 19261224) {
        $nengou = '大正';
        $diff = 1911;
    } elseif ($str >= 19261225 and $str <= 19890107) {
        $nengou = '昭和';
        $diff = 1925;
    } elseif ($str >= 19890108) {
        $nengou = '平成';
        $diff = 1988;
    }
    $str = preg_replace('/(\d{4})(\d{2})(\d{2})/', '$1,$2,$3', $str);
    $date = explode(',', $str);
    $res = $nengou . ($date[0] - $diff) . '年' . $date[1] . '月' . $date[2] . '日';
    return $res;
}
?>