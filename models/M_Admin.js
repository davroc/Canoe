const db=require('../util/db');

exports.getUsersList = liste =>{  
  db.execute('SELECT * from users')
   .then(res=>{
     liste(res[0]);
   })
  .catch(err=>{return err});
}


exports.getUserDetail = (input,data) =>{
  console.log(input);
  const sql='SELECT * from users where id_user='+input;
  console.log(sql);
  db.execute(sql)
   .then(res=>{
     data(res[0]);
   })
  .catch(err=>{return err});
}