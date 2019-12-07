$(document).ready(function(){
    $('#weather-call').on('click',function(e){
        console.log(typeof event);

        e.preventDefault();
        var history = [];
        var city = $('input').val().toLowerCase();
        console.log(city);
        history.push(city);
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=214d1666f8c0b350d54cdfa60d57fab6"
        var queryURL5 = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid=214d1666f8c0b350d54cdfa60d57fab6"
        var today = moment().format("YYYY-D-MM");
        $('#weather').empty();
        $('#forecast').empty();
        if(city==='null'){
          return;
        }
        else{
          function renderButtons() {
            //$("#buttons-view").empty();
    
            for (var i = 0; i < history.length; i++) {
    

              var a = $("<button>");
              a.addClass("list-group-item list-group-item-action");
              a.attr("data-name", history[i]);
              var up= history[i].charAt(0).toUpperCase()+ history[i].slice(1);
              a.text(up);
              $("#buttons-view").append(a);
            }
          }

          renderButtons();
          //function to view history of chosen weather cities
          $('button').click(function(){
            var ignore= $(this).attr("id");
            if(ignore==="weather-call"){
              return;
            }
            else{
            var city_store= $(this).attr("data-name");
            var city_main= $(this).text();
            console.log(city_main);
            if(city_store===null&& city_main===null&& ignore==="weather-call"){
              return;
            }
            else{
              $('#forecast').empty();
              $('#weather').empty();
              var render_main= JSON.parse(sessionStorage.getItem(city_main));
              var iconI_main = render_main.weather[0].icon;
              var render_c= city_store.charAt(0).toUpperCase()+ city_store.slice(1);
              var render_fore= JSON.parse(sessionStorage.getItem(city_store));

              var k_main = parseInt(JSON.stringify(render_main.main.temp));
              var t_main = Math.floor((k_main - 273.15) * 1.80 + 32);
              
              $('#weather').append('<h1 id= title>'+city_main+'('+today+')'+'</h1>');
              var img_main = $('<img id="dynamic">'); 
              img_main.attr('src', 'http://openweathermap.org/img/wn/'+iconI_main+'@2x.png');
              img_main.appendTo('#title');
              $('#weather').append('<p>'+'Temp: '+t_main+String.fromCharCode(176)+'F'+'</p>');
              $('#weather').append('<p>'+'Humidty: '+render_main.main.humidity+String.fromCharCode(37)+'</p>');
              $('#weather').append('<p>'+'Wind Speed: '+render_main.wind.speed+'MPH'+'</p>');

              for(i=0; i<render_fore.length; i++){
                var f_his= $('#forecast').append(
                  $('<div>')
                  .attr('id','forecast'+[i])
                  .attr('font-family','Gupter', 'serif')
                  .addClass("card bg-secondary text-light p-2 mt-2 col-sm-2")
                  );
                  var date= JSON.stringify(render_fore[i].dt_txt);
                  var dateF= date.slice(1,11);
                  var icon5= render_fore[i].weather[0].icon;
                  var f5 = $('#forecast'+[i]);
                  var k = parseInt(JSON.stringify(render_fore[i].main.temp));
                  var t = Math.floor((k - 273.15) * 1.80 + 32);
                  
                  f5.append('<div id= title'+[i]+' font-size= 1.1rem >'+render_c+'('+dateF+')'+'</div>');
                  var img = $('<img id="dynamic">'); 
                  img.attr('src', 'http://openweathermap.org/img/wn/'+icon5+'@2x.png');
                  img.appendTo('#title'+[i]);
                  f5.append('<p class= card-text>'+'Temp: '+t+String.fromCharCode(176)+'F'+'</p>');
                  f5.append('<p class= card-text>'+'Humidty: '+render_fore[i].main.humidity+String.fromCharCode(37)+'</p>');
                  f5.append('<p class= card-text>'+'Wind Speed: '+render_fore[i].wind.speed+'MPH'+'</p>');
                }
                  

            }
            }
          });

          $.ajax({
            url: queryURL,
            method: "GET"
          }).then(function(response) {
            var uvIndexLon = response.coord.lon;
            var uvIndexLat = response.coord.lat;
            var iconI = response.weather[0].icon;
            sessionStorage.setItem(response.name,JSON.stringify(response));
            
            k = parseInt(JSON.stringify(response.main.temp));
            t = Math.floor((k - 273.15) * 1.80 + 32);
            
            $('#weather').append('<h1 id= title>'+response.name+'('+today+')'+'</h1>');
            var img = $('<img id="dynamic">'); 
            img.attr('src', 'http://openweathermap.org/img/wn/'+iconI+'@2x.png');
            img.appendTo('#title');
            $('#weather').append('<p>'+'Temp: '+t+String.fromCharCode(176)+'F'+'</p>');
            $('#weather').append('<p>'+'Humidty: '+response.main.humidity+String.fromCharCode(37)+'</p>');
            $('#weather').append('<p>'+'Wind Speed: '+response.wind.speed+'MPH'+'</p>');
            
            
            
            var queryURLUV = "http://api.openweathermap.org/data/2.5/uvi?appid=214d1666f8c0b350d54cdfa60d57fab6&lat="+uvIndexLat+"&lon="+uvIndexLon
            $.ajax({
              url: queryURLUV,
              method: "GET"
            }).then(function(responseUV) {
              console.log(responseUV);
              $('#weather').append('<p>UV index: '+responseUV.value+'</p>');
              
            });
            
            
          });
          
          $.ajax({
            url: queryURL5,
            method: "GET"
          }).then(function(response5) {
            console.log(response5);
            // 3,11,19,27,35
            var forecast5 = [response5.list[2],response5.list[10],response5.list[18],response5.list[26],response5.list[34]];
            sessionStorage.setItem(response5.city.name.toLowerCase(),JSON.stringify(forecast5));
            console.log(forecast5);
            for(i=0; i<forecast5.length; i++){
              var f= $('#forecast').append(
                $('<div>')
                .attr('id','forecast'+[i])
                .attr('font-family','Gupter', 'serif')
                .addClass("card bg-secondary text-light p-2 mt-2 col-sm-2")
                );
                var date= JSON.stringify(forecast5[i].dt_txt);
                var dateF= date.slice(1,11);
                var icon5= forecast5[i].weather[0].icon;
                var f5 = $('#forecast'+[i]);
                k = parseInt(JSON.stringify(forecast5[i].main.temp));
                t = Math.floor((k - 273.15) * 1.80 + 32);
                
                f5.append('<div id= title'+[i]+' font-size= 1.1rem >'+response5.city.name+'('+dateF+')'+'</div>');
                var img = $('<img id="dynamic">'); 
                img.attr('src', 'http://openweathermap.org/img/wn/'+icon5+'@2x.png');
                img.appendTo('#title'+[i]);
                f5.append('<p class= card-text>'+'Temp: '+t+String.fromCharCode(176)+'F'+'</p>');
                f5.append('<p class= card-text>'+'Humidty: '+forecast5[i].main.humidity+String.fromCharCode(37)+'</p>');
                f5.append('<p class= card-text>'+'Wind Speed: '+forecast5[i].wind.speed+'MPH'+'</p>');
                
                
              }
              
            });}
            
            
            
          })
          
          
          
          
          
          
          
          
        });