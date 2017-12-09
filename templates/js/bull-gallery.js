function message() {
  console.log(data);
}

var galleryData = [];
var mosaicSize = 0;
var bg_mobile_columns = 2;
var bg_desktop_columns = 2;
var columns = 0;
var currentIndex = 0;

function toggle(e) {
  $('#btn-category').prop('checked', false);
  $('.navbar > li').removeAttr('active')
  var group = $(e.target).html();
  if (group == 'TODOS') {
    loadAll();
  } else {
    load(group);
  }
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
  currentIndex = $($(e.target.parentElement)[0].parentElement).attr('index');
  if (currentIndex) {
    loadContent();
  }
}

function loadContent() {
  var content = galleryData[currentIndex].content;
  content = content.substring(3, content.length - 4);
  $('.visualizacion > .content').html(content);
  $('.visualizacion').addClass('visualizacion-visible');
}

function getItems(group) {
  if (group == '*')
    return data;
  else
    return data.filter(item => item.categories.find(cat => cat == group));
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


function load(group) {
  var els = $('.mosaic').toArray();
  var toggle = $('.mosaic').attr('toggle');
  var toggled = toggle == '2' ? '1' : '2';
  galleryData = getItems(group);
  toggle = toggle == 1 ? 2 : 1;
  els.forEach((el, index) => {
    el = $(el);
    if (index < galleryData.length) {
      var item = galleryData[index];
      el.find(`> div:nth-of-type(${toggled}) > img`).attr('src', item.image);
      el.find(`> div:nth-of-type(${toggled}) > .label > span`).html(item.title);
      el.attr('index', index);
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
  var index = 0;
  galleryData = getItems('*');
  galleryData.forEach(item => {
    var el = $(els[index]);
    el.find(`> div:nth-of-type(${toggle}) > img`).attr('src', item.image);
    el.find(`> div:nth-of-type(${toggle}) > .label > span`).html(item.title);
    el.css('display','inline-block');
    index++;
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
  mosaicSize = Math.round(($('.bull-gallery').width() - columns) / columns);
}

function hiddenVisualizacion() {
  $('.content').html('');
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
    $('.mosaic').css('width', mosaicSize +'px');
    $('.mosaic').css('height', mosaicSize +'px');
  });

  $('.navbar').append($(`
      <li active>TODOS<li>
    `));

  getGroups().forEach(group => {
    $('.navbar').append($(`
        <li>${group}<li>
      `));
  });

  var getImageRegExp = /src="(.*.[jpg|png|jpeg]{1})"/g;
  //var index = 0;
  galleryData = getItems('*');
  galleryData.forEach((item, index) => {
    normalizeThumbnail(item)
      .then((image) => {
        item.image = image;
        var el = $(`
          <div class="mosaic" toggle="1" index="${index}" style="width:${mosaicSize}px; height:${mosaicSize}px" >
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
          </div>
          `);
        //index++;
        el.click(visualizar);
        $('.gallery').append(el);
      });
  });
  $('.navbar > li').click(toggle);
  //$('.mosaic').click(visualizar);
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
