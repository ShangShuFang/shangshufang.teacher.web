let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let loginRouter = require('./routes/login');
let registerRouter = require('./routes/register');
let forgetPasswordRouter = require('./routes/forgetPassword');
let technologyRouter = require('./routes/technology');
let courseRouter = require('./routes/course');
let courseDetailRouter = require('./routes/courseDetail');
let myCourseRouter = require('./routes/myCourse');
let userRouter = require('./routes/user');
let changePasswordRouter = require('./routes/changePassword');
let suggestRouter = require('./routes/suggest');
let abilityAnalysisRouter = require('./routes/abilityAnalysis');

let abilityPortraitRouter = require('./routes/abilityPortrait');
let growUpTrackRouter = require('./routes/growUpTrack');

let abilityDetailRouter = require('./routes/abilityDetail');
let commonRouter = require('./routes/common');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/forgetPassword', forgetPasswordRouter);
app.use('/technology', technologyRouter);
app.use('/course', courseRouter);
app.use('/course/detail', courseDetailRouter);
app.use('/myCourse', myCourseRouter);
app.use('/user', userRouter);
app.use('/changePassword', changePasswordRouter);
app.use('/suggest', suggestRouter);
app.use('/ability/analysis', abilityAnalysisRouter);
app.use('/ability/portrait', abilityPortraitRouter);
app.use('/growUp/track', growUpTrackRouter);
app.use('/ability/detail', abilityDetailRouter);
app.use('/common', commonRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
