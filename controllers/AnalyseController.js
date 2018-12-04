const AnalyseModel= require('../models/M_Analyse');
const ParamModel= require('../models/M_Params');


exports.getCliList =  (req, res, next) => {
  AnalyseModel.getCliList(liste_cli =>{
   res.render('analyse/clis', { pageTitle: 'Liste d Incidents', path: '/analyse/clis' ,Clis: liste_cli });
 });
};

exports.getAlarmes =(req,res,next)=>{
  ParamModel.getParamsList(params=>{
    AnalyseModel.getTop(params,top =>{  
      AnalyseModel.getCodesData4pastweek(weeklyCodedata =>{
        AnalyseModel.getAlarmesDaysHeaders(headers =>{
          //console.log(headers);
          AnalyseModel.getRupture(params,rupture =>{
            if (rupture.length > 0 )
            {
              for (var r of rupture)
              {
                console.log(r);
                for (var w of weeklyCodedata)
                {
                  if (w.ERR_CODE == r.ERR_CODE)
                  {
                   Object.assign(r,w);
                  }
                }
              }
            }
            else
            {
              console.log('pas de rupture');
            }
            //console.log(rupture);
            AnalyseModel.getDerive(params,derive =>{
              if (derive.length > 0 )
              {             
                for (var d of derive)
                {
                  console.log(d);
                  for (var w of weeklyCodedata)
                  {
                    if (w.ERR_CODE == d.ERR_CODE)
                    {
                     Object.assign(d,w);
                    }
                  }
                }
              }
              else
              {
                console.log('pas de dérive');
              }

              console.log(derive);
              res.render('analyse/alarmes',{ pageTitle: 'Alarmes', path: '/analyse/alarmes' ,derive:derive,rupture:rupture ,weeklyCodeData:weeklyCodedata ,table_header:headers});
            });
          });          
        }) ;
      });
    });
  });  
}

exports.getEvoAno = (req,res,next)=>{
  AnalyseModel.getEvoAno(evo_ano =>{
    //console.log(evo_ano);
    res.render('analyse/evo_ano',{ pageTitle: 'Evolution des anomalies', path: '/analyse/evo_ano' ,evo_ano:JSON.stringify(evo_ano) })
  });
}

exports.getInfoAno = (req,res,next)=>{
    AnalyseModel.getListeErrCodes(codes =>{
    res.render('analyse/code_identity',{ pageTitle: 'Focus Code Erreur', path: '/analyse/code_identity',code_list:codes  })
 });
}

exports.getErrCodeDetail=(req,res,next)=>{
  
  const ErrCode=req.params.code;

  console.log(ErrCode);

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
