isProduction = location.host === 'www.reddust.org.au' ? true : false;
environment = isProduction ? 'production' : 'staging';

// Google Analytics

/* jshint ignore:start */

(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function() {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date();
  a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

/* jshint ignore:end */

if (!!ga) {
  ga('create', 'UA-34474019-10', 'auto');
  ga('set', { dimension1: environment });
  ga('send', 'pageview');
}

function openModal() {
  var speed = 700;
  var easing = 'easeOutExpo';
  var $overlay = $('#modals .overlay');
  var $modal = $('#modals .modal');
  if (!$modal.hasClass('velocity-animating')) {
    $('body').addClass('prevent-scroll'); // prevent users from scrolling the content behind the modal
    $('#modals').show();
    $overlay.velocity('stop').velocity({
      opacity: 1
    }, speed, easing);
    $modal.velocity('stop').velocity({
      translateY: ['0%', '30%'],
      scale: [1, 0.9]
    }, speed, easing);
  }
}

function closeModal() {
  var speed = 400;
  var easing = 'easeOutExpo';
  var $overlay = $('#modals .overlay');
  var $modal = $('#modals .modal');
  if (!$modal.hasClass('velocity-animating')) {
    $overlay.velocity('stop').velocity({
      opacity: 0
    }, speed, easing);
    $modal.velocity('stop').velocity({
      translateY: '30%',
      scale: 0.9
    }, speed, easing, function() {
      $('#modals').hide();
      $('body').removeClass('prevent-scroll');
    });
  }
}

$(document).ready(function() {

  // Open & close the mobile navigation
  var mobileNavActive = false;
  $('header nav button').on('click', function() {
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

  // Clicking a person opens the modal
  $('.tiles.people li').on('click', function() {
    var $bio = $(this).find('.bio').clone();
    var $img = $(this).find('.img').clone();
    var $modal = $('#modals .modal');
    $('#modals .modal .content').html('').append($img).append($bio);
    openModal();
    if ($img.length) {
      $modal.addClass('has-image');
    } else {
      $modal.removeClass('has-image');
    }
  });

  // Clicking the modal overlay or close button closes the modal
  $('#modals').find('.overlay, .modal>svg').on('click', function() {
    closeModal();
  });

  // Prevent the modal from closing when clicking inside the modal box
  $('#modals .modal').on('click', function(event) {
    event.stopPropagation();
  });

});
