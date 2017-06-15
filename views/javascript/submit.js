 function submitInfo(){
    console.log("Submitting Resource");
    var file = document.getElementById('image').files;
    /*In MB*/
    
      var title = document.getElementById("title").value;
      console.log(title);
      var address = document.getElementById("address").value;
      console.log(address);
      var city = document.getElementById("city").value;
      console.log(city);
      var country = document.getElementById("country").value;
      console.log(country);
      var type = $('input[name="type"]:checked').val();
      console.log(type);
      var coords = document.getElementById("coords").value;
      coords = coords.trim();
      console.log(coords);
      var desc = document.getElementById("desc").value;
      desc = desc.trim();
      console.log(desc);


      if(title && address && city && country && type && desc && file){
        if((file[0].size/1000)<30){
      /*Authentication Code Of Format*/
      if(desc.length<1000 && coords.length<10){
        console.log("Lengths Are Good");
        var data = {
          title:title,
          address:address,
          city:city,
          country:country,
          type:type,
          coords:coords,
          desc:desc
        };
        console.log(data);
        getBase64(file[0],function(result){
          data.img=result;
          $.ajax({
                  url: "/submitData",
                  type: 'POST',
                  contentType: 'application/json',
                  data: JSON.stringify(data),
                  dataType: 'json',
                  success: function(data){
                      console.log("success");
                      self.location = "http://localhost:3000/";
                  },
                  error: function(xhr,status,error){
                    console.log("error");
                  }
              });
        });
        
      
      }else{
        $('#message').html("Description is either too long or coordinates are too long");
      }
    }else{
      $('#message').html("File Is To Big");
      console.log("File Is To Big");
      
    }

    }else{
      $('#message').html("Not All Required Fields have Values");
    }
  }
  
  function getBase64(file,cb) {
   var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function () {
     console.log(reader.result);
     cb(reader.result);
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
} 