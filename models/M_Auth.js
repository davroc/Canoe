const db=require('../util/db');

exports.checkUser = (req, isvalidUser)=>{
  const login=req.body.login_user;
  const pwd=req.body.pwd_user;
  db.execute('SELECT * from users where login_user="'+ login +'" AND pwd_user = "'+ pwd +'"')
  .then(res=>{
    isvalidUser(res[0]);
  })
 .catch(err=>{return err});

  

}