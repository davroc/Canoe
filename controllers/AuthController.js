const AuthModel= require('../models/M_Auth');
const bcrypt = require ('bcryptjs');
const {validationResult} = require('express-validator/check')
const Mailer=require('nodemailer');
const mailer_conf = {
  host:'mail-0092.sfr.com',
  port:'25',
  debug:true
};
const transporter = Mailer.createTransport(mailer_conf);

exports.getLogin=(req,res,next)=>{
  res.render('auth/login',{path:'auth/login',pageTitle:'Login'});
}

exports.postLogin=(req,res,next)=>{
  //console.log('posting creds');
  const l=req.body.login_user;
  const p =req.body.pwd_user;
  AuthModel.checkUser(l,auth=>{
    if(auth.length > 0)
    {
      //console.log(auth[0].pwd_user);
      bcrypt.compare(p,auth[0].pwd_user).then(doMatch =>{
        if(doMatch)
        {
          console.log('ok');
          req.session.isAuthenticated=true;
          req.session.login=auth[0].login_user;
          req.session.isAdmin = (auth[0].admin== 1 ? true : false) ;
          req.session.isParam = (auth[0].droits_user == 1 ? true : false);
          //console.log(auth[0].isAdmin);
          req.session.save((err)=>{
            console.log(err);
            res.redirect('/');
          });
        }
        else
        {
          console.log('mdp ne correspond pas');
          res.redirect('/auth/login');
        }    
      }).catch(err=>{console.log(err)});
    }
    else
    {
      console.log('le login n a pas ete trouvé')
      res.redirect('/auth/login');
    }
    });
  
}

exports.postLogout =(req,res,next)=>
{
  req.session.destroy((err)=>{
    console.log(err);
    res.redirect('/auth/login');
  });
};

exports.createAccountForm = (req,res,next)=>
{
  res.render('auth/createAccountForm',{path:'auth/createAccountForm',pageTitle:'Creation de compte'});
}

exports.createAccount=(req,res,next)=>
{
 const data=req.body;
 const mail=req.body.mail_user;
 const errors = validationResult(req);
 if(!errors.isEmpty())
 {
   return res.status(422).render('auth/createAccountForm',{path:'auth/createAccountForm',pageTitle:'Creation de compte',errors:errors.array()});
 }
 //console.log(mail);
  AuthModel.check_mailIsUnknown(mail,isuniq =>{
    //console.log(isuniq);
    if(isuniq.length > 0 )
    {
      return res.redirect('/auth/createAccount');
    }
    AuthModel.createUser(data,userCreated =>{
      if (userCreated.affectedRows > 0 )
      {
        //mail de confirmation
        var message = {
          from: 'Canoe@sfr.com',
          to: mail,
          subject: 'CANOE - Creation de compte utilisateur',
          html: 'Bonjour,<br>Votre compte utilisateur Canoe a bien été crée mais n\' a pas encore été activé.<br><br>Rappel de vos informations de connexion: <br>Login:'+ data.login_user +'<br>Mot de passe : '+ data.pwd_user +'<br><br><br>Cordialement'
        };
        transporter.sendMail(message).then(msg=>{
            //console.log(msg);
        }).catch(err =>{console.log('Impossible d envoyer le mail',err)});
        res.redirect('/');
      }
    })

  })
}

exports.changePwdForm=(req,res,next)=>{
  res.render('auth/changePwdForm',{path:'auth/changePwdForm',pageTitle:'Modifier mon mdp'});
}