<?php

$lat = $_GET["lat"];
$lng = $_GET["lng"];


// https://api.sunrise-sunset.org/json?lat=-37.686732&lng=176.167361
$url="https://api.sunrise-sunset.org/json?lat=".$lat."&lng=".$lng."";

$process=curl_init($url);
curl_setopt($process, CURLOPT_SSL_VERIFYHOST, FALSE);
curl_setopt($process, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
$return=curl_exec($process);

echo $return;

curl_close($process);

?>