$("#ui").timesPicker({
  duration: 20,
  format: '24h'
});

$(".save").click(function () {
  console.log($("#ui").timesPickerSave());
});


