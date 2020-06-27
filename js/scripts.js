/*!
    * Start Bootstrap - Freelancer v6.0.3 (https://startbootstrap.com/themes/freelancer)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-freelancer/blob/master/LICENSE)
  */


(function ($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 71)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Scroll to top button appear
  $(document).scroll(function () {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function () {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 80
  });

  // Collapse Navbar
  var navbarCollapse = function () {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Floating label headings for the contact form
  $(function () {
    $("body").on("input propertychange", ".floating-label-form-group", function (e) {
      $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function () {
      $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function () {
      $(this).removeClass("floating-label-form-group-with-focus");
    });
  });

})(jQuery); // End of use strict


///////// COVID-CHECKER APP ////////////////////

//Initialise postdata
var postdata = {
    sex: "", //string
    age: 0, //number
    evidence: //object
        []
};

//Handle sex and age form
$("#sexAndAgeSubmit").on("click", function (event) {
    event.preventDefault();
    var sex = $(".sex");
    for (var i = 0, length = sex.length; i < length; i++) {
        if (sex[i].checked) {
            postdata.sex = sex[i].value;
            break;
        }
    }
    postdata.age = parseInt($("#age").val());
    var countrySelected = $("#countries option:selected").attr('id');
    //Add optional Evidence for country
    if (countrySelected != null) {
        var countryEvidence = {};
        countryEvidence["id"] = countrySelected;
        countryEvidence["choice_id"] = "present";
        postdata.evidence.push(countryEvidence);
    }
    sendDiagnosis(postdata);
    $("#sexAndAge").attr("style", "display: none");
});

//Handle diagnosis request
function sendDiagnosis(postdata) {
    postdata = JSON.stringify(postdata);
    $.ajax({
        url: "https://api.infermedica.com/covid19/diagnosis",
        headers: {
            "App-Id": "7d326ac8",
            "App-Key": "accd209fd1ad490d9afe04738678b015"
        },
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: postdata,
        success: function (data) {
            var responseJSON = data;
            //console.log(responseJSON);
            if (responseJSON.should_stop != true) {
                displayQuestionAndAnswers(responseJSON);
            } else sendTriage(responseJSON);
        },
        error: function () {
            $("#sexAndAge").attr("style", "display: block");
            alert("You have entered an invalid answer. Please try again.");
        }
    });
}

//Display question and answers while diagnosis is undertaken
function displayQuestionAndAnswers(responseJSON) {
    $("#questions").attr("style", "display: block");
    var question = $("<h5>").text(responseJSON.question.text);
    var questionType = responseJSON.question.type;
    $("#question").append(question);
    var questionLineBreak = $("<br>");
    $("#question").append(questionLineBreak);
    var answer = responseJSON.question.items;
    //console.log((questionItems));
    for (var i = 0; i < answer.length; i++) {
        var item = $("<h6>").text(answer[i].name + "    ");
        $("#question").append(item);
        //Check if the answer requires one answer only (radio button)
        if (questionType == "group_single") {
            var yes = $('<input type="radio" name="rbtnCount" checked/>');
        } else {
            var yes = $('<input type="checkbox">');
        }
        yes.attr("class", "answer");
        yes.attr("id", answer[i].id);
        item.append(yes);
        var yesTick = $("<label>").text("Present");
        yes.append(yesTick);
        if (answer[i].explanation != null) {
            var explanation = $("<p>").text(answer[i].explanation);
            explanation.attr("class", "form-text text-muted");
            item.append(explanation);
        }
        $("#questionSubmit").attr("style", "display: block");
    }
}

//Handle diagnosis submission button
$("#questionSubmit").on("click", function () {
    $("#questionSubmit").attr("style", "display: none");
    var answer = $(".answer");
    for (var i = 0, length = answer.length; i < length; i++) {
        var answerEvidence = {};
        answerEvidence["id"] = answer[i].id;
        if (answer[i].checked) {
            answerEvidence["choice_id"] = "present";
        } else {
            answerEvidence["choice_id"] = "absent";
        }
        postdata.evidence.push(answerEvidence);
    }
    $("#question").empty();
    //console.log(postdata);
    sendDiagnosis(postdata);
});

//Call this function when the response should_stop value is true and the test has concluded
function sendTriage() {
    postdata = JSON.stringify(postdata);
    $.ajax({
        url: "https://api.infermedica.com/covid19/triage",
        headers: {
            "App-Id": "7d326ac8",
            "App-Key": "accd209fd1ad490d9afe04738678b015"
        },
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: postdata,
        success: function (data) {
            var responseJSON = data;
            //console.log(responseJSON);
            var label = $("<h5>").text("Result: " + responseJSON.label);
            $("#question").append(label);
            var description = $("<p>").text(responseJSON.description +
                " (Triage level code reference: " +
                responseJSON.triage_level +
                ")");
            $("#question").append(description);
            $("#questionSubmit").attr("style", "display: none");
            var restart = $("<button>").text("Restart COVID-CHECKER");
            restart.attr("id", "restart");
            restart.attr("class","btn btn-primary btn-lg btn-block");
            $("#question").append(restart);
            //Reset postdata
            postdata = {
                sex: "", //string
                age: 0, //number
                evidence: //object
                    []
            };
            //Handle restart button
            $("#restart").on("click", function () {
                $("#sexAndAge").attr("style", "display: block");
                $("#questions").attr("style", "display: none");
                label.remove();
                description.remove();
                restart.remove();
            });
        },
        error: function () {
            $("#sexAndAge").attr("style", "display: block");
            alert("You have entered an invalid answer. Please try again.");
        }
    });
}
//Optional feature for the test; gets a list of countries with local COVID transmission
function getLocations() {
    $.ajax({
        url: "https://api.infermedica.com/covid19/locations",
        headers: {
            "App-Id": "7d326ac8",
            "App-Key": "accd209fd1ad490d9afe04738678b015"
        },
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            var countriesArray = [];
            $("#countries").append($("<option>").attr('selected', "selected"));
            for (var i = 0; i < data.length; i++) {
                var countryInfo = {
                    name: data[i].name,
                    id: data[i].id,
                    has_local_covid_transmission: data[i].extras.has_local_covid_transmission
                };
                countriesArray.push(countryInfo);
            }
            countriesArray = $.grep(countriesArray, function (v) {
                return v.has_local_covid_transmission == true;
            });
            //console.log(countriesArray);
            $(countriesArray).each(function () {
                $("#countries").append($("<option>").attr('id', this.id).text(this.name));
            });
        },
        error: function () {
            alert("Cannot retrieve countries list.");
        }
    });
}

getLocations();


///////// NEWS SECTION HANDLER ////////////////

function getHeadlines() {
  var countryCode = "";
  var locationSettings = {
    "async": true,
    "crossDomain": true,
    "url": "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/",
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
      "x-rapidapi-key": "d17bca8126msh409010c4680f5aap169ce0jsnf3966f718bbf"
    }
  };
  //Get country from geolocation
  $.ajax(locationSettings).done(function (response) {
    //Get headlines for successful geolocation
    countryCode = response.country_code;
    //countryCode = "GB"; //Test other country codes
    var newsSettings = {
      "async": true,
      "crossDomain": true,
      "url": "https://covid-19-news.p.rapidapi.com/v1/covid?lang=en&sort_by=date&page_size=10&country=" +
        countryCode +
        "&q=covid&ranked_only=TRUE",
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "covid-19-news.p.rapidapi.com",
        "x-rapidapi-key": "d17bca8126msh409010c4680f5aap169ce0jsnf3966f718bbf"
      }
    };
    $.ajax(newsSettings).done(function (response) {
      //News gets displayed
      displayNews(response);
    });
  });
}

