
(function () {

  {# TODO: Re-write the code below #}

  $(document).on('click', '.pricing-currency__select label', function (e) {
  $(this).closest('.pricing-currency__select').toggleClass('-open');
  });

  $("select.select-currency").change(function(){
    var selectedCountry = $(this).children("option:selected").val(),
    c = $(this).children("option:selected").attr('data-curr');
    $(this).closest('.hidd-mobile').attr('data-currency', c);

    $('.tile .-active').removeClass('-active');
    $('.tile .-' + c + '').addClass('-active');

    $('.pricing-select__select .-active').removeClass('-active');
    $('.pricing-select__select .-' + c + '').addClass('-active');

  });

  $('.pricing-select__tiles .is-recommended').removeClass('is-recommended');

  $("select.select-venue").change(function(){
    var selectedRevenue = $(this).children("option:selected").val(),
    c = $(this).children("option:selected").attr('data-plan');
    $(this).closest('.pricing-select__select').attr('data-package', c);

    $('.pricing-select__tiles .is-popular').removeClass('is-popular');
    $('.pricing-select__tiles .is-recommended').removeClass('is-recommended');
    $('.pricing-select__tiles .-' + c + '').addClass('is-recommended');

  });

  if (startingCurrency) {
  $('.pricing-currency__select').attr('data-currency', startingCurrency);
  $('.tile .-active').removeClass('-active');
  $('.tile .-' + startingCurrency + '').addClass('-active');

  $('.pricing-select__select .-active').removeClass('-active');
  $('.pricing-select__select .-' + startingCurrency + '').addClass('-active');

  if ($("select.select-venue").children('option').attr('data-curr', startingCurrency)) {
    $(`#all_currencies option[value='${startingCurrency}']`).attr('selected', 'selected');
  }
  }



})();
