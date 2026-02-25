function $(id) {
    return document.getElementById(id);
  }
  /* eslint-enable no-restricted-properties */
  
  document.addEventListener('DOMContentLoaded', function() {
    $('print-link').hidden = false;
    $('print-link').onclick = function() {
      window.print();
      return false;
    };
  
    document.addEventListener('keypress', function(e) {
      // Make the license show/hide toggle when the Enter is pressed.
      if (e.keyCode === 0x0d && e.target.tagName === 'LABEL') {
        e.target.previousElementSibling.click();
      }
    });
  });
  