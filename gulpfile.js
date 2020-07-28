/**
 * 此为gulp4.0的配置文件
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'), //打印日志工具
    clean = require('gulp-clean'), //清理文件工具
    config = require('./src/config'),
    del = require('del'), //更好用的清理工具
    uglify = require('gulp-uglify'), //压缩js
    fileinclude = require('gulp-file-include'), //可以在html中引入模板
    htmlmin = require('gulp-htmlmin'), //HTML压缩
    sass = require('gulp-sass'), //SASS编译
    os = require('os'),
    gulpOpen = require('gulp-open'),
    cleanCSS = require('gulp-clean-css'), //压缩CSS
    autoprefixer = require('gulp-autoprefixer'), //CSS自动添加前缀
    postcss = require('gulp-postcss'), //对css处理的插件系统
    pxtorem = require('postcss-pxtorem'), //将px转成rem
    gulpInlineSource = require('gulp-inline-source'), //html外链文件内容复制到HTML，外链处标签要加 inline，如 <script src="./index.js" inline></script>
    browserSync = require('browser-sync').create(), //浏览器实时刷新
    reload = browserSync.reload,
    //runSequence = require('gulp-run-sequence'); //处理task执行顺序问题，不太用的着
    flatten = require('gulp-flatten'), //移除或替换文件的路径
    cssBase64 = require('gulp-css-base64'), //将小于38kb的图片转为base64, 样式后面加注释可忽略： / * base64：skip * /
    connect = require("gulp-connect"), //本地服务
    logger = require('log4js').getLogger(), //log输出
    { createProxyMiddleware } = require('http-proxy-middleware'); //设置服务代理

    logger.level = 'all'

    fileName = "sakura-new-website",
    srcDir = "src", //源文件存放路径
    srcPath = {
        scss: [srcDir + "/scss/**/*.scss"],
        js: srcDir + "/**/*.js",
        html: [
            srcDir + "/**/*.html"
        ],
        other: [srcDir + "/**/*+(png|jpg|gif)"]
    },

    buildDir = "dist", //编译后文件存放路径
    buildPath = {
        css: buildDir + "/css",
        js: buildDir + "/js"
    },
    end = "";

/**
 * 删除所有编译文件
 */
/* gulp.task('clean', function() {
    return del([buildDir]);
}); */
gulp.task('clean', function (done) {
    gulp.src(['dist'])
        .pipe(clean())
        .on('end', done);
});

// 获取本地ip
function getIP() {
    const ifaces = os.networkInterfaces();
    let ip = '127.0.0.1';
    for (let dev in ifaces) {
        if (ifaces.hasOwnProperty(dev)) {
            ifaces[dev].forEach(details => {
                if (ip === '127.0.0.1' && details.family === 'IPv4') {
                    ip = details.address;
                }
            });
        }
    }
    return ip;
}

/* let proxyArr =[
    // 代理转发接口(1)
    createProxyMiddleware('/api1', {
        target: 'http://www.baidu.com:80',
        changeOrigin: true,
    }),

    // 代理转发接口(2)
    createProxyMiddleware('/api2', {
        target: 'http://www.taobao.com:80',
        changeOrigin: true,
    })
]
 */
/**
 * 浏览器实时刷新
 */
gulp.task('server1111111111', function() {
    browserSync.init({
        //server: './dist',
        // 配置server
        server: {
            baseDir: './dist', // server的基础路径
            middleware: [...proxyArr] // 使用中间件
        },
        //host: getIP(), // 定义host
        open: false,
        port: 8099,
        startPath: '/index.html', // 项目启动时打开的页面路径
        //browser: "google chrome", //在Chrome浏览器中打开网站
        notify: true, //显示在浏览器中的任何通知。
        files: ["dist/**/*.*"],
        reloadDelay: 1000,
        //proxy: "http://www.bbc.co.uk"
        //files: ['./**/*.html', './**/*.css', './**/*.js'] // 修改那些文件的时候浏览器页面会自动刷新
    });
});

gulp.task('server', function () {
  /* console.log('------------------');
  logger.debug('this is debug');
  logger.warn('this is warn'); */
  setTimeout(() => {
    logger.info(`服务地址为：http://${config.path}:${config.port}/${config.html}`);
  }, 2000)
  let proxyArr = [];
  for (let key in config.proxy) {
    proxyArr.push(createProxyMiddleware(key, config.proxy[key]))
  }
  connect.server({
      root: config.pathDir,
      port: config.port,
      https: false,
      livereload: true,
      //fallback: '/index.html',
      middleware: function (connect, opt) {
          /* return [
            createProxyMiddleware('/cms', {
                  target: 'https://oboref.com/f/cms',
                  changeOrigin: true,
                  pathRewrite: {
                      '^/cms': ''
                  }
              })
          ] */
          return proxyArr;
      }
  });
});

