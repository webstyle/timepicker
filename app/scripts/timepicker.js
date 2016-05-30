var worklyPicker = function (element, duration) {

  var dates = {};
  dates.v1 = [];
  dates.v2 = [];
  dates.v3 = [];
  var start = null;
  var end = null;

  getDates();

  /**
   * v3 with jquery ui autocomplete
   */
  $(element).autocomplete({
    source: dates.v3,
    select: function (event, ui) {
      var value = ui.item.value + " - ";
      $(element).val(value);
      event.preventDefault();
      var selectedObj = ui.item;
      $(element).val(value);
    }
  });

  $(element).on('input', function (value) {

    var result = value.currentTarget.value.split(' - ');

    if (result.length > 1) {

      start = result[0];
      end = result[1];

      if (end) {
        $(element).autocomplete("search", end);

        $(element).autocomplete({
          select: function (event, ui) {

            var formValue = $(this).val().split(" ");
            var value;

            if (formValue[1]) {
              value = formValue[0] + " - " + ui.item.value;
            } else {
              value = ui.item.value + " - ";
            }

            event.preventDefault();
            var selectedObj = ui.item;
            $(element).val(value);

          }
        });
      }
    }

  });


  /**
   * get hours of the day
   */
  function getDates() {
    var startDate = moment();
    var endDate = moment();
    startDate.startOf('Day');
    endDate.endOf('Day');
    var end = new Date(endDate._d);
    for (var current = moment(startDate._d); current < end; current.add(duration, 'Minutes')) {
      dates.v3.push(current.format("HH:mm"));
    }
  }
}

module.exports = worklyPicker;
