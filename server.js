'use strict';

const express = require('express');
const morgan = require('morgan');

const { users } = require('./data/users');

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
  res.status(200).render('pages/homepage', { users, currentUser });
}

const handleUserPage = (req, res) => {
  let page = {};
  users.forEach(user => {
    if (user._id === req.params.id) {page = user;};
  });
  res.status(200).render('pages/profile', { user: page, users, currentUser });
}

const handleSignin = (req, res) => {
  if (currentUser.name) {
    res.status(200).render('pages/profile', { user: currentUser, users, currentUser });
  } else {
    res.status(200).render('pages/signin', { currentUser });
  }
}

const handleName = (req, res) => {
  let firstName = req.body.firstName.toLowerCase();
  let redirect = false;
  users.forEach(user => {
    if (user.name.toLowerCase() === firstName) {
      currentUser = user;
      res.status(200).render('pages/profile', { user, users, currentUser });
      redirect = true;
    }
  })
  if (!redirect) res.status(404).redirect('/signin')
}

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(express.urlencoded({ extended: false }))
  .set('view engine', 'ejs')

  // endpoints
  .get('/', handleHomepage)
  .get('/users/:id', handleUserPage)
  .get('/signin', handleSignin)
  .post('/getname', handleName)
  // a catchall endpoint that will send the 404 message.
  .get('*', handleFourOhFour)

  .listen(8000, () => console.log('Listening on port 8000'));
