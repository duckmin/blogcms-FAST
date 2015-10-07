(function(window){
	
	
	window.Drawer = function( canvas_box ){
		this.canvas = canvas_box.querySelector("canvas");
		this.selectionContainer = canvas_box.querySelector("ul.selections");
		this.colorDivsContainer = canvas_box.querySelector("li.colors");
		this.controlsContainer = canvas_box.querySelector("li.controls");
		this.brush_marker = canvas_box.querySelector("div.brush-marker");
		this.brushIndicator = this.controlsContainer.querySelector("div.color");
		this.toggleCheckbox = this.controlsContainer.querySelector("input[name='brush-toggle']");
		this.ctx = this.canvas.getContext("2d");
		var default_color = this.colorDivsContainer.firstElementChild.style.backgroundColor;
		this.fillStyle = default_color;
		this.brush_marker.style.backgroundColor = default_color;
		this.strokeWidth = 10; //default brush size 
		this.currX = 0;
		this.currY = 0;
		this.prevX = 0;
		this.prevY = 0;
		this.brush_mode = "pencil";  //pencil, brush, eraser 
	}
	
	Drawer.prototype.mouseDownEvent = function(e){
		e.currentTarget.setCapture();
		this.prevX = this.currX;
		this.prevY = this.currY;
		this.currX = e.clientX - this.canvas.offsetLeft;
		this.currY = e.clientY - this.canvas.offsetTop;	
		//bind mouse move listener
		if( this.brush_mode === "brush" || this.brush_mode === "eraser" ){ this.drawCoords(); }
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
		this.brush_marker.style.top = (y - this.strokeWidth )+"px";
		this.brush_marker.style.left = (x - this.strokeWidth )+"px";
	}
	
	Drawer.prototype.mouseOverEvent = function(e){
		if( this.brush_mode === "brush" || this.brush_mode === "eraser" ){
			this.brush_marker.style.display = "block";
		}
	}
	
	Drawer.prototype.mouseOutEvent = function(e){
		e.currentTarget.releaseCapture();
		var brush_marker_style = this.brush_marker.style;
		if( brush_marker_style.display === "block" ){ brush_marker_style.display = "none"; }
		this.canvas.removeEventListener("mousemove", this.canvasMouseMoveName, false );
	}
	
	Drawer.prototype.modeSelector = function(e){
		var target = e.currentTarget,
		current_selection = this.controlsContainer.querySelector("i.selected");
		current_selection.className = current_selection.className.replace("selected", "");
		target.className+=" selected";
		this.brush_mode = target.getAttribute("data-brushmode");
		
		switch( this.brush_mode ){
		    case "pencil":
				this.toggleCheckbox.checked = false;
			    break;
	    	
	    	case "brush":
			    var selected_color = this.colorDivsContainer.querySelector("div.selected").style.backgroundColor;
			    this.toggleCheckbox.checked = true;
			    var brush_size_value = this.brushIndicator.previousElementSibling.value+"px";
			    this.brush_marker.style.borderRadius = brush_size_value;
			    this.brushIndicator.style.borderRadius = brush_size_value;
			    this.brushIndicator.style.backgroundColor = selected_color;
			    this.brush_marker.style.backgroundColor = selected_color;
			    this.brushIndicator.style.border = "none";
		  	    this.brush_marker.style.border = "none";
		  		break;
		  	case "eraser":
		  	    this.toggleCheckbox.checked = true;
		  	    this.brush_marker.style.borderRadius = "0";
		  	    this.brushIndicator.style.borderRadius = "0";
		  	    this.brushIndicator.style.backgroundColor = "white";
		  	    this.brush_marker.style.backgroundColor = "white";
		  	    this.brushIndicator.style.border = "2px solid black";
		  	    this.brush_marker.style.border = "2px solid black";
			    break;
		}
	}
	
	Drawer.prototype.drawCoords = function(){
		switch( this.brush_mode ){
			case "pencil":
				this.ctx.beginPath();
			    this.ctx.moveTo(this.prevX, this.prevY);
			    this.ctx.lineTo(this.currX, this.currY);
			    this.ctx.strokeStyle = this.fillStyle;
			    this.ctx.lineWidth = 2;  //more then 2 and lines look like crap 
			    this.ctx.lineJoin = "round";
			    this.ctx.stroke();
			    this.ctx.closePath();
			    break;
	    	
	    	case "brush":
			    var context = this.ctx;
				context.fillStyle= this.fillStyle;
				var stroke_width = this.strokeWidth;
				var half_width = stroke_width/2;
				var rect_x = this.currX - half_width;
				var rect_y = this.currY - half_width;
		  		context.beginPath();
		  		context.arc(rect_x, rect_y, half_width, 0, 2 * Math.PI, false);
		  		context.fill();
		  		context.closePath();
		  		break;
		  	case "eraser":
			    console.log('erase');
			    var context = this.ctx;
				context.fillStyle= this.fillStyle;
				var stroke_width = this.strokeWidth;
				var half_width = stroke_width/2;
				var rect_x = this.currX - stroke_width;
				var rect_y = this.currY - stroke_width;
		  		context.clearRect(rect_x, rect_y, stroke_width, stroke_width );
		  		break;
	    }	
	}
	
	Drawer.prototype.selectColor = function(e){
		var target = e.currentTarget,
		selected = this.colorDivsContainer.querySelector("div.selected"),
		selected_color = target.style.backgroundColor;
		selected.className = "";  //revmoce class of currently selected
		target.className = "selected";
		this.fillStyle = selected_color;
		
		if( this.brush_mode === "brush" ){
            this.brushIndicator.style.backgroundColor = selected_color;
		    this.brush_marker.style.backgroundColor = selected_color;
	    }
	}
	
	Drawer.prototype.rangeSelectSize = function(e){
		var target = e.currentTarget,
		range_value = target.value,
		color_div = target.nextElementSibling,
		color_div_style = color_div.style;
		this.strokeWidth = range_value;  //change size of drawing pencil 
		color_div_style.width = ( range_value )+"px";
		color_div_style.height = ( range_value )+"px";
		
		//add styles to brush marker
		this.brush_marker.style.width = ( range_value )+"px";
		this.brush_marker.style.height = ( range_value )+"px";
		
		if( this.brush_mode === "brush"){  //only style radius if brush mode
            this.brush_marker.style.borderRadius = ( range_value )+"px";
            color_div_style.borderRadius = ( range_value )+"px";
	    }
	}
	
	Drawer.prototype.init = function(){
		//set height and width dynamically
		var canvas_height = this.canvas.clientHeight;
		var canvas_width = this.canvas.clientWidth;
		this.canvas.setAttribute("height", canvas_height );
		this.canvas.setAttribute("width", canvas_width );
		this.selectionContainer.style.height = canvas_height+"px";
		this.brushIndicator.style.backgroundColor = this.fillStyle; //brush indicaor to default color
		this.toggleCheckbox.checked = false; //pencil is the default hide brush indicator 
		
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
		
		var color_divs = this.colorDivsContainer.querySelectorAll("div");
		for( var i = 0; i < color_divs.length; i++ ){
			color_divs[i].addEventListener("click", this.selectColor.bind(this), false );
		} 
		
		var mode_selectors = this.controlsContainer.querySelectorAll("i");
		for( var i = 0; i < mode_selectors.length; i++ ){
			mode_selectors[i].addEventListener("click", this.modeSelector.bind(this), false );
		}
		
		var range = this.controlsContainer.querySelector("input[type='range']");
		range.addEventListener("input", this.rangeSelectSize.bind(this), false );
	}
})(window);