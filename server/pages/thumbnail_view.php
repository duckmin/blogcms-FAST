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
			//not working browser wants to download 
			//$stock_thumb = $GLOBALS['index_path']."/style/resources/no-thumbnail.png";
			//$fp = fopen($stock_thumb, 'rb');
			//header('Content-Type:img/png');
			//header('Content-Length: ' . filesize($stock_thumb));
			//fpassthru($fp);
		}
	}catch( MongoGridFSException $e ){
		echo "XXXX";
		echo $e->getMessage();
	}	
}

?>