/*weather.js by Jiajie Wu*/

//global URL to call forecast.io API
var FORECAST_URL = "http://api.forecast.io/forecast/c4f8a200f7ce039d0eeb036143160aa2/";

var WEATHER_DATA = {
	"clear-day": "Clear Day",
	"clear-night": "Clear Night",
	"cloudy": "Cloudy",
	"fog": "Fog",
	"hail": "",
	"partly-cloudy-day": "Partly Cloudy Day",
	"partly-cloudy-night": "Partly Cloudy Night",
	"rain": "Rain",
	"sleet": "Sleet",
	"snow": "Snow",
	"thunderstorm": "Thunderstorm",
	"wind": "Wind"
};

var WEEK_DAY = {
	0: "Sunday",
	1: "Monday",
	2: "Tuesday",
	3: "Wednesday",
	4: "Thursday",
	5: "Friday",
	6: "Saturday"
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
		
	$(window).on("hashchange", function(e) {
		var hash = location.hash;
		var type = hash.substring(1, 5);
		if (type == "city") {
			if (!isFarenheit) {
				convertTemp("c2f");
				isFarenheit = false;
			}
			var city = hash.substring(6, hash.length);
			$("#menu-container").hide();
			$("#detail-container").show();
			var data = JSON.parse(localStorage.getItem(city));
			updateCurrent(data, city);
			updateHourly(data.hourly.data);
			updateWeekly(data.daily.data);
			updateInfo(data.daily.summary);
			updateDetail(data.daily.data[0]);
			if (!isFarenheit) {
				console.log("convert temp");
				convertTemp("f2c");
			}
			
			if (city == "currentlocation") {
				$("#l-arrow a").attr("href", "#nothing");
				$("#l-arrow").removeClass("act-icon");
				$("#l-arrow").addClass("deact-icon");
				$("footer p:nth-child(3)").removeClass("deact-icon");
				$("footer p:nth-child(3)").addClass("act-icon");
				$("footer p:nth-child(4)").removeClass("act-icon");
				$("footer p:nth-child(4)").addClass("deact-icon");
				$("footer p:nth-child(5)").removeClass("act-icon");
				$("footer p:nth-child(5)").addClass("deact-icon");
				$("#r-arrow a").attr("href", "#city/sanjose");
				$("#r-arrow").removeClass("deact-icon");
				$("#r-arrow").addClass("act-icon");
			} else if (city == "sanjose") {
				$("#l-arrow a").attr("href", "#city/currentlocation");
				$("#l-arrow").removeClass("deact-icon");
				$("#l-arrow").addClass("act-icon");
				$("footer p:nth-child(3)").removeClass("act-icon");
				$("footer p:nth-child(3)").addClass("deact-icon");
				$("footer p:nth-child(4)").removeClass("deact-icon");
				$("footer p:nth-child(4)").addClass("act-icon");
				$("footer p:nth-child(5)").removeClass("act-icon");
				$("footer p:nth-child(5)").addClass("deact-icon");
				$("#r-arrow a").attr("href", "#city/sydney");
				$("#r-arrow").removeClass("deact-icon");
				$("#r-arrow").addClass("act-icon");
			} else if (city == "sydney") {
				$("#l-arrow a").attr("href", "#city/sanjose");
				$("#l-arrow").removeClass("deact-icon");
				$("#l-arrow").addClass("act-icon");
				$("footer p:nth-child(3)").removeClass("act-icon");
				$("footer p:nth-child(3)").addClass("deact-icon");
				$("footer p:nth-child(4)").removeClass("act-icon");
				$("footer p:nth-child(4)").addClass("deact-icon");
				$("footer p:nth-child(5)").removeClass("deact-icon");
				$("footer p:nth-child(5)").addClass("act-icon");
				$("#r-arrow a").attr("href", "#nothing");
				$("#r-arrow").removeClass("act-icon");
				$("#r-arrow").addClass("deact-icon");
			}
			
			clearInterval(autoUpdateMain);
			var autoUpdateDetail = setInterval(function() {
				updateCurrent(data, city);
				updateHourly(data.hourly.data);
				updateWeekly(data.daily.data);
				updateInfo(data.daily.summary);
				updateDetail(data.daily.data[0]);
				if (!isFarenheit) {
					console.log("convert temp");
					convertTemp("f2c");
				}
			}, 600000);
		} else if (type == "main") {
			
			$("#detail-container").hide();
			$("#menu-container").show();
			autoUpdateMain = setInterval(function() {
				clearInterval(autoUpdateDetail);
				getCurrentTemp();
				getSanJoseTemp();
				getSydneyTemp();
				if (!isFarenheit) {
					console.log("convert temp");
					convertTemp("f2c");
				}
			}, 600000);
		}
		
	});
	
	$(".celc").click(function(e) {
		console.log("celc click");
		if (isFarenheit) {
			convertTemp("f2c");
			$(".celc").each(function(index) {
				$(this).css("opacity", "0.9");
			});
			$(".fare").each(function(index) {
				$(this).css("opacity", "0.5");
			});
		}
	});
	
	$(".fare").click(function(e) {
		if (!isFarenheit) {
			convertTemp("c2f");
			$(".fare").each(function(index) {
				$(this).css("opacity", "0.9");
			});
			$(".celc").each(function(index) {
				$(this).css("opacity", "0.5");
			});
		}
	});
	
	//auto update time
	var autoTime = setInterval(function() {
		console.log("update time");
		updateTime();
	}, 60000);
	
	var autoUpdateMain = setInterval(function() {
		clearInterval(autoUpdateDetail);
		getCurrentTemp();
		getSanJoseTemp();
		getSydneyTemp();
		if (!isFarenheit) {
			console.log("convert temp");
			convertTemp("f2c");
		}
	}, 600000);
	
});


