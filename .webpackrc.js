
export default {
  "entry": 'src/index.js',
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }],
  ],
  "alias": {
    "routes": `${__dirname}/src/routes/`,
    "models": `${__dirname}/src/models/`,
    "services": `${__dirname}/src/services/`,
    "utils": `${__dirname}/src/utils/`,
    "components": `${__dirname}/src/components/`,
    "assets": `${__dirname}/src/assets/`
  },
  publicPath: process.env.API_ENV =='prod'?'/':'/',
  "theme": "./src/theme.js", //用于自定义样式
  "proxy": {
    "/": {
      "target": process.env.TEST === 'true'?"http://183.56.208.208:81/api":"http://192.168.0.140:7001/dataFactory",
      "changeOrigin": true,
      "pathRewrite": { "^/": "" }
    },
    
  },
  define: {  'API_ENV': process.env.API_ENV }
}
