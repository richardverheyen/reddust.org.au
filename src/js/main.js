$(document).ready(function() {

  //mobile Dropdown Menu Toggle
  var mobileNavActive = false;
  $('header nav>div').on('click', function() {

    if (mobileNavActive) {
      $('body').removeClass('mobile-nav-active');
      mobileNavActive = false;
    } else {
      $('body').addClass('mobile-nav-active');
      mobileNavActive = true;
      $('html, body').animate({
        scrollTop: 0
      }, 200);
    }

  });

  // Animate the horizantal program sliders
  $('.program-slider nav img').on('click', function() {
    var $section = $(this).parents('section'); // reusable jQuery selector
    var $ul = $section.children('ul');
    var amountOfSlides = $section.children('ul').children('li').length; // count the amount of slides
    var currentSlide = $section.data('current') || 1; // if no data attribute is found on <section> then assume current slide is 1
    var increment = $(this).hasClass('next') ? 1 : -1;
    var newSlide = currentSlide + increment;
    var newLeft = -100 * (newSlide - 1) + '%';
    var isAnimating = $ul.hasClass('velocity-animating') ? true : false;
    if (newSlide < 1) {
      // if first slide, spring left and back
      if (!isAnimating) {
        $ul.velocity('stop')
          .velocity({ translateX: '150px' }, 250, "easeOutQuad")
          .velocity({ translateX: '0px' }, 250, "easeInSine");
      }
    } else if (newSlide > amountOfSlides) {
      // if last slide, spring right and back
      if (!isAnimating) {
        $ul.velocity('stop')
          .velocity({ translateX: '-150px' }, 250, "easeOutQuad")
          .velocity({ translateX: '0px' }, 250, "easeInSine");
      }
    } else {
      // if not first or last slide, slide to next or previous slide
      $section
        .data('current', newSlide)
        .find('ul').velocity('stop').velocity({
          left: -100 * (newSlide - 1) + '%'
        }, 800, 'easeOutExpo');
    }
  });

  $('#about-people #people [src="/assets/img/people/"]').parents('.flip-container').addClass('hover');

});
