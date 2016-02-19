module.exports = function(config) {
  config.set({
    reporters: ['progress'],
    frameworks: ['scalajs-scalatest'],
    files: [
      'target/scala-2.11/foo-test-jsdeps.js',
      'target/scala-2.11/foo-test-fastopt.js'
    ],

    browsers: process.env.TRAVIS ? ['Firefox'] : ['Chrome'],

    autoWatch: true,

    client: {
      tests: [
        "foo.FooTest"
      ]
    }
  });
};
