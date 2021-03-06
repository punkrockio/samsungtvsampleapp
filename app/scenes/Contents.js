alert('SceneContents.js loaded');

function SceneContents() {
    this.articleTitle = null;
    this.articleDescription = null;
    this.contentsFrame = null;
    this.contentsIdx; 
    this.arrArticles = []; 
    
    // Date
    this.nowDate = new Date();
    this.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    // Scroll
    this.scroll = null;
    this.pages = 0;
    this.scrollSize = 60;
    
    // Image Loading..
    this.preloadImages = [];
    this.preloadImages.push(new Image());
    this.preloadImages[this.preloadImages.length-1].src = "images/newsImg/two_frame_bg.png";
}


SceneContents.prototype.initialize = function () {
	alert("SceneContents.initialize()");
	// this function will be called only once when the scene manager show this scene first time
	// initialize the scene controls and styles, and initialize your variables here 
	// scene HTML and CSS will be loaded before this function is called
    
    // document
    this.articleTitle = document.getElementById("ContentsTitle");
    this.articleDescription = document.getElementById("ContentsDescription");
    this.contentsFrame = document.getElementById("ContentsFrame"); 
   
    // Date
    var contentsDate = document.getElementById("ContentsDate");

    var date = this.month[this.nowDate.getMonth()];
    date += "  ";
    date += this.nowDate.getDate();
    date += ",  ";
    date += this.nowDate.getFullYear(); 
    contentsDate.innerHTML = date;
   
    // scroll
    this.scroll = document.getElementById("ContentsScroll");  
    $('#ContentsScroll').sfScroll({
        pages: this.pages
    });  
    
    // Key Help
    $('#Contentskeyhelp').sfKeyHelp({
		'iconSet' : 'WHITE',
        'leftright' : 'prev/next',
		'return': 'Return'
	});
}

SceneContents.prototype.handleShow = function (data) {
	alert("SceneContents.handleShow()");
	// this function will be called when the scene manager show this scene 
    iRemoteNews.tvState = "Detail";
    this.contentsIdx = data.index;
    this.arrArticles = data.array;  
 
 	// scroll 
    $('#ContentsScroll').sfScroll({
        pages: this.pages
    }); 
    
    this.showContents(this.contentsIdx);     
    
    for(var i=0; i<iRemoteNews.userID.length; i++){
        if(iRemoteNews.userID[i].state == "Detail"){
            var scene = sf.scene.get("Main");
            if(scene.categoryIdx ==  iRemoteNews.userID[i].catId && this.contentsIdx ==  iRemoteNews.userID[i].newsId){
                 iRemoteNews.userID[i].watch = false;
                var indexCat = iRemoteNews.userID[i].catId;
                var indexTitle = iRemoteNews.userID[i].newsId;
                iRemoteNews.titleDetail(Controller.mobileArr[indexCat][indexTitle], iRemoteNews.userID[i].id);
            }
        }
    }
}

SceneContents.prototype.showContents = function (index) {     
    alert("SceneContents.showContents()");
    
    // title
    this.articleTitle.innerHTML = this.arrArticles[index].title;
    
    // Description
    $('#ContentsDescription').css("top", 0);
    this.articleDescription.innerHTML = this.arrArticles[index].description;
    this.adjustScrollBar();
}

SceneContents.prototype.adjustScrollBar = function () {
    alert("SceneContents.adjustScrollBar()");
    var articleLength = this.articleDescription.scrollHeight;
    var frameLength = this.contentsFrame.offsetHeight;
    this.pages = Math.ceil(((articleLength - frameLength) / this.scrollSize) + 1);
    alert("this.pages == "+this.pages+" articleLength == "+articleLength+" frameLength == "+frameLength);
    if(this.pages < 0) {
    	this.pages = 0;
    }
    
    if(this.pages <= 1) {
    	this.hideScrollBar();
    }
    else {
    	this.showScrollBar();
    }    	    
}

SceneContents.prototype.showScrollBar = function () {
    alert("SceneContents.showScrollBar()");
    $('#ContentsScroll').sfScroll({
        pages: this.pages
    });
    $('#ContentsScroll').sfScroll('move', 0);
    $('#ContentsScroll').sfScroll('show');
}

SceneContents.prototype.hideScrollBar = function () {
    alert("SceneContents.hideScrollBar()");
    $('#ContentsScroll').sfScroll('hide');
}
   
SceneContents.prototype.handleHide = function () {
	alert("SceneContents.handleHide()");
	// this function will be called when the scene manager hide this scene  
}

