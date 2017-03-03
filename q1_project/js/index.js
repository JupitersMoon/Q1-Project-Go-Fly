$(document).ready(function() {
    let lat = 0
    let long = 0

    function getParamValue(param) {
        let paramString = window.location.search.replace(/\?/, '')

        result = paramString.split('&').filter(pair => pair.split('=')[0] === param)

        return result.length ? result[0].split('=')[1] : null
    }

    var geocoder;
    // var map = document.getElementById('map')
    let zip = getParamValue('search')
    console.log('zip: ' + zip);

    var error = 'no error!'


    function initMap() {
        // setup geocoder
        geocoder = new google.maps.Geocoder()
        // Create a map object and specify the DOM element for display.
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 40.0154005,
                lng: -105.2838513
            },
            scrollwheel: false,
            zoom: 11
        });
        codeAddress(geocoder, map)

    }



    function codeAddress(geocoder, resultsMap) {
        // get the value out of address input
        var addString = zip;
        geocoder.geocode({
            'address': addString
        }, function(results, status) {
            //  console.log(status);
            //  console.log(results);
            if (status == 'OK') {

                //  console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng())
                resultsMap.setCenter(results[0].geometry.location);
                var lat = results[0].geometry.location.lat()
                var long = results[0].geometry.location.lng()
                console.log('lat: ' + lat);
                console.log('long: ' + long);


                /////////AJAX///////
                $.ajax({
                    method: 'GET',

                    // WU KEY      155ad056960470aa
                    // url: `http://api.wunderground.com/api/155ad056960470aa/conditions/q/${zip}.json`,
                    url: `http://api.wunderground.com/api/155ad056960470aa/conditions/q/${lat},${long}.json`,

                    //  url: `http://api.darksky.net/forecast/bc75c564eb0f8d47ec4bb0f52e8aa307/${lat},${long}`,
                    datatype: 'json',

                    success: function(data) {
                        let weatherInfo = data
                        console.log(weatherInfo);
                        let weatherObj = {
                            humidity: {},
                            temp: {},
                            windSp: {},
                            windStr: {},
                            windGust: {},
                            windDir: {},
                            precip: {},
                            icon: {},
                            vis: {},
                            forecast: {},
                            pressure: {}
                        }

                        // METRIC
                        weatherObj.humidity.eu = weatherInfo.current_observation.relative_humidity
                        weatherObj.temp.eu = weatherInfo.current_observation.temp_c
                        weatherObj.windSp.eu = weatherInfo.current_observation.wind_kph
                        weatherObj.windStr.eu = weatherInfo.current_observation.wind_string
                        weatherObj.windGust.eu = weatherInfo.current_observation.wind_gust_kph
                        weatherObj.windDir.eu = weatherInfo.current_observation.wind_dir
                        weatherObj.precip.eu = weatherInfo.current_observation.precip_today_metric
                        weatherObj.icon.eu = weatherInfo.current_observation.icon_url
                        weatherObj.vis.eu = weatherInfo.current_observation.visibility_km
                        weatherObj.forecast.eu = weatherInfo.current_observation.weather
                        weatherObj.pressure.eu = weatherInfo.current_observation.pressure_mb

                        // US
                        weatherObj.humidity.us = weatherInfo.current_observation.relative_humidity
                        weatherObj.temp.us = weatherInfo.current_observation.temp_f
                        weatherObj.windSp.us = weatherInfo.current_observation.wind_mph
                        weatherObj.windStr.us = weatherInfo.current_observation.wind_string
                        weatherObj.windGust.us = weatherInfo.current_observation.wind_gust_mph
                        weatherObj.windDir.us = weatherInfo.current_observation.wind_dir
                        weatherObj.precip.us = weatherInfo.current_observation.precip_today_in
                        weatherObj.icon.us = weatherInfo.current_observation.icon_url
                        weatherObj.vis.us = weatherInfo.current_observation.visibility_mi
                        weatherObj.forecast.us = weatherInfo.current_observation.weather
                        weatherObj.pressure.us = weatherInfo.current_observation.pressure_in

                        us()

                        function us() {
                            $('#header-icon').append('Conditions <img src=' + weatherObj.icon.us + '>')
                            $('#forecast').append('<h4>' + weatherObj.forecast.us + '</h4>')
                            $('#pressure').append('<h4>' + weatherObj.pressure.us + ' in' + '</h4>')
                            $('#humidity').append('<h4>' + weatherObj.humidity.us + '</h4>')
                            $('#temp').append('<h4>' + weatherObj.temp.us + ' \u00B0f' + '</h4>')
                            $('#precip').append('<h4>' + weatherObj.precip.us + ' in' + '</h4>')
                            $('#wSpeed').append('<h4>' + weatherObj.windSp.us + ' mph' + '</h4>')
                            $('#vis').append('<h4>' + weatherObj.vis.us + ' mi' + '</h4>')
                            $('#wind-condition').append('<h4>' + weatherObj.windStr.us + '</h4>')
                            $('#bearing').append('<h4>' + weatherObj.windDir.us + '</h4>')
                            $('#gust').append('<h4>' + weatherObj.windGust.us + ' mph' + '</h4>')
                            console.log(weatherObj);
                        }

                        if (weatherObj.windGust.us > 5 || weatherObj.precip.us > 20 || weatherObj.vis.us < 5) {
                            console.log('indicator: No Go'); //<img src="/img/windycat.gif"/>
                            $('#cat').append('<img src="/img/windycat.gif"/>')
                            $('#status').append('<h4 style="color:red">' + 'Could Be Trouble' + '</h4>')

                        } else {
                            console.log('indicator: go');
                            $('#cat').append('<img src="/img/cat.jpg"/>')
                            $('#status').append('<h4 style="color:green">' + 'LET\'S DO THIS' + '</h4>')
                        }


                        function eu() {
                            $('#header-icon').append('Conditions <img src=' + weatherObj.icon.eu + '>')
                            $('#forecast').append('<h4>' + weatherObj.forecast.eu + '</h4>')
                            $('#pressure').append('<h4>' + weatherObj.pressure.eu + ' mb' + '</h4>')
                            $('#humidity').append('<h4>' + weatherObj.humidity.eu + '</h4>')
                            $('#temp').append('<h4>' + weatherObj.temp.eu + ' \u00B0c' + '</h4>')
                            $('#precip').append('<h4>' + weatherObj.precip.eu + ' mm' + '</h4>')
                            $('#wSpeed').append('<h4>' + weatherObj.windSp.eu + ' kph' + '</h4>')
                            $('#vis').append('<h4>' + weatherObj.vis.eu + ' km' + '</h4>')
                            $('#wind-condition').append('<h4>' + weatherObj.windStr.eu + '</h4>')
                            $('#bearing').append('<h4>' + weatherObj.windDir.eu + '</h4>')
                            $('#gust').append('<h4>' + weatherObj.windGust.eu + ' kph' + '</h4>')
                        }

                        let toggle = true;

                        // METRIC TOGGLE
                        $('#toggle').click(function() {
                            toggle = !toggle

                            $('#header-icon').text('')
                            $('#forecast').text('')
                            $('#pressure').text('')
                            $('#humidity').text('')
                            $('#temp').text('')
                            $('#precip').text('')
                            $('#wSpeed').text('')
                            $('#vis').text('')
                            $('#wind-condition').text('')
                            $('#bearing').text('')
                            $('#gust').text('')

                            if (toggle) {
                                us()
                            } else {
                                eu()
                            }
                        })




                    },
                    error: function() {
                        console.log('Weather error');
                    }
                })

                // create a marker and drop onto 'map' based on resulting geocoded-address
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });

            } else {
                var error = alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
    initMap();
})
