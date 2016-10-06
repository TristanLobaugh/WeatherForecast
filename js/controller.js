var weatherApp = angular.module("weatherApp", ["ngRoute"]);

weatherApp.config(function($routeProvider){
	$routeProvider.when("/", {
		templateUrl: "pages/main.html",
		controller: "weatherController" 
	});
	$routeProvider.otherwise({
		redirectTo: "/"
	});
});

weatherApp.controller("weatherController", function($scope, $http, $location){
	$scope.weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	$scope.dailyForecast = [];
	var myUrl = "http://localhost:3010/";
	$scope.forecastInactive = true;
	$scope.location;
	var lat;
	var lng;

	$scope.getLocation = function(){
		var goecodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + $scope.location + "&key=AIzaSyBLdAHQM8mVjiprNAXBi9DKRCobNr3nRMg"
		$http.get(goecodeUrl).success(function(results){
			if (results){
				$scope.forecastInactive = false;
				// console.log(results)
				coords_obj = results.results[0].geometry.location
				lat = coords_obj.lat;
				lng = coords_obj.lng;
				getForecast(lat,lng);
			}
		})
	}

	getForecast = function(lat,lng){
		// console.log("Lat: " + lat);
		// console.log("Lat: " + lng);
		var myWeatherApi = myUrl + "get_weather";
		$http.post(myWeatherApi,{"lat": lat, "lng": lng})
		.then(function successCallback(response){
			var forecast_obj = JSON.parse(response.data);
			$scope.current = forecast_obj.currently;
			console.log($scope.current);
			$scope.daily = forecast_obj.daily.data;
			console.log($scope.daily);
			$scope.currentTimeStamp = new Date($scope.current.time*1000);
			$scope.today = $scope.weekday[$scope.currentTimeStamp.getDay()]
			makeDailyForecast($scope.daily);
		}, function errorCallback(response){
			$scope.result = "Error!!! " + response.status;
		});
	}
	makeDailyForecast = function(days){
		for(var i = 0; i < days.length; i++){
			dailyDate = new Date(days[i].time*1000)
			dailyDay = $scope.weekday[dailyDate.getDay()]
			$scope.dailyForecast.push(new Day (dailyDay, days[i].icon, days[i].summary, days[i].temperatureMax, days[i].temperatureMax));
		}
		console.log($scope.dailyForecast);
	}

	function Day(day, icon, status, high, low){
		this.day = day;
		this.icon = icon;
		this.status = status;
		this.high = high;
		this.low = low;
	}

});

