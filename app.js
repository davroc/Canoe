const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const db=require('./util/db');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// db.execute('SELECT * from bios_sous_famille')
// .then(res=>{console.log(res[0])})
// .catch(err=>{console.log(err)});



app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
});

app.listen(3000);