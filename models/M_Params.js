const db=require('../util/db');


exports.getCliList  = liste_clis => {
  db.execute('SELECT * from cli')
   .then(res=>{
     liste_clis(res[0]);
    // console.log(liste_clis);
   })
  .catch(err=>{return err});
  }

  exports.getCliDetail = (id_cli,cli_data) =>{
    const sql='SELECT * from cli where id_cli='+id_cli;
    db.execute(sql)
     .then(res=>{
       cli_data(res[0]);
       //console.log(res[0]);
     })
    .catch(err=>{return err});
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

