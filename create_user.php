#!/usr/bin/php

<?php
	/* this script is used to add a user into the mongo users collection to login to the manager page with */
	include dirname(__FILE__)."/server/constants.php";
	
	$mongo_con = new MongoClient(MONGO_CONNECTION_STRING);
	$db_name = MONGO_DB_NAME;
	$collection = $mongo_con->$db_name->users;
	/*date_default_timezone_set('America/New_York');
	$mongo_con = new MongoClient();
	$today = date( "Y-m-d" );
	$ts = strtotime( $today."-30 days" );
	
	$mongo_date = new MongoDate( $ts );
	$collection = $mongo_con->blog->analytics;	
	$cursor = $collection->remove( array( "date"=>array( '$lt'=>$mongo_date ) ) );
	$amount_removed = $cursor["n"];*/
?>