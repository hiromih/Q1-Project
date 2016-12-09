(function() {
  'use strict';

  $(".button-collapse").sideNav();
  let recipes = [];
  let moreRecipes = false;
  let recipesStart = 0;

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

  const getUserIngredients = function() {
    const usrIngr = [];
    $('span.list-item-text').each((index) => {
      usrIngr.push($('span.list-item-text')[index].textContent);
    });
    return usrIngr;
  };

  const getParameters = function(ingredients) {

    const parameters = ingredients.map((ingredient) => {
      if(ingredient.indexOf(' ') !== -1) {
        return ingredient = ingredient.replace(/\s/g, '+');
      } else {
        return ingredient;
      }
    });

    if (moreRecipes) {
      recipesStart += 20;
    }

    return `q=${parameters.join('+')}&requirePictures=true&maxResult=20&start=${recipesStart}`;

    //might use this later if I can get better results.
    // let allParams = `q=${parameters[0]}`;
    //
    // for (let i = 0; i < parameters.length; i++) {
    //   allParams += `&allowedIngredient[]=${parameters[i]}`;
    // }
    // return allParams;

  };

  const displayNoMatchMessage = function() {
    $('#scroll-up').addClass('scroll');
    $('p.search-terms').text("Uh Oh. Something went wrong. Try spell checking or entering different ingredients. Make sure to enter valid ingredients.");
  }

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
      if($xhr.status !== 200) {
        return;
      }

      if(data.matches.length === 20) {
        moreRecipes = true;
        if($('#more-recipes').hasClass('display')) {
          $('#more-recipes').toggleClass('display');
        }
      } else {
        moreRecipes = false;
        if(!$('#more-recipes').hasClass('display')) {
          $('#more-recipes').toggleClass('display');
        }
      }

      if(data.matches.length !== 0) {

        for(const result of data.matches) {
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

  const getImageAndSource = function(recipe, ingredients) {

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

      if(recipe.matched) {
        createCard(recipe, ingredients);
      }
      console.log(recipes.length);
      if(recipes.length) {
        $('#scroll-up').removeClass('scroll');
      }
    });

    $xhr.fail((err) => {
      console.error(err);
    });

  };

  const createCard = function(recipe, ingredients) {
      $('p.search-terms').text(`searched items: ${ingredients.join(', ')}`);
      let $outerDiv = $('<div>').addClass('col s6 m6 l4');
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
    $('#scroll-up').addClass('scroll');
  });

  $('#submitBtn').click((event) => {
    recipesStart = 0;
    recipes = [];
    addToList();
    $('.card-insert-point').empty();
    $('p.search-terms').empty();

    if($('ul.list li').length) {
      getRecipes(getUserIngredients());
    } else {
      Materialize.toast('Please add ingredients.', 4000);
    }
  });

  $('#more-recipes i').click(() => {
    getRecipes(getUserIngredients());
  });

  $('#scroll-up i').click(() => {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  });

})();
