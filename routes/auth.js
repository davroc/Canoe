const path = require('path');
const { check } = require ('express-validator/check');
const express = require('express');

const rootDir = require('../util/path');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

router.get('/login', AuthController.getLogin);
router.post('/login', AuthController.postLogin);
router.post('/logout', AuthController.postLogout);

router.get('/createAccount', AuthController.createAccountForm);
router.post('/createAccount', check ('mail_user').isEmail(), AuthController.createAccount);
router.get('/changepwd',AuthController.changePwdForm);


module.exports = router;



