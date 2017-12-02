<?php

  /*
    Plugin Name: Bull Gallery
    Description: Cool Gallery
    Version: 0.0.1
    Author: Carlos Bellotti
  */

  function wpbg_bull_gallery_render($args) {
    ob_start();
    include(dirname(__FILE__) . '/templates/content-main.php');
    return ob_get_clean();
  }

  add_shortcode('bull_gallery', 'wpbg_bull_gallery_render');
?>
