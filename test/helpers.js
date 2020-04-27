const os = require('os');
const path = require('path');

const del = require('del');
const { createFsFromVolume, Volume } = require('memfs');
const uuidV4 = require('uuid/v4');
const webpack = require('webpack');

const moduleConfig = (config) => {
  return {
    rules: config.rules
      ? config.rules
      : [
          {
            test: (config.loader && config.loader.test) || /\.js$/,
            use: [
              {
                loader: path.resolve(__dirname, '../src/index.js'),
                options: (config.loader && config.loader.options) || {},
              },
            ].concat(
              config.babelLoader
                ? [
                    {
                      loader: 'babel-loader',
                      options: config.babelLoaderOptions || {},
                    },
                  ]
                : []
            ),
          },
          {
            test: /\.png$/,
            use: [
              {
                loader: path.resolve(__dirname, '../src/index.js'),
                options: (config.loader && config.loader.options) || {},
              },
              'file-loader',
            ],
          },
        ],
  };
};
const pluginsConfig = (config) => [].concat(config.plugins || []);
const outputConfig = (config) => {
  return {
    path: path.resolve(
      __dirname,
      `../outputs/${config.output ? config.output : ''}`
    ),
    filename: '[name].bundle.js',
  };
};

function compile(fixture, config = {}, options = {}) {
  // webpack Config
  // eslint-disable-next-line no-param-reassign
  config = {
    mode: 'development',
    devtool: config.devtool || 'sourcemap',
    context: path.resolve(__dirname, 'fixtures'),
    entry: path.resolve(__dirname, 'fixtures', fixture),
    output: outputConfig(config),
    module: moduleConfig(config),
    plugins: pluginsConfig(config),
    optimization: {
      runtimeChunk: true,
    },
  };

  // Compiler Options
  // eslint-disable-next-line no-param-reassign
  options = Object.assign({ output: false }, options);

  if (options.output) {
    del.sync(config.output.path);
  }

  const compiler = webpack(config);

  if (!config.outputFileSystem) {
    const outputFileSystem = createFsFromVolume(new Volume());
    // Todo remove when we drop webpack@4 support
    outputFileSystem.join = path.join.bind(path);

    compiler.outputFileSystem = outputFileSystem;
  }

  return new Promise((resolve, reject) =>
    compiler.run((error, stats) => {
      if (error) {
        return reject(error);
      }
      return resolve(stats);
    })
  );
}

function getRandomTmpDir() {
  return path.resolve(os.tmpdir(), `test_${uuidV4()}`);
}

module.exports = {
  getRandomTmpDir,
  webpack: compile,
};
