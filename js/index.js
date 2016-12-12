(function() {
  'use strict';

  $('.button-collapse').sideNav();
  let recipeNames = [];
  let recipes = [];
  let moreRecipes = false;
  let recipesStart = 0;

  // ***HELPER FUNCTIONS***
  const addToList = function() {
    if ($('#ingredient').val()) {
      const addedIngredient = ($('#ingredient').val()).trim();
      let $listItem = $('<li>');
      const $spanIngredient = $('<span>').addClass('list-item-text').text(addedIngredient);
      let $spanIcon = $('<span>');
      const $icon = $('<i>').addClass('tiny material-icons z-depth-1 clear-list red-text').text('clear');

      $spanIcon = $spanIcon.append($icon);
      $listItem = $listItem.append($spanIngredient).append($spanIcon);
      $('ul.list').append($listItem);
      $('#ingredient').val('');
    }
  };

  const getUserIngredients = function() {
    const usrIngr = [];

    $('span.list-item-text').each((index) => {
      usrIngr.push($('span.list-item-text')[index].textContent.toLowerCase());
    });

    return usrIngr;
  };

  const getParameters = function(ingredients) {
    const parameters = ingredients.map((ingredient) => {
      if (ingredient.indexOf(' ') !== -1) {
        ingredient = ingredient.replace(/\s/g, '+');
      }

      return ingredient;
    });

    if (moreRecipes) {
      recipesStart += 20;
    }

    return `q=${parameters.join('+')}&requirePictures=true&maxResult=20&start=${recipesStart}`;
  };

  const displayNoMatchMessage = function() {
    $('#scroll-up').addClass('scroll');
    $('p.search-terms').text('Uh Oh. Something went wrong. Try spell checking or entering different ingredients. Make sure to enter valid ingredients.');
  };

  const matchIngredients = function(userIngredients, recipeIngredients) {
    let matchedIngredients = 0;

    for (const userIngredient of userIngredients) {
      for (const recipeIngredient of recipeIngredients) {
        if (recipeIngredient.includes(userIngredient)) {
          matchedIngredients += 1;
          break;
        }
      }
    }

    const totals = {
      matched: matchedIngredients,
      unmatched: recipeIngredients.length - matchedIngredients,
      percentMatch: Math.round(((matchedIngredients / recipeIngredients.length) * 100))
    };

    return totals;
  };

  const sortRecipes = function() {
    if ($('#percent-sort').prop('checked')) {
      recipes = recipes.sort((obj1, obj2) => {
        return obj2.percentMatch - obj1.percentMatch;
      });
    }
  };

  const removeDuplicates = function(recipe) {
    if (recipe.matched && (recipe.unmatched < 20) && (recipeNames.indexOf(recipe.name) === -1)) {
      recipes.push(recipe);
      recipeNames.push(recipe.name);
    }
  };

  const createCard = function() {
    $('.card-insert-point').empty();

    sortRecipes();

    for (const oneRecipe of recipes) {
      let $outerDiv = $('<div>').addClass('col s6 m6 l4');
      let $cardDiv = $('<div>').addClass('card small');

      //* **image***
      let $imageDiv = $('<div>').addClass('card-image');
      const $img = $('<img>').attr('src', oneRecipe.image);

      $imageDiv = $imageDiv.append($img);

      //* **content***
      let $cardContentDiv = $('<div>').addClass('card-content');
      const $contentSpan = $('<span>').addClass('card-title grey-text text-darken-4').text(oneRecipe.name);
      let $contentP = $('<p>');
      const $contentA = $('<a>').attr({ href: oneRecipe.recipeUrl, target: '_blank' }).text('Get Recipe');

      $contentP = $contentP.append($contentA);
      $cardContentDiv = $cardContentDiv.append($contentSpan).append($contentP);

      //* **action***
      let $actionDetailsRow = $('<div>').addClass('row card-action');

      // found items section
      let $actionFoundCol = $('<div>').addClass('col s4');
      let $actionFoundRow = $('<div>').addClass('row ingredient-details');
      const $actionDivFound = $('<div>').addClass('col s12 center').text(oneRecipe.matched);
      let $actionDivFoundIcon = $('<div>').addClass('col s12 center');
      const $actionFoundIcon = $('<i>').addClass('material-icons green-text').text('done');

      $actionDivFoundIcon = $actionDivFoundIcon.append($actionFoundIcon);
      $actionFoundRow = $actionFoundRow.append($actionDivFound).append($actionDivFoundIcon);
      $actionFoundCol = $actionFoundCol.append($actionFoundRow);

      // unmatched items section
      let $actionNotFoundCol = $('<div>').addClass('col s4');
      let $actionNotFoundRow = $('<div>').addClass('row ingredient-details');
      const $actionDivNotFoundNum = $('<div>').addClass('col s12 center').text(oneRecipe.unmatched);
      let $actionDivNotFoundIcon = $('<div>').addClass('col s12 center');
      const $actionNotFoundIcon = $('<i>').addClass('material-icons red-text').text('clear');

      $actionDivNotFoundIcon = $actionDivNotFoundIcon.append($actionNotFoundIcon);
      $actionNotFoundRow = $actionNotFoundRow.append($actionDivNotFoundNum).append($actionDivNotFoundIcon);
      $actionNotFoundCol = $actionNotFoundCol.append($actionNotFoundRow);

      // percent section
      let $actionPercentCol = $('<div>').addClass('col s4');
      let $actionPercentRow = $('<div>').addClass('row ingredient-details');
      const $actionDivPercent = $('<div>').addClass('col s12 center').text(`${oneRecipe.percentMatch}%`);
      const $actionDivMatch = $('<div>').addClass('col s12 center').text('Match');

      $actionPercentRow = $actionPercentRow.append($actionDivPercent).append($actionDivMatch);
      $actionPercentCol = $actionPercentCol.append($actionPercentRow);

      $actionDetailsRow = $actionDetailsRow.append($actionFoundCol).append($actionNotFoundCol).append($actionPercentCol);

      //* **append all to main div for card***
      $cardDiv = $cardDiv.append($imageDiv).append($cardContentDiv).append($actionDetailsRow);
      $outerDiv = $outerDiv.append($cardDiv);

      $('.card-insert-point').append($outerDiv);
    }
  };

  const getImageAndSource = function(recipe, ingredients) {
    const $xhr = $.ajax({
      method: 'GET',
      url: `http://api.yummly.com/v1/api/recipe/${recipe.id}`,
      headers: {
        'X-Yummly-App-ID': '2f19c0bd',
        'X-Yummly-App-Key': '8770079240bf61a9a3e74b55eacfb7be'
      },
      dataType: 'json'
    });

    $xhr.done((data) => {
      if ($xhr.status !== 200) {
        return;
      }

      recipe.image = data.images[0].hostedLargeUrl;
      recipe.recipeUrl = data.source.sourceRecipeUrl;
      removeDuplicates(recipe);
      createCard();

      if (recipes.length) {
        $('p.search-terms').text(`searched items: ${ingredients.join(', ')}`);
        $('#scroll-up').removeClass('scroll');
      } else {
        displayNoMatchMessage();
      }
    });

    $xhr.fail((err) => {
      console.error(err);
    });
  };

  const getRecipes = function(ingredients) {
    const allParameters = getParameters(ingredients);
    const $xhr = $.ajax({
      method: 'GET',
      url: `http://api.yummly.com/v1/api/recipes?${allParameters}`,
      headers: {
        'X-Yummly-App-ID': '2f19c0bd',
        'X-Yummly-App-Key': '8770079240bf61a9a3e74b55eacfb7be'
      },
      dataType: 'json'
    });

    $xhr.done((data) => {
      if ($xhr.status !== 200) {
        return;
      }

      if (data.matches.length === 20) {
        moreRecipes = true;
        $('#more-recipes').removeClass('display');
      } else {
        moreRecipes = false;
        $('#more-recipes').addClass('display');
      }

      if (data.matches.length) {
        for (const result of data.matches) {
          const recipe = {
            id: result.id,
            name: result.recipeName,
            ingredients: result.ingredients
          };

          const ingredientResults = matchIngredients(ingredients, recipe.ingredients);

          Object.assign(recipe, ingredientResults);
          getImageAndSource(recipe, ingredients);
        }
      } else {
        displayNoMatchMessage();
      }
    });

    $xhr.fail((err) => {
      console.error(err);
    });
  };

  //* **EVENT LISTENERS***
  $('.clear-search').click(() => {
    $('ul.list').empty();
    $('p.search-terms').empty();
    $('.card-insert-point').empty();
    $('#scroll-up').addClass('scroll');
    $('#more-recipes').addClass('display');
    $('#percent-sort').removeAttr('checked');
    $('#ingredient').val('');
    recipesStart = 0;
    recipes = [];
    recipeNames = [];
  });

  $('form').submit((event) => {
    event.preventDefault();
    addToList();
  });

  $('i.add').click(() => {
    addToList();
  });

  $('ul.list').on('click', 'i.clear-list', (event) => {
    $(event.target).parent().parent().remove();
  });

  $('#submit-btn').click(() => {
    recipesStart = 0;
    recipes = [];
    recipeNames = [];
    addToList();
    $('.card-insert-point').empty();
    $('p.search-terms').empty();

    if ($('ul.list li').length) {
      getRecipes(getUserIngredients());
    } else {
      Materialize.toast('Please add ingredients.', 4000);
    }
  });

  $('#scroll-up i').click(() => {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  });

  $('#more-recipes i').click(() => {
    getRecipes(getUserIngredients());
  });
})();
