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

import { readFileSync } from 'fs';
import path from 'path';

import notify from 'gulp-notify';
import fileinclude from 'gulp-file-include';
import svgSprite from 'gulp-svg-sprite';
import svgmin from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';
import { deleteAsync } from 'del';
import gulpif from 'gulp-if';

import rev from 'gulp-rev';
import revRewrite from 'gulp-rev-rewrite';
import revdel from 'gulp-rev-delete-original';


const sass = gulpSass(nodeSass);
const rootFolder = path.basename(path.resolve());

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
    .pipe(gulp.dest(`${dist}/css`, { sourcemaps: '.' }))
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
    .pipe(gulp.dest(`${dist}/css`))
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
    .pipe(gulp.dest(`${dist}/js`))
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
    .pipe(gulp.dest(`${dist}/js`))
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

gulp.task("cacheFiles", () => {
  return gulp.src(`./dist/**/**/*.{css,js,woff2,svg,png,jpg,jpeg,webp}`, {
    base: dist
  }) // maybe need fix tabs
    .pipe(rev())
    .pipe(revdel())
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest('rev.json'))
    .pipe(gulp.dest('./dist'))
})

gulp.task("revrite", () => {
  const manifest = readFileSync('dist/rev.json');
  gulp.src(`${dist}/css/*.css`)
    .pipe(revRewrite({
      manifest
    }))
    .pipe(gulp.dest(`${dist}/css`));
  return gulp.src(`${dist}/**/*.html`)
    .pipe(revRewrite({
      manifest
    }))
    .pipe(gulp.dest(dist));
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

gulp.task("cache", gulp.series("cacheFiles", "revrite"))

gulp.task("backend", gulp.series(toProd, "clean", "html-include", "scriptsBackend", "stylesBackend", "images", "webp", "svgSprites"));