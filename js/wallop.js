(function($){
  Drupal.behaviors.wallop = {
    attach: function (context, settings) {
      var wallop_has_processed = document.querySelectorAll('.wallop-processed');
      var loadNext = function (currentSlideShow, autoplay = false) {
        var nextIndex = (currentSlideShow.currentItemIndex + 1) % currentSlideShow.allItemsArray.length;
        currentSlideShow.goTo(nextIndex);
      };
      if(wallop_has_processed.length) {
        console.log("Bail out since we already processed our Wallop slides.");
        return;
      }

      console.log(settings.wallop);
      if (settings.wallop) {
        if (settings.wallop.instances) {
          var wallop_slideshows = [];
          for (var id in settings.wallop.instances) {
            // Slider element and settings from Drupal.
            var $slider_id = '#' + id,
              $slider_settings = settings.wallop.instances[id].settings,
              $slider,
              $slideshow,
              $autoPlayMs = 1000; //$slider_settings.autoPlayMs || 4500;
            
            var el;

            $slider = document.querySelector($slider_id);

            $slideshow = new Wallop(
              $slider,
              $slider_settings
            );
            
            $($slider).addClass('wallop-processed');

            wallop_slideshows[id] = {
              slideshow: $slideshow,
            };
            wallop_slideshows[id].loadNext = function(currentId, autoplay = false) {
              var current_slideshow = wallop_slideshows[currentId].slideshow;
              loadNext(current_slideshow, autoplay);
            };
            wallop_slideshows[id].nextTimeout = function(currentId) {
              console.log(currentId);
              return setTimeout(function () {
                var current_slideshow = wallop_slideshows[currentId].slideshow;
                loadNext(current_slideshow)
              }, $autoPlayMs);
            };
          }

          for (var slideshow_id in wallop_slideshows) {
            var current_slideshow = wallop_slideshows[slideshow_id].slideshow;
            var el_id = '#' + slideshow_id;
            console.log(el_id);
            // Wallop specific settings.
            $(el_id).on('change', function () {
              clearTimeout(wallop_slideshows[slideshow_id].nextTimeout);
              wallop_slideshows[slideshow_id].nextTimeout(slideshow_id);
            });
            $(el_id).on('mouseenter', function () {
              clearTimeout(wallop_slideshows[slideshow_id].nextTimeout);
            });
            $(el_id).on('mouseleave', function () {
              wallop_slideshows[slideshow_id].nextTimeout(slideshow_id);
            });
          }
        }
      }
    },
  };
})(jQuery);

    
// (function($){​​​​​​​​
//   Drupal.behaviors.wallop = {​​​​​​​​
//     attach: function (context, settings) {​​​​​​​​
//       if (settings.wallop) {​​​​​​​​
//         if (settings.wallop.instances) {​​​​​​​​
//           var slideshows = {​​​​​​​​}​​​​​​​​;
//           for (var id in settings.wallop.instances) {​​​​​​​​
//             var $slider = '#' + id,
//               $slider_settings = settings.wallop.instances[id].settings;
//             if (!$($slider).hasClass('wallop-processed')) {​​​​​​​​
//               slideshows[$slider] = new Wallop(
//                 document.querySelector($slider),
//                 $slider_settings
//               );
//               slideshows[$slider].autoPlayMs = 4500;
//               slideshows[$slider].nextTimeout = null;
//               slideshows[$slider].loadNext = function () {​​​​​​​​
//                 var nextIndex = (slideshows[$slider].currentItemIndex + 1) % slideshows[$slider].allItemsArray.length;
//                 slideshows[$slider].goTo(nextIndex);
//               }​​​​​​​​;
//               slideshows[$slider].nextTimeout = setTimeout(function () {​​​​​​​​
//                 slideshows[$slider].loadNext();
//               }​​​​​​​​, autoPlayMs);
//               slideshows[$slider].on('change', function () {​​​​​​​​
//                 clearTimeout(slideshows[$slider].nextTimeout);
//                 slideshows[$slider].nextTimeout = setTimeout(function () {​​​​​​​​
//                   slideshows[$slider].loadNext();
//                 }​​​​​​​​, slideshows[$slider].autoPlayMs);
//               }​​​​​​​​);
//               $($slider).on('mouseenter', function () {​​​​​​​​
//                 clearTimeout(slideshows[$slider].nextTimeout);
//                 console.log('mouseenter');
//               }​​​​​​​​);
//               $($slider).on('mouseleave', function () {​​​​​​​​
//                 slideshows[$slider].nextTimeout = setTimeout(function () {​​​​​​​​
//                   slideshows[$slider].loadNext();
//                 }​​​​​​​​, slideshows[$slider].autoPlayMs);
//                 console.log('mouseleave');
//               }​​​​​​​​);
//               $($slider).addClass('wallop-processed');
//             }​​​​​​​​
//           }​​​​​​​​
//         }​​​​​​​​
//       }​​​​​​​​
//     }​​​​​​​​,
//   }​​​​​​​​;
// }​​​​​​​​)(jQuery);
/*
(function() {​​​​​​​​
    document.addEventListener('DOMContentLoaded', function() {​​​​​​​​
      var settings = JSON.parse('<?php print drupal_json_encode($settings); ?>');
      var el = document.querySelector('<?php print "#$slideshow_id" ?>');
      var slideshow = new Wallop(
        el,
        settings
      );
      var autoPlayMs = 4500,
        nextTimeout,
        loadNext = function () {​​​​​​​​
          var nextIndex = (slideshow.currentItemIndex + 1) % slideshow.allItemsArray.length;
          slideshow.goTo(nextIndex);
        }​​​​​​​​;
      nextTimeout = setTimeout(function () {​​​​​​​​
        loadNext();
      }​​​​​​​​, autoPlayMs);
      slideshow.on('change', function () {​​​​​​​​
        clearTimeout(nextTimeout);
        nextTimeout = setTimeout(function () {​​​​​​​​
          loadNext();
        }​​​​​​​​, autoPlayMs);
      }​​​​​​​​);
      // the code you asked for:
      el.addEventListener('mouseenter', function () {​​​​​​​​
        clearTimeout(nextTimeout);
      }​​​​​​​​);
      el.addEventListener('mouseleave', function () {​​​​​​​​
        nextTimeout = setTimeout(function () {​​​​​​​​
          loadNext();
        }​​​​​​​​, autoPlayMs);
      }​​​​​​​​);
    }​​​​​​​​);
  }​​​​​​​​)();
 */


