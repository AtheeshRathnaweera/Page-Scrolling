    var sections = [];
    var topOffsetVals = [];
    var dots = [];
    var sectionColors = [];

    var currentSectionNum = 0;
    var animateGoing = false;

    var slides = [];

    var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x


    $(document).ready(function () {

        $('.section').each(function () {//get all the sections
            sectionColors.push($(this).attr('clr')); //get clr attribute value and push to color array
            sections.push($(this)); // add section elements to the array
            topOffsetVals.push($(this).offset().top); // add sections offset to the array

            var innerSlidesTemp = [];
            
            $(this).children().find(".slide").each(function () {//find the slide class of the section
                innerSlidesTemp.push($(this));
            });

            if (innerSlidesTemp.length > 0) {
                //set the sector color to first slide color if slides exists
                sectionColors.pop();
                sectionColors.push(innerSlidesTemp[0].attr('clr'));

                for (var i = 0; i < innerSlidesTemp.length; i++) {
                    innerSlidesTemp[i].css("left", "100%");// set inner slides to the right
                }
            }

            slides.push(innerSlidesTemp);//push innerSildes array to the main slides array

        });


        createDots(sections.length);
        changingSections(0); //initially focus to the first section when page loads

    });





    $('body').bind(mousewheelevt, function (e) {

        var evt = window.event || e //equalize event object     
        evt = evt.originalEvent ? evt.originalEvent : evt; //convert to originalEvent if possible               
        var delta = evt.detail ? evt.detail * (-40) : evt.wheelDelta //check for detail first, because it is used by Opera and FF

        if (delta > 0) {
            console.log("scroll up");
            changingSections(-1);
            //scroll up
        } else {
            //scroll down
            console.log("scroll down");
            changingSections(1);

        }
    });

    function createDots(amount) {
        //add dots to the sections-dot div
        for (var n = 0; n < amount; n++) {
            $(".sections-dots").append('<div class="dot-holder"><span class="dot"></span></div>');
        }

        //onClick event to dots
        $(".dot").each(function () {
            $(this).click(function () {
                var clickedDotIndex = $(".dot").index(this);
                sectionDisplay(clickedDotIndex);
            });
            dots.push($(this)); //add dot to dots array
        });

    }

    function changingSections(type) {

        if (!animateGoing) {
            animateGoing = true;
            var offSetIndex = currentSectionNum + type; //temp offset var

            if (offSetIndex < 0) {
                currentSectionNum = 0; //reset the currentSectionNum
                animateGoing = false;
                return;
            } else if (offSetIndex >= topOffsetVals.length) {
                currentSectionNum = topOffsetVals.length - 1;
                animateGoing = false;
                return;
            } else {
                sectionDisplay(offSetIndex); //pass offSetIndex as the section id
            }
        } else {
            console.log("animation is going.");
        }

    }

    var previousSlide = 0;

    function sectionDisplay(sectionNumber) {
        sections[sectionNumber].css("background-color", sectionColors[sectionNumber]); //set current section backgroud color

        $('html,body').animate({
            scrollTop: topOffsetVals[sectionNumber]
        }, 800).promise().done(function () {
            //wait till the animation is done (add time delay)

            dots[currentSectionNum].removeClass("active"); //setting active status of dots
            dots[sectionNumber].addClass("active");

            currentSectionNum = sectionNumber; //set currentSectionNumber to new section index
            animateGoing = false;

            if (slides[sectionNumber].length > 0) {
                $("#arrows").show();

                for (var x = 0; x < slides[sectionNumber].length; x++) {
                    if (x == 0) {
                        changeTheSlides(currentSectionNum, 0); //show the first slide
                    } else {
                        slides[sectionNumber][x].css("left", "100%");
                    }
                }
            } else {
                $("#arrows").css("display", "none");
            }


        });

    }



    function changeTheSlides(currentSection, type) {
        var slidesArray = slides[currentSection]; //get the slides of the current section

        if (slidesArray.length > 0) {
            //check whether the slides are exist or not
            var newSlide = previousSlide + type; //new slide index

            arrowActions(type);

            if (newSlide < 0) {
                previousSlide = 0;
                //reset the previous slide var if the arrow press for view -1 slide
            } else if (type == 0) {
                //type 0 for show the first slide
                //always show the first slide when the section is changed
                slidesArray[0].show().animate({
                    left: "0%"
                }, 800).promise().done(function () {
                    sections[currentSection].css("background-color", slidesArray[0].attr("clr"));
                });
                previousSlide = 0;

            } else if (newSlide >= slidesArray.length) {
                previousSlide = slidesArray.length - 1;
                //reset the previous slide var
            } else {
                if (type == 1) {
                    //right to left
                    slidesArray[previousSlide].hide().animate({
                        left: "-100%"
                    }, 800);

                    slidesArray[newSlide].show().animate({
                        left: "0%"
                    }, 800);
                } else if (type == -1) {
                    //left to right
                    slidesArray[previousSlide].hide().animate({
                        left: "100%"
                    }, 800);

                    slidesArray[newSlide].show().animate({
                        left: "0%"
                    }, 800);

                }


                slidesArray[newSlide].css("background-color", slidesArray[newSlide].attr("clr")); //set background color

                sections[currentSection].css("background-color", slidesArray[previousSlide].attr("clr")); //change the section color to previous slid color to avoid section color display

                console.log("slide color : " + slidesArray[newSlide].attr("clr"));
                previousSlide = newSlide;
            }
        }


    }

    //handling the key inputs
    $(document).keyup(function (e) {
        if (e.which === 38) {
            e.preventDefault(); //prevent default scrolling
            changingSections(-1); //go to previouse section
        } else if (e.which === 40) {
            e.preventDefault();
            changingSections(1); //go to next section
        } else if (e.which === 39) {
            console.log("slides cur: " + currentSectionNum);
            console.log("right key pressed.");
            changeTheSlides(currentSectionNum, 1);
        } else if (e.which === 37) {
            changeTheSlides(currentSectionNum, -1);
        }
    });
