/*weather.js by Jiajie Wu*/

//global URL to call forecast.io API
var FORECAST_URL = "http://api.forecast.io/forecast/c4f8a200f7ce039d0eeb036143160aa2/";

var WEATHER_DATA = {
	"clear-day": "Clear Day",
	"clear-night": "Clear Night",
	cloudy: "Cloudy",
	fog: "Fog",
	hail: "",
	"partly-cloudy-day": "Partly Cloudy Day",
	"partly-cloudy-night": "Partly Cloudy Night",
	rain: "Rain",
	sleet: "Sleet",
	snow: "Snow",
	thunderstorm: "Thunderstorm",
	wind: "Wind"
};

var isFarenheit = true;


//document ready event
$(document).ready(function(e) {
	if (window.location.hash == "") {
		$("#detail-container").hide();
		$("#menu-container").show();
	} else {
		$("#menu-container").hide();
		$("#detail-container").show();
	}
	
	//update on menu page
	updateTime();
	getCurrentTemp();
	getSanJoseTemp();
	getSydneyTemp();
	changeListBackground();
		
	$(window).on("hashchange", function(e) {
		var hash = location.hash;
		var type = hash.substring(1, 5);
		if (type == "city") {
			$("#menu-container").hide();
			$("#detail-container").show();
			var city = hash.substring(6, hash.length);
			var data = JSON.parse(localStorage.getItem(city));
			updateCurrent(data, city);
		}
		
		
	});
	
});


//To get current weather info, and change in the index.html current location bar
var getCurrentTemp = function() {
	var success = function(position) {
		var data = localStorage.getItem("currentlocation")
		if (data) {
			console.log("update current");
			setTimeout(function() {
				updateList(JSON.parse(data), "current-loc");
			}, 20);
			
		}
		/*$.ajax({
			type: 'get',
			url: FORECAST_URL + position.coords.latitude + "," + position.coords.longitude,
			dataType: 'jsonp',
			jsonp: 'callback',
			success: function(result) {
				console.log(result);
				localStorage.setItem("currentlocation", JSON.stringify(result));
				// var item = $('#current-loc p:nth-child(3)');
				// item.empty();
				// item.html(Math.floor(result.currently.temperature) + "&deg;");	
				// var hour = new Date(result.currently.time * 1000).getHours();
				// if (hour >= 6 && hour < 18) {
					// if (result.daily.icon == "clear-day") $("#current-loc").css("background", "-webkit-linear-gradient(270deg, #2f76a1, #549dc5)");
					// else $("#current-loc").css("background", "-webkit-linear-gradient(270deg, #718291, #617588)");
				// } else {
					// if (result.daily.icon == "clear-day") $("#current-loc").css("background", "-webkit-linear-gradient(270deg, #141830, #262c43)");
					// else $("#current-loc").css("background", "-webkit-linear-gradient(270deg, #0b131e, #232931)");
				// }
			},
			error: function(jqXhr, textStatus, errorThrown) {
				console.log(jqXhr);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});*/
	};

	var error = function(msg) {
		console.log(msg);
	};
	
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(success, error);
	} else {
	  error('not supported');
	}
};

//Change San Jose's Temperature
var getSanJoseTemp = function() {
	var data = localStorage.getItem("sanjose");
	if (data) {
		console.log("update sanjose");
		data = JSON.parse(data);
		//debugger;
		setTimeout(function() {
			updateList(data, "san-jose");
		}, 20);
	}
	// $.ajax({
		// type: 'get',
		// url: FORECAST_URL + '37.3382082,-121.88632860000001',
		// dataType: 'jsonp',
		// jsonp: 'callback',
		// success: function(result) {
			// console.log(result);
			// localStorage.setItem("sanjose", JSON.stringify(result));
		// },
		// error: function(jqXhr, textStatus, errorThrown) {
			// console.log(testStatus);
		// }
	// });
};

