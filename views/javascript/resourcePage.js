function sendComment() {
    var com = document.getElementById("com")
        .children[0];
    var message = com.value;
    message = message.trim();

    console.log("message: " + message);
    /*Reset The Text Box*/
    com.innerHTML = "";
    $.ajax({
        url: '/addComment',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            comment: message
        }),
        dataType: 'json',
        success: function (data) {
            console.log("success");

        },
        error: function (xhr, status, error) {
            console.log("error");
        }
    });
    /*Refresh Page*/
    location.reload();
}

function rate(score) {
    $.ajax({
        url: '/addRating',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            score: score
        }),
        dataType: 'json',
        success: function (data) {
            console.log("success");
        },
        error: function (xhr, status, error) {
            console.log("error");
        }
    });
    /*Refresh Page*/
    location.reload()
}

function getRatings(count) {
    $.ajax({
        url: '/getComments',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            count: count
        }),
        success: function (data) {
            console.log(data);
            if (data.more) {
                var area = document.createElement('textarea');
                area.className = "comment";
                area.readOnly = true;
                var place = document.getElementById('com');
                place.style.width = "300px";
                place.appendChild(area);
                $.ajax({
                    url: '/getAccoundDataWithID',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        id: data.user_id
                    }),
                    success: function (data1) {
                        area.innerHTML = data.comment +
                            " --" + data1.USER;
                        getRatings(count + 1);
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
getRatings(0);

function start() {
    var starFive = document.getElementById("starFive");
    starFive.onclick = function () {
        rate(1);
    }

    var starFour = document.getElementById("starFour");
    starFour.onclick = function () {
        rate(2);
    }
    var starThree = document.getElementById("starThree");
    starThree.onclick = function () {
        rate(3);
    }
    var starTwo = document.getElementById("starTwo");
    starTwo.onclick = function () {
        rate(4);
    }
    var starOne = document.getElementById("starOne");
    starOne.onclick = function () {
        rate(5);
    }


    $.ajax({
        url: '/getResourceData',
        type: 'POST',
        success: function (data) {
            console.log("success");
            assignData(data);
            console.log("Get Rating Post");
            var ran = data.rank;
            console.log("rank: " + ran);
            var numCom = document.getElementById("commentors");
            numCom.innerHTML = "Ratings: " + data.num_of_commentors;
            switch (ran) {
                /*No rating Created Yet*/
            case -1:
                var star5 = document.getElementById("starFive");
                star5.style["-webkit-filter"] = "brightness(0)";

                var star4 = document.getElementById("starFour");
                star4.style["-webkit-filter"] = "brightness(0)";

                var star3 = document.getElementById("starThree");
                star3.style["-webkit-filter"] = "brightness(0)";

                var star2 = document.getElementById("starTwo");
                star2.style["-webkit-filter"] = "brightness(0)";

                var star1 = document.getElementById("starOne");
                star1.style["-webkit-filter"] = "brightness(0)";
                break;
            case 1:
                var star5 = document.getElementById("starFive");
                star5.style["-webkit-filter"] = "brightness(100%)";

                var star4 = document.getElementById("starFour");
                star4.style["-webkit-filter"] = "brightness(0)";

                var star3 = document.getElementById("starThree");
                star3.style["-webkit-filter"] = "brightness(0)";

                var star2 = document.getElementById("starTwo");
                star2.style["-webkit-filter"] = "brightness(0)";

                var star1 = document.getElementById("starOne");
                star1.style["-webkit-filter"] = "brightness(0)";
                break;
            case 2:
                var star5 = document.getElementById("starFive");
                console.log("stuff: " + star5);
                star5.style["-webkit-filter"] = "brightness(100%)";

                var star4 = document.getElementById("starFour");
                star4.style["-webkit-filter"] = "brightness(100%)";

                var star3 = document.getElementById("starThree");
                star3.style["-webkit-filter"] = "brightness(0)";

                var star2 = document.getElementById("starTwo");
                star2.style["-webkit-filter"] = "brightness(0)";

                var star1 = document.getElementById("starOne");
                star1.style["-webkit-filter"] = "brightness(0)";
                break;
            case 3:
                var star5 = document.getElementById("starFive");
                star5.style["-webkit-filter"] = "brightness(100%)";

                var star4 = document.getElementById("starFour");
                star4.style["-webkit-filter"] = "brightness(100%)";

                var star3 = document.getElementById("starThree");
                star3.style["-webkit-filter"] = "brightness(100%)";

                var star2 = document.getElementById("starTwo");
                star2.style["-webkit-filter"] = "brightness(0)";

                var star1 = document.getElementById("starOne");
                star1.style["-webkit-filter"] = "brightness(0)";
                break;
            case 4:
                var star5 = document.getElementById("starFive");
                star5.style["-webkit-filter"] = "brightness(100%)";

                var star4 = document.getElementById("starFour");
                star4.style["-webkit-filter"] = "brightness(100%)";

                var star3 = document.getElementById("starThree");
                star3.style["-webkit-filter"] = "brightness(100%)";

                var star2 = document.getElementById("starTwo");
                star2.style["-webkit-filter"] = "brightness(100%)";

                var star1 = document.getElementById("starOne");
                star1.style["-webkit-filter"] = "brightness(0)";
                break;
            case 5:
                var star5 = document.getElementById("starFive");
                star5.style["-webkit-filter"] = "brightness(100%)";

                var star4 = document.getElementById("starFour");
                star4.style["-webkit-filter"] = "brightness(100%)";

                var star3 = document.getElementById("starThree");
                star3.style["-webkit-filter"] = "brightness(100%)";

                var star2 = document.getElementById("starTwo");
                star2.style["-webkit-filter"] = "brightness(100%)";

                var star1 = document.getElementById("starOne");
                star1.style["-webkit-filter"] = "brightness(100%)";
                break;


            }
        },
        error: function (xhr, status, error) {
            console.log("error");
        }
    });
}
start();

function assignData(data) {
    var title = document.getElementById("title");
    title.innerHTML = data.title;

    var num = Math.floor((Math.random() * 2) + 1);
    console.log("Number: " + num);
    if (num == 1) {
        console.log("image 1");
        var body = document.getElementById("body");
        body.style.backgroundImage = "url('background2.jpg')";
    } else {
        var body = document.getElementById("body");
        body.style.backgroundImage = "url('background.jpg')";
        console.log("image 2");
    }



    var img = document.getElementById("author");
    console.log(data.author + data.usrID + "." + data.authorExt);
    img.src = "/images/" + data.author + data.usrID + "." + data.authorExt;
    console.log(img.src);

    var author = document.getElementById("who");
    console.log(data.authorBio);
    author.innerHTML = data.author;

    var desc = $("#desc")
        .get(0);
    desc.innerHTML = data.desc;

    var coords = document.getElementById("otherCard")
        .children[0];
    console.log(data.coords);
    coords.innerHTML = data.coords;

    var address = document.getElementById("otherCard")
        .children[1];
    console.log(data.address);
    address.innerHTML = data.address + " " + data.city + " , " + data.country;

    var type = document.getElementById("otherCard")
        .children[2];
    var strType;
    console.log(data.type);
    switch (data.type) {
    case 0:
        strType = "general";
        break;
    case 1:
        strType = "bio";
        break;
    case 2:
        strType = "Electronic";
        break;
    case 3:
        strType = "ore"
        break;
    case 4:
        strType = "metal";
        break;
    }
    type.innerHTML = "Type: " + strType;

    var im_g = document.getElementById("otherCard")
        .children[3];
    console.log("/resourceImages/" + data.title + data.itemID + "." + data.extension);
    im_g.src = "/resourceImages/" + data.title + data.itemID + "." + data.extension;

    /*If The author ID is the same as the session ID then create controls*/

    if (data.currentID === data.usrID) {
        var del = document.createElement('div');
        var control = document.getElementById("control");
        control.appendChild(del);
        del.className = "button";
        var txt = document.createElement('p');
        txt.innerHTML = "Delete";
        del.appendChild(txt);
        var tempid = data.itemID;
        del.onclick = function () {
            console.log("Current ID " + tempid);
            $.ajax({
                url: '/deleteResource',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    itemID: tempid
                }),
                dataType: 'json',
                success: function (data) {
                    console.log("success");

                },
                error: function (xhr, status, error) {
                    console.log("error");
                }
            });
        }
    }

}
