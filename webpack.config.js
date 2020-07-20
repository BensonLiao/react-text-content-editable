const path = require('path');
module.exports = (env = {}) => {
  return {
    mode: env.mode || 'development',
    entry: path.join(__dirname, 'src', 'Editable.js'),
    output: {
      path: path.join(__dirname, 'build'),
      publicPath: '/build/',
      filename: 'index.js',
      library: 'react-text-content-editable', 
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/react'
              ]
            }
          }
        }
      ]
    },
    resolve: { 
      extensions: ['.js'],
      alias: { 
        'react': path.resolve(__dirname, './node_modules/react') ,
        'react-dom': path.resolve(__dirname, './node_modules/react-dom')
      } 
    },
    externals: {
      // Don't bundle react or react-dom
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      },
      "react-dom": {
        root: "ReactDOM",
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    }
  }
};
