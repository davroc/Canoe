const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
//const session = require ('express-session');

//const OraDB=require('oracledb');
//const dbBRM=require('./util/db_brm');
// OraDB.getConnection({
//     user: 'u122495',
//     password:'T0matito21',
//     connectString:'pcw00002scan0.services.prod/PBRM01P_CLI02'
// },function(err, connex){
// if (err){
//     console.log(err.message);
//     return;
// }
// connection.execute(
//     `select * from pin.uniqueness_t where account_obj_id0=(
//         select distinct account_obj_id0 from pin.uniqueness_t where login='33609187474');`,
//     function(err, result) {
//       if (err) {
//         console.error(err.message);
//         doRelease(connection);
//         return;
//       }
//       console.log(result.rows);
//       doRelease(connection);
//     });
// });



const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const paramRoutes = require('./routes/app_params');
const analyseRoutes = require('./routes/analyse');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes); 
app.use('/params', paramRoutes);
app.use('/analyse',analyseRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
});

app.listen(3000);