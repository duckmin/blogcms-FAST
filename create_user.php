#!/usr/bin/php

<?php
	/* this script is used to add a user into the mongo users collection to login to the manager page with */
	include dirname(__FILE__)."/server/constants.php";
	
	$mongo_con = new MongoClient(MONGO_CONNECTION_STRING);
	$db_name = MONGO_DB_NAME;
	
	$options = getopt( "u:p:l:" );
	echo print_r($options);
	
	if( array_key_exists("u", $options) ){
		$username = $options["u"];
	}else{
		echo "must include the option -u <username>\n";
		exit;
	}
	
	if( array_key_exists("p", $options) ){
		$password = $options["p"];
	}else{
		echo "must include the option -p <password>\n";
		exit;
	}
	
	if( array_key_exists("l", $options) ){
		$level = intval( $options["l"] );
	}else{
		echo "must include the option -l <level>\n";
		exit;
	}
	
	if( preg_match( "/[^A-z0-9\-$]/", $username ) ){
		echo "username can only contain characters A-z 0-9 _ -\n";
		exit;
	}
	
	if( preg_match( "/[\s]/", $password ) || strlen($password) < 5  ){
		echo "password can not contain any spaces, and must be atleast 5 characters long\n";
		exit;
	}
	
	if( !is_int($level) || $level < 1 || $level > 3 ){
		echo "level must be an integer, and must be between 1-3\n";
		echo "1 is basic user, 2 is priviledged user, 3 is admin user\n";
		exit;
	}
	
	$password = password_hash($password, PASSWORD_DEFAULT);
	echo "$password\n";	
	
	//$collection = $mongo_con->$db_name->users;
	/*date_default_timezone_set('America/New_York');
	$mongo_con = new MongoClient();
	$today = date( "Y-m-d" );
	$ts = strtotime( $today."-30 days" );
	
	$mongo_date = new MongoDate( $ts );
	$collection = $mongo_con->blog->analytics;	
	$cursor = $collection->remove( array( "date"=>array( '$lt'=>$mongo_date ) ) );
	$amount_removed = $cursor["n"];*/
?>