

<!-- Build Data Array -->
<?php
  function map_categories_array($a) {
    return get_category($a)->name;
  }
?>
<script>
    bg_mobile_columns=<?=$args["mobile-columns"]?>;
    bg_desktop_columns=<?=$args["desktop-columns"]?>;
    data = [
          <?php
              $posts = get_posts(array(
                  'numberposts' => -1
              ));
              foreach ($posts as $post) :
          ?>
              <?php if (get_post_format($post->ID) == 'image' || get_post_format($post->ID) == 'video') :  ?>

                <?php
                    $item = array(
                      'title' => $post->post_title,
                      'image' => wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'full')[0],
                      'categories' => array_map('map_categories_array', wp_get_post_categories($post->ID)),
                      'type' => get_post_format($post->ID),
                      'content' => apply_filters('the_content',$post->post_content)
                    );
                ?>
                  <?= json_encode($item) ?>,
              <?php endif ?>
          <?php endforeach ?>
    ];

    $(bg_initialize);
    
 </script>

<link rel="stylesheet" href="<?= plugins_url('/css/bull-gallery.css', __FILE__) ?>">
