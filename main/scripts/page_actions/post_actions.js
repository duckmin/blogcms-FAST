(function(window){

addEvent(window, "load", function(e){
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
})



})(window);
