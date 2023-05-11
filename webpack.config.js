const TerserPlugin = require('terser-webpack-plugin');
const config = require('config');

module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];

  return {
    ...options,
    entry: ['./src/main.ts'],
    externals: [
      'fastify-swagger',
      'class-transformer/storage',
      'swagger-ui-dist',
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
          },
        }),
      ],
    },
    plugins: [
      ...options.plugins,
      new webpack.DefinePlugin({
        'process.env.NODE_CONFIG': JSON.stringify(JSON.stringify(config)),
      }),

      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
  };
};
