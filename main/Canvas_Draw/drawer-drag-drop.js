(function(window){
	
	
	window.Drawer = function( canvas_box ){
		this.max_KB_img_upload = 150;
		this.max_canvas_width = 600;
		this.container = canvas_box;
		this.canvas = canvas_box.querySelector("canvas");
		this.selectionContainer = canvas_box.querySelector("ul.selections");
		this.colorDivsContainer = canvas_box.querySelector("li.colors");
		this.controlsContainer = canvas_box.querySelector("li.controls");
		this.brush_marker = canvas_box.querySelector("div.brush-marker");
		this.brushIndicator = this.colorDivsContainer.querySelector("div.color");
		this.brushSizeRange = this.colorDivsContainer.querySelector("input[type='range']");
		this.color_input = this.colorDivsContainer.querySelector("input[type='color']");
		this.ctx = this.canvas.getContext("2d");
		var default_color = this.color_input.value;
		this.fillStyle = default_color;
		this.brush_marker.style.backgroundColor = default_color;
		this.strokeWidth = 5; //default brush size 
		this.currX = 0;
		this.currY = 0;
		this.prevX = 0;
		this.prevY = 0;
		this.brush_mode = "pencil";  //pencil, brush, eraser, spray 
		
		//drop drop addons 
		this.dragDropBox = this.controlsContainer.querySelector("div.drop-area");
	}
	
	Drawer.prototype.mouseDownEvent = function(e){
		e.currentTarget.setCapture();
		this.prevX = this.currX;
		this.prevY = this.currY;
		this.currX = e.clientX - this.canvas.offsetLeft;
		this.currY = e.clientY - this.canvas.offsetTop;	
		//bind mouse move listener
		var draw_modes = ["brush","eraser","spray"];
		if( draw_modes.indexOf(this.brush_mode) >= 0 ){ 
		    this.drawCoords(); 
		}else{
		    this.drawCircle();  
		}
		this.canvas.addEventListener("mousemove", this.canvasMouseMoveName, false );
	}
	
	Drawer.prototype.mouseUpEvent = function(e){
		e.currentTarget.releaseCapture();
		this.canvas.removeEventListener("mousemove", this.canvasMouseMoveName, false );
	}
	
	Drawer.prototype.mouseMoveEvent = function(e){
		this.prevX = this.currX;
		this.prevY = this.currY;
		this.currX = e.clientX - this.canvas.offsetLeft;
		this.currY = e.clientY - this.canvas.offsetTop;
		this.drawCoords();
	}
	
	Drawer.prototype.mouseFollowerEvent = function(e){
		var x = e.clientX,
		y = e.clientY,
		half_stroke = this.strokeWidth/2;
		this.brush_marker.style.top = (y - half_stroke)+"px";
		this.brush_marker.style.left = (x - half_stroke)+"px";
	}
	
	Drawer.prototype.mouseOverEvent = function(e){
		this.brush_marker.style.display = "block";
	}
	
	Drawer.prototype.mouseOutEvent = function(e){
		e.currentTarget.releaseCapture();
		var brush_marker_style = this.brush_marker.style;
		if( brush_marker_style.display === "block" ){ brush_marker_style.display = "none"; }
		this.canvas.removeEventListener("mousemove", this.canvasMouseMoveName, false );
	}
	
	Drawer.prototype.changeBrushSize = function(size){
		this.brushIndicator.style.width = ( size )+"px";
		this.brushIndicator.style.height = ( size )+"px";
		
		//add styles to brush marker
		this.brush_marker.style.width = ( size )+"px";
		this.brush_marker.style.height = ( size )+"px";
		
		if( this.brush_mode !== "eraser" ){
            this.brush_marker.style.borderRadius = ( size )+"px";
            this.brushIndicator.style.borderRadius = ( size )+"px";
        }
	}
	
	Drawer.prototype.modeSelector = function(e){
		var target = e.currentTarget,
		current_selection = this.controlsContainer.querySelector("i.selected");
		current_selection.className = current_selection.className.replace("selected", "");
		target.className+=" selected";
		this.brush_mode = target.getAttribute("data-brushmode");
		
		switch( this.brush_mode ){
			case "pencil":			    
			case "spray":
	    	case "brush":
			    var selected_color = this.color_input.value;
			    var brush_size_value = this.brushIndicator.previousElementSibling.value+"px";
			    //this.brush_marker.style.borderRadius = brush_size_value;
			    //this.brushIndicator.style.borderRadius = brush_size_value;
			    this.changeBrushSize (brush_size_value);
			    this.brushIndicator.style.backgroundColor = selected_color;
			    this.brush_marker.style.backgroundColor = selected_color;
			    this.brushIndicator.style.border = "none";
		  	    this.brush_marker.style.border = "none";
		  		break;
		  			
		  	case "eraser":
		  	    this.brush_marker.style.borderRadius = "0";
		  	    this.brushIndicator.style.borderRadius = "0";
		  	    this.brushIndicator.style.backgroundColor = "white";
		  	    this.brush_marker.style.backgroundColor = "white";
		  	    this.brushIndicator.style.border = "1px solid black";
		  	    this.brush_marker.style.border = "1px solid black";
			    break;
		}
	}
	
	Drawer.prototype.getRandomOffset = function(radius) {  //for spraypaint 
		var randomAngle = Math.random() * 360;
		var randomRadius = Math.random() * radius;
		return {
			x: Math.cos(randomAngle) * randomRadius,
			y: Math.sin(randomAngle) * randomRadius
		}
	}
	
	Drawer.prototype.drawCircle = function(){
		var context = this.ctx;
		var half_width = this.strokeWidth/2;
		context.fillStyle= this.fillStyle;
  		context.beginPath();
  		context.arc(this.currX, this.currY, half_width, 0, 2 * Math.PI, false);
  		context.fill();
  		context.closePath();
	}
	
	Drawer.prototype.drawCoords = function(){
		var stroke_width = this.strokeWidth;
		var half_width = stroke_width/2;
		var context = this.ctx;
		
		if( this.brush_mode === "pencil" ){  //add or remove show blur 
			context.shadowBlur = 2;
  			context.shadowColor = this.fillStyle;
		}else{ //set to default if not pencil 
			context.shadowBlur = 0;
  			context.shadowColor = "rgba(0,0,0,0)";
		}
		
		switch( this.brush_mode ){
			
			case "pencil":
				context.beginPath();
			    context.moveTo(this.prevX, this.prevY);
			    context.lineTo(this.currX, this.currY);
			    context.strokeStyle = this.fillStyle;
			    context.lineWidth = this.strokeWidth;  
			    context.lineJoin = "round";
			    context.lineCap = "round";
			    context.stroke();
			    context.closePath();
			    break;
	    	
	    	case "brush":
				context.fillStyle= this.fillStyle;
		  		context.beginPath();
		  		context.arc(this.currX, this.currY, half_width, 0, 2 * Math.PI, false);
		  		context.fill();
		  		context.closePath();
		  		break;
		  		
		  	case "spray":
				context.fillStyle= this.fillStyle;
				for (var i = 0; i < stroke_width; i++) {
					var offset = this.getRandomOffset(half_width);
            	var x = this.currX + offset.x; 
            	var y = this.currY + offset.y;  
            	context.fillRect(x, y, 1, 1);
            }
		  		break;
		  		
		  	case "eraser":
				context.fillStyle= this.fillStyle;
				var rect_x = this.currX - half_width;
				var rect_y = this.currY - half_width;
		  		context.clearRect(rect_x, rect_y, stroke_width, stroke_width );
		  		break;
	    }	
	}
	
	Drawer.prototype.selectColor = function(e){
		var target = e.currentTarget,
		selected_color = target.value;
		this.fillStyle = selected_color;
		
		if( this.brush_mode !== "eraser" ){
            this.brushIndicator.style.backgroundColor = selected_color;
		    this.brush_marker.style.backgroundColor = selected_color;
	    }
	}
	
	Drawer.prototype.rangeSelectSize = function(e){
		var target = e.currentTarget,
		range_value = target.value;
		this.strokeWidth = range_value;
		this.changeBrushSize (range_value);
		
		/*color_div = target.nextElementSibling,
		color_div_style = color_div.style;
		this.strokeWidth = range_value;  //change size of drawing pencil 
		color_div_style.width = ( range_value )+"px";
		color_div_style.height = ( range_value )+"px";
		
		//add styles to brush marker
		this.brush_marker.style.width = ( range_value )+"px";
		this.brush_marker.style.height = ( range_value )+"px";
		
		if( this.brush_mode !== "eraser" ){  //only style radius if not eraser 
            this.brush_marker.style.borderRadius = ( range_value )+"px";
            color_div_style.borderRadius = ( range_value )+"px";
	    }*/
	}
	
	Drawer.prototype.handleDragDrop = function(e){
		e.stopPropagation();
		e.preventDefault();
		
		var allowed_types = ["image/gif","image/png","image/jpeg"],
		dt = e.dataTransfer,
		file = dt.files[0],
		type = file.type;
		if( allowed_types.indexOf( type ) >= 0 ){
			var KB_size = file.size/1024;
			if( KB_size <= this.max_KB_img_upload ){
    			var reader = new FileReader();
    			reader.file = file;
    			reader.addEventListener("loadend", this.handleImgLoad.bind(this), false);
    			reader.readAsDataURL(file);
		    }else{
		        alert("Image Can Not Exceed "+this.max_KB_img_upload+" KB in Size")    
		    }
		}
	}
	
	Drawer.prototype.handleImgLoad = function(e){
		console.log(e.target);
		var data = e.target.result;
		var img = new Image();
		img.src = data;
		img.onload = function(){
			if( img.width <= this.max_canvas_width ){
    			this.canvas.width = img.width;
    			this.canvas.height = img.height;
    			this.ctx.drawImage(img,0,0,img.width,img.height);
		    }else{
		        alert("Image Exceeds Canvas Width of "+this.max_canvas_width+" px");    
		    }
		}.bind(this);
	}
	
	Drawer.prototype.init = function(){
		//set height and width dynamically
		var container_width = this.container.clientWidth;
		var toolbar = this.container.querySelector("ul");
		var toolbar_width = toolbar.clientWidth;
		var toolbar_height = toolbar.clientHeight;
        var calculated_width = (container_width - toolbar_width) - 1;
        var canvas_width = ( calculated_width <=  this.max_canvas_width )? calculated_width : this.max_canvas_width;
		this.max_canvas_width
		this.canvas.setAttribute("height", toolbar_height );
		this.canvas.setAttribute("width", canvas_width ); //-1 for 1px border
		
		//this.selectionContainer.style.height = canvas_height+"px";
		this.brushIndicator.style.backgroundColor = this.fillStyle; //brush indicaor to default color
		
		//brush follower
		this.canvas.addEventListener("mousemove", this.mouseFollowerEvent.bind(this), false );
		this.canvas.addEventListener("mouseover", this.mouseOverEvent.bind(this), false );
		this.canvas.addEventListener("mouseout", this.mouseOutEvent.bind(this), false );
		
		//set events for canvas and components 
		this.canvasMousedownName = this.mouseDownEvent.bind(this);  //put method name into name so it can be removed 
		this.canvasMouseMoveName = this.mouseMoveEvent.bind(this);
		this.canvasMouseUpName = this.mouseUpEvent.bind(this);
		this.canvas.addEventListener("mousedown", this.canvasMousedownName, false );
		this.canvas.addEventListener("mouseup", this.canvasMouseUpName, false );
		
		//set color picker change action 
		this.color_input.addEventListener("change", this.selectColor.bind(this), false );
		
		var mode_selectors = this.controlsContainer.querySelectorAll("i");
		for( var i = 0; i < mode_selectors.length; i++ ){
			mode_selectors[i].addEventListener("click", this.modeSelector.bind(this), false );
		}
		
		this.brushSizeRange.addEventListener("input", this.rangeSelectSize.bind(this), false );
		
		
		
		//drag drop funcs 
		this.dragDropBox.addEventListener("dragenter", function(e){console.log("enter");e.stopPropagation();e.preventDefault();}, false);
		this.dragDropBox.addEventListener("dragover", function(e){console.log("over");e.stopPropagation();e.preventDefault();}, false);
		this.dragDropBox.addEventListener("drop", this.handleDragDrop.bind(this), false);
	}
	
})(window);