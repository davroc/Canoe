const ImportModel = require('../models/M_Import');
const fs = require('fs');

exports.Import=(p) =>
{
  console.log(p);

  var temp_date = p.substring(p.length -12).split('.')[0];
  var date_fichier = temp_date.substring(5,4)+'-'+temp_date.substring(3,2)+'-'+temp_date.substring(1,2);
  console.log(date_fichier);
  ImportModel.truncate_daily_data(truncate=>{
    console.log(truncate);
    ImportModel.loadData(p,dataloaded=>{
      //console.log(dataloaded);
      if(dataloaded[0].affectedRows >0)
      {
        console.log('Succes de l import du fichier : ',dataloaded);
        fs.unlinkSync(p);
        ImportModel.CreateCumulsJour(cumuls =>{
          if (cumuls[0].affectedRows > 0 )
          {
            console.log('Succes de la creation des cumuls jours : ',cumuls);
            ImportModel.checkNewCodes(newCodes=>{
              console.log('Ajout de nouveaux ErrorCodes : ',newCodes[0]);
              console.log('fin de l import jour');
            })

          }
        })
      }
      console.log(dataloaded);
    })
  })
}