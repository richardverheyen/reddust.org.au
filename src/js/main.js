$(document).ready(function() {
  var mobileNavActive = false;
  $('header nav>div').on('click', function() {

    if (mobileNavActive) {
      $('body').removeClass('mobileNavActive');
      mobileNavActive = false;
    } else {
      $('body').addClass('mobileNavActive');
      mobileNavActive = true;
      $('html, body').animate({
        scrollTop: 0
      }, 200);
    };

  });
});
