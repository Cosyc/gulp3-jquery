# Gulp3-Jq 
前端传统开发的一个垃圾框架，比没有好一丢丢

``` 
npm install 
npm run dev 本地运行
npm run build 打包

``` 

## dist 目录
```
|---assets: 图片资源  
|---js： 打包后的js  
|---css: 打包后的css  
|---lib: 复制的src/lib  
|---*.html: 打包view中所有的的html文件 

``` 

## src 目录
```
|--- _temp: html模板  
|--- assets: 图片资源  
|--- config: 本地服务的配置文件
|--- css: css 文件
|--- iconfot: 字体图标文件
|--- lib：插件库
|--- scss: scss样式文件，其中：base.scss 为公共的，其余的一个页面一个.scss文件,并且scss文件最好与html同名。最终会打包到dist/css
|--- view: 一个页面一个文件夹,其中的js会被打包到 dist/js
|--- 
```
### 注意
* src中html引入js和css需要按照dist的文件结构，如何希望js或css内联（内容直接写在html中 只需在标签加上属性 inline）
* [gulp-file-include 语法](https://github.com/haoxins/gulp-file-include "gulp-file-include 语法")

