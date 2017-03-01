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
                        let weatherObj = {}
                        weatherObj.humidity = weatherInfo.current_observation.relative_humidity
                        weatherObj.temp = weatherInfo.current_observation.temp_f
                        weatherObj.windSp = weatherInfo.current_observation.wind_mph
                        weatherObj.windStr = weatherInfo.current_observation.wind_string
                        weatherObj.windGust = weatherInfo.current_observation.wind_gust_mph
                        weatherObj.windDir = weatherInfo.current_observation.wind_dir
                        weatherObj.precip = weatherInfo.current_observation.precip_today_in
                        weatherObj.icon = weatherInfo.current_observation.icon_url
                        weatherObj.vis = weatherInfo.current_observation.visibility_mi
                        weatherObj.forecast = weatherInfo.current_observation.weather
                        weatherObj.pressure = weatherInfo.current_observation.pressure_in
                        $('#header-icon').append('<img src='+ weatherObj.icon + '>')
                        $('#forecast').append('<p>' + weatherObj.forecast + '</p>')
                        $('#pressure').append('<p>' + weatherObj.pressure + ' in' + '</p>')
                        $('#humidity').append('<p>' + weatherObj.humidity + '</p>')
                        $('#temp').append('<p>' + weatherObj.temp + ' f' + '</p>')
                        $('#precip').append('<p>' + weatherObj.precip + ' in'+ '</p>')
                        $('#wSpeed').append('<p>' + weatherObj.windSp + ' mph' + '</p>')
                        $('#vis').append('<p>' + weatherObj.vis + ' mi' + '</p>')
                        $('#wind-condition').append('<p>' + weatherObj.windStr + '</p>')
                        $('#bearing').append('<p>' + weatherObj.windDir + '</p>')
                        $('#gust').append('<p>' + weatherObj.windGust + ' mph' + '</p>')
                        console.log(weatherObj);
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
