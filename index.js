require('es6-promise').polyfill();

var m = require('mithril');
var renderToString = require('mithril-node-render');
var _mSC = m.startComputation;
var _mEC = m.endComputation;
var _mR = m.request;

function run(module) {
  return new Promise(function(resolve, reject) {
    var scope;
    var pendingRequests = 0;

    function mockMithril() {
      m.startComputation = startComputation;
      m.endComputation = endComputation;
      m.request = request;
    }

    function unmockMithril() {
      m.startComputation = _mSC;
      m.endComputation = _mEC;
      m.request = _mR;
    }

    function request(url) {
      startComputation();
      return {
        then: function(fn) {
          mockMithril();
          fn();
          unmockMithril();
          endComputation();
        }
      };
    }

    function startComputation() {
      pendingRequests++;
    }

    function endComputation() {
      if (pendingRequests === 1) {
        render();
      }
      pendingRequests--;
    }

    function render() {
      resolve(renderToString(module.view(scope)));
    }

    startComputation();
    mockMithril();
    scope = module.controller();
    unmockMithril();
    endComputation();
  });
}

module.exports = run;
