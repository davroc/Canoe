const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const paramController = require('../controllers/paramsController');

const router = express.Router();


//codes et typologies

// codes list
router.get('/errorcodes', paramController.getErrorCodes);

//typologies
router.get('/typos', paramController.getTypos);


//TICKETS

// liste de tickets 
router.get('/clis', paramController.getCliList);

// edition de ticket
router.get('/cli_edit/:cli', paramController.editCli);

//ajout de ticket
// param list
router.get('/cli_add',paramController.addCli);


// app params
router.get('/parametres',paramController.getParams)


//exports.routes = router;
module.exports = router;
