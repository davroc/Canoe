const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const paramController = require('../controllers/paramsController');
const AuthMiddleware = require ('../middleware/isAuth');
const router = express.Router();


//codes et typologies

// codes list
router.get('/errorcodes',AuthMiddleware.isParam, paramController.getErrorCodes);
router.get('/code_edit/:code',AuthMiddleware.isParam, paramController.editCode);
router.post('/code_edit',AuthMiddleware.isParam,paramController.postEditCode);
router.post('/code_add',AuthMiddleware.isParam,paramController.addCode);

//typologies
router.get('/typos',AuthMiddleware.isParam, paramController.getTypos);
router.get('/typo_edit/:typo',AuthMiddleware.isParam,paramController.editTypo);
router.post('/typo_edit',AuthMiddleware.isParam,paramController.postEditTypo);
router.post('/typo_add',AuthMiddleware.isParam,paramController.addTypo);


//TICKETS

// liste de tickets 
router.get('/clis',AuthMiddleware.isParam, paramController.getCliList);
// edition de ticket
router.get('/cli_edit/:cli',AuthMiddleware.isParam, paramController.editCli);
router.post('/cli_edit',AuthMiddleware.isParam, paramController.postEditCli);
router.post('/cli_add',AuthMiddleware.isParam,paramController.addCli);

//ajout de ticket
// param list
router.get('/cli_add',paramController.addCli);


// app params
router.get('/parametres',paramController.getParams)
router.post('/param_edit',paramController.updateParam)


//exports.routes = router;
module.exports = router;
