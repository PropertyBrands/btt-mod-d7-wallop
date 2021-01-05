
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

Installation of Submodule:

```
git submodule add -b 7.x-1.x-dev --name sites/all/modules/bluetent/wallop git@github.com:PropertyBrands/btt-mod-d7-wallop.git sites/all/modules/bluetent/wallop
```
