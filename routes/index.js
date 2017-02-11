
var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET /
router.get('/', (req, res, next) => {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', (req, res, next) => {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', (req, res, next) => {
  return res.render('contact', { title: 'Contact' });
});

//GET /profile
router.get('/profile', (req, res, next) => {
  
});

//GET /login
router.get('/login', (req, res, next) => {
  return res.render('login', { title: 'Login' });
});

//POST /login
router.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (err, user) => {
      if (err || !user) {
        let error = new Error('Wrong email or password.');
        error.status = 401;
        return next(error)
      }
      req.session.id = user._id;
      return res.redirect("/profile");
    });
  } else {
    let error = new Error('Email and password are required!');
    error.status = 401;
    return next(error);
  }
});

//GET /register
router.get('/register', (req, res, next) => {
  return res.render('register', {title: 'Sign Up'});
});

//POST /register
router.post('/register', (req, res, next) => {
  const allFieldsGiven = 
    (req.body.email &&
    req.body.name &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword);
  if (allFieldsGiven) {
      //check for password match
      if (req.body.password !== req.body.confirmPassword) {
        const err = new Error('Passwords do not match!');
        err.status = 400;
        return next(err);
      }
      //post it!
      let userData = {
        name: req.body.name,
        email: req.body.email,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password
      };

      User.create(userData, (error, user) => {
        if(error) {
          return next(error)
        } else {
          req.session.id = user._id;
          return res.redirect('/profile')
        }
      });
      
  } else {
    const err = new Error('All fields required!');
    err.status = 400;
    return next(err);
  }
});

module.exports = router;
