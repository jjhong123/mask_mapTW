// 新增一隻名為 vue.config.js 的檔案在專案的根目錄

const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        title:'hello',
        $: 'jquery',
        jQuery: 'jquery',
        'windows.jQuery': 'jquery',
      }),
    ],
  },
  css: {
    extract: false
  },
  publicPath: "./", // 預設為/ 所有html下的js css 連結都會是/js/xx,在輸出到web server 路徑會有問題,需用./
};