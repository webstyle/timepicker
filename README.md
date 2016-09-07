# Time range picker
Demo http://webstyle.github.io/timepicker


### Installation
```bash
$ git clone https://github.com/WebStyle/timepicker.git
```

Install a npm and bower dependencies:
```bash
npm install && bower install
```
`gulp serve` to launch a server on your source files


### Usage

```html
<link rel="stylesheet" href="/path/to/jquery-ui.min.css">

....

<input type="text" id="timepicker" name="name">

....

<script type="text/javascript">
  $('.timepicker').timesPicker();
</script>
<script src="/path/to/jquery.min.js" charset="utf-8"></script>
<script src="/path/to/jquery-ui.min.js" charset="utf-8"></script>
<script src="/scripts/timepicker.js" charset="utf-8"></script>
```


### Options
```javascript
var options = {
  duration: 15,     // on minutes
  format: '24h',    // 24 hours time format or you can use 12 time format with '12h' option
  time: {           // set default times
    start: '09:00', // start default time
    end: '19:00'    // end default time
  }
};

$('.timepicker').timesPicker(options);
```
