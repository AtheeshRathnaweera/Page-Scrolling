    var sections = [];
    var topOffsetVals = [];
    var dots = [];
    var sectionColors = [];

    var currentSectionNum = 0;
    var animateGoing = false;

    var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x


    $(document).ready(function () {

        $('.section').each(function () {
            sectionColors.push($(this).attr('clr'));//get clr attribute value and push to color array
            sections.push($(this)); // add section elements to the array
            topOffsetVals.push($(this).offset().top);// add sections offset to the array

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
            dots.push($(this));//add dot to dots array
        });

    }

    function changingSections(type) {

        if (!animateGoing) {
            animateGoing = true;
        //    previousSectionNum = currentSectionNum;
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
                sectionDisplay(offSetIndex);//pass offSetIndex as the section id
            }
        } else {
            console.log("animation is going.");
        }

    }

    function sectionDisplay(sectionNumber) {
        sections[sectionNumber].css("background-color", sectionColors[sectionNumber]); //set current section backgroud color

        $('html,body').animate({
            scrollTop: topOffsetVals[sectionNumber]
        }, 800).promise().done(function () {
            //wait till the animation is done (add time delay)
            
            dots[currentSectionNum].removeClass("active");//setting active status of dots
            dots[sectionNumber].addClass("active");
            
            currentSectionNum = sectionNumber;//set currentSectionNumber to new section index
            animateGoing = false;
        });

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
            console.log("right key pressed.");
        } else if (e.which === 37) {
            console.log("left key pressed.");
        }
    });
