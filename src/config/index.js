var config = {
    path: 'localhost',
    port: 9080,
    pathDir: './dist',
    html: 'index.html',
    proxy: {
      '/cms': {
        target: 'https://oboref.com/f/cms',
        changeOrigin: true,
        pathRewrite: {
            '^/cms': ''
        }
      }
    }
};

module.exports = config;
