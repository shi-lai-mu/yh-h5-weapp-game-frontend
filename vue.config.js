const path = require('path');
const tsImportPluginFactory = require('ts-import-plugin');
const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
  assetsDir: './',
  configureWebpack: (config) => {
    config.module = {
      rules: [
        // 配置新的 使用config的话 必须要将原来的和现在的合并,而且使用新的在后面覆盖旧的
        ...config.module.rules,
        {
          test: /\.(jsx|tsx|js|ts)$/,
          loader: 'ts-loader',
          options: {
            happyPackMode: true,
            transpileOnly: true,
            getCustomTransformers: () => ({
              before: [ tsImportPluginFactory( {
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: name => `${name}/style/less`
              })]
            }),
            compilerOptions: {
              module: 'es2015'
            }
          },
          exclude: /node_modules/
        }
      ]
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@views', resolve('src/views'))
      .set('@Home', resolve('src/views/Home'))
  }
}
