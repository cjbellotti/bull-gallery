

<!-- Build Data Array -->
<?php
  function map_categories_array($a) {
    return get_category($a)->name;
  }
?>

<script>
    data = [
          <?php
              $posts = get_posts(array(
                  'numberposts' => -1
              ));
              foreach ($posts as $post) :
          ?>
              <?php if (get_post_format($post->ID) == 'image' || get_post_format($post->ID) == 'video') :  ?>

                <?php
                    /*$output = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches);
                    $first_img = $matches [1] [0];*/
                    $item = array(
                      'title' => $post->post_title,
                      'image' => wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'full')[0],
                      /*'fullImage' => $first_img,*/
                      'categories' => array_map('map_categories_array', wp_get_post_categories($post->ID)),
                      'type' => get_post_format($post->ID),
                      'content' => $post->post_content
                    );
                ?>
                  <?= json_encode($item) ?>,
              <?php endif ?>
          <?php endforeach ?>
    ];
 </script>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script src="<?= plugins_url('/js/bull-gallery.js', __FILE__) ?>"></script>
<link rel="stylesheet" href="<?= plugins_url('/css/bull-gallery.css', __FILE__) ?>">
