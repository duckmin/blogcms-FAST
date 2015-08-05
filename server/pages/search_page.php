<?php
	//included in index.php which has configs.php included already
	$base = $GLOBALS['base_url'];
	$url = $_SERVER["REQUEST_URI"];
	
	if( $part_count === 4 ){
		
		$_GET['cat'] = $url_parts[1];
		$_GET['search'] = $url_parts[2];
		$_GET['page'] = (int)$url_parts[ $part_count-1 ]; //page is always last part of url or 1		
		
		try{		
			$cat = $_GET['cat'];		
			$page = $_GET['page'];
			$search = $_GET['search'];
			$parsedown = new Parsedown();				
			$post_views = new PostViews( $parsedown );		
			$db = MongoConnection();
			$db_getter = new MongoGetter( $db );
			$post_controller = new PostController( $db_getter, $post_views );
			$mongo_results = $post_controller->getSearchPagePosts( $page, $cat, $search ); //false if no result set
			$template = file_get_contents( $GLOBALS['template_dir']."/base_page.txt" );
			$title = $cat." page ".$page." - ".$_SERVER['HTTP_HOST'];		
			$desc	= 	$_SERVER['HTTP_HOST']." - browse ".$cat." page ".$page;
			
			if( $mongo_results ){
				$tmplt_data = array();
				$tmplt_data["title"] = $title;
				$tmplt_data["description"] = $desc;
				$tmplt_data["styles"] = "";
				$tmplt_data["scripts"] = "";
				$tmplt_data["base"] = $base;
				$tmplt_data["search_cat"] = $cat;		
				$tmplt_data["header"] = $post_views->getCatHeaderList( $cat );
				$tmplt_data["body"] = $mongo_results;
				
				$full_page = TemplateBinder::bindTemplate( $template, $tmplt_data );
				echo $full_page;
			}else{
				//if mongo results are false go to 404,	logic in getHomePagePosts Funtion			
				goTo404();
			}
		}catch( MongoException $e ){
			//echo $e->getMessage();
			//Mongo error, go to 404 page		
			goTo404();
		}	
	}else{ 
		//wrong amount of URL params
		echo "wrong amount of url params";
		
	}
?>
