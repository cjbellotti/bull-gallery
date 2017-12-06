<?php

  /*
    Plugin Name: Bull Gallery
    Description: Cool Gallery
    Version: 0.0.1
    Author: Carlos Bellotti
  */

  function wpbg_init() {
    wp_deregister_script('jquery');
    wp_enqueue_script( 'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js');
  }

  add_action('wp_enqueue_scripts', 'wpbg_init');

  function wpbg_load_script() {
    wp_enqueue_script( 'bg_main_script', plugins_url('/templates/js/bull-gallery.js', __FILE__), array( 'jquery' ));
  }

  add_action('wp_enqueue_scripts', 'wpbg_load_script');

  function wpbg_bull_gallery_render($args) {
    ob_start();
    include(dirname(__FILE__) . '/templates/content-main.php');
    return ob_get_clean();
  }

  add_shortcode('bull_gallery', 'wpbg_bull_gallery_render');
?>
