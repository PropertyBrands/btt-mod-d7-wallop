(function($){
  Drupal.behaviors.wallop = {
    attach: function (context, settings) {
      if (settings.wallop) {
        if (settings.wallop.instances) {
          for (var id in settings.wallop.instances) {
            var $slider = '#' + id,
              $slider_settings = settings.wallop.instances[id].settings;
            if (!$($slider).hasClass('wallop-processed')) {
              console.log('wallop instance: ' + $slider);
              new Wallop(
                document.querySelector($slider),
                $slider_settings
              );
              $($slider).addClass('wallop-processed');
            }
          }
        }
      }
    },
  };
})(jQuery);