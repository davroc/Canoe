const db=require('../util/db');


exports.getCliList  = liste_clis => {
  db.execute('SELECT * from cli')
   .then(res=>{
     liste_clis(res[0]);
   })
  .catch(err=>{return err});
  }

  exports.getEvoAno = evo_ano =>{
    //db.execute('')
  }


  exports.getTop = top =>{
    db.execute('select ERR_CODE,dt,nb_tickets from bios_errorcodes_daily_summary where dt=subdate(current_date,1) order by nb_tickets desc limit 7')
    .then(res=>{
      top(res[0]);
    })
    .catch(err=>{return err});
  }

  exports.getListeErrCodes=errCodes =>{
    db.execute('select distinct ErrorCode from errorcodes')
    .then(res =>{
      errCodes(res[0]);
    })
    .catch(err=>{return err});
  }

  exports.getCodeEvo=(code,evoCode)=>{
    db.execute('select ERR_CODE as code,date_format(dt,"%d/%m/%Y") as dat,nb_tickets from bios_errorcodes_daily_summary where ERR_CODE = "'+code+'" order by dt')
    .then(res=>{

      evoCode(res[0]);
    })
    .catch(err=>{return err});
  }
  
  exports.getCodeInfo=(code,infoCode)=>{
    //console.log('select * from errorcodes where ErrorCode = "'+code+'"');
    db.execute('select * from errorcodes where ErrorCode = "'+code+'"' )
    .then(res=>{
      infoCode(res[0]);
    })
    .catch(err=>{return err});    
  }

  exports.getCodeRelatedTypologies=(code,typosCode)=>{
    db.execute('select * from bios_typologies where error_code = "'+code+'"')
    .then(res=>{
      typosCode(res[0]);
    })
    .catch(err=>{return err});
  }
  exports.getCodeRelatedClis=(code,attachedClis)=>{
    //console.log('select * from cli where CODE_ERREUR= "'+code+'"');
    db.execute('select * from cli where CODE_ERREUR= "'+code+'"')
    .then(res=>{
      attachedClis(res[0]);
    })
    .catch(err=>{return err});
  }

  exports.getCodeRelatedAlarms=(code,relatedAlarms)=>{
    db.execute('select type_flag,flag_val,date_format(date_flag,"%d/%m/%Y") as date_flag from bios_is_flagged where error_code ="'+code+'"')
    .then(res=>{
      relatedAlarms(res[0]);
    })
    .catch(err=>{return err});
  }