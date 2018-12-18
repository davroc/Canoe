const db=require('../util/db');

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
  order by day1 desc
  limit 7`
  


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

 exports.insertAlarm=(errcode,type_alarme,val_alarme,date,addedAlarm)=>{
  sql="insert into bios_is_flagged (error_code,type_flag,flag_val,date_flag) VALUES ('"+ errcode +"','"+ type_alarme +"','"+ val_alarme +"','"+ date +"')";
  console.log(sql);
  db.execute(sql)
  .then(res =>{
    addedAlarm(res[0]);
  })
  .catch(err=>{console.log(err)});
}  
 