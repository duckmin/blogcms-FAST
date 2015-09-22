<?php
	require_once dirname(__FILE__)."/../configs.php";
		
	class PostUtils {
 
		public static function extractHashtagsFromPostData( $post_data_array ){
			$hashes = array();
			foreach( $post_data_array as $post_item ){
				//echo var_dump( $post_item );
				$post_type = $post_item["data-posttype"];
				if( $post_type === "markdown" ){
					 //$hash_matches = array();
					 preg_match_all( "/#{1}([A-z0-9]+)/", $post_item["text"], $hash_matches );
					 if( isset($hash_matches[1]) ){
					 	 $hashes = array_merge ( $hashes, $hash_matches[1] );
					 }
				}
			}
			return $hashes;
		}
	
	}
   
?>
