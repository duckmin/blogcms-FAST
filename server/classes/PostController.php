<?php
	include_once dirname(__FILE__)."/../configs.php";
	
	class PostController
	{
		
		function __construct( MongoGetter $db_getter, PostViews $post_views )
		{
			$this->mongo_getter = $db_getter;
			$this->post_views = $post_views;
		}
		
		public function getHomePagePostsByTime( $time, $cat ){
			$str="";
			$posts_from_db = $this->mongo_getter->getHomePagePostsFromDbByCategoryAfterDate( (int)$time, $cat );
			$L = $posts_from_db->count(true);
			if( $L === 0 ){ 
				//no results return false and we will send them to 404 (paginator logic should not allow this to happen)
				return false;
			}
			$post_array = iterator_to_array($posts_from_db, false);
			if( $L > $GLOBALS['amount_on_main_page'] ){
				array_pop( $post_array );
				$url_add = $cat;
				$last_item = end($post_array);
				$last_timestamp = $last_item["lastModified"]->sec;
				$paginator_template = file_get_contents( $GLOBALS['template_dir']."/paginator.txt" );
				$paginator = $this->post_views->paginator( $last_timestamp, $url_add, $paginator_template );
			}else{
				$paginator = "";
			}
			$post_template = file_get_contents( $GLOBALS['template_dir']."/blog_post.txt" );		
			foreach( $post_array as $single ){		
				$post_html = $this->post_views->makePostHtmlFromData( $single, $cat, $post_template ); //pass in cat because post can have multiple cats and we want to know which one we are looking at				$str .= $post_html;
			}
			return $str.$paginator;
		}	

		public function getSearchPagePostsAfterTime( $time, $cat, $search ){
			$str="";
			$search = trim( $search );
			$posts_from_db = $this->mongo_getter->getHomePagePostsFromDbByCategoryAndSearchAfterDate( (int)$time, $cat, $search );
			$L = $posts_from_db->count(true);
			if( $L === 0 ){
				$empty_search_template = file_get_contents( $GLOBALS['template_dir']."/empty_search.txt" );				
				//if search is set and count is 0 and page = one then search return no n results show them a non result page
				return $this->post_views->emptySearchHtml( $cat, $search, $empty_search_template );
			}
			$post_array = iterator_to_array($posts_from_db, false);
			if( $L > $GLOBALS['amount_on_main_page'] ){
				array_pop( $post_array );
				$s = urlencode( $search );
				$url_add = "search/$cat/$s";
				$last_item = end($post_array);
				$last_timestamp = $last_item["lastModified"]->sec;
				$paginator_template = file_get_contents( $GLOBALS['template_dir']."/paginator.txt" );
				$paginator = $this->post_views->paginator( $last_timestamp, $url_add, $paginator_template );
			}else{
				$paginator = "";
			}
			$post_template = file_get_contents( $GLOBALS['template_dir']."/blog_post.txt" );		
			foreach( $post_array as $single ){		
				$post_html = $this->post_views->makePostHtmlFromData( $single, $cat, $post_template ); //pass in cat because post can have multiple cats and we want to know which one we are looking at				$str .= $post_html;
			}
			return $str.$paginator;
		}
		
	}
	
?>