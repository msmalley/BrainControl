<?php

function clean_string($string)
{
    $string = preg_replace('/\s*/', '-', $string);
    $string = strtolower($string);
    return $string;
}

function var_dumped($content, $exit = true)
{
    echo '<pre>';
    print_r($content);
    echo '</pre>';
    if($exit === true) exit;
}
