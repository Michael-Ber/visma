"use strict";

import gulp from 'gulp';
import webpack from 'webpack-stream';
import browsersync from 'browser-sync';
import gulpSass from 'gulp-sass';
import nodeSass from 'node-sass';
import autoprefixer from 'autoprefixer';
import cleanCSS from 'gulp-clean-css';
import postcss from 'gulp-postcss';
import imagemin, { svgo } from 'gulp-imagemin';
import htmlmin from 'gulp-htmlmin';
import plumber from 'gulp-plumber';
import webpConv from 'gulp-webp';
import multiDest from 'gulp-multi-dest';
import changed from 'gulp-changed';


const sass = gulpSass(nodeSass);

// const dist = "../../../js/OpenServer/domains/portfolio";
const dist = "./dist";

gulp.task("copy-html", () => {
  return gulp.src("./src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(dist))
    .pipe(browsersync.stream());
});

gulp.task("build-sass", () => {
  return gulp.src("./src/assets/sass/style.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dist))
    .pipe(browsersync.stream());
});

gulp.task("build-js", () => {
  return gulp.src("./src/assets/js/main.js")
    .pipe(webpack({
      mode: 'development',
      output: {
        filename: 'script.js'
      },
      watch: false,
      devtool: "source-map",
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', {
                  debug: true,
                  corejs: 3,
                  useBuiltIns: "usage"
                }]]
              }
            }
          },
          {
            test: /\.(sass|less|css)$/,
            use: ["style-loader", "css-loader", 'sass-loader'],
          }
        ]
      }
    }))
    .pipe(gulp.dest(dist))
    .on("end", browsersync.reload);
});

gulp.task('imagemin', function () {
  return gulp.src('./src/assets/img/**/*.*')
    .pipe(imagemin())
    // .pipe(gulp.dest('../../../js/OpenServer/domains/portfolio/assets/img'));
    .pipe(gulp.dest('./dist/assets/img'));
});

gulp.task('iconsmin', function () {
  return gulp.src('./src/assets/icons/**/*.*')
    .pipe(imagemin())
    // .pipe(gulp.dest('../../../js/OpenServer/domains/portfolio/assets/icons'));
    .pipe(gulp.dest('./dist/assets/icons'));
});

gulp.task('webp', function () {
  return gulp.src('./src/assets/img/**/*.*')
    .pipe(plumber())
    .pipe(changed('dist/assets/img/webp', {
      extension: '.webp'
    }))
    .pipe(webpConv())
    .pipe(multiDest(['src/assets/img/webp', 'dist/assets/img/webp']))
})

gulp.task("watch", () => {
  browsersync.init({
    server: "./dist/",
    port: 4000,
    notify: true
  });

  gulp.watch("./src/*.html", gulp.parallel("copy-html"));
  gulp.watch("./src/assets/js/**/*.js", gulp.parallel("build-js"));
  gulp.watch("./src/assets/sass/**/*.scss", gulp.parallel("build-sass"));
  gulp.watch("./src/assets/img/**/*.*", gulp.parallel("imagemin"));
  gulp.watch("./src/assets/icons/**/*.*", gulp.parallel("iconsmin"));
});

gulp.task("build", gulp.parallel("copy-html", "build-js", "build-sass"));

gulp.task("prod", () => {
  gulp.src("./src/assets/sass/style.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(gulp.dest(dist))

  return gulp.src("./src/assets/js/main.js")
    .pipe(webpack({
      mode: 'production',
      output: {
        filename: 'script.js'
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: [['@babel/preset-env', {
                    corejs: 3,
                    useBuiltIns: "usage"
                  }]]
                }
              }
            ]
          },
          {
            test: /\.(sass|less|css)$/,
            use: ['style-loader', 'css-loader', 'less-loader']
          }
        ],

      }
    }))
    .pipe(gulp.dest(dist));
});

gulp.task("default", gulp.parallel("watch", "build"));