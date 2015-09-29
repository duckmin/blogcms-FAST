<?php
	$server = dirname(__FILE__)."/../server";
	
	include_once $server."/configs.php";
	$db = MongoConnection();//file:///home/duckmin/projects/js_libs/libs_in_dev/extender_test.html

	
	//TEST TO GET TIMESTAMP OF ONE POST AND GET THE NEXT POST BACK IN TIME
	//$time = 1427140819000/1000;	
	//$d = new MongoDate(time());
	//echo time();
	//var_dump($d);
	
	//echo var_dump( isset($_COOKIE["sort"]) );
	//echo var_dump((int)$_COOKIE["sort"]);
	
	
	
	/*try{
	    $grid = $db->blog->getGridFS();
	    $path ="/var/www/html/blogcms/main/pics/222/";
	    $filename="crang.JPG";
	    //$storedfile = $grid->storeFile($path . $filename, array("metadata" => array("filename" => $filename), 
	    //"filename" => $filename));
	    $grid->remove( array("filename" => $filename) );
	}catch( MongoGridFSException $e ){
		echo "XXXX";
		echo $e->getMessage();
	}	
	
	$stock_thumb = $GLOBALS['index_path']."/style/resources/no-thumbnail.png";
			//$fp = fopen($stock_thumb, 'rb');
			header('Content-Type: img/png');
			$img = imagecreatefrompng($stock_thumb);
			imagepng($img);*/
?>