const ParamModel= require('../models/M_Params');

//errorcodes *********************************************************************************************************
exports.getErrorCodes =(req,res,next)=>{
  ParamModel.getCodesList(liste_errorcodes =>{
    res.render('params/errorcodes',{errorCodes : liste_errorcodes})
  })
}

exports.addCode = (req,res,next)=>{
  const code_data=req.body;
  ParamModel.addCode(code_data,addedCode =>{
    if (addedCode[0].affectedRows > 0)
    {
      res.render('notifications/maj_success_modal',{pageTitle:'Succes',returnPath:'/params/errorcodes',Message:'Le Code d erreur a été correctement ajouté !'})
    }
    else
    {
      res.render('notifications/maj_ko_modal',{pageTitle:'Erreur de mise a jour',returnPath:'/params/errorcodes',Message:'Le Code d erreur n\'a pas pu être ajouté !'})
    }
  })
}

exports.editCode =(req,res,next)=>{
  const id_code = req.params.code;
  console.log(id_code);
  ParamModel.getCode(id_code,code_data =>{
    console.log(code_data);
    res.render('params/edit_code',{pageTitle:'Edition du Code d\'erreur',code_data:code_data})
  })
}

exports.postEditCode = (req,res,next)=>{
  const editCodeData = req.body;
 // console.log(editTypoData);
  ParamModel.updateCode(editCodeData,updatedcode=>{
    console.log(updatedcode[0].affectedRows);
    if(updatedcode[0].affectedRows >0)
    {
      res.render('notifications/maj_success_modal',{pageTitle:'Succes',returnPath:'/params/errorcodes',Message:'Le Code d erreur a été correctement modifié !'})
    }
    else
    {
      res.render('notifications/maj_ko_modal',{pageTitle:'Erreur de mise a jour',returnPath:'/params/errorcodes',Message:'Le Code d erreur n\'a pas pu être modifié !'})
    }
  })
}

//typologies

exports.getTypos =(req,res,next)=>{
  ParamModel.getTypoList(liste_typos =>{
    ParamModel.getCodesList(liste_errorcodes =>{
      ParamModel.getRespList(liste_resp=>{
        res.render('params/typos',{typos : liste_typos, errorCodes : liste_errorcodes, resp:liste_resp})
      })
      
    })
  })
}

exports.addTypo = (req,res,next)=>{
  const typo_data=req.body;
  ParamModel.addTypo(typo_data,addedTypo =>{
    if (addedTypo[0].affectedRows > 0)
    {
      res.render('notifications/maj_success_modal',{pageTitle:'Succes',returnPath:'/params/typos',Message:'La typologie a été correctement ajoutée !'})
    }
    else
    {
      res.render('notifications/maj_ko_modal',{pageTitle:'Erreur de mise a jour',returnPath:'/params/typos',Message:'La typologie n\'a pas pu être ajoutée !'})
    }
  })
}

exports.editTypo =(req,res,next)=>{
  const id_typo = req.params.typo;
  console.log(id_typo);
  ParamModel.getTypo(id_typo,typo_data =>{
    //console.log(typo_data);
    res.render('params/edit_typo',{pageTitle:'Edition de la typologie',typo_data:typo_data})
  })
}

exports.postEditTypo = (req,res,next)=>{
  const editTypoData = req.body;
 // console.log(editTypoData);
  ParamModel.updateTypo(editTypoData,updatedtypo=>{
   // console.log(updatedtypo);
    if (updatedtypo[0].affectedRows > 0)
    {
      res.render('notifications/maj_success_modal',{pageTitle:'Succes',returnPath:'/params/typos',Message:'La Typologie a été correctement modifiée !'})
    }
    else
    {
      res.render('notifications/maj_ko_modal',{pageTitle:'Erreur de mise a jour',returnPath:'/params/typos',Message:'La Typologie n\'a pas pu etre modifiée !'})
    }
    
  })
}

// app params
exports.getParams =(req,res,next)=>{
  ParamModel.getParamsList(liste_params =>{
    res.render('params/parameters',{pageTitle: 'Liste de Parametres',params : liste_params})
  })
}

exports.updateParam =(req,res,next)=>{
  ParamModel.updateParam(req,updatedParam =>{
    console.log(updatedParam);
    if (updatedParam[0].affectedRows >0)
    {
      console.log('ok');
      res.render('notifications/maj_success_modal',{pageTitle:'Succes',returnPath:'/params/parametres',Message:'Le paramètre a été correctement modifié !'})
    }
    else
    {
      res.render('notifications/maj_ko_modal',{pageTitle:'Erreur de mise a jour',returnPath:'/params/parametres',Message:'Le paramètre n\'a pas pu etre modifié !'})
    }

  })
}

//tickets ************************************************************************************************************

exports.getCliList =  (req, res, next) => {
  ParamModel.getCliList(liste_cli =>{
    ParamModel.getCliStatusList(liste_status=>{
      ParamModel.getRespList(liste_resp=>{
        ParamModel.getCodesList(liste_codes=>{
          res.render('params/clis', { pageTitle: 'Liste de Clis', path: '/params/clis' ,Clis: liste_cli,liste_status:liste_status,liste_resp:liste_resp,liste_codes:liste_codes });
        })
      })
    })       
 });
};


exports.editCli = (req, res, next) => {

  const id_cli=req.params.cli;
 // console.log(id_cli);
  ParamModel.getCliDetail(id_cli,cli_data =>{
      ParamModel.getCliStatusList(liste_status=>{
        ParamModel.getRespList(liste_resp=>{
          //console.log(liste_resp);
          res.render('params/edit_incident', { pageTitle: 'Edition de ticket', path: '/params/edit_incident' ,cli_data:cli_data,liste_status:liste_status,liste_resp:liste_resp}); 
        })
        
      })
    
  })  
};

exports.postEditCli = (req,res,next)=>{
  const editCliData = req.body; 
  ParamModel.updateCli(editCliData,updatedcli=>{
    //console.log(updatedcli.affectedRows);
    if (updatedcli[0].affectedRows > 0)
    {
      res.render('notifications/maj_success_modal',{pageTitle:'Succes',returnPath:'/params/clis',Message:'L\'incident a été correctement modifié !'})
    }
    else
    {
      res.render('notifications/maj_ko_modal',{pageTitle:'Erreur de mise a jour',returnPath:'/params/clis',Message:'L\'incident  n\'a pas pu etre modifié !'})
    }
    
  })
}

exports.addCli =  (req, res, next) => {
  const cli_data=req.body;
  ParamModel.addCli(cli_data,addedCli=>{
      //console.log(updatedcli.affectedRows);
      if (addedCli[0].affectedRows > 0)
      {
        res.render('notifications/maj_success_modal',{pageTitle:'Succes',returnPath:'/params/clis',Message:'L\'incident a été correctement ajouté !'})
      }
      else
      {
        res.render('notifications/maj_ko_modal',{pageTitle:'Erreur de mise a jour',returnPath:'/params/clis',Message:'L\'incident  n\'a pas pu etre ajouté !'})
      }
    })
  }
