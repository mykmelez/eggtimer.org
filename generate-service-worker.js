var fs = require('fs');
var readline = require('readline');

var SW_FILE = 'service-worker.js';
var SW_TEMPLATE_FILE = 'service-worker.tmpl.js';
var SW_OUTPUT_FILE = 'service-worker.js.out';

var rd = readline.createInterface({
  input: fs.createReadStream(SW_TEMPLATE_FILE),
  terminal: false,
});

var out = fs.createWriteStream(SW_OUTPUT_FILE);

rd.on('line', function(line) {
  // We should use a proper template processor, but then we'd depend on
  // a third-party module, so for now we're using a simple String.replace
  // on the VERSION key.
  line = line.replace(/\{\{VERSION\}\}/, Date.now());
  out.write(line + '\n');
});
rd.on('close', function() {
  fs.renameSync(SW_OUTPUT_FILE, SW_FILE);
});
