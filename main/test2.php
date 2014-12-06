<?php
$server = dirname(__FILE__)."/../server";
	
	include_once $server."/configs.php";
	
	$db = new MongoClient();
	$dt = date('Y-m-d'); //todays date with no time
	
	$ts = new MongoDate( strtotime( $dt." 00:00:00" ) ); //time of 00:00:00 because we only want 1 record per page per day
	$url = "http://localhost:8080/video";	
		
	$write_result = $db->blog->analytics->update( array("url"=>$url,'date'=>$ts), array('$inc'=>array('views'=>1)), array('upsert'=>true) );
	$written = ( $write_result['n'] === 1 )? true : false;				
	
	
	/*$cursor = $db->blog->analytics->find();
	
	foreach( $cursor as $post ){
		echo $post["views"]."<br>";
	}*/
?>