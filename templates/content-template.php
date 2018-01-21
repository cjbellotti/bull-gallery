<div class="bg_navbar">
  <input type="checkbox" id="bg_toggle">
  <label for="bg_toggle"><img src="<?= plugins_url('/img/category.png', __FILE__) ?>" alt=""></label>
  <div class="bg_navbar__container">
    <div class="bg_navbar__section">
      <ul class="bg_category_items">
      </ul>
    </div>
    <div class="bg_navbar__section">
      <ul class="bg_type_items">
      </ul>
    </div>
  </div>
</div>
<div class="gallery">

</div>
<div class="visualizacion">
  <!--a id="left-navigate" class="btn-navigate"><</a-->
  <div class="bg_content">
      <a id="left-navigate" class="btn-navigate btn-navigate-left"><</a>
      <a id="right-navigate" class="btn-navigate btn-navigate-right">></a>
      <div class="bg-content-img"></div>
  </div>
  <!--a id="right-navigate" class="btn-navigate">></a-->
  <a id="btn-close-visualizacion"><span><img src="<?= plugins_url('/img/close.png', __FILE__) ?>"></span></a>
</div>
