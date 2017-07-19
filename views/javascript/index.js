 var map;

 function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
     center: {
       lat: 37.0902,
       lng: -95.7129
     },
     zoom: 4
   });
   var but = document.getElementById('subLoc');

   but.addEventListener('click', function () {
     var input = document.getElementById('search_for')
       .value;
     console.log(input);
     var loc = new google.maps.Geocoder();
     loc.geocode({
       address: input
     }, function (results, status) {
       if (status == google.maps.GeocoderStatus.OK) {
         map.setCenter(results[0].geometry.location);
       } else {
         console.log("Status was not ok");
       }
     });

   });
 }
 initMap();

 function dropPins() {
   $.ajax({
     url: "/getSessionData",
     type: 'POST',
     //console.log('Checking if data exist...');
     success: function (data) {
       if (data.loggedIn) {
         console.log("There are data!");
         $.ajax({
           url: "/getResources",
           type: "POST",
           success: function (data) {
             console.log("We got a success.");
             //Add pin dropping functions here
             var addressInput = data.address + " " + data.city +
               " " + data.country;
             console.log(data.address);
             console.log(addressInput);
             var geocoder = new google.maps.Geocoder();
             geocoder.geocode({
               address: addressInput
             }, function (results, status) {
               console.log("Status equals " + status);
               if (status == google.maps.GeocoderStatus.OK) {
                 var myResult = results[0].geometry.location;
                 console.log("This is the result: " + myResult);
                 var contentString = '<p>' + data.desc + '</p>';
                 var theWindow = new google.maps.InfoWindow({
                   content: contentString
                 });
                 var theMarker = new google.maps.Marker({
                   map: map,
                   position: myResult,
                   title: addressInput
                 });
                 theMarker.addListener('click', function () {
                   $.ajax({
                     url: '/sendID',
                     type: 'POST',
                     contentType: 'application/json',
                     data: JSON.stringify(data),
                     dataType: 'json',
                     success: function (data1) {
                       console.log("success");
                       /*Change This If you change port*/
                       self.location =
                         "http://localhost:3000/resourcePage";
                     },
                     error: function (xhr, status,
                       error) {
                       console.log("error");
                     }
                   });
                 });
                 console.log("This is the marker: " + theMarker);
               } else {
                 console.log("The status check didn't pass");
               }
               console.log("This is in the callback.");
             });
             if (data.moreData) {
               dropPins();
             }
           },
           error: function (xhr, status, error) {
             console.log("error");
           }
         });
       }
     },
     error: function (xhr, status, error) {
       console.log("error");
     }
   });
 }
 dropPins();

 function selectHome() {
   $("#RBL")
     .removeClass("active");
   $("#ABL")
     .removeClass("active");
   $("#HBL")
     .addClass("active");
   console.log("Making About Active");
 }
 selectHome();
