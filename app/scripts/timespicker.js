(function ($) {

  var timePickerFormat;

  /**
   * Timeni regEx yordamida to'g'rilash funksiyasi
   * @param str
   * @returns {string|XML}
   */
  function timeFormat(str) {

    if (!/:/.test(str)) {
      str += (timePickerFormat == '24h') ? ':00' : ':00 am';
    }

    return str
      .replace(/^\d{1}:/, '0$&')
      .replace(/:\d{1}$/, '$&0');
  }


  function ThrowError(message) {
    throw new Error(message);
  }


  /**
   * Save qilganda start va end timelarni validatsiya qilib qaytaradi.
   * @returns {{start: *, end: *}}
   */
  function reformat(element, callback) {

    var formValue, startTime, endTime, firstSplited, secondSplited, firstSplited2, secondSplited2, start, end, maxLength;

    startTime = {};
    endTime = {};

    formValue = $(element).val().split(' - ');

    if (formValue[1].length < 1) return callback('field require');

    firstSplited = formValue[0].split(":");
    secondSplited = formValue[1].split(":");

    firstSplited2 = formValue[0].split("");
    secondSplited2 = formValue[1].split("");

    console.log(firstSplited2, secondSplited2);

    startTime.result = formValue[0];
    startTime.hour = parseInt(firstSplited[0]);
    startTime.minut = firstSplited[1];

    endTime.result = formValue[1];
    endTime.hour = parseInt(secondSplited[0]);
    endTime.minut = secondSplited[1];

    if(firstSplited.length > 1 && secondSplited.length > 1) {
      console.log(startTime.minut);
      console.log(endTime.minut);
    }

    switch (timePickerFormat) {
      case "24h":
        maxLength = 25;
        startTime.result = (startTime.result == 24) ? '00' : startTime.result; endTime.result = (endTime.result == 24) ? '00' : endTime.result; break;
      case "12h":
        maxLength = 13;
        break;
      default:
        maxLength = 25;
    }

    console.log('maxlength', maxLength);
    console.log('startTime result', startTime.hour);
    console.log('endTime result', endTime.hour);

    if (startTime.hour >= maxLength || endTime.hour >= maxLength) return callback('not hour number');

    start = (firstSplited2.length < 4) ? timeFormat(startTime.result) : startTime.result;
    end = (secondSplited2.length < 4) ? timeFormat(endTime.result) : endTime.result;

    var result = {
      start: start,
      end: end
    };

    callback(null, result);
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


    /**
     * Autocomplete on typing to input form
     */
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


    /**
     * Reformat on focusout
     */
    $(element).focusout(function () {
      reformat(element, function (err, result) {
        if(err) return ThrowError(err);

        $(element).val(result.start + " - " + result.end);
      });
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
