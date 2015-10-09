	window.Drawer = function( canvas_box ){
		this.max_KB_img_upload = 200;
		this.max_canvas_width = 600;
		this.container = canvas_box;
		this.canvas = canvas_box.querySelector("canvas");
		this.selectionContainer = canvas_box.querySelector("ul.selections");
		this.bottomBar = canvas_box.querySelector("ul.bottom-bar");
		this.colorDivsContainer = this.selectionContainer.querySelector("li.colors");
		this.controlsContainer = this.selectionContainer.querySelector("li.controls");
		this.brush_marker = canvas_box.querySelector("div.brush-marker");
		this.text_marker = canvas_box.querySelector("input.text-marker");
		this.brushIndicator = this.colorDivsContainer.querySelector("div.color");
		this.brushSizeRange = this.colorDivsContainer.querySelector("input[type='range'].brush-size");
		this.textSizeRange = this.controlsContainer.querySelector("input[type='range'].font-size");
		this.textSizeIndicator = this.controlsContainer.querySelector("p.text-style");
		this.color_input = this.colorDivsContainer.querySelector("input[type='color']");
		this.ctx = this.canvas.getContext("2d");
		this.fillStyle = this.color_input.value;
		this.strokeWidth = this.brushSizeRange.min; //default brush size 
		this.pencil_size = 1; //pencil is non adjustable fixed thin width 
		this.currX = 0;
		this.currY = 0;
		this.prevX = 0;
		this.prevY = 0;
		this.textFontSize = this.textSizeRange.min;
		this.colorHistory = [];
		this.brush_mode = "brush";  //pencil, brush, eraser, spray 
		this.dragDropBox = this.bottomBar.querySelector("li > div.drop-area");
	}
	
	Drawer.prototype.getRealCanvasCoords = function(e){  //x y coords of mouse on canvas
		var coordinates = {};
		coordinates.x = (window.pageXOffset + e.clientX) - ( this.container.offsetLeft + this.canvas.offsetLeft);
		coordinates.y = (window.pageYOffset + e.clientY) - (this.container.offsetTop + this.canvas.offsetTop);
		return coordinates;
	} 	
	
	Drawer.prototype.mouseDownEvent = function(e){
		e.currentTarget.setCapture();
		var coords = this.getRealCanvasCoords(e);
		this.prevX = this.currX;
		this.prevY = this.currY;
		this.currX = coords.x;
		this.currY = coords.y;	
		
		//bind mouse move listener
		if( this.brush_mode !== "text" ){
			var draw_modes = ["eraser","spray"];
			if( draw_modes.indexOf(this.brush_mode) >= 0 ){ 
			    this.drawCoords(); 
			}else{
			    this.drawCircle();  
			}
			this.canvas.addEventListener("mousemove", this.canvasMouseMoveName, false );
		}
	}
	
	Drawer.prototype.mouseUpEvent = function(e){
		e.currentTarget.releaseCapture();
		this.canvas.removeEventListener("mousemove", this.canvasMouseMoveName, false );
	}
	
	Drawer.prototype.mouseMoveEvent = function(e){
		var coords = this.getRealCanvasCoords(e);
		this.prevX = this.currX;
		this.prevY = this.currY;
		this.currX = coords.x;
		this.currY = coords.y;	
		this.drawCoords();
	}
	
	Drawer.prototype.mouseFollowerEvent = function(e){
		var coords = this.getRealCanvasCoords(e),
		half_stroke = this.strokeWidth/2,
		half_font = this.textFontSize/2,
		x = ( coords.x - half_stroke ) + this.canvas.offsetLeft,
		y = ( coords.y - half_stroke ) + this.canvas.offsetTop;
		this.brush_marker.style.top = y+"px";
		this.brush_marker.style.left = x+"px";
		this.text_marker.style.top = ((coords.y + this.canvas.offsetTop) - half_font )+"px";
		this.text_marker.style.left = (coords.x + this.canvas.offsetLeft)+"px";		
	}
	
	Drawer.prototype.mouseOverEvent = function(e){
		if( this.brush_mode !== "text" ){ 
			this.brush_marker.style.display = "block"; 
		}else{
			this.text_marker.style.display = "block"; 
			this.text_marker.focus();
		}
	}
	
	Drawer.prototype.mouseOutEvent = function(e){
		e.currentTarget.releaseCapture();
		var brush_marker_style = this.brush_marker.style,
		text_marker_style = this.text_marker.style;
		if( brush_marker_style.display === "block" ){ brush_marker_style.display = "none"; }
		if( text_marker_style.display === "block" ){ text_marker_style.display = "none"; }
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
	
	Drawer.prototype.changeBrushUIColor = function(color){
		this.brushIndicator.style.backgroundColor = color;
		this.brush_marker.style.backgroundColor = color;
		this.text_marker.style.color = color;
		this.textSizeIndicator.style.color = color;
	}
	
	Drawer.prototype.modeSelectAction = function(e){
		var target = e.currentTarget,
		current_selection = this.controlsContainer.querySelector("i.selected");
		mode = target.getAttribute("data-brushmode");
		current_selection.className = current_selection.className.replace("selected", "");
		target.className+=" selected";
		this.modeSelector(mode);
	}
	
	Drawer.prototype.setCtxColor = function(){ //call after setting this.fillStyle,  binds to ctx fill or stroke Style	
		var context = this.ctx,
		is_line = ( this.brush_mode === "pencil" || this.brush_mode === "brush" )? true : false,
		has_shadow = ( this.brush_mode === "brush" || this.brush_mode === "spray" )? true : false;
		if( is_line ){
		    context.strokeStyle = this.fillStyle;
  			context.lineJoin = "round";
			context.lineCap = "round";
		}else{
		   context.fillStyle= this.fillStyle; 
		}
		
		if( !has_shadow ){
		    context.shadowBlur = 0;
  			context.shadowColor = "rgba(0,0,0,0)";
		}else{
		    var shadow_val = (this.brush_mode === "spray")? 5 : 2;
		    context.shadowBlur = shadow_val;
  			context.shadowColor = this.fillStyle;   
		}
	}
	
	Drawer.prototype.modeSelector = function(mode){		
		this.brush_mode = mode;
		var brush_size_value = this.brushSizeRange.value;
		this.setCtxColor();
		if( this.brush_mode !== "eraser" ){
			this.changeBrushUIColor(this.color_input.value);
			this.brushIndicator.style.border = "none";  //take border off might be comming from eraser mode 
			this.brush_marker.style.border = "none";
		}
		
		if( this.brush_mode === "text" ){
			this.canvas.addEventListener("mousedown", this.addTextMouseDownAction, false );
		}else{
			this.canvas.removeEventListener("mousedown", this.addTextMouseDownAction, false );
		}
		
		switch( this.brush_mode ){
			case "pencil":
				this.brushSizeRange.disabled = true; //freeze pencil width;
				this.changeBrushSize (this.pencil_size+1);  //make marker a little bigger when in pencil mode so it can be seen easier
				this.strokeWidth = this.pencil_size;
				break;
							    
			case "spray":
	    	case "brush":
			   this.brushSizeRange.disabled = false;
			   this.changeBrushSize (brush_size_value);
			   this.strokeWidth = brush_size_value;
		  		break;
		  			
		  	case "eraser":
		  		console.log('eraser block');
		  	   this.strokeWidth = brush_size_value;
		  	   this.brushSizeRange.disabled = false;
		  	   this.changeBrushSize (brush_size_value);
		  	   this.brush_marker.style.borderRadius = "0";
		  	   this.brushIndicator.style.borderRadius = "0";
		  	   this.changeBrushUIColor( "white" );
		  	   this.brushIndicator.style.border = "1px solid black";
		  	   this.brush_marker.style.border = "1px solid black";
			   break;
			   
			case "text":
		  		this.brushSizeRange.disabled = true;
		  		this.changeBrushSize (brush_size_value);
		  		
			   break;
		}
	}
	
	Drawer.prototype.addText = function(e) {
		var text = this.text_marker.value;
		this.ctx.fillStyle= this.fillStyle;
		this.ctx.font=this.textFontSize+"px Helvetica";
		var y = this.currY + (this.textFontSize/2);
		this.ctx.fillText(text, this.currX, y );
		this.text_marker.value = "";
		setTimeout(function(){
			this.text_marker.focus();
		}.bind(this),10);
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
		
		switch( this.brush_mode ){
			
			case "pencil":
				context.beginPath();
			   context.moveTo(this.prevX, this.prevY);
			   context.lineTo(this.currX, this.currY);
			   context.lineWidth = this.pencil_size;  
			   context.stroke();
			   context.closePath();
			   break;
	    	
	    	case "brush":
	    		context.beginPath();
			   context.moveTo(this.prevX, this.prevY);
			   context.lineTo(this.currX, this.currY);
			   context.lineWidth = this.strokeWidth;  
			   context.stroke();
			   context.closePath();
		  		break;
		  		
		  	case "spray":
				//context.fillStyle= this.fillStyle;
				for (var i = 0; i < stroke_width; i++) {
					var offset = this.getRandomOffset(half_width);
            	var x = this.currX + offset.x; 
            	var y = this.currY + offset.y;  
            	context.fillRect(x, y, 1, 1);
            }
		  		break;
		  		
		  	case "eraser":
				//context.fillStyle= this.fillStyle;
				var rect_x = this.currX - half_width;
				var rect_y = this.currY - half_width;
		  		context.clearRect(rect_x, rect_y, stroke_width, stroke_width );
		  		break;
	    }	
	}
	
	Drawer.prototype.addColorToHistory = function(color){
		this.colorHistory.push(color);
		if( this.colorHistory.length > 10 ){
			this.colorHistory.shift(); //max 10 colors 
		}
		
		var frag = document.createDocumentFragment(),
		color_history_li = this.bottomBar.querySelector("li.color-history");
		this.colorHistory.forEach(function(color){
			var div = document.createElement("div");
			div.setAttribute("data-color", color );
			div.style.backgroundColor = color;
			frag.appendChild(div);
			div.addEventListener("click", function(e){
				if( this.brush_mode !== "eraser" ){  //if in eraser mode ignore clicks 
					var bg = e.currentTarget.getAttribute("data-color");
					this.fillStyle = bg;
					this.setCtxColor();
					this.color_input.value = bg;
					this.changeBrushUIColor( bg );
				}		
			}.bind(this), false );
		}.bind(this));
		color_history_li.innerHTML = ""; //clear previous
		color_history_li.appendChild(frag);
	}
	
	Drawer.prototype.selectColor = function(e){
		var target = e.currentTarget,
		selected_color = target.value;
		this.addColorToHistory(selected_color);
		this.fillStyle = selected_color;
		this.setCtxColor();
		if( this.brush_mode !== "eraser" ){
			this.changeBrushUIColor( selected_color );
		}
	}
	
	Drawer.prototype.rangeSelectSize = function(e){
		var target = e.currentTarget,
		range_value = target.value;
		this.strokeWidth = range_value;
		this.changeBrushSize (range_value);
	}
	
	Drawer.prototype.changeUITextFontSize = function(size){
		this.textSizeIndicator.innerHTML = size+"px";
		this.text_marker.style.fontSize = size+"px";
	}
	
	Drawer.prototype.rangeSelectFontSize = function(e){
		var target = e.currentTarget,
		range_value = target.value;
		this.textFontSize = range_value;
		this.changeUITextFontSize(range_value);
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
           
            if(img.width > this.max_canvas_width){  //resize image to canvas size using ratio forumla
                var ratio = img.width/img.height,
                resized_height = this.max_canvas_width/ratio;		
    			resized_height = Math.ceil(resized_height * 10) / 10;
    			img.width = this.max_canvas_width;
    			img.height = resized_height;
		    }

			this.canvas.width = img.width;
			this.canvas.height = img.height;
			this.ctx.drawImage(img,0,0,img.width,img.height);
			this.modeSelector(this.brush_mode); //reset mode after drawing image, or else color is black 		   
		}.bind(this);
	}
	
	Drawer.prototype.init = function(){
		//set height and width dynamically
		var container_width = this.container.clientWidth;
		var toolbar = this.container.querySelector("ul");
		var toolbar_width = toolbar.clientWidth;
		var toolbar_height = toolbar.clientHeight;
        var calculated_width = (container_width - toolbar_width); 
        var canvas_width = ( calculated_width <=  this.max_canvas_width )? calculated_width : this.max_canvas_width;
		this.canvas.setAttribute("height", toolbar_height );
		this.canvas.setAttribute("width", canvas_width - 3 );  //3 px extra width from borders  
		this.bottomBar.style.width = ( canvas_width + toolbar_width )+"px";  //-1 to align borders 
		
		this.modeSelector(this.brush_mode);
		this.addColorToHistory(this.fillStyle);
		this.brushSizeRange.value = this.strokeWidth; //sets to min value of range onload
		this.textSizeRange.value = this.textFontSize;
		this.changeUITextFontSize(this.textFontSize); //sets to min value of range onload
		
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
		
		this.addTextMouseDownAction = this.addText.bind(this); //create now so we can bind on mouse down when in text mode
		
		//set color picker change action 
		this.color_input.addEventListener("change", this.selectColor.bind(this), false );
		
		var mode_selectors = this.controlsContainer.querySelectorAll("i");
		for( var i = 0; i < mode_selectors.length; i++ ){
			mode_selectors[i].addEventListener("click", this.modeSelectAction.bind(this), false );
		}
		
		this.brushSizeRange.addEventListener("input", this.rangeSelectSize.bind(this), false );
		this.textSizeRange.addEventListener("input", this.rangeSelectFontSize.bind(this), false );

		//drag drop funcs 
		this.dragDropBox.addEventListener("dragenter", function(e){console.log("enter");e.stopPropagation();e.preventDefault();}, false);
		this.dragDropBox.addEventListener("dragover", function(e){console.log("over");e.stopPropagation();e.preventDefault();}, false);
		this.dragDropBox.addEventListener("drop", this.handleDragDrop.bind(this), false);
		console.log("top="+this.canvas.offsetTop+" left="+this.canvas.offsetLeft);
	}
	