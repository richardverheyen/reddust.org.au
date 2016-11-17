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
    };

  });

  //leaving this for Jan
  $('.scroller ul .right').on('click', function() {
    console.log('clicked!')
    var scrollerPosition = $(this).parent().parent().css('margin-left'),
      pageWidth = $(window).width(),
      scrollerPositionNumber = parseInt(scrollerPosition),
      newScrollerPosition = scrollerPositionNumber - pageWidth;
    $(this).parent.parent.css('margin-left', newScrollerPosition + 'px')
  })

});
