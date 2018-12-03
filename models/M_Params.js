const db=require('../util/db');

//errorcodes


exports.getCodesList = liste_errorCodes =>{
  db.execute('select * from errorcodes')
  .then(res=>{
    liste_errorCodes(res[0]);
   // console.log(liste_clis);
  })
 .catch(err=>{return err});
}

exports.getCode = (id_code,data_code)=>{
  db.execute('select * from errorcodes where ErrorCode ='+id_code)
  .then(res=>{
    data_code(res[0]);
   // console.log(liste_clis);
  })
 .catch(err=>{return err});
}

exports.updateCode = (updated_code_data,updated_code)=>{
  const code_id=updated_code_data.edit_code_id;
  const desc_code = updated_code_data.edit_code_description;

  const sql='update errorcodes set Description_ErrorCode="'+ desc_code +'" where ErrorCode = "'+ code_id +'"  ';
  console.log(sql);
  db.execute(sql)
  .then(res=>{
    console.log(res);
    updated_code(res);
  })
 .catch(err=>{return err});
}

//typologies

exports.getTypoList = liste_typos =>{
  db.execute('select * from bios_typologies')
  .then(res=>{
    liste_typos(res[0]);
   // console.log(liste_clis);
  })
 .catch(err=>{return err});
}

exports.getTypo = (id_typo,data_typo)=>{
  db.execute('select * from bios_typologies where id_typologie ='+id_typo)
  .then(res=>{
    data_typo(res[0]);
   // console.log(liste_clis);
  })
 .catch(err=>{return err});
}

exports.updateTypo = (updated_typo_data,updated_typo)=>{
  const typo_id=updated_typo_data.typo_id;
  const lib_typo = updated_typo_data.edit_typo_libelle;
  const source_typo = updated_typo_data.edit_typo_source_potentielle;
  const collecte = updated_typo_data.edit_typo_collecte;
  const resp = updated_typo_data.edit_typo_resp;

  const sql='update bios_typologies set libelle_typologie="'+ lib_typo +'", source_potentielle="'+ source_typo +'" , collecte_impactee="'+ collecte +'" ,responsabilite="'+ resp +'" where id_typologie = '+ typo_id +'  ';
  db.execute(sql)
  .then(res=>{
    console.log(res);
    updated_typo(res);
  })
 .catch(err=>{return err});
}

//app params
exports.getParamsList = liste_params =>{
  db.execute('select * from conf_bios_params')
  .then(res=>{
    liste_params(res[0]);
  })
 .catch(err=>{return err});  
}

//tickets

exports.getCliList  = liste_clis => {
  db.execute('SELECT * from cli')
   .then(res=>{
     liste_clis(res[0]);
    // console.log(liste_clis);
   })
  .catch(err=>{return err});
  }

  exports.getCliDetail = (id_cli,cli_data) =>{
    const sql='SELECT CLI,TITRE,CODE_ERREUR,DATE_FORMAT(DATE_CREATION,"%Y-%m-%d") as DATE_CREATION,DATE_FORMAT(DATE_CLOTURE,"%Y-%m-%d") as DATE_CLOTURE,ETAT,DESCRIPTIF,ENTITE_RESPONSABLE,ENTITE_EN_ACTION from cli where CLI="'+id_cli+'"';
    db.execute(sql)
     .then(res=>{
       cli_data(res[0]);
     })
    .catch(err=>{return err});
  }

  exports.updateCli = (updated_cli_data,updated_cli)=>{
    console.log(updated_cli_data);
    const cli_id=updated_cli_data.cli_id;
    const titre=updated_cli_data.edit_incident_titre;
    const creation=updated_cli_data.edit_incident_dt_creation;
    const cloture=updated_cli_data.edit_incident_dt_cloture;
    const desc=updated_cli_data.edit_incident_desc;
    const resp=updated_cli_data.edit_incident_resp;
    const action = updated_cli_data.edit_incident_act;
    const etat= updated_cli_data.edit_incident_etat;

    const sql='update cli set TITRE="'+ titre +'", DATE_CREATION="'+ creation +'", DATE_CLOTURE="'+ cloture +'", ETAT="'+ etat +'" , DESCRIPTIF="'+ desc +'", ENTITE_RESPONSABLE="'+ resp +'", ENTITE_EN_ACTION="'+ action  +'" where CLI = "'+ cli_id +'"';
    db.execute(sql)
    .then(res=>{
      updated_cli(res[0]);
    })
   .catch(err=>{return err});
   // console.log(sql); 
  }
  exports.getCliStatusList =(cb)=>
  {
    db.execute('SELECT * from conf_bios_status_incidents')
      .then(res=>{
        cb(res[0]);
        //console.log(res[0]);
      })
      .catch(err=>{return err});
  }

  exports.getRespList=(cb)=>
  {
    db.execute('SELECT * from responsabilites')
      .then(res=>{
        cb(res[0]);
        //console.log(res[0]);
      })
      .catch(err=>{return err});    
  }

