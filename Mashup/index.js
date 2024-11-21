function _autoload(scriptUrl, callback) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = scriptUrl;
  
  script.onload = function() {
      console.log(scriptUrl + ' loaded successfully.');
      if (callback) callback();
  };

  script.onerror = function() {
      console.error('Error loading ' + scriptUrl);
  };

  document.head.appendChild(script);
}

_autoload('mashup.js', function() {
  console.log('Script cargado y ejecutado.');
});