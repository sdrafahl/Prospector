(function() {
    var img = document.getElementById("background");
    var num = Math.floor((Math.random() * 2) + 1);
    console.log("Number: " + num);
    if (num == 1) {
        img.src = "background.jpg";
    } else {
        img.src = "background2.jpg";
    }
 })();
    

        $('#signIn').click(function() {
            console.log("Sending Post To Login");
            var usr = document.getElementById("exampleInputEmail1").value;
            var pass = document.getElementById("exampleInputPassword1").value;
                if (usr && pass) {
                    console.log("there is data");
                                var data = {
                                    'password': pass,
                                    'username': usr
                                };
                                console.log(data);
                                $.ajax({
                                    url: '/login',
                                    type: 'POST',
                                    contentType: 'application/json',
                                    data: JSON.stringify(data),
                                    dataType: 'json',
                                    success: function(data) {
                                        console.log("success");
                                        if (data.match) {
                                            console.log("match");
                                            self.location = "http://localhost:3003/index";
                                        } else {
                                            $('#message').html("Either the Password or Email is Wrong");
                                        }


                                    },
                                    error: function(xhr, status, error) {
                                        console.log("error");
                                    }

                                });
                            } else {
                                $('#message').html("Not All Fields are Filled");
                            }
                        });


                        function test() {
                            $.ajax({
                                url: '/getSessionData',
                                type: 'POST',
                                success: function(data) {
                                    console.log(data);
                                    if (data.loggedIn) {
                                        console.log("Is Logged In");
                                    } else {
                                        console.log("Not Logged In");
                                    }

                                },
                                error: function(xhr, status, error) {
                                    console.log("error");
                                }

                            });
                        }
                        test();