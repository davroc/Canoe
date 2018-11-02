const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

// param list
router.get('/params', (req, res, next) => {

  res.render('params', { pageTitle: 'Parametres Applicatifs', path: '/admin/params' });
});

// user list
router.get('/userslist', (req, res, next) => {
  res.render('userslist', { pageTitle: 'Utilisateurs', path: '/admin/userslist' });
});

// user add
// getting the form
router.get('/adduser', (req, res, next) => {
  res.render('adduser', { pageTitle: 'Ajouter un utilisateur', path: '/admin/adduser' });
});

// submiting new user
router.post('/adduser', (req, res, next) => {
  //products.push({ title: req.body.title });
  res.redirect('/');
});

exports.routes = router;
exports.products = products;
