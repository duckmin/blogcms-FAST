


(function(window){

function articleAtBottom(){
	var article = document.querySelector(".main > article:last-of-type"),
	article_height = article.clientHeight,
	offset_top = article.offsetTop,
	win_height = window.innerHeight,
	bottom_of_window_to_top = (  win_height +  window.pageYOffset  ),
    amt_post_visable = ( bottom_of_window_to_top - offset_top ),
	distance_from_bottom = ( amt_post_visable - article_height );
	
	if( distance_from_bottom >= 0 ){
		loadNextPostPreview();
		loadRelatedHashtagsPreview();
		removeEvent( window, "scroll", articleAtBottom );
	}
}

function loadNextPostPreview(){
	var ts = document.querySelector("section.main > article > p:first-of-type > time[data-ts]").getAttribute("data-ts"),
	html_area = gEBI("next-posts");
	Ajaxer({
		url:constants.ajax_url+'?action=14&ts='+ts,
		method:"GET",
		send:null,
		async:true,
		success:function( data ){ 
			if(data.length > 0){
				html_area.innerHTML+=data;
			}else{
				html_area.style.display = "none";
			}
		},
		error:function( e_code, e_message ){  }
	})
}

function loadRelatedHashtagsPreview(){
	var form = document.querySelector("section.main > article > form"),
	form_class = new FormClass( form ),
	vals = form_class.getValues(),
	html_area = gEBI("related-hashtags");
	delete vals.created; //do not send timestamp back 
	
	controller.postJson( constants.ajax_url+'?action=17', vals, function(data){
		if(data.length > 0){
			html_area.innerHTML+=data;
		}else{
			html_area.style.display = "none";
		}
	})
}

addEvent(window, "load", function(e){
	addEvent( window, "scroll", articleAtBottom );
	articleAtBottom();
})






})(window);
