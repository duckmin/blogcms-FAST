<?php

if( $part_count === 2 ){
	$filename = $GLOBALS['url_parts'][1];
	try{
	    $mongo = MongoConnection();
		$gridFS = $mongo->blog->getGridFS();
		$image = $gridFS->findOne( $filename );
		if( $image !== null ){
			$mime_type = $image->file["metadata"]["mime-type"];
			header("Content-type: $mime_type");
			echo $image->getBytes();
		}else{
			//use a default image
		}
	}catch( MongoGridFSException $e ){
		echo "XXXX";
		echo $e->getMessage();
	}	
}

?>