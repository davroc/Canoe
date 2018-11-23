const AnalyseModel= require('../models/M_Analyse');


exports.getCliList =  (req, res, next) => {
  AnalyseModel.getCliList(liste_cli =>{
   res.render('analyse/clis', { pageTitle: 'Liste d Incidents', path: '/analyse/clis' ,Clis: liste_cli });
 });
};

exports.getAlarmes =(req,res,next)=>{
  AnalyseModel.getTop(top=>{
    res.render('analyse/alarmes',{ pageTitle: 'Alarmes', path: '/analyse/alarmes'  })
  });
    
}

exports.getEvoAno = (req,res,next)=>{
  AnalyseModel.getEvoAno(evo_ano =>{
    res.render('analyse/evo_ano',{ pageTitle: 'Evolution des anomalies', path: '/analyse/evo_ano'  })
  });
}

exports.getInfoAno = (req,res,next)=>{
 // console.log(req);
      AnalyseModel.getListeErrCodes(codes =>{
        //console.log(codes);
    res.render('analyse/code_identity',{ pageTitle: 'Focus Code Erreur', path: '/analyse/code_identity',code_list:codes  })
 });
}

exports.getErrCodeDetail=(req,res,next)=>{
  const ErrCode=req.body.errCode;

  AnalyseModel.getListeErrCodes(codes =>{
    AnalyseModel.getCodeEvo(ErrCode,codeEvo=>{
      AnalyseModel.getCodeRelatedClis(ErrCode,relatedClis=>{
        AnalyseModel.getCodeRelatedAlarms(ErrCode,relatedAlarms =>{
          AnalyseModel.getCodeInfo(ErrCode,codeDetail =>{
            AnalyseModel.getCodeRelatedTypologies(ErrCode,codeTypos =>{
           // console.log(codeDetail);
            res.render('analyse/code_identity',{ pageTitle: 'Focus Code Erreur', path: '/analyse/code_identity',code_list:codes,SelectedCode:ErrCode,code_evo:JSON.stringify(codeEvo),relatedClis:relatedClis,relatedAlarms:relatedAlarms,codeDetail:codeDetail ,Typos:codeTypos })
             })
          })
        })
      })
    })
});
}
