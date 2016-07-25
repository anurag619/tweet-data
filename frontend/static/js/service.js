
var tweetServices = angular.module('tweetServices',[])


tweetServices.factory('trendsData',function($http, $log, $q){

	return { query: function(){

			var url = '/api/list/trends'

			var deferred = $q.defer();

			 $http.get(url, {}, { cache: true})
				.success(function(data) {

					deferred.resolve({
						response: data});

				}).error(function(msg, code) {
		          deferred.reject(msg);
		          $log.error(msg, code);
		       });

			return deferred.promise;
		}
	}
});


tweetServices.factory('imagesData',function($http, $log, $q){

	return { query: function(params){

			var url = '/api/list/images'

			var deferred = $q.defer();
			 $http.get(url, {params: params.trends},  { cache: true})
				.success(function(data) {

					deferred.resolve({
						response: data});

				}).error(function(msg, code) {
		          deferred.reject(msg);
		          $log.error(msg, code);
		       });

			return deferred.promise;
		}
	}
});
