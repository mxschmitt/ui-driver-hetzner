/* jshint node: true */
const gulp = require('gulp');
const clean = require('gulp-clean');
const gulpConcat = require('gulp-concat');
const gulpConnect = require('gulp-connect');
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const argv = require('yargs').argv;
const pkg = require('./package.json');
const fs = require('fs');
const replaceString = require('replace-string');


const NAME_TOKEN = '%%DRIVERNAME%%';

const BASE = 'component/';
const DIST = 'dist/';
const TMP = 'tmp/';
const ASSETS = 'assets/';
const DRIVER_NAME = argv.name || pkg.name.replace(/^ui-driver-/, '');

console.log('Driver Name:', DRIVER_NAME);

if (!DRIVER_NAME) {
  console.log('Please include a driver name with the --name flag');
  process.exit(1);
}

gulp.task('default', ['build']);

gulp.task('watch', function () {
  gulp.watch(['./component/*.js', './component/*.hbs', './component/*.css'], ['build']);
});

gulp.task('clean', function () {
  return gulp.src([`${DIST}*.js`, `${DIST}*.css`, `${DIST}*.hbs`, `${TMP}*.js`, `${TMP}*.css`, `${TMP}*.hbs`,], { read: false })
    .pipe(clean());
});

gulp.task('assets', ['styles'], function () {
  return gulp.src(ASSETS + '*')
    .pipe(gulp.dest(DIST));
});

gulp.task('build', ['compile']);

gulp.task('babel', ['assets'], function () {

  const opts = {
    "presets": [
      [
        "@babel/preset-env",
        {
          "useBuiltIns": "entry"
        }
      ]
    ],
    "plugins": [
      "add-module-exports",
      [
        "transform-es2015-modules-amd", {
          "noInterop": true,
        }]
    ],
    "moduleId": `nodes/components/driver-${DRIVER_NAME}/component`,
    "comments": false
  };

  let hbs = fs.readFileSync(`${BASE}template.hbs`, 'utf8');

  hbs = replaceString(hbs, NAME_TOKEN, DRIVER_NAME);

  hbs = Buffer.from(hbs).toString('base64');

  return gulp.src([
    `${BASE}component.js`
  ])
    .pipe(replace('const LAYOUT;', `const LAYOUT = "${hbs}";`))
    .pipe(replace(NAME_TOKEN, DRIVER_NAME))
    .pipe(babel(opts))
    .pipe(gulpConcat(`component.js`, { newLine: ';\n' }))
    .pipe(gulp.dest(TMP));
});

gulp.task('rexport', ['babel'], function () {
  const rexpOpts = {
    "presets": [
      ["env", {
        "targets": {
          "browsers": ["> 1%"]
        }
      }]
    ],
    "plugins": ["add-module-exports",
      ["transform-es2015-modules-amd", { "noInterop": true, }]
    ],
    "moduleId": `ui/components/driver-${DRIVER_NAME}/component`
  }

  return gulp.src([
    `${BASE}rexport.js`
  ])
    .pipe(replace(NAME_TOKEN, DRIVER_NAME))
    .pipe(babel(rexpOpts))
    .pipe(gulpConcat(`rexport.js`, { newLine: ';\n' }))
    .pipe(gulp.dest(TMP));
});

gulp.task('compile', ['rexport'], function () {
  return gulp.src([
    `${TMP}**.js`
  ])
    .pipe(gulpConcat(`component.js`, { newLine: ';\n' }))
    .pipe(gulp.dest(DIST));
});


gulp.task('styles', ['clean'], function () {
  return gulp.src([
    BASE + '**.css'
  ])
    .pipe(replace(NAME_TOKEN, DRIVER_NAME))
    .pipe(gulpConcat(`component.css`, { newLine: ';\n' }))
    .pipe(gulp.dest(DIST));
});

gulp.task('server', ['build', 'watch'], function () {
  return gulpConnect.server({
    root: [DIST],
    port: process.env.PORT || 3000,
    https: false,
  });
});

gulp.task('watch', function () {
  gulp.watch(['./component/*.js', './component/*.hbs', './component/*.css'], ['build']);
});