SceneContents.prototype.handleFocus = function () {
	alert("SceneContents.handleFocus()");
	// this function will be called when the scene manager focus this scene
}

SceneContents.prototype.handleBlur = function () {
	alert("SceneContents.handleBlur()");
	// this function will be called when the scene manager move focus to another scene from this scene
}

SceneContents.prototype.handleKeyDown = function (keyCode) {
	alert("SceneContents.handleKeyDown(" + keyCode + ")");
	// TODO : write an key event handler when this scene get focued
	switch (keyCode) {
		case sf.key.LEFT:
			$('#ContentsScroll').sfScroll('move', 0);
            this.contentsIdx--;
            if (this.contentsIdx < 0) {
                this.contentsIdx = this.arrArticles.length - 1;
            }
            this.showContents(this.contentsIdx);
            for(var i=0; i<iRemoteNews.userID.length; i++){
            if(iRemoteNews.userID[i].state == "Detail"){
                if(!iRemoteNews.userID[i].watch){
                    iRemoteNews.userID[i].watch = true;
                    var indexCat = iRemoteNews.userID[i].catId;
                    var indexTitle = iRemoteNews.userID[i].newsId;
                    iRemoteNews.titleDetail(Controller.mobileArr[indexCat][indexTitle], iRemoteNews.userID[i].id);
                }
                var scene = sf.scene.get("Main");
                if(scene.categoryIdx ==  iRemoteNews.userID[i].catId && this.contentsIdx ==  iRemoteNews.userID[i].newsId){
                     iRemoteNews.userID[i].watch = false;
                    var indexCat = iRemoteNews.userID[i].catId;
                    var indexTitle = iRemoteNews.userID[i].newsId;
                    iRemoteNews.titleDetail(Controller.mobileArr[indexCat][indexTitle], iRemoteNews.userID[i].id);
                }
            }
            }
			break;
		case sf.key.RIGHT:
			$('#ContentsScroll').sfScroll('move', 0);
            this.contentsIdx++;
            if(this.contentsIdx > this.arrArticles.length - 1) {
                this.contentsIdx = 0;
            }
            this.showContents(this.contentsIdx);
            for(var i=0; i<iRemoteNews.userID.length; i++){
            if(iRemoteNews.userID[i].state == "Detail"){
                if(!iRemoteNews.userID[i].watch){
                    iRemoteNews.userID[i].watch = true;
                    var indexCat = iRemoteNews.userID[i].catId;
                    var indexTitle = iRemoteNews.userID[i].newsId;
                    iRemoteNews.titleDetail(Controller.mobileArr[indexCat][indexTitle], iRemoteNews.userID[i].id);
                }
                var scene = sf.scene.get("Main");               
                if(scene.categoryIdx ==  iRemoteNews.userID[i].catId && this.contentsIdx ==  iRemoteNews.userID[i].newsId){
                     iRemoteNews.userID[i].watch = false;
                    var indexCat = iRemoteNews.userID[i].catId;
                    var indexTitle = iRemoteNews.userID[i].newsId;
                    iRemoteNews.titleDetail(Controller.mobileArr[indexCat][indexTitle], iRemoteNews.userID[i].id);
                }
            }
            }
			break;
		case sf.key.UP:
            var DesPosition = $('#ContentsDescription').position().top;
            if(DesPosition < 0) {
                $('#ContentsDescription').css("top", DesPosition+this.scrollSize);
                $('#ContentsScroll').sfScroll('prev');
            }
			break;
		case sf.key.DOWN:
            var DesPosition = $('#ContentsDescription').position().top;
            if(this.articleDescription.scrollHeight-this.contentsFrame.offsetHeight > DesPosition*(-1)) {  
                $('#ContentsDescription').css("top", DesPosition-this.scrollSize);
              	$('#ContentsScroll').sfScroll('next');
            }
			break;
		case sf.key.ENTER:
        case sf.key.RETURN:
            sf.scene.hide('Contents');
            Controller.showMain(this.contentsIdx);
            var scene=sf.scene.get('Main');
    
            for(var i=0; i<iRemoteNews.userID.length; i++){
                if(!iRemoteNews.userID[i].watch && iRemoteNews.userID[i].state == "Detail"){
                    iRemoteNews.userID[i].watch = true;
                    var indexCat = iRemoteNews.userID[i].catId;
                    var indexTitle = iRemoteNews.userID[i].newsId;
                    iRemoteNews.titleDetail(Controller.mobileArr[indexCat][indexTitle], iRemoteNews.userID[i].id);
                }
            }
            sf.key.preventDefault();    // Block default action of the RETURN key. Without this line, this application exits to Smart Hub.
            break;
	}
}