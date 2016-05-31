(function ($) {

  /**
   * Save qilganda start va end timelarni validatsiya qilib qaytaradi.
   * @returns {{start: *, end: *}}
   */
  $.fn.timesPickerSave = function () {
    var formValue = $(this).val().split(" - ");
    var first = formValue[0];
    var second = formValue[1];
    var start, end;

    /**
     * Timeni regEx yordamida to'g'rilash funksiyasi
     * @param str
     * @returns {string|XML}
     */
    function time(str) {

      if (!/:/.test(str)) {
        str += ':00';
      }

      var strArray = str.split("");
      var regexStart, regexEnd;

      regexStart = (strArray.length > 2) ? /^\d{1}:/ : /^\d{2}:/;
      regexEnd = /:\d{1}$/;

      return str
        .replace(regexStart, '0$&')
        .replace(regexEnd, '$&0');
    }


    console.log(formValue.length);

    if (formValue.length > 1) {

      if (parseInt(formValue[0]) < 24 || parseInt(formValue[1])) {
        start = time(formValue[0]);
        end = time(formValue[1]);

        var result = {
          start: start,
          end: end
        };

        $(this).val(result.start + " - " + result.end);
        return result;

      } else {
        console.error('errorku format xato berdiz');
      }
    }


  };


  /**
   * Times Pickerga values qo'shish uchun
   * @param time
   */
  $.fn.timesPickerSetValues = function (time) {
    var result = time.start + " - " + time.end;
    $(this).val(result);
  };

  /**
   * Times Pickerni ko'rsatish va autocomplete
   */
  $.fn.timesPicker = function (options) {

    var dates = {};
    dates = [];
    var start = null;
    var end = null;

    var settings = $.extend({
      'duration': 15,
      'format': '24h'
    }, options);

    var format;

    format = (settings.format == '24h') ? "HH:mm" : "h:mm a";

    var element = this;
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


$("ui").timesPickerSetValues({start: '10:30', end: '20:00'});

$("#ui").timesPicker({
  duration: 20,
  format: '24h'
});

$(".save").click(function () {
  console.log($("#ui").timesPickerSave());
});


