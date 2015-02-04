<?php
/**
 * Created by PhpStorm.
 * User: cedric
 * Date: 04.02.15
 * Time: 10:29
 */

// before week1
$include = "base.html";

$timestamp = time();

//set_include_path();


if (mktime(8, null, null, 2, 6, 2015) >= $timestamp &&
    $timestamp < mktime(8, null, null, 2, 13, 2015)) {
    //week1

} else if (mktime(8, null, null, 2, 13, 2015) >= $timestamp &&
    $timestamp < mktime(8, null, null, 2, 20, 2015)) {
    //week2

} else if (mktime(8, null, null, 2, 20, 2015) >= $timestamp &&
    $timestamp < mktime(8, null, null, 2, 27, 2015)) {
    //week3

} else if (mktime(8, null, null, 3, 6, 2015) >= $timestamp &&
    $timestamp < mktime(8, null, null, 3, 13, 2015)) {
    //week4

} else if (mktime(8, null, null, 3, 13, 2015) >= $timestamp &&
    $timestamp < mktime(8, null, null, 3, 20, 2015)) {
    //week5

} else if (mktime(8, null, null, 3, 21, 2015) >= $timestamp) {
    //week6

}

include_once($include);

?>