<?php

$lat = $_GET["lat"];
$lon = $_GET["lon"];


	$url = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&mode=xml&APPID=348ecf1b294d7f120bf3d74104f7c926";
	//explicitly ask for response as xml
	
 
  	$process = curl_init($url);
	curl_setopt($process, CURLOPT_SSL_VERIFYHOST, FALSE);
  	curl_setopt($process, CURLOPT_SSL_VERIFYPEER, FALSE);
  	curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);

  	$return = curl_exec($process);

    
	echo $return;

  
	curl_close($process);
	?>  
