function getBase64(file, cb) {
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

document.getElementById('register')
  .addEventListener('click', function () {
    console.log("registering...");
    var files = document.getElementById('fileInput')
      .files;

    var imag32;
    var tempData;
    //console.log(tempData);
    var usr = document.getElementById("username")
      .value;
    //console.log(usr);
    var email = document.getElementById("email")
      .value;
    //console.log(email);
    var pass1 = document.getElementById("password")
      .value;
    //console.log(pass1);
    var pass2 = document.getElementById("password_confirm")
      .value;
    //console.log(pass2);
    var bio = document.getElementById("bio")
      .value;
    //console.log(bio);
    var data = {
      usr: usr,
      email: email,
      pass: pass1,
      bio: bio
    };

    if ((usr && email && pass1 && pass2 && bio)) {
      if (pass1 === pass2) {
        if ((files[0].size / 1000) < 200) {
          if ((files[0].size / 1000) > 0) {
            getBase64(files[0], function (result) {
              data.img = result;

              $.ajax({
                url: '/registerAccount',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function (data) {
                  console.log("success");
                  if (data.duplicate) {
                    console.log("Duplicate");
                    $('#message')
                      .html("Duplicate User or Email");
                  } else {
                    self.location = "http://localhost:3000/";
                    console.log("No Duplicate");
                  }

                },
                error: function (xhr, status, error) {
                  console.log("error");
                }
              });

            });



          } else {

            $('#message')
              .html("No File Selected");

          }

        } else {
          console.log("Image Too Big");

          $('#message')
            .html("Image is Too Big");


        }

      } else {
        $('#message')
          .html("Passwords Dont Match");
      }

    } else {

      console.log("Not All Fields Are Filled");
      $('#message')
        .html("Not All Fields Are Filled");
    }

  });
