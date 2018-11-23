const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const analyseCOntroller = require('../controllers/AnalyseController');
const router = express.Router();

router.get('/liste_clis', analyseCOntroller.getCliList);
router.get('/alarmes', analyseCOntroller.getAlarmes);
router.get('/evo_ano', analyseCOntroller.getEvoAno);
router.get('/cni', analyseCOntroller.getInfoAno);
router.post('/cni', analyseCOntroller.getErrCodeDetail);



module.exports = router;