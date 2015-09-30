<?php
	$server = dirname(__FILE__)."/../server";
	
	include_once $server."/configs.php";
	$db = MongoConnection();
	$id = new MongoId( "56056409ce95181c26aa05db" );  //long post with plenty of text
	$collection = $db->blog->posts;					
	$item = $collection->findOne(array('_id'=>$id));
	//echo var_dump( $item );
	$post_data = $item["post_data"];
	//echo var_dump( $post_data )."<br><br>";
	
	$blogdown = new Parsedown();
	$post_views = new PostViews( $blogdown );
	echo $post_views->getPreviewTextFromMarkdown( $post_data )."<br><br>";
	echo var_dump( $post_views->extractHashtagsFromPostData( $post_data ) );	
	
	
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