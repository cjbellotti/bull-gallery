<?php

  /*
    Plugin Name: Bull Gallery
    Description: Cool Gallery
    Version: 0.8.0
    Author: Carlos Bellotti
  */

  function wpbg_init() {
    wp_deregister_script('jquery');
    wp_enqueue_script( 'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js');
  }

  add_action('wp_enqueue_scripts', 'wpbg_init');

  function wpbg_load_script() {
    wp_enqueue_script( 'bg_main_script', plugins_url('/templates/js/bull-gallery.js', __FILE__), array( 'jquery' ));
    include(dirname(__FILE__) . '/templates/content-data.php');
  }

  add_action('wp_enqueue_scripts', 'wpbg_load_script');

  function wpbg_bull_gallery_render($args) {

    if (empty($args)) {
      $args = array();
    }

    if (!array_key_exists("mobile-columns", $args)) {
      $args['mobile-columns'] = "2";
    }

    if (!array_key_exists("desktop-columns", $args)) {
      $args['desktop-columns'] = "4";
    }

    if (!array_key_exists("filter-text-color", $args)) {
      $args['filter-text-color'] = "black";
    }

    if (!array_key_exists("filter-selected-color", $args)) {
      $args['filter-selected-color'] = "rgb(30, 166, 133)";
    }

    ob_start();
    include(dirname(__FILE__) . '/templates/content-main.php');
    return ob_get_clean();
  }

  add_shortcode('bull_gallery', 'wpbg_bull_gallery_render');
?>
