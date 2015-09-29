


(function(window){

function articleAtBottom(){
	var article = document.querySelector(".main > article:last-of-type"),
	article_height = article.clientHeight,
	offset_top = article.offsetTop,
	win_height = window.innerHeight,
	bottom_of_window_to_top = (  win_height +  window.pageYOffset  ),
    amt_post_visable = ( bottom_of_window_to_top - offset_top ),
	distance_from_bottom = ( amt_post_visable - article_height );
	console.log( distance_from_bottom );
	
	if( distance_from_bottom >= 0 ){
		loadNextPostPreview();
		removeEvent( window, "scroll", articleAtBottom );
	}
}

function loadNextPostPreview(){
	var ts = document.querySelector("section.main > article > p:first-of-type > time[data-ts]").getAttribute("data-ts");
	Ajaxer({
		url:constants.ajax_url+'?action=14&ts='+ts,
		method:"GET",
		send:null,
		async:true,
		success:function( data ){ 
			document.querySelector("section.main").innerHTML+=data; 
		},
		error:function( e_code, e_message ){  }
	})
}

addEvent(window, "load", function(e){
	addEvent( window, "scroll", articleAtBottom );
	articleAtBottom();
})






})(window);
