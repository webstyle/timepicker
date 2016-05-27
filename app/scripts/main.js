var dates = {};
dates.v1 = [];
dates.v2 = [];
dates.v3 = [];
var start = null;
var end = null;
var options = {
  lookup: dates.v2,
  minChars: 0,
  onSelect: function (result) {
    var value = result.value + " - ";
    $(this).val(value);
  },
  onSearchComplete: function (query, suggestions) {
    // on search completed
  }
};


getDates();

/**
 * V1 autocomplete with select 2
 */
$('#time').select2({
  multiple: true,
  maximumSelectionLength: 2,
  data: dates.v1
});


/**
 * v2 with jquery autocomplete
 */

$('#autocomplete').devbridgeAutocomplete(options).on('focus', function (event) {

  var self = this;
  $(self).devbridgeAutocomplete("search", this.value);

});


/**
 * end date
 */
$('#end').devbridgeAutocomplete({
  lookup: dates,
  minChars: 0
});

$('#autocomplete').on('input', function (value) {
  var self = this;
  var result = value.currentTarget.value.split(' - ');
  if(result.length > 1) {
    start = result[0];
    end = result[result.length - 1];
    console.log('result', result);
    if(end) {
      $('#end').val(end);
      $(this).devbridgeAutocomplete().clear();
      $('.time').devbridgeAutocomplete({
        lookup: dates.v2,
        onSelect: function(){
          console.log('hi from time');
        }
      });
    }
  }

  $(self).devbridgeAutocomplete("clear");

});


/**
 * v3 with jquery ui autocomplete
 */
$("#ui").autocomplete({
  source: dates.v3,
  select: function(event, ui) {
    var formValue = $(this).val().split(" ");
    var value = formValue[0] + " - ";
    console.log("value 1", value);
    console.log('first value', formValue);
    $("#ui").val(value);
    event.preventDefault();
    var selectedObj = ui.item;
    $("#ui").val(value);
  }
});

$("#ui").on('input', function (value) {

  var result = value.currentTarget.value.split(' - ');
  if(result.length > 1) {

    start = result[0];
    end = result[result.length - 1];


    if(end) {
      $("#ui").autocomplete("search", end);
      $("#ui").autocomplete({
        select: function(event, ui) {
          var formValue = $(this).val().split(" ");
          if(end) {

            var value = formValue[0] + " - "+ ui.item.value;
            console.log('end value', formValue);

            console.log("end", ui.item.value);

            event.preventDefault();
            var selectedObj = ui.item;
            $("#ui").val(value);

          }
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
  var i = 0;
  for (var current = moment(startDate._d); current < end; current.add(1, 'Hours')) {
    i++;
    var v1 = {
      id: i,
      text: current.format("h A")
    };
    var v2 = {
      value: current.format("HH:mm"),
      data: current._d
    };
    dates.v1.push(v1);
    dates.v2.push(v2);
    dates.v3.push(current.format("HH:mm"));
  }
}


/**
 * set input format
 */
function setFormatter() {
  var formatted = new Formatter(document.getElementById('autocomplete'), {
    'pattern': '{{9}}:{{99}} {{aa}} - {{9}}:{{99}} {{aa}}',
    'persistent': true
  });
}
