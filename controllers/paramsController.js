exports.getCliList = (req, res, next) => {

  res.render('params/clis', { pageTitle: 'Clis', path: '/params/clis' });
}

exports.editCli = (req, res, next) => {

  res.render('params/cli_edit', { pageTitle: 'Edition de ticket', path: '/params/edit_cli' });
}

exports.addCli =  (req, res, next) => {

  res.render('params/add_cli', { pageTitle: 'Ajout de ticket', path: '/params/add_cli' });
}

// familles et sous familles

exports.getFamilles = (req, res, next) => {
  res.render('params/families_main', { pageTitle: 'Familles de Codes', path: '/params/families_main' });
}