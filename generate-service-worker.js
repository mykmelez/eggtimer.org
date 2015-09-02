var fs = require('fs');
var path = require('path');
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

// Walk the current directory tree and generate a list of file paths relative to
// the current directory.
var walk = function(dir, results) {
  var list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    var stat = fs.lstatSync(file);
    if (stat && stat.isDirectory()) {
      walk(file, results);
    }
    else {
      results.push(file);
    }
  });
}
var files = [];
walk('./', files);

// XXX Move these to an external configuration file.
// XXX Allow simple wildcards/globs in addition to regexes (for inspiration,
// see http://wiki.greasespot.net/Include_and_exclude_rules).
var include = [
  new RegExp('.*\.css$'),
  new RegExp('.*\.html$'),
  new RegExp('.*\.js$'),
];
var exclude = [
  /^\./,
  /generate-service-worker\.js/,
  /service-worker\.js/,
  /service-worker\.tmpl\.js/,
];

// Write files to the manifest that match the include rules (and aren't excluded
// by the exclude rules).
// XXX Instead of iterating over files, integrate the include/exclude tests
// into the directory tree walker.
files.forEach(function(file) {
  for (var i = 0; i < include.length; i++) {
    if (include[i].test(file)) {
      for (var j = 0; j < exclude.length; j++) {
        if (exclude[j].test(file)) {
          break;
        }
      }
      if (j === exclude.length) {
        manifestOut.write('  "' + file + '",\n');
      }
      break;
    }
  }
});

manifestOut.write('];\n');
manifestOut.end();
fs.renameSync(MANIFEST_TEMP_FILE, MANIFEST_FILE);
