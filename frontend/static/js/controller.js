'use strict'

var tweetController = angular.module('tweetController',[])

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}


tweetController.controller('appctrl', ['$scope','$state','$stateParams','$rootScope','$http','trendsData', function(a,state,stateParams,rootScope,$http,trendsData){

  a.all_trends = [];
  a.bundle = [];
  a.hashes = [];
  var querySelector = [];
  var queryParams = {};
  var str = '';

   trendsData.query().then(function (get_list) {

      for(var i=0;i<get_list.response.data[0].trends.length;i++){
        a.all_trends.push(get_list.response.data[0].trends[i])

      }

      for(var j=0;j<5;j++){
          a.hashes.push(a.all_trends[j].name)
       }


   },function (error){
            rootScope.api_error = true
            $("#success-alert-btn").fadeTo(5000, 500).slideUp(500);

    });


  a.getTrends = function() {

    for(var t=0;t<a.bundle.length;t++){

       str = str+'&'+ a.bundle[t].query
    }

    state.go("view.ids",{'ids': str});

  };
		
}])



tweetController.controller('viewctrl', ['$scope','$state','$stateParams','$rootScope', '$localStorage','$location','imagesData', function(a,state,stateParams,rootScope, localStorage,location,imagesData){

    var variant_urls = location.url().match(/view\/(\S+)/);
    a.allImages = [];
    a.allTweets = [];
    a.followers_count = [];
    a.hashtag = [];
    a.allData = [];
    a.all_source = []
    a.popoverIsVisible = false
    var source = '';
    var source_count = [];
    var unique_source = [];

    a._graph = true;
    a._images = false;
    var total_follow_count = 0

    var hash = variant_urls[1].split('&')
    hash.shift()


    for(var j=0;j<hash.length;j++){
      hash[j] = decodeURIComponent(hash[j])
    }

    var queryParams = {'trends': hash}

    imagesData.query(queryParams).then(function (resp) {

        console.log(resp.response.data);
        a.allData = resp.response.data;

        a.all_source =  _.map( resp.response.data, function(num){ 

          source = (num.source).match(/([\w\s\.]+)\</)

              if(source){ return source[1]}
              else{ return NaN }
        });

        unique_source = a.all_source.getUnique()

        for(var i=0;i<hash.length;i++){

          total_follow_count = 0 ;      

          for(var u=0;u<resp.response.data.length;u++){

                 a.allImages.push(resp.response.data[u].media_url);
                
                if( decodeURIComponent(hash[i]) == decodeURIComponent(decodeURIComponent(resp.response.data[u].hashtag))){
                    total_follow_count = total_follow_count+ resp.response.data[u].followers_count
                }
          }

          a.followers_count.push(total_follow_count)

        }

        for(var d=0;d<(unique_source).length;d++){

            var temp_list = []

            var count = a.all_source.reduce(function(n, val) {
                return n + (val === unique_source[d]);
            }, 0);

            source_count.push([unique_source[d], count]);
                  
        }   

        //console.log(source_count )

        pie_chart.load({
            columns: source_count
          });



        for(var j=0;j<hash.length;j++){
          a.hashtag.push( decodeURIComponent(decodeURIComponent(hash[j]) ))
        }

        a.allImages = a.allImages.getUnique();

         //console.log(a.hashtag, a.followers_count)

        a.hashtag.unshift('x')
        a.followers_count.unshift('Followers Count')

       

        chart.load({
            columns: [a.hashtag, a.followers_count ]
          });
        

       },function (error){
                rootScope.api_error = true
                $("#success-alert-btn").fadeTo(5000, 500).slideUp(500);

    });


     a.popover = function(){

      this.popoverIsVisible = true;
    }


    a.hidePopover = function () {
      this.popoverIsVisible = false;
    };


    a.switchStats = function(val){

        if(val == '_images'){
            a._images = true;
            a._graph = false;

        }
        else{
          a._images = false;
            a._graph = true;

            chart.load({
              columns: [a.hashtag, a.followers_count ]
            });

        }
    }
  
    if(a._images){

      var grid = document.querySelector('.grid');
        var msnry;

        imagesLoaded( grid, function() {
          // init Isotope after all images have loaded
          msnry = new Masonry( grid, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            percentPosition: true
          });
        });
    }



    var chart = c3.generate({
        data: {
            x : 'x',
            columns: [
                
            ],
            type: 'bar'
        },
        axis: {
            x: {
                type: 'category',
               
            }
        }
    });

    var pie_chart = c3.generate({

        bindto: '#chart1',

        data: {
            
            columns: [   ],
            type : 'pie',
           
        }
    });


    


    	

}])




