'use strict';

(function () {
  var PIN_SHIFT_X = 25;
  var PIN_SHIFT_Y = 70;
  var MAX_PIN_QUANTITY = 5;

  var fragment = document.createDocumentFragment();
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var renderAdvert = function (advert) {
    var mapPin = mapPinTemplate.cloneNode(true);
    mapPin.style.left = Number(advert.location.x - PIN_SHIFT_X) + 'px';
    mapPin.style.top = Number(advert.location.y - PIN_SHIFT_Y) + 'px';
    mapPin.querySelector('img').src = advert.author.avatar;
    mapPin.querySelector('img').alt = advert.offer.title;
    mapPin.addEventListener('click', function () {
      window.placeCard.place(advert);
      mapPin.classList.add('map__pin--active');
    });
    return mapPin;
  };

  var removeActivePin = function () {
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  var adverts = [];

  var getAdverts = function () {
    return adverts;
  };

  var loadData = function (receivedData) {
    adverts = receivedData.filter(function (advert) {
      return advert.offer;
    });
    updateArray(adverts);
    createSimilar();
  };

  var updateArray = function (dataToRender) {
    removeSimilar();
    var maxLength = MAX_PIN_QUANTITY;
    if (dataToRender.length < MAX_PIN_QUANTITY) {
      maxLength = dataToRender.length;
    }

    for (var i = 0; i < maxLength; i++) {
      fragment.appendChild(renderAdvert(dataToRender[i]));
    }
  };

  var removeSimilar = function () {
    var similarPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < similarPins.length; i++) {
      similarPins[i].remove();
    }
  };

  var createSimilar = function () {
    document.querySelector('.map__pins').appendChild(fragment);
  };

  var downloadData = function () {
    window.backend.sendLoadData('GET', 'https://javascript.pages.academy/keksobooking/data', loadData, window.backend.drawError);
  };

  window.pin = {
    createSimilar: createSimilar,
    removeSimilar: removeSimilar,
    removeActive: removeActivePin,
    getAdverts: getAdverts,
    downloadData: downloadData,
    reloadData: updateArray,
    MAX_PIN_QUANTITY: MAX_PIN_QUANTITY
  };
})();
