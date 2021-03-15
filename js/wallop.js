(function($){
  Drupal.behaviors.wallop = {
    attach: function (context, settings) {
      var wallop_has_processed = document.querySelectorAll('.wallop-processed');
      if(wallop_has_processed.length) {
        return;
      }

      if (settings.wallop) {
        if (settings.wallop.instances) {
          var wallop_slideshows = [];
          for (var id in settings.wallop.instances) {
            // Slider element and settings from Drupal.
            console.log(settings.wallop.instances);
            console.log(id);
            var $slider_id = '#' + id,
              $slider_settings = settings.wallop.instances[id].settings,
              $slider,
              $slideshow,
              $shouldAutoPlay = $slider_settings.shouldAutoPlay || true,
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

          var loadNext = function (current_slideshow, autoplay = true) {
            var nextIndex = (current_slideshow.currentItemIndex + 1) % current_slideshow.allItemsArray.length;
            current_slideshow.goTo(nextIndex);

            if(autoplay) {
              setTimeout(function () {
                loadNext(current_slideshow, autoplay);
              }, $autoPlayMs);
            }
          };

          var nextTimeout;

          wallop_slideshows.forEach(function(current_slideshow) {
            // Auto-run without requiring user change or mouseenter/mouseleave.
            setTimeout(function () {
              loadNext(current_slideshow, $shouldAutoPlay);
            }, $autoPlayMs);


            var el = $(document.querySelector(current_slideshow.id));
            // Wallop specific settings.
            el.on('change', function () {
              if(nextTimeout) {
                clearTimeout(nextTimeout);
              }
              nextTimeout = setTimeout(function () {
                loadNext(current_slideshow, $shouldAutoPlay);
              }, $autoPlayMs);
            });
            el.on('mouseenter', function () {
              if(nextTimeout) {
                clearTimeout(nextTimeout);
              }
            });
            el.on('mouseleave', function () {
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