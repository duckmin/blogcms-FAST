(function(window){

addEvent(window, "beforeunload", function(e){
	var analytics_key = document.querySelector("article.post").id,
	send = {
		service:"PagesCount_page_view",
		values:{
			url:analytics_key
		}
	};
	
	Ajaxer({
		url:"/api",
		method:"POST",
		send:JSON.stringify( send ),
		async:false,
		success:function( data ){ alert(data) },
		error:function( e_code, e_message ){  }
	})
})



})(window);

