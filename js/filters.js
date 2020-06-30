'use strict';

(function () {
  var PriceDefault = {
    MIDDLE_MIN: 10000,
    MIDDLE_MAX: 50000,
    LOW_MIN: 0,
    LOW_MAX: 9999,
    HIGH_MIN: 50001,
    HIGH_MAX: Infinity,
  };
  console.log(window.pin.MAX_PIN_QUANTITY);
  var prices = {
    'middle': {
      min: PriceDefault.MIDDLE_MIN,
      max: PriceDefault.MIDDLE_MAX
    },
    'low': {
      min: PriceDefault.LOW_MIN,
      max: PriceDefault.LOW_MAX
    },
    'high': {
      min: PriceDefault.HIGH_MIN,
      max: PriceDefault.HIGH_MAX
    },
    'any': {}
  };

  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelector('#housing-features');
  var features = housingFeatures.querySelectorAll('.map__checkbox');

  var filtersForm = document.querySelector('.map__filters');
  var filteredSimilarPins = window.pin.mainArray;
  var filtersMap;

  var buildFeaturesArray = function () {
    var checkedFeatures = [];
    for (var i = 0; i < features.length; i++) {
      if (features[i].checked) {
        checkedFeatures.push(features[i].value);
      }
    }
    return checkedFeatures;
  };

  var translateAny = function (valueToTranslate) {
    if (valueToTranslate === 'any') {
      return -1;
    }
    return valueToTranslate;
  };

  var translatePriceToText = function (valueToTranslate) {

  }

  var buildFiltersMap = function () {
    filtersMap = {};
    filtersMap.offer = {};
    filtersMap.offer.type = translateAny(housingType.value);
    filtersMap.offer.price = housingPrice.value;
    filtersMap.offer.priceMin = prices[housingPrice.value].min;
    filtersMap.offer.priceMax = prices[housingPrice.value].max;
    filtersMap.offer.rooms = Number(translateAny(housingRooms.value));
    filtersMap.offer.guests = Number(translateAny(housingGuests.value));
    filtersMap.offer.features = buildFeaturesArray();
  };

  var returnFlag = 0;
/*
  var isSimilar2 = function (similarPin, typeOffer) {
    switch (typeOffer) {
      case 'type':
      case 'rooms':
      case 'guests':
        if ((similarPin.offer[typeOffer] === filtersMap.offer.type) || filtersMap.offer.type === 'any') {
          returnFlag++;
        }
    }
  };

  var isSimilar3 = function (similarPin) {
    isSimilar2(similarPin, 'type');
    isSimilar2(similarPin, 'rooms');
    isSimilar2(similarPin, 'type');
    isSimilar2(similarPin, 'type');
  };*/

  var isSimilar = function (similarPin) {
    returnFlag = 0;
    if ((similarPin.offer.type === filtersMap.offer.type) || filtersMap.offer.type === -1) {
      returnFlag++;
    }
    if ((similarPin.offer.price <= filtersMap.offer.priceMax && similarPin.offer.price >= filtersMap.offer.priceMin) || filtersMap.offer.price === 'any') {
      returnFlag++;
    }
    console.log('inPin ' + similarPin.offer.rooms);
    console.log('inFilter ' + filtersMap.offer.rooms);
    console.log('Are they equals' + (filtersMap.offer.rooms === -1));
    if ((similarPin.offer.rooms === filtersMap.offer.rooms) || filtersMap.offer.rooms === -1) {
      returnFlag++;
    }
    if ((similarPin.offer.guests === filtersMap.offer.guests) || filtersMap.offer.guests === -1) {
      returnFlag++;
    }
    if (window.utils.isIncludeArray(similarPin.offer.features, filtersMap.offer.features)) {
      returnFlag++;
    }
    console.log(returnFlag)
    return (returnFlag === 5);
  };

  var onFiltersBarChange = function () {
    window.debounce(function () {
      filteredSimilarPins = [];
      if (document.querySelector('.popup')) {
        window.placeCard.closeCard();
      }
      buildFiltersMap();
      var counter = 0;
      for (var i = 0; i < window.pin.mainArray.length; i++) {
        if (counter === window.pin.MAX_PIN_QUANTITY) {
          break;
        }
        if (isSimilar(window.pin.mainArray[i])) {
          filteredSimilarPins.push(window.pin.mainArray[i]);
          counter++;
        }
      }
      window.pin.reloadData(filteredSimilarPins);
      window.pin.createSimilar();
    });
  };

  filtersForm.addEventListener('change', onFiltersBarChange);

  var filtersReset = function () {
    filtersForm.reset();
  };

  window.filters = {
    filteredSimilarPins: filteredSimilarPins,
    filtersReset: filtersReset
  };
})();
