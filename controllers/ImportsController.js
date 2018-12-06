const ImportModel = require('../models/M_Import');
const fs = require('fs');

exports.Import=(p) =>
{
  console.log(p);
  ImportModel.truncate_daily_data(truncate=>{
    console.log(truncate);
    //if (truncate.affected)
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