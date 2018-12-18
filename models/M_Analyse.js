const db=require('../util/db');


exports.getCliList  = liste_clis => {
 // db.execute('SELECT CLI,CODE_ERREUR, from cli')
  db.execute('SELECT SI,CLI,TITRE,CODE_ERREUR,DATE_FORMAT(DATE_CREATION,"%Y-%m-%d") as DATE_CREATION,DATE_FORMAT(DATE_CLOTURE,"%Y-%m-%d") as DATE_CLOTURE,ETAT,DESCRIPTIF,ENTITE_RESPONSABLE,ENTITE_EN_ACTION from cli')
   .then(res=>{
     liste_clis(res[0]);
   })
  .catch(err=>{return err});
  }

  exports.getCodesData4pastweek = (refdate,profondeur,weeklydata) =>{
   sql=`select code.Errorcode as ERR_CODE,
   SUM(if(daily.dt = subdate("${refdate[0].dt_insertion}",7),daily.nb_tickets,0)) as day7,
   SUM(if(daily.dt = subdate("${refdate[0].dt_insertion}",6),daily.nb_tickets,0)) as day6,
   SUM(if(daily.dt = subdate("${refdate[0].dt_insertion}",5),daily.nb_tickets,0)) as day5,
   SUM(if(daily.dt = subdate("${refdate[0].dt_insertion}",4),daily.nb_tickets,0)) as day4,
   SUM(if(daily.dt = subdate("${refdate[0].dt_insertion}",3),daily.nb_tickets,0)) as day3,
   SUM(if(daily.dt = subdate("${refdate[0].dt_insertion}",2),daily.nb_tickets,0)) as day2,
   SUM(if(daily.dt = subdate("${refdate[0].dt_insertion}",1),daily.nb_tickets,0)) as day1,
   SUM(if(daily.dt between subdate("${refdate[0].dt_insertion}",${profondeur}) and subdate("${refdate[0].dt_insertion}",1) ,daily.nb_tickets,0)) as stock,
   AVG(if(daily.dt between subdate("${refdate[0].dt_insertion}",${profondeur}) and subdate("${refdate[0].dt_insertion}",1) ,daily.nb_tickets,0)) as moyenne
   from errorcodes as code left join bios_errorcodes_daily_summary as daily 
   on code.Errorcode = daily.ERR_CODE
   where daily.dt_insertion="${refdate[0].dt_insertion}"
   group by code.ErrorCode
   order by day1 desc`


    //console.log(sql);
    db.query(sql)
    .then(res=>{
      weeklydata(res[0]);
    })
    .catch(err=>{console.log(err)});
  }

  exports.getAlarmesDaysHeaders = (refdate,headers) =>{
    sql = `select date_format(subdate("${refdate[0].dt_insertion}",7),'%d/%m/%Y') as 'day7',
    date_format(subdate("${refdate[0].dt_insertion}",6),'%d/%m/%Y') as 'day6',
    date_format(subdate("${refdate[0].dt_insertion}",5),'%d/%m/%Y') as 'day5',
    date_format(subdate("${refdate[0].dt_insertion}",4),'%d/%m/%Y')as 'day4',
    date_format(subdate("${refdate[0].dt_insertion}",3),'%d/%m/%Y')as 'day3',
    date_format(subdate("${refdate[0].dt_insertion}",2),'%d/%m/%Y')as 'day2',
    date_format(subdate("${refdate[0].dt_insertion}",1),'%d/%m/%Y') as 'day1'`;
    db.execute(sql)
    .then(res=>{
      headers(res[0]);
    })
    .catch(err=>{console.log(err)});
  }

  exports.getRupture = (refdate,params,rupture) =>{
   // console.log(params);
    const seuil = params.filter(param=>param.param == 'seuil_min_rupture')[0].value;
    const nb_ecarttype=params.filter(param=>param.param == 'nb_ecart_type_rupture')[0].value;
    const profondeur=params.filter(param=>param.param =='profondeur_rupture')[0].value;
    //console.log(seuil);
    sql=`SELECT  a.ERR_CODE,
    REPLACE(FORMAT(avg(a.nb_tickets),1),","," ") as moy ,
    REPLACE(FORMAT(STD(a.nb_tickets),1),","," ") as ecart ,
    b.nb_tickets as yesterday 
    FROM canoe_db.bios_errorcodes_daily_summary a 
    join canoe_db.bios_errorcodes_daily_summary b on a.ERR_CODE = b.ERR_CODE
    WHERE a.dt BETWEEN SUBDATE("${refdate[0].dt_insertion}",${profondeur} + 1 ) AND SUBDATE("${refdate[0].dt_insertion}", 1)
    AND a.dt_insertion = "${refdate[0].dt_insertion}"
    AND b.dt_insertion = "${refdate[0].dt_insertion}"
    AND b.dt = SUBDATE("${refdate[0].dt_insertion}",1)
    AND (b.nb_tickets > ${seuil}) 
    GROUP BY a.ERR_CODE 
    HAVING b.nb_tickets > (AVG(a.nb_tickets)  + (${nb_ecarttype} * STD(a.nb_tickets)) )`;
   
    //console.log(sql);
    db.execute(sql)
    .then(res =>{
      rupture(res[0]);
    })
    .catch(err=>{console.log(err)});
  }
  
  exports.getDerive =(refdate,params,derive) =>{
    const seuil_derive = params.filter(param=>param.param == 'pourcentage_min_derive')[0].value /100;
    const profondeur_derive = params.filter(param=>param.param == 'profondeur_derive')[0].value;
 
    sql=`SELECT distinct a.ERR_CODE,
    b.nb_tickets AS yesterday,
    date_format(SUBDATE("${refdate[0].dt_insertion}", ${profondeur_derive} +1),'%d/%m/%Y') as dt_comparaison,
    c.nb_tickets AS data_dt_comparaison,
    CONCAT(REPLACE(FORMAT(((b.nb_tickets - c.nb_tickets) / c.nb_tickets) * 100 ,1),","," ")," %") as derive 
    FROM bios_errorcodes_daily_summary a
    JOIN bios_errorcodes_daily_summary b ON a.ERR_CODE = b.ERR_CODE 
    JOIN bios_errorcodes_daily_summary c ON a.ERR_CODE = c.ERR_CODE 
    WHERE b.dt = SUBDATE("${refdate[0].dt_insertion}", 1) AND c.dt = SUBDATE("${refdate[0].dt_insertion}", ${profondeur_derive} +1)
    AND a.dt_insertion = "${refdate[0].dt_insertion}" AND b.dt_insertion = "${refdate[0].dt_insertion}"
    AND c.dt_insertion = "${refdate[0].dt_insertion}" AND ((b.nb_tickets - c.nb_tickets) / c.nb_tickets ) > ${seuil_derive}`;
    //console.log(sql);
    db.execute(sql)
    .then(res =>{
      derive(res[0]);
    })
    .catch(err=>{console.log(err)});
  }

  exports.getListeErrCodes=errCodes =>{
    db.execute('select distinct ErrorCode from errorcodes')
    .then(res =>{
      errCodes(res[0]);
    })
    .catch(err=>{return err});
  }

  exports.getEvoAno = (refdate,profondeur ,evo_ano) =>{
    db.execute(`select ERR_CODE as ERROR_CODE,date_format(dt,"%d/%m/%Y") as dt,nb_tickets 
    from bios_errorcodes_daily_summary 
    where dt between subdate("${refdate[0].dt_insertion}",${profondeur}) and  subdate("${refdate[0].dt_insertion}",1) and dt_insertion= "${refdate[0].dt_insertion}" 
    group by ERR_CODE,dt`)
    .then(res=>{
      evo_ano(res[0]);
    })
    .catch(err=>{console.log(err) });
  }

  exports.getCodeEvo=(refdate,profondeur,code,evoCode)=>{
    
    db.execute(`select ERR_CODE as code,date_format(dt,"%d/%m/%Y") as dat,nb_tickets 
    from bios_errorcodes_daily_summary 
    where ERR_CODE = "${code}" 
    and dt between subdate("${refdate[0].dt_insertion}",${profondeur}) and  subdate("${refdate[0].dt_insertion}",1) 
    and dt_insertion= "${refdate[0].dt_insertion}" order by dt`)
    .then(res=>{

      evoCode(res[0]);
    })
    .catch(err=>{console.log(err) });
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
    db.execute('SELECT CLI,TITRE,CODE_ERREUR,DATE_FORMAT(DATE_CREATION,"%Y-%m-%d") as DATE_CREATION,DATE_FORMAT(DATE_CLOTURE,"%Y-%m-%d") as DATE_CLOTURE,ETAT,DESCRIPTIF,ENTITE_RESPONSABLE,ENTITE_EN_ACTION from cli where CODE_ERREUR= "'+code+'"')
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

  exports.getrResolutioninLastDays=(code,maxdate,Resolution)=>{
    maxdate= maxdate[0].dt_insertion;
    let result=[];
    sql=`SELECT ERR_CODE,DATE_FORMAT(dt,"%Y-%m-%d") dt,DATE_FORMAT(dt_insertion,"%Y-%m-%d") dt_insertion,nb_tickets FROM bios_errorcodes_daily_summary 
          WHERE ERR_CODE='${code}' and dt=subdate('${maxdate}',1)
          and dt_insertion between subdate('${maxdate}',7) and '${maxdate}'`;
          //console.log(sql);
    db.execute(sql)
    .then(res=>{
        
        result.push(res[0]);
        sql=`SELECT ERR_CODE,DATE_FORMAT(dt,"%Y-%m-%d") dt,DATE_FORMAT(dt_insertion,"%Y-%m-%d") dt_insertion,nb_tickets FROM bios_errorcodes_daily_summary 
        WHERE ERR_CODE='${code}' and dt=subdate('${maxdate}',2)
        and dt_insertion between subdate('${maxdate}',7) and '${maxdate}'`;
        
        db.execute(sql)   
        .then(res=>{
          
          result.push(res[0]);
          sql=`SELECT ERR_CODE,DATE_FORMAT(dt,"%Y-%m-%d") dt,DATE_FORMAT(dt_insertion,"%Y-%m-%d") dt_insertion,nb_tickets FROM bios_errorcodes_daily_summary 
          WHERE ERR_CODE='${code}' and dt=subdate('${maxdate}',3)
          and dt_insertion between subdate('${maxdate}',7) and '${maxdate}'`;
          
          db.execute(sql)
          .then(res=>{
          
            result.push(res[0]);
            sql=`SELECT ERR_CODE,DATE_FORMAT(dt,"%Y-%m-%d") dt,DATE_FORMAT(dt_insertion,"%Y-%m-%d") dt_insertion,nb_tickets FROM bios_errorcodes_daily_summary 
            WHERE ERR_CODE='${code}' and dt=subdate('${maxdate}',4)
            and dt_insertion between subdate('${maxdate}',7) and '${maxdate}'`;
            
            db.execute(sql)
            .then(res=>{

              result.push(res[0]);
              sql=`SELECT ERR_CODE,DATE_FORMAT(dt,"%Y-%m-%d") dt,DATE_FORMAT(dt_insertion,"%Y-%m-%d") dt_insertion,nb_tickets FROM bios_errorcodes_daily_summary 
              WHERE ERR_CODE='${code}' and dt=subdate('${maxdate}',5)
              and dt_insertion between subdate('${maxdate}',7) and '${maxdate}'`;
              
              db.execute(sql)
              .then(res=>{

                result.push(res[0]);          
                console.log(result);
                Resolution(result);
              })
            })
          })
        })   
    })
    .catch(err=>{console.log(err)});
  }