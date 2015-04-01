<?php
session_start();
date_default_timezone_set('UTC');
$GLOBALS['server_path'] = dirname(__FILE__);
$GLOBALS['index_path'] = $GLOBALS['server_path']."/../main";
$GLOBALS['base_url'] = "http://".$_SERVER['HTTP_HOST'];
$GLOBALS['template_dir'] = $GLOBALS['server_path']."/templates";
$GLOBALS['cache_dir'] = dirname(__FILE__)."/page_cache";
$GLOBALS['url_parts'] = preg_split( "/\//", preg_replace( "/\/$/", "", substr( $_SERVER['REQUEST_URI'], 1 ) ) );

//audio and video files allowed to be uploaded through the manager
//if adding new type add a new permitted extension & mime type
$GLOBALS["upload_vars"] = array(
	"allowed_image_extensions"=>array("gif", "jpeg", "jpg", "png"),
	"allowed_audio_extensions"=>array("mp3"),
	"allowed_mimetypes"=>array("image/jpeg", "image/gif", "image/jpg", "image/png", "audio/mpeg"),
	"max_kb_img_upload"=>500,
	"max_mb_audio_upload"=>40
);
$GLOBALS["upload_vars"]["allowed_extensions"] = array_merge ( $GLOBALS["upload_vars"]["allowed_image_extensions"], $GLOBALS["upload_vars"]["allowed_audio_extensions"] );

//mongo DB name project uses
$GLOBALS['mongo_db_name'] = "blog";

//# of posts that show up per page
$GLOBALS['amount_on_main_page'] = 3;

//# of posts that show up on the "posts" tab in the manager
$GLOBALS['amount_on_manger_tab'] = 8;

//minutes until cache file expires
$GLOBALS['max_page_cache_mins'] = -5;  

$GLOBALS['max_category_length'] = 500;
$GLOBALS['max_title_length'] = 500;
$GLOBALS['max_desc_length'] = 500;
$GLOBALS['max_tags_length'] = 1000;
$GLOBALS['max_folder_path_length'] = 1000;

//categories are how posts will be sorted edit with care !!
//new category names must not contain any spaces or special chars 
//only A-z 0-9 -_
$GLOBALS['post_categories'] = array(
	"blog",
	"video",
	"project",
	"ramblings",
	"test"
);

//header categries are the ones which show up in the header of the site
//you may not want every single category to show up in the header so you can define
//which ones do here
$GLOBALS['header_categories'] = $GLOBALS['post_categories']/*array(
	$GLOBALS['post_categories'][0],
	$GLOBALS['post_categories'][1],
	$GLOBALS['post_categories'][2]
)*/;

function returnMessage( $success, $message, $data ){
	$holder = Array( 'result'=>$success, 'message'=>$message, 'data'=>$data );
	return json_encode( $holder );
};
	
//autoload any class with this function
spl_autoload_register('myAutoloader');

function myAutoloader( $className )
{
    $path = dirname(__FILE__).'/classes/';

    include $path.$className.'.php';
}

function goTo404(){
	$redirect_url = $GLOBALS['server_path']."/pages/404.php";
	header( $_SERVER["SERVER_PROTOCOL"]." 404 Not Found" );	
	include($redirect_url );	
}


//mongo connection string cqan be changed here
function MongoConnection(){
	return new MongoClient("mongodb:///tmp/mongodb-27017.sock");
}
?>
