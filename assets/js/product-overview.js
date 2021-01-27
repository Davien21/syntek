/// <reference path="../typings/tsd.d.ts" />

jQuery(function( $ ) {
  function increaseQuantity(max=null) {
    $('.quantity-adjuster .add').click(function () {
      let input = $(this).siblings('input')[0]
      if (input.value !== 0 && !max) return input.value++;
      if (input.value < max) return input.value++
    })
  }
  function decreaseQuantity() {
    $('.quantity-adjuster .reduce').click(function () {
      let input = $(this).siblings('input')[0]
      if (input.value > 0) return input.value--;
    })
  }
  increaseQuantity(5);
  decreaseQuantity();
  

})
  