<?php
	$post_data = file_get_contents("php://input");
	if( $post_data === "" ){
		echo "no data provided";
		exit;
	}
		
	$json_data = json_decode( $post_data, true );
	if( !array_key_exists("service", $json_data) || !array_key_exists("values", $json_data) ){ //does not have keys service and values
		echo "wrong json keys could not complete request";
		exit;		
	}
	
	$service = $json_data["service"];
	$_APIVALS = $json_data["values"];
	//echo print_r($json);
	//echo print_r($_APIVALS);
	$file = Api::getApiPath($service);
	if( $file !== false ){
		include $file;
   }else{
		echo "$service is not a valid api call";   
   }
    
?>