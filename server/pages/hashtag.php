<?php
	//included in index.php which has configs.php included already
	$base = $GLOBALS['base_url'];
	$url = $_SERVER["REQUEST_URI"];
	
	if( $part_count !== 2  ){
		//wrong amount of URL params
		goTo404();
		exit;
	}
	
	$_GET['cat'] = $GLOBALS['post_categories'][0]; //hashtag has no cat, use default cat	
	$cat = $_GET['cat'];
	$_GET['hashtag'] = $url_parts[1];
	$hashtag = $_GET['hashtag'];	
	$time = ( isset($_GET['after']) )? $_GET['after'] : time();
	
	try{
	    $db = MongoConnection();
		$db_getter = new MongoGetter( $db ); 
		$parsedown = new Parsedown();				
    	$post_views = new PostViews( $parsedown );
    	$post_controller = new PostController( $db_getter, $post_views );
		$mongo_results = $post_controller->getHashtagPostsByTime( $time, $hashtag ); //false if no result set
	}catch( MongoException $e ){
		//echo $e->getMessage();
		//Mongo error, go to 404 page		
		goTo404();
		exit;
	}		
			
	if( $mongo_results ){
		$template = file_get_contents( $GLOBALS['template_dir']."/base_page.txt" );
		$title = "#$hashtag posts - ".$_SERVER['HTTP_HOST'];		
		$desc	= 	"browse #$hashtag";

		$tmplt_data = array();
		$tmplt_data["title"] = $title;
		$tmplt_data["description"] = $desc;
		$tmplt_data["styles"] = "";
		$tmplt_data["scripts"] = "";
		$tmplt_data["base"] = $base;
		$tmplt_data["category"] = $cat;
		$tmplt_data["search_placeholder"] = "search $cat";	
		$tmplt_data["search_value"] = "";		
		$tmplt_data["header"] = $post_views->getCatHeaderList( $cat );
		$tmplt_data["body"] = $mongo_results;
		
		$full_page = TemplateBinder::bindTemplate( $template, $tmplt_data );
		echo $full_page;
	}else{
		//if mongo results are false go to 404,	logic in getHashtagPostsByTime Function			
		goTo404();
	}
	
	
?>
