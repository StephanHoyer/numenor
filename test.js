var m = require('mithril');
var expect = require('expect');
var numenor = require('./index');

describe('mithril-node-request', function() {
  var module;

  beforeEach(function() {
    // start http server
    module = {
      controller: function() {
        var scope = {
          result: 'no result'
        };
        m.request('/').then(function() {
          scope.result = 'result';
        });
        return scope;
      },
      view: function(scope) {
        return m('div', scope.result);
      }
    };
  });

  it('should allow to make requests', function() {
    return numenor(module).then(function(htmlString) {
      expect(htmlString).toEqual('<div>result</div>');
    });
  });

});
