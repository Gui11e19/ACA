var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product.js');
var authRouter =  require('./routes/auth.js');


const setUserInfo= require('./middleware/setUserInfo.js')
const isLoggedIn = require('./middleware/isLogged.js')
const passport= require('./config/passport.js');
const mongoose =  require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var app = express();

//connect to database
const URI = "mongodb+srv://Victor:Victor@cluster0.o6cti.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//const URI = process.env.URI;

mongoose.connect(URI,{ 
    useNewUrlParser: true,
    useCreateIndex: true
})
.then(db=>{
console.log('Connection success!!');
}

	)
.catch(err=>console.error(err));

//
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret:"anime",
    resave: true, // para alamcenar el objeto session
    saveUninitialized: true, // inicializar si el objeto esta vacio
    //para almacenar la sesion en la base de datos
    store: new MongoStore({        
		mongooseConnection: mongoose.connection,
		autoReconnect: true
    })
    }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
//app.use(express.static(path.join(__dirname, './node_modules/bootstrap'))); 
app.use(passport.initialize());
app.use(passport.session());

//custom middleware
app.use(setUserInfo);


console.log(process.env.NODE_ENV);

if(true){

	console.log("HOLIWS");
	var testRouter  =  require('./routes/test.js');
    app.use('/test',isLoggedIn, testRouter);

}

app.use('/auth', authRouter);
app.use('/', indexRouter);
app.use('/users',isLoggedIn, usersRouter);
app.use('/product',isLoggedIn, productRouter);

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
