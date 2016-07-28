$("#ui").timesPicker({
  duration: 20,
  format: '24h'
});

$(".save").click(function() {
  $("#ui").timesPickerSave(function(err, result) {
    if(err) {
      console.error(err);
    }

    console.log(result);
  });
});


