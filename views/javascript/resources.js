        function selectResources() {
            $("#HBL")
                .removeClass("active");
            $("#ABL")
                .removeClass("active");
            $("#RBL")
                .addClass("active");
            console.log("Making Resources Active");
        }
        selectResources();

        function fillList(value) {
            console.log("Filling List");
            $.ajax({
                url: '/getResources',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.moreData && data.logged) {
                        console.log(data);
                        var list = document.getElementById('list');
                        var entry = document.createElement('li');
                        var di = document.createElement('div');
                        di.id = "" + data.id; //make sure this works
                        console.log("Value is " + value);
                        di.onclick = function () {
                            data.id = data.id;
                            console.log("ID is: " + data.id);
                            $.ajax({
                                url: '/sendID',
                                type: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify(
                                    data),
                                dataType: 'json',
                                success: function (
                                    data1) {
                                    console.log(
                                        "success"
                                    );
                                    window.location
                                        .href =
                                        '/resourcePage'
                                },
                                error: function (xhr,
                                    status, error) {
                                    console.log(
                                        "error"
                                    );
                                }
                            });
                        }
                        di.className = "resourceArea";
                        colorStuff(di);
                        var picture = document.createElement('img');
                        picture.src = "/resourceImages/" + data.title +
                            data.id +
                            "." + data.ext;
                        console.log("/resourceImages/" + data.title +
                            data.id +
                            "." + data.ext);
                        picture.className = "scrap";
                        var authorPic = document.createElement(
                            'img');
                        authorPic.className = "author";
                        authorPic.src = "/images/" + data.author +
                            data.usrID +
                            "." + data.authorExt;
                        di.appendChild(authorPic);
                        di.appendChild(picture);
                        var authorName = document.createElement('p');
                        authorName.className = "authorName";
                        console.log("Author name is: " + data.author);
                        authorName.innerHTML = data.author;
                        di.appendChild(authorName);
                        var heading = document.createElement('h4');
                        heading.className = "title";
                        heading.innerHTML = data.title;
                        heading.id = "tit";
                        list.appendChild(entry);
                        entry.appendChild(di);
                        di.appendChild(heading);
                        fillList(value + 1);
                        var starDiv = document.createElement('div');
                        di.appendChild(starDiv);
                        starDiv.className = "radioButton";
                        var radio = document.createElement('div');
                        starDiv.appendChild(radio);
                        radio.className = "radio";
                        var image1 = document.createElement('img');
                        radio.appendChild(image1);
                        image1.className = "stars";
                        image1.id = "starOne";
                        image1.src = "star.png";
                        var radio = document.createElement('div');
                        starDiv.appendChild(radio);
                        radio.className = "radio";
                        var image2 = document.createElement('img');
                        radio.appendChild(image2);
                        image2.className = "stars";
                        image2.id = "starTwo";
                        image2.src = "star.png";
                        var radio = document.createElement('div');
                        starDiv.appendChild(radio);
                        radio.className = "radio";
                        var image3 = document.createElement('img');
                        radio.appendChild(image3);
                        image3.className = "stars";
                        image3.id = "starThree";
                        image3.src = "star.png";
                        var radio = document.createElement('div');
                        starDiv.appendChild(radio);
                        radio.className = "radio";
                        var image4 = document.createElement('img');
                        radio.appendChild(image4);
                        image4.className = "stars";
                        image4.id = "starFour";
                        image4.src = "star.png";
                        var radio = document.createElement('div');
                        starDiv.appendChild(radio);
                        radio.className = "radio";
                        var image5 = document.createElement('img');
                        radio.appendChild(image5);
                        image5.className = "stars";
                        image5.id = "starFive";
                        image5.src = "star.png";
                        console.log("rank: " + data.rank);
                        var number_of_comments = document.createElement(
                            'p');
                        number_of_comments.className = "numOfComm";
                        starDiv.appendChild(number_of_comments);
                        number_of_comments.innerHTML = "Raters: " +
                            data.num_rating;
                        switch (data.rank) {
                        case -1:
                            image5.style["-webkit-filter"] =
                                "brightness(0)";
                            image4.style["-webkit-filter"] =
                                "brightness(0)";
                            image3.style["-webkit-filter"] =
                                "brightness(0)";
                            image2.style["-webkit-filter"] =
                                "brightness(0)";
                            image1.style["-webkit-filter"] =
                                "brightness(0)";
                            break;
                        case 1:
                            image5.style["-webkit-filter"] =
                                "brightness(100%)";
                            image4.style["-webkit-filter"] =
                                "brightness(0)";
                            image3.style["-webkit-filter"] =
                                "brightness(0)";
                            image2.style["-webkit-filter"] =
                                "brightness(0)";
                            image1.style["-webkit-filter"] =
                                "brightness(0)";
                            break;
                        case 2:
                            console.log("stuff: " + image5);
                            image5.style["-webkit-filter"] =
                                "brightness(100%)";
                            image4.style["-webkit-filter"] =
                                "brightness(100%)";
                            image3.style["-webkit-filter"] =
                                "brightness(0)";
                            image2.style["-webkit-filter"] =
                                "brightness(0)";
                            image1.style["-webkit-filter"] =
                                "brightness(0)";
                            break;
                        case 3:
                            image5.style["-webkit-filter"] =
                                "brightness(100%)";
                            image4.style["-webkit-filter"] =
                                "brightness(100%)";
                            image3.style["-webkit-filter"] =
                                "brightness(100%)";
                            image2.style["-webkit-filter"] =
                                "brightness(0)";
                            image1.style["-webkit-filter"] =
                                "brightness(0)";
                            break;
                        case 4:
                            image5.style["-webkit-filter"] =
                                "brightness(100%)";
                            image4.style["-webkit-filter"] =
                                "brightness(100%)";
                            image3.style["-webkit-filter"] =
                                "brightness(100%)";
                            image2.style["-webkit-filter"] =
                                "brightness(100%)";
                            image1.style["-webkit-filter"] =
                                "brightness(0)";
                            break;
                        case 5:
                            image5.style["-webkit-filter"] =
                                "brightness(100%)";
                            image4.style["-webkit-filter"] =
                                "brightness(100%)";
                            image3.style["-webkit-filter"] =
                                "brightness(100%)";
                            image2.style["-webkit-filter"] =
                                "brightness(100%)";
                            image1.style["-webkit-filter"] =
                                "brightness(100%)";
                            break;
                        }

                    } else {
                        console.log("All Data Used in MYSQL");
                    }
                },
                error: function (xhr, status, error) {
                    console.log("error");
                }
            });
        }
        var value = 0;
        fillList(value);

        function colorStuff(item) {
            item.style.color = "#FFFFFF";
            var num = Math.floor((Math.random() * 5));
            console.log(num);
            switch (num) {

            case 0:
                item.style.background = "#808000";
                break;
            case 1:
                item.style.background = "#2E8B57";
                break;
            case 2:
                item.style.background = "#800080";
                break;
            case 3:
                item.style.background = "#000080";
                break;
            case 4:
                item.style.background = "#6A5ACD";
                break;
            case 5:
                item.style.background = "#2F4F4F";
                break;
            }

        }
