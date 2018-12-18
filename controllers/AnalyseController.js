const AnalyseModel= require('../models/M_Analyse');
const ParamModel= require('../models/M_Params');


exports.getCliList =  (req, res, next) => {
  AnalyseModel.getCliList(liste_cli =>{
   res.render('analyse/clis', { pageTitle: 'Liste d Incidents', path: '/analyse/clis' ,Clis: liste_cli });
 });
};

exports.getAlarmes =(req,res,next)=>{
  //console.log(req.body);
  ParamModel.getMaxDataInsertionDate(maxdt =>{
    //console.log(maxdt);
    ParamModel.getParamsList(params=>{  
      const profondeur=params.filter(param=>param.param =='prof_histo')[0].value; 
      const seuil_rupture=params.filter(param=>param.param =='seuil_min_rupture')[0].value; 
      const profondeur_rupture=params.filter(param=>param.param =='profondeur_rupture')[0].value; 
      const ecart_type_rupture=params.filter(param=>param.param =='nb_ecart_type_rupture')[0].value; 
      const profondeur_derive=params.filter(param=>param.param =='profondeur_derive')[0].value; 
      const pourcentage_min_derive=params.filter(param=>param.param =='pourcentage_min_derive')[0].value; 
      
        AnalyseModel.getCodesData4pastweek(maxdt,profondeur,weeklyCodedata =>{
          AnalyseModel.getAlarmesDaysHeaders(maxdt,headers =>{
            //console.log(headers);
            AnalyseModel.getRupture(maxdt,params,rupture =>{
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
              AnalyseModel.getDerive(maxdt,params,derive =>{
                if (derive.length > 0 )
                {             
                  for (var d of derive)
                  {
                    //console.log(d);
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
                var auj=new Date().toLocaleDateString('fr-FR');
                //console.log(derive);
                //console.log(rupture);
                res.render('analyse/alarmes',{ pageTitle: 'Alarmes',
                 path: '/analyse/alarmes' ,
                 fraicheur_donnees:maxdt[0].dt_insertion,
                 auj : auj,
                 derive:derive,
                 rupture:rupture ,
                 weeklyCodeData:weeklyCodedata ,
                 table_header:headers,
                 profondeur : profondeur,
                 seuil_rupture : seuil_rupture,
                 profondeur_rupture : profondeur_rupture,
                 ecart_type_rupture : ecart_type_rupture,
                 profondeur_derive : profondeur_derive,
                 pourcentage_min_derive : pourcentage_min_derive               
                });
              });
            });          
          }) ;
        });
      });
    });
}

exports.getEvoAno = (req,res,next)=>{
  ParamModel.getMaxDataInsertionDate(maxdt =>{
    ParamModel.getParamsList(params=>{  
      const profondeur=params.filter(param=>param.param =='prof_histo')[0].value;  
    AnalyseModel.getEvoAno(maxdt,profondeur,evo_ano =>{
    //console.log(evo_ano);
    res.render('analyse/evo_ano',{ pageTitle: 'Evolution des anomalies', path: '/analyse/evo_ano' ,evo_ano:JSON.stringify(evo_ano),fraicheur_donnees:maxdt[0].dt_insertion,profondeur:profondeur })
   });
  });
  });
}

exports.getInfoAno = (req,res,next)=>{
    AnalyseModel.getListeErrCodes(codes =>{
    res.render('analyse/code_identity',{ pageTitle: 'Focus Code Erreur', path: '/analyse/code_identity',code_list:codes  })
 });
}

exports.getErrCodeDetail=(req,res,next)=>{
  
  const ErrCode=req.params.code;

  //console.log(ErrCode);

  AnalyseModel.getListeErrCodes(codes =>{
    ParamModel.getMaxDataInsertionDate(maxdt =>{
      ParamModel.getParamsList(params=>{
        const profondeur=params.filter(param=>param.param =='prof_histo')[0].value;  
      AnalyseModel.getCodeEvo(maxdt,profondeur,ErrCode,codeEvo=>{
        AnalyseModel.getCodeRelatedClis(ErrCode,relatedClis=>{
          AnalyseModel.getCodeRelatedAlarms(ErrCode,relatedAlarms =>{
            AnalyseModel.getCodeInfo(ErrCode,codeDetail =>{
              AnalyseModel.getCodeRelatedTypologies(ErrCode,codeTypos =>{
                AnalyseModel.getrResolutioninLastDays(ErrCode,maxdt,Resolution=>{
                console.log(Resolution);
                res.render('analyse/code_identity',{ pageTitle: 'Focus Code Erreur', 
                path: '/analyse/code_identity',
                code_list:codes,
                SelectedCode:ErrCode,
                code_evo:JSON.stringify(codeEvo),
                relatedClis:relatedClis,
                relatedAlarms:relatedAlarms,
                codeDetail:codeDetail,
                Typos:codeTypos,
                fraicheur_donnees:maxdt[0].dt_insertion ,
                profondeur:profondeur,
                resolutionData: Resolution})
                })
             })
            })
          })
        })
        })
      })
    })
});
}
