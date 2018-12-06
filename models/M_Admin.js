const db=require('../util/db');

exports.getUsersList = liste =>{  
  db.execute('SELECT a.login_user,a.nom_user,a.prenom_user,a.mail_user,a.droits_user,b.descr_droit as "lib_droit_user" ,a.admin,a.is_active  from users a join conf_bios_droits b on a.droits_user=b.id_droit')
   .then(res=>{
     liste(res[0]);
   })
  .catch(err=>{return err});
}


exports.getUserDetail = (input,data) =>{
  const sql='SELECT * from users where login_user="'+ input + '"';
  //console.log(sql);
  db.execute(sql)
   .then(res=>{
     data(res[0]);
   })
  .catch(err=>{return err});
}

exports.updateUser = (updatedUserData,updatedUser) =>{
  const user_id= updatedUserData.user_id;
  const user_login=updatedUserData.edit_user_login;
  const user_name=updatedUserData.edit_user_nom;
  const user_pnom=updatedUserData.edit_user_pnom;
  const user_mail=updatedUserData.edit_user_email;
  const user_droits=updatedUserData.edit_user_droits;
  const user_admin=updatedUserData.edit_user_admin;
  const user_actif=updatedUserData.edit_user_actif;

  const sql='update users set login_user= "'+ user_login +'" , nom_user = "'+ user_name +'" ,prenom_user = "'+ user_pnom +'" ,mail_user = "'+ user_mail +'" ,droits_user = "'+ user_droits +'" ,admin = "'+ user_admin +'" ,is_active = "'+ user_actif +'" WHERE id_user = '+ user_id +''
  console.log(sql);
  db.execute(sql)
   .then(res=>{
    updatedUser(res);
   })
  .catch(err=>{return err});  
}

exports.deleteUser=(userid,deleteduser)=>{
  const sql='delete from users where login_user="'+ userid + '"';
  console.log(sql);
  db.execute(sql)
   .then(res=>{
    deleteduser(res);
   })
  .catch(err=>{return err});
}
exports.getListeDroits = (data) =>{
  const sql='SELECT * from conf_bios_droits';
  db.execute(sql)
   .then(res=>{
     data(res[0]);
   })
  .catch(err=>{return err});
}