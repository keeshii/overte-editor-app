const WrapperPlugin = require('wrapper-webpack-plugin');
const path = require('path');

const outputFiles = [
  'editor-spawner',
  'editor-client',
  'editor-server'
];

const configs = [];

outputFiles.forEach(file => {
  configs.push({
    entry: './scripts/source/' + file + '.ts',
    target: 'es5',
    mode: 'production',
    optimization: { minimizer: [] },
    module: {
      rules: [{
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules|spec.ts$/
        }]
    },
    resolve: {
      extensions: ['.ts']
    },
    output: {
      chunkFormat: false,
      filename: file + '.js',
      path: path.resolve(__dirname, '../dist'),
      libraryTarget: 'self'
    },
    plugins: [
      new WrapperPlugin({
        test: /\.js$/, // only wrap output of bundle files with '.js' extension
        header: '((typeof module !== \'undefined\' ? module : {}).exports = function () { var self={};\n',
        footer: '\nreturn self["default"];})' + (file.match(/(client|server)$/) ? ';' : '();'),
        afterOptimizations: true
      })
    ]
  });
});

module.exports = configs;
