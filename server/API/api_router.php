<?php
	$json = file_get_contents("php://input");
	if( $json === "" ){
		echo "no data provided";
		exit;
	}
		
	$json = json_decode( $json, true );
	if( !array_key_exists("service", $json) || !array_key_exists("values", $json) ){ //does not have keys service and values
		echo "wrong json keys could not complete request";
		exit;		
	}
	
	$_APIVALS = $json["values"];
	echo print_r($json);
	echo print_r($_APIVALS);
	
	//TODO put service value through switch statement and include file
?>