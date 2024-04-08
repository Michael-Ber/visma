"use strict";

import gulp from 'gulp';
import webpack from 'webpack-stream';
import browsersync from 'browser-sync';
import gulpSass from 'gulp-sass';
import nodeSass from 'node-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';
import htmlmin from 'gulp-htmlmin';
import plumber from 'gulp-plumber';
import webp from 'gulp-webp';
import multiDest from 'gulp-multi-dest';
import changed from 'gulp-changed';

import rename from 'gulp-rename';
import notify from 'gulp-notify';
import sourcemaps from 'gulp-sourcemaps';
import fileinclude from 'gulp-file-include';
import svgSprite from 'gulp-svg-sprite';
import svgmin from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';
import uglify from 'gulp-uglify-es';
import { deleteAsync } from 'del';
import gulpif from 'gulp-if';

const sass = gulpSass(nodeSass);

// const dist = "../../../js/OpenServer/domains/portfolio";
const dist = "./dist";
let isProd = false;

gulp.task("clean", () => {
  return deleteAsync('./dist')
})

gulp.task("html-minify", () => {
  return gulp.src("./dist/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(dist))
    .pipe(browsersync.stream());
});

gulp.task("html-include", () => {
  return gulp.src(['./src/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(dist))
    .pipe(browsersync.stream())
})

gulp.task("styles", () => {
  return gulp.src("./src/assets/sass/style.scss", { sourcemaps: !isProd })
    .pipe(plumber(
      notify.onError({
        title: "SCSS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false,
      grid: true
    }))
    .pipe(gulpif(isProd, cleanCSS({
      level: 2
    })))
    .pipe(gulp.dest(dist, { sourcemaps: '.' }))
    .pipe(browsersync.stream());
});
gulp.task("stylesBackend", () => {
  return gulp.src("./src/assets/sass/style.scss", { sourcemaps: !isProd })
    .pipe(plumber(
      notify.onError({
        title: "SCSS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false,
      grid: true
    }))
    .pipe(gulp.dest(dist, { sourcemaps: '.' }))
    .pipe(browsersync.stream());
});


gulp.task("scripts", () => {
  return gulp.src("./src/assets/js/main.js")
    .pipe(plumber(
      notify.onError({
        title: "JS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(webpack({
      mode: isProd ? 'production' : 'development',
      output: {
        filename: 'script.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
      devtool: !isProd ? 'source-map' : false
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(gulp.dest(dist))
    .pipe(browsersync.stream());
})

gulp.task("scriptsBackend", () => {
  return gulp.src("./src/assets/js/main.js")
    .pipe(plumber(
      notify.onError({
        title: "JS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(webpack({
      mode: 'development',
      output: {
        filename: 'script.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
      devtool: false
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(gulp.dest(dist))
    .pipe(browsersync.stream());
})


gulp.task('images', function () {
  return gulp.src(['./src/assets/img/**/**.{jpg,jpeg,png,svg}'])
    .pipe(gulpif(isProd, imagemin([
      mozjpeg({
        quality: 80,
        progressive: true
      }),
      optipng({
        optimizationLevel: 2
      }),
    ])))
    // .pipe(gulp.dest('../../../js/OpenServer/domains/portfolio/assets/img'));
    .pipe(gulp.dest('./dist/assets/img'));
});

gulp.task('webp', function () {
  return gulp.src(['./src/assets/img/**/**.{jpg,jpeg,png}'])
    .pipe(webp())
    .pipe(multiDest(['src/assets/img/webp', 'dist/assets/img/webp']))
})

gulp.task('svgSprites', function () {
  return gulp.src('./src/assets/svg/*.svg')
      .pipe(
        svgmin({
          js2svg: {
            pretty: true,
          },
        })
      )
      .pipe(
        cheerio({
          run: function ($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
          },
          parserOptions: {
            xmlMode: true
          },
        })
      )
      .pipe(replace('&gt;', '>'))
      .pipe(svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg"
          }
        },
      }))
    .pipe(gulp.dest('./dist/assets/svg'))
})

const toProd = (done) => {
  isProd = true;
  done();
};

gulp.task("watch", () => {
  browsersync.init({
    server: "./dist/",
    port: 4000,
    notify: true
  });

  gulp.watch("./src/assets/sass/**/*.scss", gulp.parallel("styles"));
  gulp.watch("./src/assets/js/**/*.js", gulp.parallel("scripts"));
  gulp.watch("./src/partials/**/*.html", gulp.parallel("html-include"));
  gulp.watch("./src/*.html", gulp.parallel("html-include"));
  gulp.watch("./src/assets/svg/**/*.*", gulp.parallel("svgSprites"));
  gulp.watch("./src/assets/img/**/**.{jpg,jpeg,png,svg}", gulp.parallel("images"));
  gulp.watch("./src/assets/img/**/**.{jpg,jpeg,png}", gulp.parallel("webp"));
});


gulp.task("default", gulp.series("clean", "html-include", "scripts", "styles", "images", "webp", "svgSprites", "watch"));

gulp.task("build", gulp.series(toProd, "clean", "html-include", "scripts", "styles", "images", "webp", "svgSprites", "html-minify"));

gulp.task("backend", gulp.series("clean", "html-include", "scriptsBackend", "stylesBackend", "images", "webp", "svgSprites"));