/**
 Tests for adapter
 These tests are executed in browser.
 */

/*global createStartFn*/

/* jshint globalstrict: true */
'use strict';

describe('scalajs-scalatest adapter', function(){
  var Karma = window.__karma__.constructor;

  describe('startFn', function(){
    var tc, config, start;

    beforeEach(function(){
      tc = new Karma(new MockSocket(), {});

      spyOn(tc, 'info');
      spyOn(tc, 'complete');
      spyOn(tc, 'result');

      config = {'suite':'Bla'};
      start = createStartFn(tc, config);
    });
  });

});
