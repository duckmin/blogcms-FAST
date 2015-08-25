<?php
	//included in index.php which has configs.php included already
	$base = $GLOBALS['base_url'];
	$url = $_SERVER["REQUEST_URI"];
	
	if( $part_count !== 3 || !in_array( $url_parts[1], $GLOBALS['post_categories'] ) ){
		//wrong amount of URL params or not a valid category
		goTo404();
		exit;
	}
	
	$_GET['cat'] = $url_parts[1];
	$_GET['search'] = urldecode( $url_parts[2] );	
	$cat = $_GET['cat'];		
	$search = $_GET['search'];
	$time = ( isset($_GET['after']) )? $_GET['after'] : time();
	
	try{
	    $db = MongoConnection();
		$db_getter = new MongoGetter( $db ); 
		$parsedown = new Parsedown();				
    	$post_views = new PostViews( $parsedown );
    	$post_controller = new PostController( $db_getter, $post_views );
		$mongo_results = $post_controller->getSearchPagePostsAfterTime( $time, $cat, $search ); //false if no result set
	}catch( MongoException $e ){
		//echo $e->getMessage();
		//Mongo error, go to 404 page		
		goTo404();
		exit;
	}		
			
	if( $mongo_results ){
		$safe_search = htmlspecialchars($search, ENT_QUOTES);
		$template = file_get_contents( $GLOBALS['template_dir']."/base_page.txt" );
		$title = $cat." search '".$safe_search." - ".$_SERVER['HTTP_HOST'];		
		$desc	= 	$_SERVER['HTTP_HOST']." - browse ".$cat." search '".$safe_search;
		//need to special chars anything using $search param that gets inserted into HTML
		$tmplt_data = array();
		$tmplt_data["title"] = $title;
		$tmplt_data["description"] = $desc;
		$tmplt_data["styles"] = "";
		$tmplt_data["scripts"] = "";
		$tmplt_data["base"] = $base;
		$tmplt_data["category"] = $cat;
		$tmplt_data["search_placeholder"] = htmlspecialchars("search ".$cat, ENT_QUOTES);	
		$tmplt_data["search_value"] = $safe_search;		
		$tmplt_data["header"] = $post_views->getCatHeaderList( $cat );
		$tmplt_data["body"] = $mongo_results;
		
		$full_page = TemplateBinder::bindTemplate( $template, $tmplt_data );
		echo $full_page;
	}else{
		//if mongo results are false go to 404,	logic in getHomePagePosts Funtion			
		goTo404();
	}
	
	
?>
