<?php	
	$success = false; 
	$message = "";
	$data = null;
	$logged_in = ManagerActions::isLoggedIn();
	
	if( $logged_in && isset($_GET["path"]) && isset($_GET["thumbname"]) ){
		
		$image_path = INDEX_PATH.$_GET["path"];
		//this is the filename of the image prepended with the last modified date
		//this will be the key we save to mongo with (has a unique key index for "filename")
		$thumbname = $_GET["thumbname"]; 
		
		if( file_exists( $image_path ) ){
			//even if thumb will not be stored in mongo we still create a thumb every time
		    //thumb will get cleaned up automatically by the tmp clearing chron job 
			$tmp_thumb = ImageModifier::createThumbFromExistingImage( $image_path );  //returns array with the result (t/f) and the path to the thumb file in tmp
			if( $tmp_thumb["result"] === true ){
				$thumb_path = $tmp_thumb["thumb_path"];
				$mime_type = $tmp_thumb["mime"];
				$meta_data = array(
					"metadata" => array(
						"filename" => $thumbname,
						"mime-type"=>$mime_type
					), 
		    	    "filename" => $thumbname 
		    	);
				try{
		    	    $db = MongoConnection();
		    	    $grid = $db->blog->getGridFS();
		    	    $storedfile = $grid->storeFile( $thumb_path, $meta_data );
		    	    unlink($thumb_path); //once thumb is stored in mongo remove temporary thumbnail from filesystem
		    	    $success = true;
		    	    $message = "Thumbnail Created";
		    	}catch( MongoGridFSException $e ){
		    		$message = "Already a thumbnail";
		    		//$message = $e->getMessage();
		    	}
			}
		}				
	}
	echo returnMessage( $success, $message, $data );
?>