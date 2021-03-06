/**
 * @author Samsung
 */

var Controller = {
    arrayArticles: null,
    categoryData: [],
    categoryName : [],
    categoryURL : [],
    mobileArr : new Array(3)
    
}

Controller.initialize = function (categories) {
    for(var i=0; i<categories.length; i++) {
      this.categoryData.push(categories[i]);
    }

}

Controller.mobileStart=function(category, idx, userIdx)
{
   Controller.ParseForMobileXML(category.url, idx, userIdx);
}
Controller.start = function (category) {
    alert("Controller.start()");
    sf.scene.show('Main');
    Controller.ParseXML(category.url);
}

Controller.ParseForMobileXML=function(categoryurl, idx, userIdx)
{
 alert("Controller.XMLParsing()");         
    var count = 0;  
    var _THIS_ = this;
    this.mobileIdx = idx;
   this.mobileArr[idx] = [];
    $.ajax({
        type: "get"
        ,dataType: "xml"
        ,url: categoryurl
        ,success: function(xml){
            if($(xml).find("item").length > 0){ // null check
                $(xml).find("item").each(function(){ // loop
                    var t_title = $(this).find("title").text();
                    var t_description = $(this).find("description").text();              
                    var oArticle = {};
                    oArticle.title = t_title;
                    oArticle.description = t_description;         
                     _THIS_.mobileArr[_THIS_.mobileIdx].push(oArticle);
                    
                        });
                            iRemoteNews.sendCategoryData(_THIS_.mobileArr[_THIS_.mobileIdx], idx, userIdx);
                          }
        }
        ,error: function(err){ alert("xml error!!"); alert(err); }
    });
}


Controller.ParseXML = function (categoryurl) {
    alert("Controller.XMLParsing()");
    this.arrayArticles = [];        
          
    var count = 0;  
    var _THIS_ = this;
   
    $.ajax({
        type: "get"
        ,dataType: "xml"
        ,url: categoryurl
        ,success: function(xml){
            if($(xml).find("item").length > 0){ // null check
                $(xml).find("item").each(function(){ // loop
                    var t_title = $(this).find("title").text();
                    var t_description = $(this).find("description").text();
                    
                    var oArticle = {};
                    oArticle.title = t_title;
                    oArticle.description = t_description;
            
                    _THIS_.arrayArticles.push(oArticle);                          
                });      
                
                sf.scene.get('Main').initMainpage(_THIS_.arrayArticles);   
                sf.scene.focus('Main');
            }
        }
        ,error: function(){ alert("xml error!!"); }
    });

}

Controller.showContents = function (articleindex) {
    sf.scene.show('Contents', {index: articleindex, array: this.arrayArticles});    // pass the index of articles and array contains article data.
    sf.scene.focus('Contents');
}



Controller.showMain = function (articleindex) {
    sf.scene.show('Main', {Index: articleindex});        
    sf.scene.focus('Main');
}

