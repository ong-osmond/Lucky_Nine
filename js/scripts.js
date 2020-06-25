/*!
    * Start Bootstrap - Freelancer v6.0.3 (https://startbootstrap.com/themes/freelancer)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-freelancer/blob/master/LICENSE)
    */
    (function($) {
    "use strict"; // Start of use strict
  
    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
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
    $(document).scroll(function() {
      var scrollDistance = $(this).scrollTop();
      if (scrollDistance > 100) {
        $('.scroll-to-top').fadeIn();
      } else {
        $('.scroll-to-top').fadeOut();
      }
    });
  
    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function() {
      $('.navbar-collapse').collapse('hide');
    });
  
    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({
      target: '#mainNav',
      offset: 80
    });
  
    // Collapse Navbar
    var navbarCollapse = function() {
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
    $(function() {
      $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
      }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
      }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
      });
    });
  
  })(jQuery); // End of use strict


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
          }
          //Get country from geolocation
      $.ajax(locationSettings).done(function(response) {
          //console.log(response);
          //Get headlines for successful geolocation
          countryCode = response.country_code;
          //countryCode = "GB";
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
          }

          $.ajax(newsSettings).done(function(response) {
              ////console.log(response);
              //News gets displayed
              displayNews(response);
          });
      });



  }

  getHeadlines();

  function displayNews(response) {
      //console.log(response.articles);
      headlines = response.articles;
      var previousHeadline = "";
      var imageURL = "";
      for (var i = 0; i < 6; i++) {
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
              ////console.log(previousHeadline);
              appendImage(headlineLink, newsCard);


          }



      }

  }

  //Add images to the cards
  function appendImage(headlineLink, newsCard) {
      imageURL = "https://cors-anywhere.herokuapp.com/" + headlineLink;
      $.ajax({
          url: imageURL //"https://cors-anywhere.herokuapp.com/" + headlineLink
      }).then(function(data) {
          var html = $(data);
          ////console.log(imageURL);
          var imageUnvailableSRC = "https://www.health.mil/-/media/Images/MHS/Photos/CDC-coronavirus.ashx?h=407&la=en&mw=720&w=720&hash=3DB38BA5F52E762419150762BFCF1CD044B01A29F38A7DFCB338A9CB6E2FC029";
          imageSRC = html.find('img').attr('src');
          if (!/^https?:\/\//.test(imageSRC)) {
              imageSRC = imageUnvailableSRC;
          }
          var image = $("<img>");
          image.attr("src", imageSRC);
          image.attr("style", "width: 20rem")
              //console.log(imageSRC);
          newsCard.prepend(image);
      });
  }

  