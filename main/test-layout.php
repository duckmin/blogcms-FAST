<!DOCTYPE html>
<html>
	<head>
	<style type="text/css">
	   ul {
	       list-style-type: none;
	       width:50%;
	   }
	   
	   li {
	       display:inline-block;
	       width:50%;
	       vertical-align: top;
	   }
	   
	   ul li div {
	       background-color: orange;
	       height:200px;
	       
	   }
	           
	           
	</style>
	</head>
	<body>
		<ul>
		    <li>
                <div style="height:200px;background-color:red" ></div>
		        <div style="height:300px;background-color:orange" ></div>
		    </li><!--
		    --><li>
		        <div style="height:150px;background-color:blue" ></div>
		        <div style="height:250px;background-color:green" ></div>
		    </li>
		</ul>
		
		<?php
		    $root_dir = dirname(__FILE__)."/../";
	        include_once $root_dir."/server/configs.php";
            $a = array( "doe", "rey", "mi", "so" );
            $tmplt = "<ul><li>{{ 0 }}</li><li>{{ 1 }}</li><li>{{ 2 }}</li><li>{{ 3 }}</li></ul>";		
		    $bnd = TemplateBinder::bindTemplate( $tmplt, $a );
		    echo $bnd;
		?>
	</body>
</html>