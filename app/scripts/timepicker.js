(function ($) {

  var timePickerFormat;

  /**
   * Timeni regEx yordamida to'g'rilash funksiyasi
   * @param str
   * @returns {string|XML}
   */
  function timeFormat(str) {

    if (!/:/.test(str)) {
      str += (timePickerFormat == '24h') ? ':00' : ':00 AM';
    }

    return str
      .replace(/^\d{1}:/, '0$&')
      .replace(/:\d{1}$/, '$&0');
  }


  /**
   * Save qilganda start va end timelarni validatsiya qilib qaytaradi.
   * @returns {{start: *, end: *}}
   */
  $.fn.timesPickerSave = function () {

    var formValue, first, second, firstSplited, secondSplited, firstSplited2, secondSplited2, start, end, maxLength, validtion;

    first = {};
    second = {};

    formValue = $(this).val().split(" - ");
    if (formValue.length > 1) {

      firstSplited = formValue[0].split(":");
      secondSplited = formValue[1].split(":");

      firstSplited2 = formValue[0].split("");
      secondSplited2 = formValue[0].split("");

      first.result = formValue[0];
      first.hour = firstSplited[0];
      first.minut = firstSplited[1];

      second.result = formValue[1];
      second.hour = secondSplited[0];
      second.minut = secondSplited[1];

      switch (timePickerFormat) {
        case "24h":
          maxLength = 25;
          first.result = (first.result == 24) ? '00' : first.result;
          second.result = (second.result == 24) ? '00' : second.result;
          break;
        case "12h":
          maxLength = 13;
          break;
        default:
          maxLength = 25;
      }

      if(first.result < maxLength && second.result < maxLength) {

        start = (firstSplited2.length < 4)? timeFormat(first.result) : first.result;
        end = (secondSplited2.length < 4)? timeFormat(second.result) : second.result;

        var result = {
          start: start,
          end: end
        };

        $(this).val(result.start + " - " + result.end);
        return result;

      } else {
        console.error('format errorku');
      }

    } else {
      console.error('field required');
    }

  };

  /**
   * Times Pickerni ko'rsatish va autocomplete
   */
  $.fn.timesPicker = function (options) {

    var dates;
    var start = null;
    var end = null;
    var element = this;
    var format;

    dates = [];

    var settings = $.extend({
      'duration': 15,
      'format': '24h',
      'time': false
    }, options);

    if (settings.time) {
      $(this).val(settings.time.start + " - " + settings.time.end);
    }


    format = (settings.format == '24h') ? "HH:mm" : "h:mm a";
    timePickerFormat = settings.format;

    var duration = settings.duration;

    getDates();


    function split(val) {
      return val.split(/,\s*/);
    }

    function extractLast(term) {
      return split(term).pop();
    }

    /**
     * v3 with jquery ui autocomplete
     */
    $(element).bind("keydown", function (event) {
      if (event.keyCode === $.ui.keyCode.TAB &&
        $(this).autocomplete("instance").menu.active) {
        event.preventDefault();
      }
    }).autocomplete({
      focus: function () {
        // prevent value inserted on focus
        return false;
      },
      source: function (request, response) {
        // delegate back to autocomplete, but extract the last term
        response($.ui.autocomplete.filter(
          dates, extractLast(request.term)));
      },
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

          $(element).bind("keydown", function (event) {
            if (event.keyCode === $.ui.keyCode.TAB &&
              $(this).autocomplete("instance").menu.active) {
              event.preventDefault();
            }
          }).autocomplete({

            focus: function () {
              // prevent value inserted on focus
              return false;
            },

            select: function (event, ui) {

              var formValue = $(this).val().split(" - ");
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

    /*
     * get hours of the day
     */
    function getDates() {
      var startDate = moment();
      var endDate = moment();
      startDate.startOf('Day');
      endDate.endOf('Day');
      var end = new Date(endDate._d);
      for (var current = moment(startDate._d); current < end; current.add(duration, 'Minutes')) {
        dates.push(current.format(format));
      }
    }


  };

})(jQuery);
