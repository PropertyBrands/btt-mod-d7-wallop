
(function($){
  var nextTimeout;

  var loadNext = function (current_slideshow, autoplay) {
    var nextIndex = (current_slideshow.currentItemIndex + 1) % current_slideshow.allItemsArray.length,
      $hidden = $(current_slideshow.allItemsArray[nextIndex]).find('.wallop-hidden'),
      $img;
    if ($hidden.length) {
      $img = $hidden.find('img');
      if ($img.length) {
        // If the next slide was flagged with wallop hidden, set image srcset
        // and src from data attributes and show it before going to the next
        // slide.
        $img.each(function(index) {
          var $elem = $(this),
            srcset = $elem.attr('data-srcset'),
            src = $elem.attr('data-src');
          if (srcset) {
            $elem.attr('srcset', srcset);
          }

          if (src) {
            $elem.attr('src', src);
          }

          if (index === 0) {
            $elem.one('load', function () {
              // Don't go to the next slide until its first image has been loaded.
              current_slideshow.goTo(nextIndex);
            });
          }

          $elem.addClass('bto-lazy-loaded');
        });

        $hidden.removeClass('wallop-hidden');
        $hidden.show();
      }
      else {
        // No image found inside hidden slide, so just show next slide.
        $hidden.show();
        current_slideshow.goTo(nextIndex);
      }
    }
    else {
      // This slide wasn't flagged as a hidden slide, so just show it.
      current_slideshow.goTo(nextIndex);
    }

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
