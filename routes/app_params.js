const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const paramController = require('../controllers/paramsController');

const router = express.Router();


//codes et typologies

// codes list
router.get('/errorcodes', paramController.getErrorCodes);
router.get('/code_edit/:code', paramController.editCode);
router.post('/code_edit',paramController.postEditCode);

//typologies
router.get('/typos', paramController.getTypos);
router.get('/typo_edit/:typo',paramController.editTypo);
router.post('/typo_edit',paramController.postEditTypo);


//TICKETS

// liste de tickets 
router.get('/clis', paramController.getCliList);
// edition de ticket
router.get('/cli_edit/:cli', paramController.editCli);
router.post('/cli_edit', paramController.postEditCli);

//ajout de ticket
// param list
router.get('/cli_add',paramController.addCli);


// app params
router.get('/parametres',paramController.getParams)


//exports.routes = router;
module.exports = router;
