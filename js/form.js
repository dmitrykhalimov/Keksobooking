'use strict';

(function () {

  var TYPE_FLAT_MIN_VALUE = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0
  };

  var DISABLED_ROOMS = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };
  document.querySelector('#title').value = 'dsafsdfksadjhfasdjlfhasdkljfhasdlkjfhasdkfjhasdf';
  document.querySelector('#price').value = '9000';
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var typeFlatList = document.querySelector('#type');
  var priceInput = document.querySelector('#price');
  var submitButton = document.querySelector('.ad-form__submit');
  var roomsNumber = document.querySelector('#room_number');
  var guestsNumber = document.querySelector('#capacity');
  var resetButton = document.querySelector('.ad-form__reset');

  var onTimeInChange = function () {
    timeOut.value = timeIn.value;
  };

  var onTimeOutChange = function () {
    timeIn.value = timeOut.value;
  };

  var onTypeFlatChange = function () {
    priceInput.setAttribute('min', TYPE_FLAT_MIN_VALUE[typeFlatList.value]);
    priceInput.setAttribute('placeholder', TYPE_FLAT_MIN_VALUE[typeFlatList.value]);
  };

  timeIn.addEventListener('change', onTimeInChange);
  timeOut.addEventListener('change', onTimeOutChange);
  typeFlatList.addEventListener('change', onTypeFlatChange);

  submitButton.addEventListener('click', function () {
    if (!DISABLED_ROOMS[roomsNumber.value].includes(guestsNumber.value)) {
      guestsNumber.setCustomValidity('Выбрано некорректное количество мест');
    } else {
      guestsNumber.setCustomValidity('');
    }
  });

  roomsNumber.addEventListener('change', function () {
    for (var j = 0; j < guestsNumber.options.length; j++) {
      guestsNumber[j].disabled = !DISABLED_ROOMS[roomsNumber.value].includes(guestsNumber.options[j].value);
    }
  });

  var updateMapAddress = function (valueX, valueY) {
    var fieldAddress = document.querySelector('#address');
    fieldAddress.value = ((valueX + ', ' + valueY));
  };

  updateMapAddress(window.map.MAP_PIN_DEFAULT_X + window.map.MAP_PIN_WIDTH / 2, window.map.MAP_PIN_DEFAULT_Y + window.map.MAP_PIN_HEIGHT / 2);

  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');

  var onError = function () {
    var errorPopup = errorTemplate.cloneNode(true);

    errorPopup.addEventListener('click', onErrorWindowClick);
    document.addEventListener('keydown', onErrorWindowEsc);
    window.drawPopups.openPopup(errorPopup);
  };

  var onErrorWindowClick = function () {
    closeErrorWindow();
  };

  var closeErrorWindow = function () {
    document.querySelector('.error').removeEventListener('click', onErrorWindowClick);
    document.removeEventListener('keydown', onErrorWindowEsc);
    window.drawPopups.closePopup(document.querySelector('.error'));
  };

  var onErrorWindowEsc = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeErrorWindow();
    }
  };

  var onSend = function () {
    var successPopup = successTemplate.cloneNode(true);

    successPopup.addEventListener('click', onSuccessWindowClick);
    document.addEventListener('keydown', onSuccessWindowEsc);

    window.drawPopups.openPopup(successPopup);

    resetButton.click();
    window.map.deactivateMap();
    window.pin.removeSimilar();
    window.pin.reloadData();
  };

  var onSuccessWindowClick = function () {
    closeSuccessWindow();
  };

  var onSuccessWindowEsc = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeSuccessWindow();
    }
  };

  var closeSuccessWindow = function () {
    document.querySelector('.success').removeEventListener('click', onSuccessWindowClick);
    document.removeEventListener('keydown', onSuccessWindowEsc);
    window.drawPopups.closePopup(document.querySelector('.success'));
  };

  var formAdvert = document.querySelector('.ad-form');
  var onFormSubmit = function (evt) {
    window.backend.sendLoadData('POST', 'https://javascript.pages.academy/keksobooking', onSend, onError, new FormData(formAdvert));
    evt.preventDefault();
  };

  formAdvert.addEventListener('submit', onFormSubmit);

  window.form = {
    updateMapAddress: updateMapAddress
  };

  window.utils.changeInputs('fieldset', true);
})();
