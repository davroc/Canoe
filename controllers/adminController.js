const AdminModel= require('../models/M_Admin');
//const db=require('../util/db');

exports.getUsersList =  (req, res, next) => {
   AdminModel.getUsersList(liste =>{
    res.render('admin/userslist', { pageTitle: 'Utilisateurs', path: '/admin/userslist',Usr: liste });
  });
};

exports.viewUser =(req,res,next) =>{
  const UserId=req.params.userid;
  //console.log(UserId);
  AdminModel.getUserDetail(UserId,detail =>{
    AdminModel.getListeDroits(listedroits =>{
      res.render('admin/userDetail',{pageTitle:'Informations Utilisateur', path: '/admin/userDetail',user_data: detail,liste_droits:listedroits})
    })
    
  });
};

exports.postEditUser=(req,res,next)=>{
  const editUserData = req.body; 
  AdminModel.updateUser(editUserData,updateduser=>{
    console.log(updateduser.affectedRows);
    if (updateduser[0].affectedRows > 0)
    {
      res.render('notifications/maj_success_modal',{pageTitle:'Succes',returnPath:'/admin/userslist',Message:'L\'utilisateur a été correctement modifié !'})
    }
    else
    {
      res.render('notifications/maj_ko_modal',{pageTitle:'Erreur de mise a jour',returnPath:'/admin/userslist',Message:'L\'utilisateur  n\'a pas pu etre modifié !'})
    }
    
  })
}

exports.deleteUser = (req,res,next) =>{
  const UserId=req.params.userid;
  AdminModel.deleteUser(UserId,deleteuser =>{
    console.log(deleteuser.affectedRows);
    if (deleteuser[0].affectedRows > 0)
    {
      res.render('notifications/maj_success_modal',{pageTitle:'Succes',returnPath:'/admin/userslist',Message:'L\'utilisateur a été correctement supprimé !'})
    }
    else
    {
      res.render('notifications/maj_ko_modal',{pageTitle:'Erreur de mise a jour',returnPath:'/admin/userslist',Message:'L\'utilisateur  n\'a pas pu etre supprimé !'})
    }
  })
}


exports.addUser = (req, res, next) => {
  res.render('admin/adduser', { pageTitle: 'Ajouter un utilisateur', path: '/admin/adduser' });
};

exports.postNewUser = (req, res, next) => {
  //products.push({ title: req.body.title });
  res.redirect('/');
};