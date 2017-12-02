function message() {
  console.log(data);
}

var galleryData = [];

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

function visualizar(e) {
  var index = $($(e.target.parentElement)[0].parentElement).attr('index');
  if (index) {
    var content = galleryData[index].content;
    //$('.visualizacion > img').attr('src', imagen);
    $('.visualizacion > .content').html(content);
    $('.visualizacion').addClass('visualizacion-visible');
  }
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
  var index = 0;
  toggle = toggle == 1 ? 2 : 1;
  els.forEach(el => {
    el = $(el);
    if (index < galleryData.length) {
      var item = galleryData[index];
      el.find(`> div:nth-of-type(${toggled}) > img`).attr('src', item.image);
      el.find(`> div:nth-of-type(${toggled}) > .label > span`).html(item.title);
      index++;
    } else {
      el.find(`> div:nth-of-type(${toggle}) > img`).attr('src', '');
      el.find(`> div:nth-of-type(${toggle}) > .label > span`).html('');
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
    el.find(`> div:nth-of-type(${toggle}) > .label > span`).html(item.title)
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

$(function() {
  $('.navbar').append($(`
      <li active>TODOS<li>
    `));

  getGroups().forEach(group => {
    $('.navbar').append($(`
        <li>${group}<li>
      `));
  });

  var index = 0;
  galleryData = getItems('*');
  galleryData.forEach(item => {
    var el = $(`
      <div class="mosaic" toggle="1" index="${index}">
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
    index++;
    $('.gallery').append(el);
  });
  $('.navbar > li').click(toggle);
  $('.mosaic').click(visualizar);
  $('#btn-close-visualizacion').click((e) => {
    e.preventDefault();
    $('.visualizacion').removeClass('visualizacion-visible');
  })
});
