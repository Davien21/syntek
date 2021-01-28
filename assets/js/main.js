$(document).ready(function() {
    // $(function($) {
    //     $("img.lazy").Lazy();
    // });
    'use strict';
    /* ====== Helpful and Reusable functions ====== */
    function addEffectonEvent (effectClass,event,identity,classToRemove='') {
        let but = $('.contact-text');
        if (classToRemove !== '') {
            $(identity).removeClass(classToRemove)
        }
        $(identity).on(event, function(){
            $(identity).addClass(effectClass)
        })
    }
    addEffectonEvent('tada','mouseenter','.instagram-link');
    removeEffectonEvent('tada','mouseleave','.instagram-link');
    function removeEffectonEvent (effectClass,event,identity,classToAdd='') {
        let but = $('.contact-text');
        $(identity).on(event, function(){
            $(identity).removeClass(effectClass)
        })
        if (classToAdd !== '') {
            $(identity).addClass(classToAdd)
        }
    }
    /* ====== Specific functions ====== */
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        }
        , BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        }
        , iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        }
        , Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        }
        , Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        }
        , any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    // Full Height
    var fullHeight = function () {
        if (!isMobile.any()) {
            $('.js-fullheight').css('height', $(window).height());
            $(window).resize(function () {
                $('.js-fullheight').css('height', $(window).height());
            });
        }
    };
    // Animations
    var contentWayPoint = function () {
        var i = 0;
        $('.animate-box').waypoint(function (direction) {
            if (direction === 'down' && !$(this.element).hasClass('animated')) {
                i++;
                $(this.element).addClass('item-animate');
                setTimeout(function () {
                    $('body .animate-box.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            var effect = el.data('animate-effect');
                            let className = effect +' animated';
                            el.addClass(className);
                            el.removeClass('item-animate');
                        }, k * 200, 'easeInOutExpo');
                    });
                }, 100);
            }
        }, {
            offset: '85%'
        });
    };
    // Burger Menu 
    var burgerMenu = function () {
        $('.js-syntek-nav-toggle').on('click', function (event) {
            event.preventDefault();
            var $this = $(this);
            if ($('body').hasClass('offcanvas')) {
                $this.removeClass('active');
                $('body').removeClass('offcanvas');
            }
            else {
                $this.addClass('active');
                $('body').addClass('offcanvas');
            }
        });
    };
    // Click outside of offcanvass
    var mobileMenuOutsideClick = function () {
        $(document).click(function (e) {
            var container = $("#syntek-aside, .js-syntek-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('offcanvas')) {
                    $('body').removeClass('offcanvas');
                    $('.js-syntek-nav-toggle').removeClass('active');
                }
            }
        });
        $(window).scroll(function () {
            if ($('body').hasClass('offcanvas')) {
                $('body').removeClass('offcanvas');
                $('.js-syntek-nav-toggle').removeClass('active');
            }
        });
    };
    // Sub Menu 
    $('#syntek-main-menu li.syntek-sub>a').on('click', function () {
        $(this).removeAttr('href');
        var element = $(this).parent('li');
        if (element.hasClass('open')) {
            element.removeClass('open');
            element.find('li').removeClass('open');
            element.find('ul').slideUp();
        }
        else {
            element.addClass('open');
            element.children('ul').slideDown();
            element.siblings('li').children('ul').slideUp();
            element.siblings('li').removeClass('open');
            element.siblings('li').find('li').removeClass('open');
            element.siblings('li').find('ul').slideUp();
        }
    });
    $('#syntek-main-menu>ul>li.syntek-sub>a').append('<span class="holder"></span>');
    // Slider
    var sliderMain = function () {
        $('#syntek-hero .flexslider').flexslider({
            animation: "fade"
            , slideshowSpeed: 5000
            , directionNav: true
            , start: function () {
                setTimeout(function () {
                    $('.slider-text').removeClass('animated fadeInUp');
                    $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
                }, 500);
            }
            , before: function () {
                setTimeout(function () {
                    $('.slider-text').removeClass('animated fadeInUp');
                    $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
                }, 500);
            }
        });
    };
    // Sticky 
    var stickyFunction = function () {
        var h = $('.image-content').outerHeight();
        if ($(window).width() <= 992) {
            $("#sticky_item").trigger("sticky_kit:detach");
        }
        else {
            $('.sticky-parent').removeClass('stick-detach');
            $("#sticky_item").trigger("sticky_kit:detach");
            $("#sticky_item").trigger("sticky_kit:unstick");
        }
        $(window).resize(function () {
            var h = $('.image-content').outerHeight();
            $('.sticky-parent').css('height', h);
            if ($(window).width() <= 992) {
                $("#sticky_item").trigger("sticky_kit:detach");
            }
            else {
                $('.sticky-parent').removeClass('stick-detach');
                $("#sticky_item").trigger("sticky_kit:detach");
                $("#sticky_item").trigger("sticky_kit:unstick");
                $("#sticky_item").stick_in_parent();
            }
        });
        $('.sticky-parent').css('height', h);
        $("#sticky_item").stick_in_parent();
    };
    // Document on load.
    $(function () {
        fullHeight();
        contentWayPoint();
        burgerMenu();
        mobileMenuOutsideClick();
        sliderMain();
        stickyFunction();
    });
    // Sections background image from data background
    var pageSection = $(".bg-img, section");
    pageSection.each(function (indx) {
        if ($(this).attr("data-background")) {
            $(this).css("background-image", "url(" + $(this).data("background") + ")");
        }
    });
    // Testimonials owlCarousel
    $('.testimonials .owl-carousel').owlCarousel({
        loop:true,
        margin: 30,
        mouseDrag:true,
        autoplay:false,
        dots: false,
        nav: true,
        navText: ["<span class='lnr ti-angle-left'></span>","<span class='lnr ti-angle-right'></span>"],
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
            },
            600:{
                items:2
            },
            1000:{
                items:2
            }
        }
    });
    $('.events .owl-carousel').owlCarousel({
        loop:true,
        margin: 30,
        mouseDrag:true,
        autoplay:true,
        dots: false,
        nav: true,
        navText: ["<span class='lnr ti-angle-left'></span>","<span class='lnr ti-angle-right'></span>"],
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
            },
            600:{
                items:2
            },
            1000:{
                items:2
            }
        }
    });
    // samples owlCarousel
    $('.samples .owl-carousel').owlCarousel({
        loop:true,
        margin: 10,
        mouseDrag:true,
        autoplay:true,
        dots: false,
        responsiveClass:true,
        responsive:{
            0:{
                margin: 0,
                items:1
            },
            600:{
                items:3
            },
            1000:{
                margin: 30,
                items:3
            }
        }
    });
    // Team owlCarousel
    $('.team .owl-carousel').owlCarousel({
        loop: true,
        margin: 0,
        autoplay: false,
        dots: true,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                autoplay:true,
            },
            600:{
                items:2,
                autoplay:true,
            },
            1000:{
                items:3,
                autoplay:false,
            }
        }
    });
     // Accordion
    $(document).ready(function() {
        $('.collapse').on('shown.bs.collapse', function () {
            $(this).parent().addClass('active');
        });
        $('.collapse').on('hidden.bs.collapse', function () {
            $(this).parent().removeClass('active');
        });
    });
    /* ======= Declaratives =======*/
    $('section.syntek-testimonial .item-box').addClass('border');
    $(".currentYear").text((new Date).getFullYear())
    /* ======= Extras =======*/
    // img zoom
     $(".img-zoom").magnificPopup({
        type: "image"
        , closeOnContentClick: !0
        , mainClass: "mfp-fade"
        , gallery: {
            enabled: !0
            , navigateByImgClick: !0
            , preload: [0, 1]
        }
    })
    var buttons = document.querySelectorAll(".btn .btn-contact .syntek-contact-info");
    for(var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      button.addEventListener("click", function() {
        if(!button.classList.contains("active"))
          button.classList.add("active");
        else
          button.classList.remove("active");
      });
    }
});
