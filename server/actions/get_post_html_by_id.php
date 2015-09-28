<?php
	include_once dirname(__FILE__)."/../configs.php";
	
	if( isset( $_GET["id"] ) && isset( $_GET["cat"] ) ){
		
		$id = $_GET["id"];
		
		try{			
			$db = MongoConnection();
			$db_getter = new MongoGetter( $db );
			$post_data = $db_getter->getSingleRowById( $id );
			if( $post_data !== NULL ){ //post is found
    			$post_data["show_id"] = true; //make id visable
    			$parse_down  = new Parsedown();
    			$post_views = new PostViews( $parse_down );
    			$post_template = file_get_contents( $GLOBALS['template_dir']."/blog_post.txt" );

    			echo $post_views->makePostHtmlFromData( $post_data, $post_template );
		    }
			
		} catch( MongoCursorException $e ) {;
			//echo "error message: ".$e->getMessage()."\n";
		}
		
	}
?>