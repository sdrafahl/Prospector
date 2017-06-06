 function setupBackground(){
            var img = document.getElementById("background");
                var num = Math.floor((Math.random() * 2) + 1);
                console.log("Number: " + num);
                if(num==1){
                    img.src = "background.jpg";
                }else{
                    img.src = "background2.jpg";
                }
        }
        setupBackground();
        function setupClick(){
            var input = document.getElementById("email");
             var data = {
                 email_usr: input.value
             };
             console.log(input.value);
             console.log(data);
             $.ajax({
                  url: '/sendEmail',
                  type: 'POST',
                  contentType: 'application/json',
                  data: JSON.stringify(data),
                  dataType: 'json',
                  success: function(data){
                      
                  },
                  error: function(xhr,status,error){
                    console.log("error");
                    }

                  });
        }
        