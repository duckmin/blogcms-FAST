<?php
	/* 
		Page takes the date from the url finds the beginning and end time for that date
		then searches mongo for a post between start and end dates with the same title
	*/
	if( count( $GLOBALS['url_parts'] ) !== 5 ){	
		goTo404();
		exit;
	}
		
	$base = $GLOBALS['base_url'];
	$cat = "";//$GLOBALS['url_parts'][1];
	$year = $GLOBALS['url_parts'][1];
	$month = $GLOBALS['url_parts'][2];
	$date = $GLOBALS['url_parts'][3];
	$title = $GLOBALS['url_parts'][4];
	$initial_date = "$year-$month-$date";		
	$start = strtotime( $initial_date );
	$end = strtotime( "$initial_date+23 hours 59 minutes 59 seconds" );
	
	try{
		$db = MongoConnection();
		$db_getter = new MongoGetter( $db );
		$post_views = new PostViews( new Parsedown() );
		$non_hyphenated_title = $post_views->convertPostTitleHyphensToSpaces( $title );
		$single_post_data = $db_getter->getSingleRowFromDate( $non_hyphenated_title, $start, $end ); //NULL if not found\	
	}catch( MongoException $e ){
		//echo $e->getMessage();
		//Mongo error, go to 404 page		
		goTo404();
		exit;
	}	
		
	if( $single_post_data !== NULL ){
		$single_post_data["show_id"] = true; //show id on post so analytics can track views by ID
		$page_template = file_get_contents( $GLOBALS['template_dir']."/base_page.txt" );
		$post_template = file_get_contents( $GLOBALS['template_dir']."/blog_post.txt" );
		$tmplt_data = array();
		$scripts = "<script src='/scripts/page_actions/main_analytics.js'></script>";
		$scripts .= "<script src='/scripts/page_actions/post_actions.js' ></script>";
		
		$tmplt_data["title"] = $single_post_data["title"]." - ".$_SERVER['HTTP_HOST'];
		$tmplt_data["description"] = $single_post_data["description"];
		$tmplt_data["styles"] = "";
		$tmplt_data["scripts"] = $scripts;
		$tmplt_data["base"] = $base;
		$tmplt_data["header"] = "";
		$tmplt_data["search_value"] = "";
		$tmplt_data["body"] = $post_views->makePostHtmlFromData( $single_post_data, $post_template );
	
		$full_page = TemplateBinder::bindTemplate( $page_template, $tmplt_data );
		echo $full_page;
	}else{
		goTo404();
	}
	
?>