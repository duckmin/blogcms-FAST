<?php

if( $part_count === 2 ){
	$filename = $GLOBALS['url_parts'][1];
	try{
	    $mongo = MongoConnection();
		$gridFS = $mongo->blog->getGridFS();
		$image = $gridFS->findOne( $filename );
		if( $image !== null ){
			header('Content-type: image/jpeg');
			echo $image->getBytes();
		}else{
			//use a default image
		}
	}catch( MongoException $e ){
		//use a default image
	}	
}

?>