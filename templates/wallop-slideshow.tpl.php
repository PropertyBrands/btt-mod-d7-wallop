<?php
/**
 * @var $slides - an array of slide content. Each element in this array will be
 * either a string of content to be printed - or a renderable array
 * which will be `rendered` and then printed.
 *
 * @var $attributes_array - an array of attributes including classes. Implement
 * hook_preprocess_HOOK() to and change this to do things like adding custom
 * animations.
 *
 * @var $header - The Block header
 *
 * @var $slideshow_id - an id for the slideshow calculated in
 * wallop_preprocess_wallop_slideshow().
 *
 * @var $show_controls - boolean flag indicating whether to show prev/next
 *
 * @var $settings - JSON encoded slideshow settings.
 *
 * @var $not_first - local variable to add the `current` class as recommended
 * by wallop.
 */
?>
<div id="<?php print $slideshow_id; ?>" <?php print drupal_attributes($attributes_array) ?>>
  <?php if ($header): ?><h4 class="block-title"><?php print $header; ?></h4><?php endif; ?>
  <div class="Wallop-list">
    <?php foreach($slides as $slide) : ?>
      <div class="<?php !isset($not_first)
        ? print 'Wallop-item Wallop-item--current'
        : print 'Wallop-item'; ?>"
      >
        <?php
          is_array($slide)
            ? print drupal_render($slide)
            : print $slide;
          $not_first = TRUE;
        ?>
      </div>
    <?php endforeach; ?>
  </div>
  <?php if(count($slides) > 1 && $show_controls) : ?>
    <span class="Wallop-buttonPrevious Wallop-control"></span>
    <span class="Wallop-buttonNext Wallop-control"></span>
  <?php endif; ?>
</div>
