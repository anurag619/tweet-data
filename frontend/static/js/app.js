
var tweet = angular.module('tweet', [
	'angular-loading-bar' ,
	'ui.router',
	'ngAnimate',
	'tweetController',
	'tweetServices',
	'ngStorage',
	'ngDialog',
	'oi.select']);

tweet.config(function($stateProvider, $urlRouterProvider,$httpProvider,$urlRouterProvider,$locationProvider,$sceProvider,cfpLoadingBarProvider){
		

	$sceProvider.enabled(false);

	//$urlRouterProvider.otherwise("/404");

	 var randomString =  function (len, an){
		    an = an&&an.toLowerCase();
		    var str="", i=0, min=an=="a"?10:0, max=an=="n"?10:62;
		    for(;i++<len;){
		      var r = Math.random()*(max-min)+min <<0;
		      str += String.fromCharCode(r+=r>9?r<36?55:61:48);
		    }
		    return str;
		  }

  var random_str = randomString(3);

	$stateProvider

	.state('home',{
		url: "/home",
		cache: false,
		controller: 'appctrl',

		templateUrl: 'static/partials/home.html?'+random_str
		})

	.state('view',{

		url: "/view",
		cache: false,

		controller: 'viewctrl',
		templateUrl: 'static/partials/analytics.html?'+random_str
		})

	.state('view.ids',{

		url: "/{ids}",
		cache: false,

		controller: 'viewctrl',
		templateUrl: 'static/partials/analytics.html?'+random_str
		})

	
	
	//$locationProvider.html5Mode(true);

});

