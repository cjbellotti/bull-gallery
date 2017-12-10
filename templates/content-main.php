<style>
  .bull-gallery .navbar > li {
    color : <?=$args["filter-text-color"]?>;
  }
  .bull-gallery .navbar > li[active=""] {
    border-bottom: 3px solid <?=$args["filter-selected-color"]?>;
  }

  @media (max-width: 768px) {
    .bull-gallery .navbar > li {
      color : white;
    }
  }
</style>
<script>
  bg_mobile_columns=<?=$args["mobile-columns"]?>;
  bg_desktop_columns=<?=$args["desktop-columns"]?>;
</script>
<div class="bull-gallery">
<?php
    include(dirname(__FILE__) . '/content-template.php');
?>
</div>
