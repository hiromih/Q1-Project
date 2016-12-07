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

      createCard(recipe);
    });

    $xhr.fail((err) => {
      console.error(err);
    });

  };

  const createCard = function(recipe) {
    let $outerDiv = $('<div>').addClass('col s12 m6');
    let $cardDiv = $('<div>').addClass('card small sticky-action');
    let $imageDiv = $('<div>').addClass('card-image waves-effect waves-block waves-light');
    const $img = $('<img>').addClass('activator').attr('src', recipe.image);
    let $cardContentDiv = $('<div>').addClass('card-content');
    let $contentSpan = $('<span>').addClass('card-title activator grey-text text-darken-4').text(recipe.name);
    const $contentIcon = $('<i>').addClass('meterial-icons right');
    let $contentP = $('<p>');
    const $contentA = $('<a>').attr({ href:recipe.recipeUrl, target:"_blank" }).text('Get Recipe');
    let $actionDiv = $('<div>').addClass('card-action');
    let $actionRow = $('<div>').addClass('row');
    const $actionPercentDiv = $('<div>').addClass('col s4').text('%');
    const $actionFound = $('<div>').addClass('col s4').text('found');
    const $actionNotFound = $('<div>').addClass('col s4').text('not found');
    let $revealDiv = $('<div>').addClass('card-reveal');
    let $revealRow = $('<div>').addClass('row');
    const $revealFoundDiv = $('<div>').addClass('col s5').text('found');
    const $revealNotFoundDiv = $('<div>').addClass('col s5').text('not found');
    let $revealClearDiv = $('<div>').addClass('col s2');
    let $revealIconSpan = $('<span>').addClass('card-title grey-text text-darken-4');
    const $revealClearIcon = $('<i>').addClass('material-icons right').text('close');

    $revealIconSpan = $revealIconSpan.append($revealClearIcon);
    $revealClearDiv = $revealClearDiv.append($revealIconSpan);

    $revealRow = $revealRow.append($revealFoundDiv).append($revealNotFoundDiv).append($revealClearDiv);

    $actionRow = $actionRow.append($actionPercentDiv).append($actionFound).append($actionNotFound)

    $contentP = $contentP.append($contentA);
    $contentSpan = $contentSpan.append($contentIcon);

    $imageDiv = $imageDiv.append($img);
    $cardContentDiv = $cardContentDiv.append($contentSpan).append($contentP);
    $actionDiv = $actionDiv.append($actionRow);
    $revealDiv = $revealDiv.append($revealRow);

    $cardDiv = $cardDiv.append($imageDiv).append($cardContentDiv).append($actionDiv).append($revealDiv);

    $outerDiv = $outerDiv.append($cardDiv);

    $('.card-insert-point').append($outerDiv);

  }

  $('form').submit((event) => {
      event.preventDefault();
      addToList();
      $('.card-insert-point').empty();
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
