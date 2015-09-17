<?php
	
	if( isset( $_GET["cat"] ) && isset( $_GET["ts"] ) ){
		$time = floatval( $_GET["ts"] );
		$time_stamp = $time/1000; //js use milliseconds mongo uses seconds convert milliseconds to seconds
		$cat = $_GET['cat'];		
		
		try{			
			$db = MongoConnection();
			$db_getter = new MongoGetter( $db );
			$post_data = $db_getter->getPreviousPostsFromTimestamp( $cat, $time_stamp );
			$post_template = file_get_contents( $GLOBALS['template_dir']."/blog_post_preview.txt" );
			$post_view = new PostViews( new Parsedown );
			
			foreach( $post_data as $post ){
				echo $post_view->makePostPreviewHtmlFromData( $post, $cat, $post_template );
			}
			
		} catch( MongoCursorException $e ) {;
			echo "error message: ".$e->getMessage()."\n";
		}
		
	}
	
?>