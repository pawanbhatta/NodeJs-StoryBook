const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const connectDB = require('./config/db');

// Import Routes
const indexRoute = require('./routes/index');
const authRoutes = require('./routes/auth');
const storyRoutes = require('./routes/stories');

// Load config
dotenv.config({
    path: './config/config.env'
});

// Passport config
require('./config/passport')(passport);

connectDB();

const app = express();

// To disable caching, basically to speed up loading page
app.disable('etag');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

// Method Override Middleware
app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}

// Handlebar Helpers
const {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
} = require('./helpers/hbs');

// Handlebars Setup
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Sessions
app.use(session({
    secret: 'pawanbhai',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));

// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

// Set global Var
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

// Routes
app.use('/', indexRoute);
app.use('/auth', authRoutes);
app.use('/stories', storyRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running in ${process.env.NODE_ENV} mode on port ${port}`));