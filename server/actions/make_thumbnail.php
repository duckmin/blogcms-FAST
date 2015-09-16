<?php	
	$success = false; 
	$message = "";
	$logged_in = ManagerActions::isLoggedIn();
	
	if( $logged_in ){
		
		
		try{
    	    $grid = $db->blog->getGridFS();
    	    $path ="/var/www/html/blogcms/main/pics/222/";
    	    $filename="crang.JPG";
    	    $storedfile = $grid->storeFile($path . $filename, array("metadata" => array("filename" => $filename), 
    	    "filename" => $filename));
    	}catch( MongoGridFSException $e ){
    		echo "XXXX";
    		echo $e->getMessage();
    	}	
		
	}
	echo returnMessage( $success, $message, null );
?>