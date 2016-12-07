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

  const getParameters = function(ingredients) {

    const parameters = ingredients.map((ingredient) => {
      if(ingredient.indexOf(' ') !== -1) {
        return ingredient = ingredient.replace(/\s/g, '+');
      } else {
        return ingredient;
      }
    });

    return `q=${parameters.join('+')}`;

    //might use this later if I can get better results.
    // let allParams = `q=${parameters[0]}`;
    //
    // for (let i = 0; i < parameters.length; i++) {
    //   allParams += `&allowedIngredient[]=${parameters[i]}`;
    // }
    // return allParams;

  };

  const getRecipes = function(ingredients) {

    const allParameters = getParameters(ingredients);
    console.log(allParameters);
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

      for(const result of data.matches) {

        const recipe = {
          id: result.id,
          name: result.recipeName,
          ingredients: result.ingredients
        };

        const ingredientResults = matchIngredients(ingredients, recipe.ingredients);
        Object.assign(recipe, ingredientResults);
        console.log(recipe);
        getImageAndSource(recipe);
      }
    });

    $xhr.fail((err) => {
      console.error(err);
    });

  };

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

      createCard(recipe);
    });

    $xhr.fail((err) => {
      console.error(err);
    });

  };

  const createCard = function(recipe) {
    let $outerDiv = $('<div>').addClass('col s12 m6');
    let $cardDiv = $('<div>').addClass('card small');
    let $imageDiv = $('<div>').addClass('card-image');
    const $img = $('<img>').attr('src', recipe.image);
    let $cardContentDiv = $('<div>').addClass('card-content');
    let $contentSpan = $('<span>').addClass('card-title grey-text text-darken-4').text(recipe.name);
    const $contentIcon = $('<i>').addClass('meterial-icons right');
    let $contentP = $('<p>');
    const $contentA = $('<a>').attr({ href:recipe.recipeUrl, target:"_blank" }).text('Get Recipe');
    let $actionDiv = $('<div>').addClass('card-action');
    let $actionRow = $('<div>').addClass('row');
    const $actionPercentDiv = $('<div>').addClass('col s4').text(recipe.percentMatch);
    const $actionFound = $('<div>').addClass('col s4').text(recipe.matched);
    const $actionNotFound = $('<div>').addClass('col s4').text(recipe.unmatched);

    $actionRow = $actionRow.append($actionPercentDiv).append($actionFound).append($actionNotFound)

    $contentP = $contentP.append($contentA);
    $contentSpan = $contentSpan.append($contentIcon);

    $imageDiv = $imageDiv.append($img);
    $cardContentDiv = $cardContentDiv.append($contentSpan).append($contentP);
    $actionDiv = $actionDiv.append($actionRow);

    $cardDiv = $cardDiv.append($imageDiv).append($cardContentDiv).append($actionDiv);

    $outerDiv = $outerDiv.append($cardDiv);

    $('.card-insert-point').append($outerDiv);

  };

  const matchIngredients = function (userIngredients, recipeIngredients) {
    let matchedIngredients = 0;
    let unmatchedIngredients = 0;
    for(const userIngredient of userIngredients) {
      for(const recipeIngredient of recipeIngredients) {
        if(recipeIngredient.includes(userIngredient)) {
          matchedIngredients++;
          break;
        }
      }
    }

    const totals = {
      matched: matchedIngredients,
      unmatched: recipeIngredients.length - matchedIngredients,
      percentMatch: Math.round(((matchedIngredients / recipeIngredients.length) * 100)) + "%"
    };

    return totals;
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
    $('.card-insert-point').empty();
  });

  $('.submitBtn').click((event) => {
    recipes = [];
    addToList();
    $('.card-insert-point').empty();

    if($('ul.list li').length) {
      const itemsToSearch = [];

      $('span.list-item-text').each((index) => {
        itemsToSearch.push($('span.list-item-text')[index].textContent);
      });

      $('p.search-terms').text(`searched items: ${itemsToSearch.join(', ')}`);

      getRecipes(itemsToSearch);

    } else {
        Materialize.toast('Please add ingredients.', 4000);
    }
  });

})();
