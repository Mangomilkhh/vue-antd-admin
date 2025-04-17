// 适用于前端项目中使用 Node.js 标准库或兼容旧版依赖的场景
// 引入 Webpack 模块，在配置中添加插件或修改 Webpack 的默认行为
const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {   
    // 在浏览器环境中支持 Node.js 的 fs 功能，允许前端代码访问文件系统功能
    fs: require.resolve("browserify-fs"),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      // 为全局环境注入 process 和 Buffer 对象，以兼容依赖这些变量的第三方库
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);


  // 添加一个新的规则，匹配 .js 和 .mjs 文件
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      // 禁止 Webpack 在导入模块时强制要求文件扩展名，避免因扩展名问题导致的模块加载失败
      fullySpecified: false,
    },
  });

  return config;
};