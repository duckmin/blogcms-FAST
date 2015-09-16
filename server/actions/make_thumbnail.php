<?php	
	$success = false; 
	$message = "";
	$data = null;
	$logged_in = ManagerActions::isLoggedIn();
	
	if( $logged_in && isset($_GET["path"]) && isset($_GET["thumbname"]) ){
		
		$image_path = $GLOBALS['index_path'].$_GET["path"];
		//this is the filename of the image prepended with the last modified date
		//this will be the key we save to mongo with (has a unique key index for "filename")
		$thumbname = $_GET["thumbname"]; 
		
		if( file_exists( $image_path ) ){
			//even if thumb will not be stored in mongo we still create a thumb every time
		    //thumb will get cleaned up automatically by the tmp clearing chron job 
			$tmp_thumb = ImageModifier::createThumbFromExistingImage( $image_path );  //returns array with the result (t/f) and the path to the thumb file in tmp
			if( $tmp_thumb["result"] === true ){
				$thumb_path = $tmp_thumb["thumb_path"];
				try{
		    	    $db = MongoConnection();
		    	    $grid = $db->blog->getGridFS();
		    	    $storedfile = $grid->storeFile( $thumb_path, 
		    	    array("metadata" => array("filename" => $thumbname), 
		    	    "filename" => $thumbname ));
		    	    unlink($thumb_path);
		    	}catch( MongoGridFSException $e ){
		    		$message = "Already a thumbnail";
		    		//$message = $e->getMessage();
		    	}
			}
		}				
	}
	echo returnMessage( $success, $message, $data );
?>