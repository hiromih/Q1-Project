(function() {
  'use strict';

  $(".button-collapse").sideNav();

  const addToList = function() {
    if($('#ingredient').val()) {
      const addedIngredient = $('#ingredient').val();
      let $listItem = $('<li>');
      let $spanIngredient = $('<span>').addClass('list-item-text').text(addedIngredient);
      let $spanIcon = $('<span>');
      const $icon = $('<i>').addClass('tiny material-icons z-depth-1 clearList red-text').text('clear');

      $spanIcon = $spanIcon.append($icon);
      $listItem = $listItem.append($spanIngredient).append($spanIcon);
      $('ul.list').append($listItem);
      console.log($('ul.list')[0]);
      $('#ingredient').val('');
    }
  }

  $('form').submit((event) => {
      event.preventDefault();
      addToList();
  });

  $('i.add').click((event) => {
    addToList();
  });

  $('ul.list').on('click', 'i.clearList', (event) => {
    $(event.target).parent().parent().remove();
  });

  $('.submitBtn').click((event) => {
    addToList();
    if(($('#strict').is(':checked') || $('#percent').is(':checked')) && $('ul.list li').length) {
      $('span.list-item-text').each((index) => {
        console.log($('span.list-item-text')[index].textContent);
      });
    } else if(!$('ul.list li').length) {
        Materialize.toast('Please add ingredients.', 4000);
    } else {
        Materialize.toast('Please select a search type.', 4000);
    }
  });

  // $('.add').click((event) => {
  //   let $divRow = $('<div>').addClass('row');
  //   const $divCol1 = $('<div>').addClass('input-field col s6');
  //   const $input1 = $('<input>').addClass('validate').attr('placeholder', 'add ingredient').attr('type', 'text').attr('name', 'ingredient');
  //   const $divCol2 = $('<div>').addClass('input-field col s6');
  //   const $input2 = $('<input>').addClass('validate').attr('placeholder', 'add ingredient').attr('type', 'text').attr('name', 'ingredient');
  //
  //   const $firstInput = $divCol1.append($input1);
  //   const $secondInput = $divCol2.append($input2);
  //   $divRow = $divRow.append($firstInput).append($secondInput);
  //   $('.addContainer').before($divRow);
  // });
  //
  // $('.search-box').click((event) => {
  //   event.preventDefault();
  // });

  // const $xhr = $.ajax({
  //   method: 'GET',
  //   url: 'ingredients.txt',
  //   dataType: 'json'
  // });

  // This is metadata search of all ingredients in their database does not work
  // const $xhr = $.ajax({
  //   method: 'GET',
  //   url: "http://api.yummly.com/v1/api/metadata/ingredient?_app_id=2f19c0bd&_app_key=8770079240bf61a9a3e74b55eacfb7be",
  //   // headers: {
  //   //   'X-Yummly-App-ID': '2f19c0bd',
  //   //   'X-Yummly-App-Key': '8770079240bf61a9a3e74b55eacfb7be'
  //   // },
  //   dataType: 'json'
  // });

  // This is search by title and ingredients
  // const $xhr = $.ajax({
  //   method: 'GET',
  //   url: 'http://api.yummly.com/v1/api/recipes?q=chicken&allowedIngredient[]=onion&allowedIngredient[]=chicken&allowedIngredient[]=garbanzo+beans&allowedIngredient[]=bacon',
  //   headers: {
  //     'X-Yummly-App-ID': '2f19c0bd',
  //     'X-Yummly-App-Key': '8770079240bf61a9a3e74b55eacfb7be'
  //   },
  //   dataType: 'json'
  // });


  // This is Ajax request by ID
  // const $xhr = $.ajax({
  //   method: 'GET',
  //   url:'http://api.yummly.com/v1/api/recipe/Green-Goddess-Curry-1811304',
  //   headers: {
  //     'X-Yummly-App-ID': '2f19c0bd',
  //     'X-Yummly-App-Key': '8770079240bf61a9a3e74b55eacfb7be'
  //   },
  //   dataType: 'json'
  // });

  // food2fork request but ingredients
  // const $xhr = $.ajax({
  //   method: 'GET',
  //   url:'https://cors-anywhere.herokuapp.com/http://food2fork.com/api/search?key=5b002586b23b7919beac1aa2b1c550d9&q=beef,asparagus,pepper',
  //   // headers: {
  //   //   key: '5b002586b23b7919beac1aa2b1c550d9'
  //   // },
  //   dataType: 'json'
  // });

  // food2fork request by ID
  // const $xhr = $.ajax({
  //   method: 'GET',
  //   url:'https://cors-anywhere.herokuapp.com/http://food2fork.com/api/get?key=5b002586b23b7919beac1aa2b1c550d9&rID=ac43c6',
  //   // headers: {
  //   //   key: '5b002586b23b7919beac1aa2b1c550d9'
  //   // },
  //   dataType: 'json'
  // });
  //
  // $xhr.done((data) => {
  //   if($xhr.status !== 200) {
  //     return;
  //   }
  //   console.log(data);
  // });
  //
  // $xhr.fail((err) => {
  //   console.error(err);
  // });

})();
