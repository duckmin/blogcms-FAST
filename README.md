#blogcms-Fast
BlogCms is fully responsive, and searchable, and **FAST**.
BlogCms is an appication that revolves around an authenticated UI interface that is used to build individual postings under defined categories.  The UI is very easy to use, from the manager you can 
- create postings with any combination of images, embedded videos, audio files, and markdown
- upload jpg,png,gif images
- upload mp3 audio files
- dynamically add uploaded resoures to a post template
- create a blog post using Markdown, making for unlimted possibilities of content and css styles
- edit/delete/change categories of created posts
- view analytic data graphs of your sites traffic

##Getting Started
- Install apache, php, mongo db
- php must have "Mongo" module
- Clone project into folder
- change your apache conf documentroot to be the "<path_to_blogcms>/main" ( same directory of index.php ) folder of the project 
- this application routes all urls through "index.php" file using apaches mod rewrite rules. Your vhost container should **atleast** have the following rules. 
``` 
<VirtualHost *:80>
    ServerName www.blog.local
    DocumentRoot <path_to_blogcms>/main
		
    <Directory "<path_to_blogcms>/main">
        RewriteEngine On
	RewriteBase /
	RewriteCond %{REQUEST_FILENAME} !-f
	RewriteCond %{REQUEST_FILENAME} !-d
	RewriteRule ^(.*)$ index.php
			   
	Options -Indexes +FollowSymLinks
	AllowOverride None
	Order allow,deny
	Allow from all
    </Directory>
</VirtualHost>
```
- in blogcms/server/configs.php you will find many configuration settings most are obvious as to what they are and can be changed easily 
**except** categories
- set the /blogcms/server/include/categories.json array to the categories you wish to start making postings under ( do not put spaces in category name ) **if you wish to edit a category name or remove a category read the warning in the 'things to note' section before doing so**
- In the /blogcms/server/includes/logins.json file set a user name and password used to enter the manager.php page ( use same format as examples ) **ATM json property "level" is not used leave at 1**
- run both commands in the /blogcms/mongo_instructions.txt one to put search indexs on the correct fields, the other to put on index on the main date field for faster pagination
- Navigate to { host }/manager in your browser and log in with credentials
-  Start creating posts!  

##Things to note
- make sure permissions on the /blogcms/main/pics/ folder and sub folders give full permissions to the user server is running as
- until a category created in the "/blogcms/server/include/categories.json" file has any posts that belong to it the category will bring up an error page.  this is expected, create a post in the category for the error not to show
- if you remove a category in the "/blogcms/server/include/categories.json" file and there are posts associated with that category in Mongo they will not show up on any page,  use the "Posts" tab on the manager page to change the category of any posts belonging the the category you intend to delete first
- if you "edit" a post form the "Posts" tab on the manager page, and wish to cancel an edit.  You must click cancel from the "Template" tab, this will exit edit mode, and allow you to start creating new posts again ( editing a post and then saving the edit will also make you exit edit mode ).  
- If you wish to change the look and feel of the blog /blogcms/main/style/blog.css if where all the style for the main page is located and can be changed carefully
- most HTML used to construct pages is located in /blogcms/server/templates/ these can be edited with care to add classes or extra content
- On manager console, just click around on every icon and read the messages to find out what they do!
