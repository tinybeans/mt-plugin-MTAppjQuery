<?php
/*
Uploadify v2.1.0
Release Date: August 24, 2009

Copyright (c) 2009 Ronnie Garcia, Travis Nickels

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/* Path to mt : Movable Typeがインストールされているディレクトリのパス */
$mt_dir = '';

if (isset($mt_dir)) {
    require_once($mt_dir . 'php/mt.php');
    $mt = MT::get_instance(NULL, $mt_dir . 'mt-config.cgi');
    $AssetFileExtensions_conf = $mt->config('AssetFileExtensions');
    $DeniedAssetFileExtensions_conf = $mt->config('DeniedAssetFileExtensions');
    $AssetFileExtensions = explode(',', preg_replace('/\s/', '', $AssetFileExtensions_conf));
    $DeniedAssetFileExtensions = explode(',', preg_replace('/\s/', '', $DeniedAssetFileExtensions_conf));
}

$fileArray = array();

foreach ($_POST as $key => $value) {
    if ($key != 'folder') {
        $fileArray[$key] = array();

        preg_match('/\.([a-z]+)$/', $value, $match);
        $extension = $match[1];
        $check_ext = 'allow';

        /* Check the extensions */
        if (isset($mt_dir)) {

            if (isset($AssetFileExtensions_conf) and in_array($extension, $AssetFileExtensions)) {
                $check_ext = 'allow';
            } elseif (isset($AssetFileExtensions_conf)) {
                $check_ext = 'deny';
            }

            if (isset($DeniedAssetFileExtensions_conf) and in_array($extension, $DeniedAssetFileExtensions)) {
                $check_ext = 'deny';
            } elseif (isset($DeniedAssetFileExtensions_conf)) {
                $check_ext = 'allow';
            }
        }

        $fileArray[$key]['ext'] = $check_ext;

        /* Check exist */
        if (file_exists($_SERVER['DOCUMENT_ROOT'] . $_POST['folder'] . '/' . $value)) {
            $fileArray[$key]['name'] = $value;
            $fileArray[$key]['exist'] = 1;
        } else {
            $fileArray[$key]['name'] = $value;
            $fileArray[$key]['exist'] = 0;
        }
    }
}
echo json_encode($fileArray);
?>