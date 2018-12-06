const db=require('../util/db');
const Mailer = require ('nodemailer');

let transporter = Mailer.createTransport( {
  host: 'mail-0092.sfr.com',
  port: 25,
  secure: false, // upgrade later with STARTTLS

})
var message = {
  from: 'supporttest@sfr.com',
  to: 'david.roche.prestataire@sfr.com',
  subject: 'Message title',
  text: 'Plaintext version of the message',
  html: '<p>HTML version of the message</p>'
};

//transporter.sendMail(message);

exports.getCliList  = liste_clis => {
  db.execute('SELECT * from cli')
   .then(res=>{
     liste_clis(res[0]);
   })
  .catch(err=>{return err});
  }

  exports.getEvoAno = evo_ano =>{
    db.execute('SELECT ERROR_CODE,date_format(START_COMM,"%Y-%m-%d") as dt, COUNT(EVENT_NO) as nb_tickets  FROM canoe_db.daily_data  WHERE START_COMM <= subdate(current_date,1)  GROUP BY ERROR_CODE,dt')
    db.execute('select ERR_CODE as ERROR_CODE,date_format(dt,"%d/%m/%Y") as dt,nb_tickets from bios_errorcodes_daily_summary where dt <= subdate(current_date(),1) and dt_insertion= current_date() group by ERR_CODE,dt')
    .then(res=>{
      evo_ano(res[0]);
    })
    .catch(err=>{return err});
  }

  exports.getCodesData4pastweek = (weeklydata) =>{
  sql="select z.ErrorCode as ERR_CODE, a.nb_tickets as 'day7' ,b.nb_tickets as 'day6',c.nb_tickets as 'day5',d.nb_tickets as 'day4',e.nb_tickets as 'day3',f.nb_tickets as 'day2',g.nb_tickets as 'day1',sum(h.nb_tickets) as `stock`,avg(i.nb_tickets) as `moyenne` from errorcodes z left join bios_errorcodes_daily_summary a on z.ErrorCode=a.ERR_CODE left join bios_errorcodes_daily_summary b on z.ErrorCode=b.ERR_CODE left join bios_errorcodes_daily_summary c on z.ErrorCode=c.ERR_CODE left join bios_errorcodes_daily_summary d on z.ErrorCode=d.ERR_CODE left join bios_errorcodes_daily_summary e on z.ErrorCode=e.ERR_CODE left join bios_errorcodes_daily_summary f on z.ErrorCode=f.ERR_CODE left join bios_errorcodes_daily_summary g on z.ErrorCode=g.ERR_CODE left join bios_errorcodes_daily_summary h on z.ErrorCode=h.ERR_CODE left join bios_errorcodes_daily_summary i on z.ErrorCode=i.ERR_CODE where a.dt = subdate(current_date(),7) and a.dt_insertion = current_date() and b.dt = subdate(current_date(),6) and b.dt_insertion = current_date() and c.dt = subdate(current_date(),5) and c.dt_insertion = current_date() and d.dt = subdate(current_date(),4) and d.dt_insertion = current_date() and e.dt = subdate(current_date(),3) and e.dt_insertion = current_date() and f.dt = subdate(current_date(),2) and f.dt_insertion = current_date() and g.dt = subdate(current_date(),1) and g.dt_insertion = current_date() and h.dt between subdate(current_date(),90) and current_date() and h.dt_insertion = current_date() and i.dt between subdate(current_date(),90) and current_date() and i.dt_insertion = current_date() group by z.ErrorCode";
    console.log(sql);
    db.execute(sql)
    .then(res=>{
      weeklydata(res[0]);
    })
    .catch(err=>{console.log(err)});
  }

  exports.getAlarmesDaysHeaders = (headers) =>{
    sql = "select date_format(subdate(current_date(),7),'%d/%m/%Y') as 'day7',date_format(subdate(current_date(),6),'%d/%m/%Y') as 'day6',date_format(subdate(current_date(),5),'%d/%m/%Y') as 'day5',date_format(subdate(current_date(),4),'%d/%m/%Y')as 'day4',date_format(subdate(current_date(),3),'%d/%m/%Y')as 'day3',date_format(subdate(current_date(),2),'%d/%m/%Y')as 'day2',date_format(subdate(current_date(),1),'%d/%m/%Y') as 'day1'"
    db.execute(sql)
    .then(res=>{
      headers(res[0]);
    })
    .catch(err=>{console.log(err)});
  }

  exports.getTop = (params,top) =>{
    const profondeur=params.filter(param=>param.param =='prof_histo')[0].value;
    db.execute('select ERR_CODE,dt,nb_tickets from bios_errorcodes_daily_summary where dt between subdate(current_date,'+ profondeur +') and subdate(current_date,1)  order by nb_tickets desc')
    .then(res=>{
      top(res[0]);
    })
    .catch(err=>{return err});
  }

  exports.getRupture = (params,rupture) =>{
   // console.log(params);
    const seuil = params.filter(param=>param.param == 'seuil_min_rupture')[0].value;
    const nb_ecarttype=params.filter(param=>param.param == 'nb_ecart_type_rupture')[0].value;
    const profondeur=params.filter(param=>param.param =='profondeur_rupture')[0].value;
    //console.log(seuil);
    sql="SELECT  a.ERR_CODE, AVG(a.nb_tickets) as moy, STD(a.nb_tickets) as ecart, b.nb_tickets as yesterday FROM canoe_db.bios_errorcodes_daily_summary a join canoe_db.bios_errorcodes_daily_summary b on a.ERR_CODE = b.ERR_CODE WHERE a.dt BETWEEN SUBDATE(CURRENT_DATE,"+ profondeur +" + 1 ) AND SUBDATE(CURRENT_DATE, 1)  AND a.dt_insertion = CURRENT_DATE AND b.dt_insertion = CURRENT_DATE  AND b.dt = SUBDATE(CURRENT_DATE,1) AND (b.nb_tickets > "+ seuil +") GROUP BY a.ERR_CODE HAVING b.nb_tickets > (AVG(a.nb_tickets)  + ("+ nb_ecarttype +" * STD(a.nb_tickets)) )";
    sql="SELECT  a.ERR_CODE, AVG(a.nb_tickets) as moy, STD(a.nb_tickets) as ecart, b.nb_tickets as yesterday FROM canoe_db.bios_errorcodes_daily_summary a join canoe_db.bios_errorcodes_daily_summary b on a.ERR_CODE = b.ERR_CODE WHERE a.dt BETWEEN '2018-10-20' AND '2018-11-13'  AND a.dt_insertion = CURRENT_DATE AND b.dt_insertion = CURRENT_DATE  AND b.dt = '2018-11-13'  AND (b.nb_tickets > "+ seuil +")  GROUP BY a.ERR_CODE HAVING  b.nb_tickets > (AVG(a.nb_tickets)  + ("+ nb_ecarttype +" * STD(a.nb_tickets)) )";
    //console.log(sql);
    db.execute(sql)
    .then(res =>{
      rupture(res[0]);
    })
    .catch(err=>{return err});
  }
  
  exports.getDerive =(params,derive) =>{
    const seuil_derive = params.filter(param=>param.param == 'pourcentage_min_derive')[0].value /100;
    const profondeur_derive = params.filter(param=>param.param == 'profondeur_derive')[0].value ;

    sql="SELECT distinct a.ERR_CODE, b.nb_tickets AS yesterday,date_format(SUBDATE(CURRENT_DATE, "+ profondeur_derive +" +1),'%d/%m/%Y') as dt_comparaison, c.nb_tickets AS data_dt_comparaison,(b.nb_tickets - c.nb_tickets) / c.nb_tickets AS derive FROM bios_errorcodes_daily_summary a JOIN bios_errorcodes_daily_summary b ON a.ERR_CODE = b.ERR_CODE JOIN bios_errorcodes_daily_summary c ON a.ERR_CODE = c.ERR_CODE WHERE b.dt = SUBDATE(CURRENT_DATE, 1) AND c.dt = SUBDATE(CURRENT_DATE, "+ profondeur_derive +" +1)	 AND a.dt_insertion = CURRENT_DATE AND b.dt_insertion = CURRENT_DATE AND c.dt_insertion = CURRENT_DATE AND ((b.nb_tickets - c.nb_tickets) / c.nb_tickets ) > "+seuil_derive+"";
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

  exports.getCodeEvo=(code,evoCode)=>{
    db.execute('select ERR_CODE as code,date_format(dt,"%d/%m/%Y") as dat,nb_tickets from bios_errorcodes_daily_summary where ERR_CODE = "'+code+'" and dt_insertion= current_date() order by dt')
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