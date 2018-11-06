const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/main', (req, res, next) => {
  const products = adminData.products;
  res.render('analyse', {prods: codes, pageTitle: 'Analyse', path: 'analyse/main'});
});

router.get('/cni', (req, res, next) => {
  const products = adminData.products;
  res.render('analyse/code_identity', { pageTitle: 'CNI', path: 'analyse/CNI'});
});

router.get('/', (req, res, next) => {
  const products = adminData.products;
  res.render('shop', {prods: codes, pageTitle: 'Main', path: '/'});
});


module.exports = router;