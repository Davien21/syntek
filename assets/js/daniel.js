/* 
*Daniel js is a library I'
*/

function dropToggler() {
  $(".dropper").click(function(){
    $(".dropper +").slideToggle()
  });
  $('.drop').css('display', 'none')
}
function autoFixInAltProps() {
  $('img:not([alt])').prop('alt', '');
}
