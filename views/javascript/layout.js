function logout() {
    console.log("logging out");
    $.ajax({
        url: '/logout',
        type: 'POST',
        success: function (data) {
            console.log("success");
        },
        error: function (xhr, status, error) {
            console.log("error");
        }
    });
}

function showImage() {
    $.ajax({
        url: '/getSessionData',
        type: 'POST',
        success: function (data) {
            console.log(data);
            if (data.loggedIn) {
                console.log("Is Logged In");
                var edit = document.getElementById("profilePicture");
                var strings = data.user + data.id + "." + data.ext;
                console.log(strings);
                edit.src = "/images/" + strings;
                console.log(edit.src);
            } else {
                console.log("Not Logged In");
            }
        },
        error: function (xhr, status, error) {
            console.log("error");
        }

    });
}
showImage();

function initSideBar() {
    var hideButton = document.getElementById("reorder");
    var sideNav = document.getElementById("sidenav");
    var map = document.getElementById("area");

    console.log("The side nav" + sideNav);
    hideButton.onclick = function () {
        if (sideNav.classList.contains('hid')) {
            sideNav.classList.add('vis');
            sideNav.classList.remove('hid');
            map.style.width = '75%';
            document.getElementById('title')
                .classList.remove('invisible');
            document.getElementById('homeButton')
                .classList.remove('invisible');
            document.getElementById('resourceButton')
                .classList.remove('invisible');
            document.getElementById('aboutButton')
                .classList.remove('invisible');
            document.getElementById('search_for')
                .classList.remove('invisible');
            document.getElementById('subLoc')
                .classList.remove('invisible');
            return;
        }
        if (sideNav.classList.contains('vis')) {
            sideNav.classList.add('hid');
            sideNav.classList.remove('vis');
            map.style.width = '95%';
            document.getElementById('title')
                .classList.add('invisible');
            document.getElementById('homeButton')
                .classList.add('invisible');
            document.getElementById('resourceButton')
                .classList.add('invisible');
            document.getElementById('aboutButton')
                .classList.add('invisible');
            document.getElementById('search_for')
                .classList.add('invisible');
            document.getElementById('subLoc')
                .classList.add('invisible');
            return;
        }
    }
}

initSideBar();
