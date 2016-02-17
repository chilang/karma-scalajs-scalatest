var path = require('path');

var createPattern = function(path) {
  return {pattern: path, included: true, served: true, watched: false};
};

var initJasmine = function(files) {
  files.unshift(createPattern(__dirname + '/adapter.js'));
};

initJasmine.$inject = ['config.files'];

module.exports = {
  'framework:scalajs-scalatest': ['factory', initJasmine]
};
