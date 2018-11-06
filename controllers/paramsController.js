const ParamModel= require('../models/M_Params');


exports.getCliList =  (req, res, next) => {
  ParamModel.getCliList(liste_cli =>{
    //console.log(liste_cli);
   res.render('params/clis', { pageTitle: 'Liste de Clis', path: '/params/clis' ,Clis: liste_cli });
 });
};


exports.editCli = (req, res, next) => {
  const id_cli=req.params.cli;
  //console.log(id_cli);
  ParamModel.getCliDetail(id_cli,cli_data =>{
    console.log(cli_data);
    res.render('params/edit_cli', { pageTitle: 'Edition de ticket', path: '/params/edit_cli' ,cli_data:cli_data});
  })
  
};

exports.addCli =  (req, res, next) => {

  res.render('params/add_cli', { pageTitle: 'Ajout de ticket', path: '/params/add_cli' });
}

// familles et sous familles

exports.getFamilles = (req, res, next) => {
  res.render('params/families_main', { pageTitle: 'Familles de Codes', path: '/params/families_main' });
}