//To get current weather info, and change in the index.html current location bar
var getCurrentTemp = function() {
	var success = function(position) {
		var data = localStorage.getItem("currentlocation")
		if (data) {
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
				// item.html(Math.round(result.currently.temperature) + "&deg;");	
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
	if (min < 10) {
		min = "0" + min;
	}
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
	item.html(Math.round(data.currently.temperature) + "&deg;");	
	var hour = new Date(data.currently.time * 1000).getHours();
	if (city == "sydney") {
		hour = (hour + 19) % 24;
	}
	if (hour >= 6 && hour < 18) {
		if (data.daily.icon == "clear-day") {
			$("#" + city).css("background", "-webkit-linear-gradient(270deg, #2f76a1, #549dc5)");
		}
		else {
			$("#" + city).css("background", "-webkit-linear-gradient(270deg, #718291, #617588)");
		}
	} else {
		if (data.daily.icon == "clear-day") {
			$("#" + city).css("background", "-webkit-linear-gradient(270deg, #141830, #262c43)");
		}
		else {
			$("#" + city).css("background", "-webkit-linear-gradient(270deg, #0b131e, #232931)");
		}
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
	var temp = Math.round(data.currently.temperature);
	var tempMax = Math.round(data.daily.data[0].temperatureMax);
	var tempMin = Math.round(data.daily.data[0].temperatureMin);
	$(".current-temp").html(temp + "&deg;");
	$(".day-temp-tbl td:nth-child(1)").html(WEEK_DAY[new Date().getDay()]);
	$(".day-temp-tbl td:nth-child(3)").html(tempMax + "&deg;");
	$(".day-temp-tbl td:nth-child(4)").html(tempMin + "&deg;");
	center($(".current-city"));
	center($(".current-weather"));
	center($(".current-temp"));
};

//update hourly weather information
var updateHourly = function(hourlyData) {
	if (!(hourlyData)) {
		return;
	}
	
	var i;
	for (i = 0; i < 27; i++) {
		var hour = "12 AM";
		if (i != 0) {
			hour = getTime(hourlyData[i].time, true);
			$("#hour-temp td:nth-child(" + (i+1) +") p:nth-child(1)").html(hour);
		}
		var imgSrc = "icons/" + hourlyData[i].icon + ".png";
		$("#hour-temp td:nth-child(" + (i+1) +") img").attr("src", imgSrc);
		$("#hour-temp td:nth-child(" + (i+1) +") p:nth-child(3)").html(Math.round(hourlyData[i].temperature) + "&deg;");
	}
};

//update daily info
var updateWeekly = function(weeklyData) {
	if (!(weeklyData)) {
		return;
	}
	
	var i;
	for (i = 0; i < 8; i++) {
		$("#day-weather li:nth-child(" + (i+1) + ") td:nth-child(1)").html(WEEK_DAY[new Date(weeklyData[i].time * 1000).getDay()]);
		var imgSrc = "icons/" + weeklyData[i].icon + ".png";
		$("#day-weather li:nth-child(" + (i+1) + ") img").attr("src", imgSrc);
		$("#day-weather li:nth-child(" + (i+1) + ") td:nth-child(3)").html(Math.round(weeklyData[i].temperatureMax) + "&deg;");
		$("#day-weather li:nth-child(" + (i+1) + ") td:nth-child(4)").html(Math.round(weeklyData[i].temperatureMin) + "&deg;");
	}
};

//update daily info
var updateInfo = function(info) {
	if (!(info)) {
		return;
	}
	$("#day-info p").html(info);
};

var updateDetail = function(details) {
	if (!(details)) {
		return false;
	}
	
	$(".sun-info p:nth-child(2)").html(getTime(details.sunriseTime, false));
	$(".sun-info p:nth-child(4)").html(getTime(details.sunsetTime, false));
	$(".rain-info p:nth-child(2)").html((details.precipProbability * 100) + "%");
	$(".rain-info p:nth-child(4)").html((details.humidity * 100) + "%");
	
	//calculate wind info
	var windBearing = details.windBearing;
	var windDirection = "";
	if(windBearing >= 337.5 && windBearing < 22.5) windDirection = "N";
    else if(windBearing >= 22.5 && windBearing < 67.5) windDirection = "NE";
    else if(windBearing >= 67.5 && windBearing < 112.5) windDirection = "E";
    else if(windBearing >= 112.5 && windBearing < 157.5) windDirection = "SE";
    else if(windBearing >= 157.5 && windBearing < 202.5) windDirection = "S";
    else if(windBearing >= 202.5 && windBearing < 247.5) windDirection = "SW";
    else if(windBearing >= 247.5 && windBearing < 292.5) windDirection = "W";
    else if(windBearing >= 292.5 && windBearing < 337.5) windDirection = "NW";
	$(".wind-info p:nth-child(2)").html(details.windSpeed + " mph " + windDirection);
	$(".wind-info p:nth-child(4)").html(Math.round((details.apparentTemperatureMin + details.apparentTemperatureMax) / 2) + "&deg;");
	
	$(".pressure-info p:nth-child(2)").html(details.precipIntensity + " in");
	$(".pressure-info p:nth-child(4)").html(details.pressure);
	
	$(".visibility-info p:nth-child(2)").html(details.visibility + " mi");
};

var center = function(elem) {
	var halfWidth = elem.width() / 2;
	elem.css("left", "calc(50% - " + halfWidth + "px)");
}

var celc2Fren = function(temp) {
	return Math.round(temp * 9 / 5 + 32);
};

var fren2Celc = function(temp) {
	return Math.round((temp - 32) * 5 / 9);
};

var convertTemp = function(type) {
	if (type == "c2f") {
		$(".temp-convert").each(function(index) {
			var num = parseInt($(this).html().substring(0, $(this).html().length - 1));
			var num = Math.round(celc2Fren(num));
			$(this).html(num + "&deg;");
		});
		isFarenheit = true;
	} else if (type == "f2c") {
		$(".temp-convert").each(function(index) {
			var num = parseInt($(this).html().substring(0, $(this).html().length - 1));
			var num = Math.round(fren2Celc(num));
			$(this).html(num + "&deg;");
		});
		isFarenheit = false;
	}
};

/**
 *Return a string in HH:MM AM format of given time
 *@param miliSec current time in milliseconds
 *@param isHour boolean value to determine if the return string show minute
 *
 */
var getTime = function(miliSec, isHour) {
	hour = new Date(miliSec * 1000).getHours();
	min = new Date(miliSec * 1000).getMinutes();
	if (min < 10) {
		min = "0" + min;
	}
	var hourStr = "";
	if (hour < 12) {
		if (hour == 0) {
			hour = 12;
		}
		if (isHour) {
			hourStr = hour + " AM";
		} else {
			hourStr = hour + ":" + min + " AM";
		}
	} else {
		if (hour > 12) {
			hour -= 12;
		}
		if (isHour) {
			hourStr = hour + " PM";
		} else {
			hourStr = hour + ":" + min + " PM";
		}
	}
	
	return hourStr;
};
