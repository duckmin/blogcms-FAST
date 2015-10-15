<?php 
session_start();
date_default_timezone_set('UTC');
include "constants.php";
//!!can chage to https if needed!!
define("BASE_URL", "http://".$_SERVER['HTTP_HOST']); //constant is defined here because CLI scripts will not have $_SERVER vars set and do not need this constant

//break apart the request url, individual parts used as params to route and as page level params  
$GLOBALS['url_parts'] = preg_split( "/\//", preg_replace( "/\/$/", "", preg_replace( "/\?.+/", "", substr( $_SERVER['REQUEST_URI'], 1 ) ) ) );

function returnMessage( $success, $message, $data ){
	$holder = Array( 'result'=>$success, 'message'=>$message, 'data'=>$data );
	return json_encode( $holder );
};
	
//autoload any class with this function
spl_autoload_register('myAutoloader');

function myAutoloader( $className )
{
    $path = dirname(__FILE__).'/classes/';
    include $path.$className.'.php';
}

function goTo404(){
	$error_box = SERVER_PATH."/pages/html/404.php";
	header( $_SERVER["SERVER_PROTOCOL"]." 404 Not Found" );	
	include $error_box;	
}


//mongo connection string can be changed here
function MongoConnection(){
	return new MongoClient(MONGO_CONNECTION_STRING);
}
?>