//Change Sydney's Temperature
var getSydneyTemp = function() {
	var data = localStorage.getItem("sydney");
	if (data) {
		console.log("update sydney");
		setTimeout(function() {
			updateList(JSON.parse(data), "sydney");
		}, 20);
	}
	// $.ajax({
		// type: 'get',
		// url: FORECAST_URL + '-33.8674869,151.20699020000006',
		// dataType: 'jsonp',
		// jsonp: 'callback',
		// success: function(result) {
			// console.log(result);
			// localStorage.setItem("sydney", JSON.stringify(result));
		// },
		// error: function(jqXhr, textStatus, errorThrown) {
			// console.log(jqXhr);
			// console.log(textStatus);
			// console.log(errorThrown);
		// }
	// });	
};

//change list item background
var changeListBackground = function() {
	var d = new Date();
	var hour = d.getHours();
	$(".city-list-item").each(function(index) {
		if (index >= 2) {
			hour += 19;
			hour = hour % 24;
		}
		if (hour >= 6 && hour < 18) {
			$(this).css("background", "-webkit-linear-gradient(270deg, #2f76a1, #549dc5)");
		} else {
			$(this).css("background", "-webkit-linear-gradient(270deg, #141830, #262c43)");
		}
	});
};

var updateTime = function() {
	var d = new Date();
	var hour = d.getHours();
	var min = d.getMinutes();
	var sydneyHour = (hour + 19) % 24;
	var curTime, sydneyTime;
	if (hour < 12) {
		if (hour == 0) {
			hour = 12
		}
		curTime = hour + ":" + min + " AM";
	} else {
		if (hour > 12) {
			hour -= 12;
		}
		curTime = hour + ":" + min + " PM";
	}
	
	if (sydneyHour < 12) {
		if (sydneyHour == 0) {
			sydneyHour = 12
		}
		sydneyTime = sydneyHour + ":" + min + " AM";
	} else {
		if (sydneyHour > 12) {
			sydneyHour -= 12;
		}
		sydneyTime = sydneyHour + ":" + min + " PM";
	}
	$(".time").html(curTime);
	$("#sydney-time").html(sydneyTime);
};

//menu page updates
var updateList = function(data, city) {
	var item = $('#' + city + ' p:nth-child(3)');
	item.empty();
	item.html(Math.floor(data.currently.temperature) + "&deg;");	
	var hour = new Date(data.currently.time * 1000).getHours();
	if (city == "sydney") {
		hour = (hour + 19) % 24;
	}
	if (hour >= 6 && hour < 18) {
		console.log(city + " background " + data.daily.icon);
		if (data.daily.icon == "clear-day") $("#" + city).css("background", "-webkit-linear-gradient(270deg, #2f76a1, #549dc5)");
		else $("#" + city).css("background", "-webkit-linear-gradient(270deg, #718291, #617588)");
	} else {
		console.log("background " +city + data.daily.icon);
		if (data.daily.icon == "clear-day") $("#" + city).css("background", "-webkit-linear-gradient(270deg, #141830, #262c43)");
		else $("#" + city).css("background", "-webkit-linear-gradient(270deg, #0b131e, #232931)");
	}
};

//detail page updates
var updateCurrent = function(data, city) {
	switch(city) {
		case "currentlocation":
			city = "Current Location";
			break;
		case "sanjose":
			city = "San Jose";
			break;
		case "sydney":
			city = "Sydney";
			break;
		default:
			break;
	};
	$(".current-city").html(city);
	$(".current-weather").html(WEATHER_DATA[data.currently.icon]);
	var temp = Math.floor(data.currently.temperature);
	var tempMax = Math.floor(data.daily.data[0].temperatureMax);
	var tempMin = Math.floor(data.daily.data[0].temperatureMin);
	if (!isFarenheit) {
		temp = fren2Celc(temp);
		tempMax = fren2Celc(tempMax);
		tempMin = fren2Celc(tempMin);
	}
	$(".current-temp").html(temp + "&deg;");
	$(".day-temp-tbl td:nth-child(3)").html(tempMax);
	$(".day-temp-tbl td:nth-child(4)").html(tempMin);
	center($(".current-city"));
	center($(".current-weather"));
	center($(".current-temp"));
};

var center = function(elem) {
	var halfWidth = elem.width() / 2;
	console.log(halfWidth);
	elem.css("left", "calc(50% - " + halfWidth + "px)");
}

var celc2Fren = function(temp) {
	return Math.floor(temp * 9 / 5 + 32);
};

var fren2Celc = function(temp) {
	return Math.floor((temp - 32) * 5 / 9);
};

