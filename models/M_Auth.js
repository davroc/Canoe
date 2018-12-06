const bcrypt = require ('bcryptjs');
const db=require('../util/db');

exports.checkUser = (login, isvalidUser)=>{
  //console.log(login,'SELECT login_user,pwd_user,admin,droits_user from users where login_user="'+ login +'" and is_active=1');
  db.execute('SELECT login_user,pwd_user,admin,droits_user from users where login_user="'+ login +'" and is_active=1')
  .then(res=>{
    //console.log(res[0]);
    isvalidUser(res[0]);
  })
 .catch(err=>{return err});
}


exports.check_mailIsUnknown =(mail,isUniq)=>{
  console.log(mail);
  db.execute('SELECT * from users where mail_user="'+ mail +'"')
  .then(res=>{
    isUniq(res[0]);
  })
 .catch(err=>{console.log(err) });
}

exports.createUser = (user_data,isCreated)=>{
 
  bcrypt.hash(user_data.pwd_user,12).then(hashedPwd=>{

    const nom= user_data.nom_user;
    const prenom= user_data.prenom_user;
    const login= user_data.login_user;
    const mail= user_data.mail_user;
    sql='INSERT  INTO  users (login_user,nom_user,prenom_user,pwd_user,mail_user,droits_user,admin,is_active ) VALUES ("'+ login +'","'+ nom +'","'+ prenom +'","'+ hashedPwd +'","'+ mail +'",2,0,0)';
    db.execute(sql)
    .then(res=>{
      isCreated(res[0]);
    })
    .catch(err=>{console.log(err)});
  });

 
}