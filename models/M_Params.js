const db=require('../util/db');


exports.getCliList  = liste_clis => {
  db.execute('SELECT * from cli')
   .then(res=>{
     liste_clis(res[0]);
    // console.log(liste_clis);
   })
  .catch(err=>{return err});
  }