//mac chrome: "Google chrome",
var browser = os.platform() === 'linux' ? 'Google chrome' : (
  os.platform() === 'darwin' ? 'Google chrome' : (
      os.platform() === 'win32' ? 'chrome' : 'firefox'));

gulp.task('open', function (done) {
  gulp.src('')
      .pipe(gulpOpen({
          app: browser,
          uri: `http://${config.path}:${config.port}/${config.html}`
      }))
      .on('end', done);
});

//拷贝外部插件及安装包
gulp.task('copy:lib', function (done) {
    gulp.src('src/lib/**/*')
    .pipe(gulp.dest('dist/lib/'))
    .on('end', done);
});

//用于在html文件中直接include文件
gulp.task('temp:include', function (done) {
  gulp.src(['src/view/**/*.html'])
      .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
      }))
      .pipe(gulp.dest('dist'))
      .on('end', done);
});

//拷贝字体图标
gulp.task('copy:icontfont', function (done) {
    gulp.src('src/icontfont/**/*')
    .pipe(gulp.dest('dist/icontfont/'))
    .on('end', done);
});

//将图片拷贝到目标目录
gulp.task('copy:assets', function (done) {
    gulp.src(['src/assets/**/*'])
    .pipe(gulp.dest('dist/assets'))
    .on('end', done);
});

//拷贝css
gulp.task('copy:css', function (done) {
    gulp.src('src/css/**/*')
    .pipe(cssBase64())
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css/'))
    /* .pipe(postcss(
      [
        pxtorem({
            propList: ['*'],
            selectorBlackList: ['ignore'],
            replace: true,
            mediaQuery: true,
            minPixelValue: 1
        })
      ]
    )) */
    .on('end', done);
});

//拷贝html
gulp.task('copy:html', function (done) {
    gulp.src('src/view/**/*.html')
    //.pipe(htmlmin({ collapseWhitespace: true }))
    //.pipe(gulpInlineSource())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(flatten())
    .pipe(gulp.dest('dist'))
    .on('end', done);
});

//拷贝js
gulp.task('copy:js', function (done) {
    gulp.src('src/view/**/*.js')
    //.pipe(uglify())
    .pipe(flatten())
    .pipe(gulp.dest('dist/js'))
    .on('end', done);
});

//编译SCSS && 添加CSS前缀
gulp.task('scss:tocss', function() {
    return(
        gulp
        .src(srcPath.scss)
        .pipe(sass().on("error", sass.logError))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 2 versions', 'Android >= 4.0'],
                cascade: true, //是否美化属性值 默认：true 像这样：
                remove: true //是否去掉不必要的前缀 默认：true
            })
        )
        .pipe(cssBase64())
        .pipe(cleanCSS())
        .pipe(gulp.dest(buildPath.css))
    );
});

/**
 * 监听文件变化
 */
gulp.task('watch', function(done) {
    gulp.watch(srcPath.scss, ['scss:tocss', 'reload']).on(
        'change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            done
        }
    );
    gulp.watch('src/view/**/*.html', ['copy:html', 'reload']).on('监听--HTML', done);
    gulp.watch('src/lib/**/*', ['copy:lib', 'reload']).on('监听--lib变化了',done);
    gulp.watch('src/view/**/*.js', ['copy:js', 'reload']).on('监听--JS变化了',done);
    gulp.watch('src/assets/**/*', ['copy:assets', 'reload']).on('监听--图片变化了',done);
    gulp.watch('src/icontfont/**/*', ['copy:icontfont', 'reload']).on('监听--字体图标变化了',done);
});

//编译刷新浏览器
gulp.task('reload111111111', function() {
    return(
        gulp
        .src('dist')
        .pipe(reload({ stream: true }))
    );
});

gulp.task("reload", function(){
	gulp.src("./dist/**/*")
		.pipe(connect.reload());
})

gulp.task('default',
    [
        'copy:lib',
        'copy:icontfont',
        'copy:assets',
        'copy:css',
        'copy:html',
        'copy:js',
        'scss:tocss'
    ]
);

gulp.task('dev',
    [
        'server',
        'watch',
        'copy:lib',
        'copy:icontfont',
        'copy:assets',
        'copy:css',
        'copy:html',
        'copy:js',
        'scss:tocss',
        'open'
    ]
);