function displayNews(response) {
  var headlines = response.articles;
  var previousHeadline = "";
  var maxNews = 6; //Configurable number of headlines
  for (var i = 0; i < maxNews; i++) {
    //Check if previous headline was already reported. We don't want duplicate news.
    if (previousHeadline != headlines[i].title) {
      var newsCard = $("<div>");
      newsCard.attr("class", "card");
      newsCard.attr("style", "width : 20rem; height : 20rem; float : left; margin : 5px");
      newsCard.attr("id", i);
      if (i < 3) {
        $("#headlines").append(newsCard);
      } else {
        $("#headlines2").append(newsCard);
      }
      var newsCardBody = $("<div>");
      newsCardBody.attr("class", "card-body");
      newsCard.append(newsCardBody);
      var headlineLink = headlines[i].link;
      var goToPage = $("<a>");
      goToPage.attr("href", headlineLink);
      goToPage.attr("target", "_blank");
      newsCardBody.append(goToPage);
      var headline = $("<h6>").text(headlines[i].title + " \n (" + headlines[i].clean_url + ")");
      goToPage.append(headline);
      //var summary = $("<p>").text(headlines[i].summary + "\n Source: [" + headlines[i].clean_url + "]");
      //summary.attr("style", "height: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;");
      //newsCardBody.append(summary);
      previousHeadline = headlines[i].title;
      appendImage(headlineLink, newsCard);
    }
  }

}

//Add images to the cards
function appendImage(headlineLink, newsCard) {
  var imageURL = "https://cors-anywhere.herokuapp.com/" + headlineLink;
  $.ajax({
    url: imageURL //"https://cors-anywhere.herokuapp.com/" + headlineLink
  }).then(function (data) {
    var html = $(data);
    var imageUnavailableSRC = "https://www.health.mil/-/media/Images/MHS/Photos/CDC-coronavirus.ashx?h=407&la=en&mw=720&w=720&hash=3DB38BA5F52E762419150762BFCF1CD044B01A29F38A7DFCB338A9CB6E2FC029";
    var imageSRC = html.find('img').attr('src');
    if (!/^https?:\/\//.test(imageSRC)) {
      imageSRC = imageUnavailableSRC;
    }
    var image = $("<img>");
    image.attr("src", imageSRC);
    image.attr("style", "width: 19rem");
    newsCard.prepend(image);
  });
}

getHeadlines();

