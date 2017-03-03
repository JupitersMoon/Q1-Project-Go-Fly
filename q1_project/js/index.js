$(document).ready(function() {
  let lat = 0
  let long = 0
  let result = 0


  function getParamValue(param) {
    let paramString = window.location.search.replace(/\?/, '')

    result = paramString.split('&').filter(pair => pair.split('=')[0] === param)

    return result.length ? result[0].split('=')[1] : null
  }

  let geocoder;
  let zip = getParamValue('search')
  let error = 'no error!'


  function initMap() {
    // let google = 0

    // setup geocoder
    geocoder = new google.maps.Geocoder()

    // Create a map object and specify the DOM element for display.
    let map = new google.maps.Map(document.getElementById('map'), {

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
    let addString = zip;

    geocoder.geocode({
      'address': addString
    }, function(results, status) {
      if (status === 'OK') {

        resultsMap.setCenter(results[0].geometry.location);
        lat = results[0].geometry.location.lat()
        long = results[0].geometry.location.lng()


        // ///////AJAX///// //

        $.ajax({
          method: 'GET',

          // WU KEY      155ad056960470aa
          // url: `http://api.wunderground.com/api/155ad056960470aa/conditions/q/${zip}.json`,
          url: `http://api.wunderground.com/api/155ad056960470aa/conditions/q/${lat},${long}.json`,

          //  url: `http://api.darksky.net/forecast/bc75c564eb0f8d47ec4bb0f52e8aa307/${lat},${long}`,
          datatype: 'json',

          success: function(data) {
            let weatherInfo = data


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

            let obs = weatherInfo.current_observation

            // METRIC
            weatherObj.humidity.eu = obs.relative_humidity
            weatherObj.temp.eu = obs.temp_c
            weatherObj.windSp.eu = obs.wind_kph
            weatherObj.windStr.eu = obs.wind_string
            weatherObj.windGust.eu = obs.wind_gust_kph
            weatherObj.windDir.eu = obs.wind_dir
            weatherObj.precip.eu = obs.precip_today_metric
            weatherObj.icon.eu = obs.icon_url
            weatherObj.vis.eu = obs.visibility_km
            weatherObj.forecast.eu = obs.weather
            weatherObj.pressure.eu = obs.pressure_mb

            // US
            weatherObj.humidity.us = obs.relative_humidity
            weatherObj.temp.us = obs.temp_f
            weatherObj.windSp.us = obs.wind_mph
            weatherObj.windStr.us = obs.wind_string
            weatherObj.windGust.us = obs.wind_gust_mph
            weatherObj.windDir.us = obs.wind_dir
            weatherObj.precip.us = obs.precip_today_in
            weatherObj.icon.us = obs.icon_url
            weatherObj.vis.us = obs.visibility_mi
            weatherObj.forecast.us = obs.weather
            weatherObj.pressure.us = obs.pressure_in


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
            }
            us()

            if (weatherObj.windGust.us > 5 || weatherObj.precip.us > 20 || weatherObj.vis.us < 5) {
              $('#cat').append('<img src="/img/windycat.gif"/>')
              $('#status').append('<h4 style="color:red">' + 'Could Be Trouble' + '</h4>')
            }
             else {
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
              }
              else {
                eu()
              }
            })
          },
          error: function() {
          }
        })

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
