<?php	
	$json = json_decode( $_POST['json'], true );
	$post_view = new PostViews( new Parsedown );
	$form_data = $json["post_data"];
	$template_data = $json["template_data"];
	$post_template = file_get_contents( $GLOBALS['template_dir']."/blog_post.txt" );
	$preview_template = file_get_contents( $GLOBALS['template_dir']."/blog_post_preview.txt" );
	
	$single = array();
	$single["_id"] ="5428784f7f8b9afe1a779e93";  //just a dummy ID means nothing 
	$single["lastModified"] = new MongoDate();
	$single["title"] = $form_data["title"];
	$single["post_data"] = $template_data;
	$single["author"] = $_SESSION['user'];
	$single["description"] = $form_data["description"];
	$single["thumbnail"] = $form_data["thumbnail"];
	$single["hashtags"] = PostUtils::extractHashtagsFromPostData( $template_data );
	
	//post category is just a placeholder the link will not work i the preview it is just a sample
	echo $post_view->makePostHtmlFromData( $single, $post_template );
	echo $post_view->makePostPreviewHtmlFromData( $single, $preview_template );	
?>