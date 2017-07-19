document.getElementById('resetButton')
  .addEventListener('click', function () {
    var pass1 = document.getElementById("password")
      .value;
    var pass2 = document.getElementById("password_confirm")
      .value;
    if (pass1 === pass2) {
      $.ajax({
        url: '/resetPassword',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          code: getQueryVariable("code")
        }),
        success: function (data) {
          console.log("success");
        }
        error: function (xhr, status, error) {
          console.log("error");
        }
      });
    } else {
      $('#message')
        .html("Passwords do not match");
    }
  });
