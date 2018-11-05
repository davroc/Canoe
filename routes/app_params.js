const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const paramController = require('../controllers/paramsController');

const router = express.Router();


//FAMILLES ET SOUS FAMILLES

// param list
router.get('/fam', paramController.getFamilles);


//TICKETS

// liste de tickets 
router.get('/clis', paramController.getCliList);

// edition de ticket
router.get('/cli_edit', paramController.editCli);

//ajout de ticket
// param list
router.get('/cli_add',paramController.addCli);


exports.routes = router;
