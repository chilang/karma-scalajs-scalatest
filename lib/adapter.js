(function(window) {

/* jshint globalstrict: true */
'use strict';

var callback = null;
var testReporter = null;


function stackTraceToString(stackTrace) {
    return stackTrace.map(function(s){
      return 'at '+ s.className + '.' + s.methodName + '('+ s.fileName +':' + s.lineNumber+')';
    }).join('\n');
  }

function ScalaJSReporter(tc) {

  var testCount = 0;

  this.testFinished = function(event) {
    // console.log('testFinished', testCount, event);
    var result = {
      description: event.selector.testName,
      id: event.fullyQualifiedName + '.' + event.selector.testName,
      log: event.throwable ? [event.throwable.toString].concat([stackTraceToString(event.throwable.stackTrace)]) : [],
      skipped: event.status === 'Skipped',
      success: event.status === 'Success',
      suite: [event.fullyQualifiedName],
      time: event.durationLS
    };
    testCount--;
    tc.info({
      total: testCount
    });
    tc.result(result);
  };

  this.testStarted = function() {
    // console.log('testStarted', testCount);
    testCount++;
    tc.info({
      total: testCount
    });
  };
  this.suiteCompleted = function() {
    tc.info({
      total: testCount
    });
    tc.complete({coverage: window.__coverage__});
    // console.log('COUNT', testCount);
    // testCount = 0;
  };
  this.suiteStarting = function() {
    // tc.info({
    //   total: 7
    // });
    // console.log('suiteStarting', testCount);

  };
  this.onMessage = function(msg) {
    var split = msg.indexOf(':');
    var cmd = msg.substring(0, split);
    if (cmd === 'event') {
      var event = JSON.parse(msg.substr(split+1));
      this.testFinished(event);
    } else if (cmd === 'msg') {
      var message = msg.substr(split+1);
      if (message === 'org.scalatest.events.TestStarting') { this.testStarted(); }
      else if(message === 'org.scalatest.events.SuiteCompleted') { this.suiteCompleted(); }
      else if(message === 'org.scalatest.events.SuiteStarting') { this.suiteStarting(); }
    } else {
      console.log('onMesssage', msg);
    }
  };
}

window.scalajsCom = {
  reporter: function(tc) {
    testReporter = new ScalaJSReporter(tc);
  },
  init: function(recvCB) {
    console.log('init');
    callback = recvCB;

  },
  receive: function(msg) {
    callback(msg);
  },
  send: function(msg) {
    console.log('send:', msg);
    testReporter.onMessage(msg);
  },
  close: function() {
    // console.log('close');
  }
};
/**
 * Karma starter function factory.
 *
 * @param  {Object}   karma        Karma runner instance.
 * @param  {Object}   config       Adapter config
 * @return {Function}              Karma starter function.
 */
function createStartFn(karma, config) {
  // This function will be assigned to `window.__karma__.start`:
  return function () {
      scalajsCom.reporter(karma);
      var slave = new org.scalajs.testinterface.internal.Slave('org.scalatest.tools.Framework', [], []);
      slave.init();

      var task = {
        fullyQualifiedName: config.suite,
        fingerprint: {
          fpType: 'SubclassFingerprint',
          superclassName: 'org.scalatest.Suite',
          isModule: false,
          requireNoArgConstructor: true
        },
        explicitlySpecified: true,
        selectors: [{selType: 'SuiteSelector'}]
      };
      var cmd = {
        loggerColorSupport: [],
        serializedTask: JSON.stringify(task)
      };
      scalajsCom.receive('newRunner:');

      scalajsCom.receive('execute:' + JSON.stringify(cmd));

      scalajsCom.receive('stopSlave:');

      //scalajsCom.close();
  };
}

window.__karma__.start = createStartFn(window.__karma__, window.__karma__.config);

})(typeof window !== 'undefined' ? window : global);
