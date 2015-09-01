var fs = require('fs');
var readline = require('readline');

var WORKER_FILE = 'service-worker.js';
var WORKER_TEMPLATE_FILE = 'service-worker.tmpl.js';
var WORKER_TEMP_FILE = 'service-worker.js.out';

var rd = readline.createInterface({
  input: fs.createReadStream(WORKER_TEMPLATE_FILE),
  terminal: false,
});

var workerOut = fs.createWriteStream(WORKER_TEMP_FILE);

rd.on('line', function(line) {
  // We should use a proper template processor, but then we'd depend on
  // a third-party module, so for now we're using a simple String.replace
  // on the VERSION key.
  line = line.replace(/\{\{VERSION\}\}/, Date.now());
  workerOut.write(line + '\n');
});
rd.on('close', function() {
  workerOut.end();
  fs.renameSync(WORKER_TEMP_FILE, WORKER_FILE);
});

var MANIFEST_FILE = 'manifest.js';
var MANIFEST_TEMP_FILE = 'manifest.js.out';
var manifestOut = fs.createWriteStream(MANIFEST_TEMP_FILE);
manifestOut.write('var urlsToCache = [\n');
manifestOut.write('  "index.css",\n');
manifestOut.write('  "index.html",\n');
manifestOut.write('  "index.js",\n');
manifestOut.write('];\n');
manifestOut.end();
fs.renameSync(MANIFEST_TEMP_FILE, MANIFEST_FILE);
