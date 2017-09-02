
A helper module for implementing Wallop slideshows. This module has no UI or configuration.
It just provides a theme function and mechanism for including the Wallop slideshow assets.

Usage:

```php
<?php
$render = array(
  '#theme' => 'wallop_slideshow',
  '#slides' => array(
    'This is a string',
    array(
      '#theme' => 'image',
      '#url' => '../../path/to/image.jpg'
    ),
  ),
);

print drupal_render($render);
```