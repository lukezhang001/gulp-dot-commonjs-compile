# gulp-dot-commonjs-compile
Gulp plugin for precompilation of doT templates.
# Example
If we have following folder structure:    
src/list.html:
```js
  <script type="text/template" id="mainTpl"> 
  ...
  </script>
  <script type="text/template" id="detailTpl"> 
  ...
  </script>
```  
Then, running this code:
```js
gulp.task('templates', function() {
    gulp.src('src/*.html')
    .pipe(dotCompile())
    .pipe(rename(function (path) {
      path.extname = ".js"
     }))
    .pipe(gulp.dest('dest'));
});
```
Will produce dest/list.js:
```js
define("list",function(require,exports,module){
exports.mainTpl =function ...
exports.detailTpl =function ...
...
}
```
