(function($){
  Drupal.behaviors.wallop = {
    attach: function (context, settings) {
      var wallop_has_processed = document.querySelectorAll('.wallop-processed');
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
              $autoPlayMs = $slider_settings.autoPlayMs || 4500;
            
            $slider = document.querySelector($slider_id);

            $slideshow = new Wallop(
              $slider,
              $slider_settings
            );

            
            $($slider).addClass('wallop-processed');

            if(!$slideshow) {
              // For some reason Wallop's slideshow is not there. Bail out to avoid a JS error.
              // Fallback behavior will be to display the first slide. Slideshows won't work, however.
              return;
            }
            wallop_slideshows.push($slideshow);
          }

          var loadNext = function (current_slideshow) {
            console.log(current_slideshow);
            var nextIndex = (current_slideshow.currentItemIndex + 1) % current_slideshow.allItemsArray.length;
            current_slideshow.goTo(nextIndex);
          };

          var nextTimeout;

          console.log(wallop_slideshows);
          wallop_slideshows.forEach(function(current_slideshow) {
            // Auto-run without requiring user change or mouseenter/mouseleave.
            setTimeout(function () {
              loadNext(current_slideshow);
            }, $autoPlayMs);


            var el = document.querySelector(current_slideshow.$selector);

            // Wallop specific settings.
            el.on('change', function () {
              if(nextTimeout) {
                clearTimeout(nextTimeout);
              }
              console.log(this);
              nextTimeout = setTimeout(function () {
                loadNext(current_slideshow);
              }, $autoPlayMs);
            });
            el.on('mouseenter', function () {
              if(nextTimeout) {
                clearTimeout(nextTimeout);
              }
            });
            el.on('mouseleave', function () {
              console.log(current_slideshow);
              nextTimeout = setTimeout(function () {
                loadNext(current_slideshow);
              }, $autoPlayMs);
            });
          });
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


