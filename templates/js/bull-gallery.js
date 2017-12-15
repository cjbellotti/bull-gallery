function message() {
  console.log(data);
}

var bg_mobile_columns = 2;
var bg_desktop_columns = 2;
var filterTextColor = 'black';
var filterSelectedColor = 'rgb(30, 166, 133)';

var galleryData = [];
var mosaicSize = 0;
var mosaicHSize = 0;
var columns = 0;
var currentIndex = 0;

var currentGroup = 'TODOS';
var currentType = 'TODOS';

function toggleCategory(e) {
  $('#bg_toggle').prop('checked', false);
  $('.bg_category_items > li').removeAttr('active')
  currentGroup = $(e.target).html();
  load();
  $(e.target).attr('active', '');
}

function toggleType(e) {
  $('#bg_toggle').prop('checked', false);
  $('.bg_type_items > li').removeAttr('active')
  currentType = $(e.target).html();
  load();
  $(e.target).attr('active', '');
}

function leftNavigate(e) {
  console.log('navigate');
  e.stopPropagation();
  if (currentIndex > 0) {
    currentIndex--;
    loadContent();
  }
}

function rightNavigate(e) {
  console.log('navigate');
  e.stopPropagation();
  if (currentIndex < galleryData.length - 1) {
    currentIndex++;
    loadContent();
  }
}

function visualizar(e) {
  currentIndex = $(e.target).attr('index');
  if (currentIndex) {
    loadContent();
  }
}

function loadContent() {
  var content = galleryData[currentIndex].content;
  if (content.substring(0, 3) == '<p>') {
    content = content.substring(3, content.length - 5);
  }
  $('.visualizacion > .bg_content').html(content);
  $('.visualizacion').addClass('visualizacion-visible');
}

function getItems() {
    return data.filter(item => {
      return (item.categories.find(cat => cat == currentGroup) || currentGroup == 'TODOS') &&
              (item.type == currentType || currentType == 'TODOS');
    });
}

function getGroups() {
  var groups = [];
  data.forEach(item => {
    item.categories.forEach(c => {
      if (!groups.find(g => g == c)) {
        groups.push(c);
      }
    });
  });
  return groups;
}

function getTypes() {
  var types = [];
  data.forEach(item => {
    if (types.indexOf(item.type) < 0) {
      types.push(item.type);
    }
  });
  return types;
}


function load() {
  var els = $('.mosaic').toArray();
  var toggle = $('.mosaic').attr('toggle');
  var toggled = toggle == '2' ? '1' : '2';
  galleryData = getItems();
  toggle = toggle == 1 ? 2 : 1;
  els.forEach((el, index) => {
    el = $(el);
    if (index < galleryData.length) {
      var item = galleryData[index];
      el.find(`> div:nth-of-type(${toggled}) > img`).attr('src', item.image);
      el.find(`> div:nth-of-type(${toggled}) > .label > span`).html(item.title);
      el.find('> .mosaic-clickable').attr('index', index);
      el.css('display', 'inline-block');
    } else {
      el.find(`> div:nth-of-type(${toggle}) > img`).attr('src', '');
      el.find(`> div:nth-of-type(${toggle}) > .label > span`).html('');
      el.css('display', 'none');
    }
  });
  $('.mosaic').attr('toggle', toggled);
}

function loadAll() {
  var els = $('.mosaic').toArray();
  var toggle = $('.mosaic').attr('toggle');
  toggle = (toggle == '1') ? '2' : '1';
  galleryData = getItems('TODOS');
  galleryData.forEach((item, index) => {
    var el = $(els[index]);
    el.find(`> div:nth-of-type(${toggle}) > img`).attr('src', item.image);
    el.find(`> div:nth-of-type(${toggle}) > .label > span`).html(item.title);
    el.find('> .mosaic-clickable').attr('index', index);
    el.css('display','inline-block');
  })
  $('.mosaic').attr('toggle', toggle);
}

function clearAll() {
  var els = new Array($('.mosaic'))[0];
  els.forEach(el => {
    el = $(el);
    el.find(`> div:nth-of-type(1) > img`).attr('src', '');
    el.find('> div:nth-of-type(1) > .label > span').html('')
  });
}

function loadSizes() {
  columns = $(window).width() <= 768 ? bg_mobile_columns : bg_desktop_columns;
  // mosaicSize = Math.round(($('.bull-gallery').width() - columns) / columns);
  mosaicSize = 100 / columns;
  mosaicHSize = $('.bull-gallery').width() * (mosaicSize * 0.01);

}

function hiddenVisualizacion() {
  $('.bg_content').html('');
  $('.visualizacion').removeClass('visualizacion-visible');
}

function normalizeThumbnail(item) {
  if (item.type == 'image') {
    if (item.image == null) {
      var result = /src="(.*.[jpg|png|jpeg]{1})"/g.exec(item.content);
      if (result) {
        return Promise.resolve(result[1]);
      } else {
        return Promise.resolve(item.image);
      }
    } else {
      return Promise.resolve(item.image);
    }
  } else
  if (item.type == 'video') {
    if (item.image == null) {
      var result = /https:\/\/player.vimeo.com\/video\/(\d+)?/g.exec(item.content);
      if (result) {
        console.log('ENTRA!!!!');
        return fetch(`http://vimeo.com/api/v2/video/${result[1]}.json`)
                  .then(response => response.json())
                  .then(response => response[0].thumbnail_large);
      } else {
        return Promise.resolve(item.image);
      }
    } else {
      return Promise.resolve(item.image);
    }
  } else {
    return Promise.resolve(item.image);
  }
}

function bg_initialize() {
  loadSizes();
  $(window).resize(()=> {
    loadSizes();
    $('.mosaic').css('width', mosaicSize +'%');
    $('.mosaic').css('height', mosaicHSize +'px');
  });

  $('.bg_category_items').append($(`
      <li active>TODOS</li>
    `));

  getGroups().forEach(group => {
    $('.bg_category_items').append($(`
        <li>${group}</li>
      `));
  });

  $('.bg_type_items').append($(`
      <li active>TODOS</li>
    `));

  getTypes().forEach(type => {
    $('.bg_type_items').append($(`
        <li>${type}</li>
      `));
  });

  var getImageRegExp = /src="(.*.[jpg|png|jpeg]{1})"/g;
  galleryData = getItems('TODOS');
  galleryData.forEach((item, index) => {
    normalizeThumbnail(item)
      .then((image) => {
        item.image = image;
        var el = $(`
          <div class="mosaic" toggle="1" style="width:${mosaicSize}%; height:${mosaicHSize}px" >
            <div>
              <div class="label">
                  <span>${item.title}</span>
              </div>
              <img src="${item.image}" alt="">
            </div>
            <div>
              <div class="label">
                  <span></span>
              </div>
              <img src="" alt="">
            </div>
            <div class="mosaic-clickable" index="${index}">
            </div>
          </div>
          `);
        el.click(visualizar);
        $('.gallery').append(el);
      });
  });
  $('.bg_category_items > li').click(toggleCategory);
  $('.bg_type_items > li').click(toggleType);
  $('.label').click(visualizar);
  $('#btn-close-visualizacion').click((e) => {
    e.preventDefault();
    hiddenVisualizacion();
  });
  $('.visualizacion').click((e) => {
    e.preventDefault();
    hiddenVisualizacion();
  });
  $('#left-navigate').click(leftNavigate);
  $('#right-navigate').click(rightNavigate);
  $(window).keyup((e)=> {
    console.log(e.keyCode);
    if (e.keyCode == 27) {
      hiddenVisualizacion();
    }
  });

}

$(bg_initialize);
