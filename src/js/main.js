$(document).ready(function() {
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
    };

  });
});
