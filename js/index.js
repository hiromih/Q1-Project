(function() {
  'use strict';

  $(".button-collapse").sideNav();
  let recipes = [];

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
  };

  const getParameters = function(formattedIngredients) {

    const parameters = formattedIngredients.map((ingredient) => {
      if(ingredient.indexOf(' ') !== -1) {
        return ingredient = ingredient.replace(/\s/g, '+');
      } else {
        return ingredient;
      }
    });

    let allParams = `q=${parameters[0]}`;

    for (let i = 0; i < parameters.length; i++) {
      allParams += `&allowedIngredient[]=${parameters[i]}`;
    }

    return allParams;

  };

  const getRecipes = function(ingredients) {

    const allParameters = getParameters(ingredients);

    const $xhr = $.ajax({
      method: 'GET',
      url: `http://api.yummly.com/v1/api/recipes?${allParameters}&requirePictures=true`,
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
      console.log(data);
      for(const result of data.matches) {

        const recipe = {
          id: result.id,
          name: result.recipeName,
          ingredients: result.ingredients
        };

        getImageAndSource(recipe);
      }
    });

    $xhr.fail((err) => {
      console.error(err);
    });

    console.log(recipes);
  }

  const getImageAndSource = function(recipe) {

    const $xhr = $.ajax({
      method: 'GET',
      url:`http://api.yummly.com/v1/api/recipe/${recipe.id}`,
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

      recipe.image = data.images[0].hostedLargeUrl;
      recipe.recipeUrl = data.source.sourceRecipeUrl;
      recipes.push(recipe);
    });

    $xhr.fail((err) => {
      console.error(err);
    });

  };

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

  $('.clear-search').click((event) => {
    $('ul.list').empty();
    $('p.search-terms').empty();
  });

  $('.submitBtn').click((event) => {
    recipes = [];
    addToList();

    if($('ul.list li').length) {
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

})();
