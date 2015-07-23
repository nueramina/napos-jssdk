var tmp = "./.tmp";
var dist = "./dist";
var src = './lib';
var example = './example';
var simulator = './simulator';
var bowerComponents = './bower_components';

module.exports = {
  browserSync: {
    server: {
      // We're serving the src folder as well
      // for sass sourcemap linking
      index: "simulator.html",
      baseDir: [tmp, example, simulator, './']
    },
    files: [
      example + "/**",
      simulator + "/**",
      tmp + "/**",
      dist + "/**",
      bowerComponents + "/**",
      // Exclude Map files
      "!" + example + "/**.map"
    ]
  },
  server: {
    port: 3001
  },
  browserify: {
    // Enable source maps
    debug: true,
    // Additional file extentions to make optional
    extensions: [],
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: example + '/demo.js',
      dest: tmp,
      outputName: 'demo.js'
    }, {
      entries: simulator + '/simulator.js',
      dest: tmp,
      outputName: 'simulator.js'
    }, {
      entries: './exports.js',
      dest: dist,
      outputName: 'napos-jssdk.js'
    }]
  }
};
