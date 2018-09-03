const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const winston = require('winston');

const app = express();

app.set('port', 3000);

// providing static files
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static('public2'));
app.use(express.static(path.join(__dirname, 'resources')));
// app.use(express.static(path.join(__dirname, 'resources')));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongodb = mongoose.connection;

const server = app.listen(app.get('port'), () => {
  const port = server.address().port;
  winston.log('log', 'Example app listening on port 3000!');
});

// Mongo-DB setup
mongoose.connect('mongodb://db:27017/users');

mongodb.on('error', console.error.bind(console, 'connection error:'));
mongodb.once('open', () => {
  winston.log('log', 'connection to mongodb established');
});

// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');

passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

const authCheckMiddleware = require('./middleware/auth-check');

app.use('/api/auth/mw', authCheckMiddleware);

// ROUTING
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const eventRoutes = require('./routes/event');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/event', eventRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});
