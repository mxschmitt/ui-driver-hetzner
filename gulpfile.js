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

gulp.task('watch', function () {
  gulp.watch(['./component/*.js', './component/*.hbs', './component/*.css'], gulp.parallel('build'));
});

gulp.task('clean', function () {
  return gulp.src([`${DIST}*.js`, `${DIST}*.css`, `${DIST}*.hbs`, `${TMP}*.js`, `${TMP}*.css`, `${TMP}*.hbs`,], { read: false })
    .pipe(clean());
});

gulp.task('styles', gulp.series('clean', function () {
  return gulp.src([
    BASE + '**.css'
  ])
    .pipe(replace(NAME_TOKEN, DRIVER_NAME))
    .pipe(gulpConcat(`component.css`, { newLine: ';\n' }))
    .pipe(gulp.dest(DIST));
}))

gulp.task('assets', gulp.series('styles', function () {
  return gulp.src(ASSETS + '*')
    .pipe(gulp.dest(DIST));
}));

gulp.task('hetznerbabel', function () {
  const babelOpts = {
    presets: [
      [
        "@babel/preset-env", {
          targets: {
            browsers: ["> 1%"]
          }
        }]
    ],
    plugins: [
      "add-module-exports",
      [
        "transform-es2015-modules-amd", {
          "noInterop": true,
        }
      ]
    ],
    comments: false,
    moduleId: `nodes/components/driver-${DRIVER_NAME}/hetzner`
  }


  return gulp.src([
    `${BASE}hetzner.js`,
  ])
    .pipe(replace(NAME_TOKEN, DRIVER_NAME))
    .pipe(babel(babelOpts))
    .pipe(gulpConcat(`hetzner.js`, { newLine: ';\n' }))
    .pipe(gulp.dest(TMP));
});

gulp.task('babel', gulp.series('assets', function () {
  const babelOpts = {
    presets: [
      [
        "@babel/preset-env", {
          targets: {
            browsers: ["> 1%"]
          }
        }]
    ],
    plugins: [
      "add-module-exports",
      [
        "transform-es2015-modules-amd", {
          "noInterop": true,
        }
      ]
    ],
    comments: false,
    moduleId: `nodes/components/driver-${DRIVER_NAME}/component`
  }

  let hbs = fs.readFileSync(`${BASE}template.hbs`, 'utf8');

  hbs = replaceString(hbs, NAME_TOKEN, DRIVER_NAME);

  hbs = Buffer.from(hbs).toString('base64');

  return gulp.src([
    `${BASE}component.js`,
  ])
    .pipe(replace('const LAYOUT;', `const LAYOUT = "${hbs}";`))
    .pipe(replace(NAME_TOKEN, DRIVER_NAME))
    .pipe(babel(babelOpts))
    .pipe(gulpConcat(`component.js`, { newLine: ';\n' }))
    .pipe(gulp.dest(TMP));
}));

gulp.task('rexport', gulp.series('babel', function () {
  const babelOpts = {
    presets: [
      [
        "@babel/preset-env", {
          targets: {
            browsers: ["> 1%"]
          }
        }]
    ],
    plugins: [
      "add-module-exports",
      [
        "transform-es2015-modules-amd", {
          "noInterop": true,
        }
      ]
    ],
    comments: false,
    moduleId: `ui/components/driver-${DRIVER_NAME}/component`
  }
  return gulp.src([
    `${BASE}rexport.js`
  ])
    .pipe(replace(NAME_TOKEN, DRIVER_NAME))
    .pipe(babel(babelOpts))
    .pipe(gulpConcat(`rexport.js`, { newLine: ';\n' }))
    .pipe(gulp.dest(TMP));
}));

gulp.task('hetznerexport', gulp.series('hetznerbabel', function () {
  const babelOpts = {
    presets: [
      [
        "@babel/preset-env", {
          targets: {
            browsers: ["> 1%"]
          }
        }]
    ],
    plugins: [
      "add-module-exports",
      [
        "transform-es2015-modules-amd", {
          "noInterop": true,
        }
      ]
    ],
    comments: false,
    moduleId: `ui/components/driver-${DRIVER_NAME}/hetzner`
  }
  return gulp.src([
    `${BASE}hetznerexport.js`
  ])
    .pipe(replace(NAME_TOKEN, DRIVER_NAME))
    .pipe(babel(babelOpts))
    .pipe(gulpConcat(`hetznerexport.js`, { newLine: ';\n' }))
    .pipe(gulp.dest(TMP));
}));

gulp.task('compile', gulp.series(['rexport', 'hetznerexport'], function () {
  return gulp.src([
    `${TMP}**.js`
  ])
    .pipe(gulpConcat(`component.js`, { newLine: ';\n' }))
    .pipe(gulp.dest(DIST));
}));

gulp.task('build', gulp.series('compile'));

gulp.task('server', gulp.parallel(['build', 'watch'], function () {
  return gulpConnect.server({
    root: [DIST],
    port: process.env.PORT || 3000,
    https: false,
  });
}));

gulp.task('default', gulp.series('build'));

gulp.task('watch', function () {
  gulp.watch(['./component/*.js', './component/*.hbs', './component/*.css'], gulp.parallel('build'));
});
