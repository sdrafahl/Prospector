document.getElementById('resetButton').addEventListener('click', function() {
    var pass1 = document.getElementById("password").value;
    var pass2 = document.getElementById("password_confirm").value;
    if(pass1 === pass2){
        
    }else{
        $('#message').html("Passwords do not match");
    }
});