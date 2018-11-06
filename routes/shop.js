const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/analyse', (req, res, next) => {
  const products = adminData.products;
  res.render('analyse', {prods: codes, pageTitle: 'Analyse', path: '/'});
});

module.exports = router;
