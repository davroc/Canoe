const ParamModel= require('../models/M_Params');

//errorcodes *********************************************************************************************************
exports.getErrorCodes =(req,res,next)=>{
  ParamModel.getCodesList(liste_errorcodes =>{
    res.render('params/errorcodes',{errorCodes : liste_errorcodes})
  })
}

//typologies

exports.getTypos =(req,res,next)=>{
  ParamModel.getTypoList(liste_typos =>{
    ParamModel.getCodesList(liste_errorcodes =>{
      res.render('params/typos',{typos : liste_typos, errorCodes : liste_errorcodes})
    })
  })
}


// app params
exports.getParams =(req,res,next)=>{
  ParamModel.getParamsList(liste_params =>{
    res.render('params/parameters',{pageTitle: 'Liste de Parametres',params : liste_params})
  })
}

//tickets ************************************************************************************************************

exports.getCliList =  (req, res, next) => {
  ParamModel.getCliList(liste_cli =>{
   res.render('params/clis', { pageTitle: 'Liste de Clis', path: '/params/clis' ,Clis: liste_cli });
 });
};

exports.editCli = (req, res, next) => {

  const id_cli=req.params.cli;
  //console.log(id_cli);
  ParamModel.getCliDetail(id_cli,cli_data =>{
      ParamModel.getCliStatusList(liste_status=>{
        console.log(cli_data);
        res.render('params/edit_cli', { pageTitle: 'Edition de ticket', path: '/params/edit_cli' ,cli_data:cli_data,cli_status:liste_status}); 
      })
    
  })  
};

exports.addCli =  (req, res, next) => {

  res.render('params/add_cli', { pageTitle: 'Ajout de ticket', path: '/params/add_cli' });
}

// familles et sous familles

exports.getFamilles = (req, res, next) => {
  res.render('params/families_main', { pageTitle: 'Familles de Codes', path: '/params/families_main' });
}