const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const analyseCOntroller = require('../controllers/AnalyseController');
const AuthMiddleware = require ('../middleware/isAuth');
const router = express.Router();

router.get('/liste_clis',AuthMiddleware.isLoggedIn, analyseCOntroller.getCliList);
router.get('/alarmes',AuthMiddleware.isLoggedIn, analyseCOntroller.getAlarmes);
router.get('/evo_ano',AuthMiddleware.isLoggedIn, analyseCOntroller.getEvoAno);
router.get('/cni/:code',AuthMiddleware.isLoggedIn,analyseCOntroller.getErrCodeDetail);
router.get('/cni',AuthMiddleware.isLoggedIn, analyseCOntroller.getInfoAno);



module.exports = router;