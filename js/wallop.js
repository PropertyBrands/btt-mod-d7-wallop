
(function($){
  var nextTimeout;

  var loadNext = function (current_slideshow, autoplay) {
    var nextIndex = (current_slideshow.currentItemIndex + 1) % current_slideshow.allItemsArray.length;
    current_slideshow.goTo(nextIndex);

    // If this is an autoplay slideshow, then let's recursively load the next slide per the
    // autoplay settings.
    if(autoplay) {
      nextTimeout = setTimeout(function () {
        loadNext(current_slideshow, autoplay);
      }, current_slideshow.options.autoPlayMs);
    }
  };

  var autoplayWallopSlideshows = function(wallop_slideshows) {
    wallop_slideshows.forEach(function(current_slideshow) {
      // Get invidiual slide settings.
      var autoPlayMs = current_slideshow.options.autoPlayMs;
      var shouldAutoPlay = current_slideshow.options.shouldAutoPlay;

      if(current_slideshow && shouldAutoPlay) {
        // Auto-run without requiring user change or mouseenter/mouseleave.
        nextTimeout = setTimeout(function () {
          loadNext(current_slideshow, shouldAutoPlay);
        }, autoPlayMs);
      }
      else {
        // If we don't need to set up autoplay for this slideshow, or it doesn't exist, then let's bail out.
        return;
      }
      
      var el = $(document.querySelector(current_slideshow.id));
      // Wallop specific settings.
      el.on('change', function () {
        if(nextTimeout) {
          clearTimeout(nextTimeout);
        }
        nextTimeout = setTimeout(function () {
          loadNext(current_slideshow, shouldAutoPlay);
        }, autoPlayMs);
      });
      el.on('mouseenter', function () {
        if(nextTimeout) {
          clearTimeout(nextTimeout);
        }
      });
      el.on('mouseleave', function () {
        nextTimeout = setTimeout(function () {
          loadNext(current_slideshow, shouldAutoPlay);
        }, autoPlayMs);
      });
    });
  };

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
            var $slider_id = '#' + id,
              $slider_settings = settings.wallop.instances[id].settings,
              $slider,
              $slideshow;
              // $shouldAutoPlay = $slider_settings.shouldAutoPlay,
              // $autoPlayMs = $slider_settings.autoPlayMs || 4500;

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

          if(!wallop_slideshows.length) {
            return;
          }

          autoplayWallopSlideshows(wallop_slideshows);
        }
      }
    },
  };

})(jQuery);