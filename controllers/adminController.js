exports.getUsersList =  (req, res, next) => {
  res.render('admin/userslist', { pageTitle: 'Utilisateurs', path: '/admin/userslist' });
};

exports.addUser = (req, res, next) => {
  res.render('admin/adduser', { pageTitle: 'Ajouter un utilisateur', path: '/admin/adduser' });
}

exports.postNewUser = (req, res, next) => {
  //products.push({ title: req.body.title });
  res.redirect('/');
}