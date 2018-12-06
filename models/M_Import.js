const db=require('../util/db');


exports.truncate_daily_data = trunc =>{
  db.execute('truncate table canoe_db.daily_data')
  .then(res=>{
    trunc(res);
  })
 .catch(err=>{return err});
};

exports.loadData = (file,isloaded)=>{
  var fileR =file.replace(/\\/g,"\/" );
  console.log('load data local infile "'+ fileR +'" into table canoe_db.daily_data fields terminated by ";" ignore 1 lines ');
  db.query('load data local infile "'+ fileR +'" into table canoe_db.daily_data fields terminated by ";" ignore 1 lines ')
  .then(res=>{
    isloaded(res);
  })
 .catch(err=>{console.log('impossible d importer le fichier ',err)});
};

exports.CreateCumulsJour = (cumul)=>{
  db.execute('INSERT INTO bios_errorcodes_daily_summary SELECT ERROR_CODE,date_format(START_COMM,"%Y-%m-%d") as dt, COUNT(EVENT_NO) as nb_tickets,current_date() FROM canoe_db.daily_data GROUP BY ERROR_CODE,dt')
  .then(res=>{
    cumul(res);
  })
 .catch(err=>{console.log(err) });
};

exports.checkNewCodes = (newCodes) =>{
  db.execute('INSERT IGNORE INTO errorcodes (ErrorCode)	SELECT distinct ERROR_CODE from canoe_db.daily_data')
  .then(res=>{
    newCodes(res);
  })
 .catch(err=>{return err});
}
