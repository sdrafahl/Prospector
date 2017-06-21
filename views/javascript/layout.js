    function initMap() {
        var myLatLng = {lat: 42.011018, lng: -93.68398};
        var mapDiv = document.getElementById('map');
        var map = new google.maps.Map(mapDiv, {
        center: {lat: 42.03, lng: -93.75},
        zoom: 4
      });
      var marker = new google.maps.Marker({
       position: myLatLng,
       map: map,
       title: 'Hello World!'
       });
      }
      initMap();
  
  function logout(){
              console.log("logging out");
              $.ajax({
                url: '/logout',
                type: 'POST',
                success:function(data){
                  console.log("success");
                },
                error: function(xhr,status,error){
                  console.log("error");
                }
              });
            }
            
    function showImage(){
               $.ajax({
                  url: '/getSessionData',
                  type: 'POST',
                  success: function(data){
                    console.log(data);
                    if(data.loggedIn){
                      console.log("Is Logged In");
                      var edit = document.getElementById("profilePicture");
                      var strings = data.user + data.id + "." + data.ext;
                      console.log(strings);
                      edit.src= "/images/" + strings;
                      console.log("File Path " + edit.src);
                      
                    }else{
                      console.log("Not Logged In");
                    }
                    
                  },
                  error: function(xhr,status,error){
                    console.log("error");
                    }

                  });
            }
            showImage();