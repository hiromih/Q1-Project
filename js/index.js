(function() {
  'use strict';

  $(".button-collapse").sideNav();

  const addToList = function() {
    if($('#ingredient').val()) {
      const addedIngredient = ($('#ingredient').val()).trim();
      let $listItem = $('<li>');
      let $spanIngredient = $('<span>').addClass('list-item-text').text(addedIngredient);
      let $spanIcon = $('<span>');
      const $icon = $('<i>').addClass('tiny material-icons z-depth-1 clearList red-text').text('clear');

      $spanIcon = $spanIcon.append($icon);
      $listItem = $listItem.append($spanIngredient).append($spanIcon);
      $('ul.list').append($listItem);
      $('#ingredient').val('');
    }
  }

  const getRecipes = function(ingredients) {

    const parameters = ingredients.map((ingredient) => {
      if(ingredient.indexOf(' ') !== -1) {
        return ingredient = ingredient.replace(/\s/g, '+');
      } else {
        return ingredient;
      }
    });

    let allParams = `q=${parameters[0]}`;

    for (let i = 1; i < parameters.length; i++) {
      allParams += `&allowedIngredient[]=${parameters[i]}`;
    }

    // This is search by title and ingredients
    const $xhr = $.ajax({
      method: 'GET',
      url: `http://api.yummly.com/v1/api/recipes?${allParams}`,
      headers: {
        'X-Yummly-App-ID': '2f19c0bd',
        'X-Yummly-App-Key': '8770079240bf61a9a3e74b55eacfb7be'
      },
      dataType: 'json'
    });

    $xhr.done((data) => {
      if($xhr.status !== 200) {
        return;
      }

      const results = [];
      
      for(const recipe of data.matches) {
        const recipeId = recipe.id;
        const recipeName = recipe.recipeName;
        const recipeIngredients = recipe.ingredients;

        // This is Ajax request by ID
        const $xhr = $.ajax({
          method: 'GET',
          url:`http://api.yummly.com/v1/api/recipe/${recipeId}`,
          headers: {
            'X-Yummly-App-ID': '2f19c0bd',
            'X-Yummly-App-Key': '8770079240bf61a9a3e74b55eacfb7be'
          },
          dataType: 'json'
        });

        $xhr.done((data) => {
          if($xhr.status !== 200) {
            return;
          }
          const largeImage = data.images[0].hostedLargeUrl;
          const recipeSourceUrl = data.source.sourceRecipeUrl;

        });

        $xhr.fail((err) => {
          console.error(err);
        });
      }
    });

    $xhr.fail((err) => {
      console.error(err);
    });
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
      const itemsToSearch = [];

      $('span.list-item-text').each((index) => {
        itemsToSearch.push($('span.list-item-text')[index].textContent);
      });

      $('p.search-terms').text(`searched items: ${itemsToSearch.join(', ')}`);
      getRecipes(itemsToSearch);

    } else if(!$('ul.list li').length) {
        Materialize.toast('Please add ingredients.', 4000);

    } else {
        Materialize.toast('Please select a search type.', 4000);
    }
  });

  $('.clear-search').click((event) => {
    $('#strict').attr('checked', false);
    $('#percent').attr('checked', false);
    $('ul.list').empty();
    $('p.search-terms').empty();
  });

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

})();
