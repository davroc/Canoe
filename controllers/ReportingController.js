const fs = require('fs');
const path = require('path');
const reportingModel = require('../models/M_Reporting');
const ParamModel = require('../models/M_Params');
const Mailer = require ('nodemailer');

let transporter = Mailer.createTransport( {
  host: 'mail-0092.sfr.com',
  port: 25,
  secure: false, // upgrade later with STARTTLS

})


//transporter.sendMail(message);

function createXLReport(today,top,derive,rupture)
{
  var mapObj = {
    '<table>':"",
    '</table>':"",
    '<th>':"",
    '<td>':"",
    '<tr>':"",
    '<thead>':"",
    '</thead>':"",
    '<tbody>':"",
    '</tbody>':"",
    '</td>':"\t",
    '</th>':"\t",
    '</tr>':"\n",
    };
 var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

headerTop = "Top:" + "\n";

 translatedTop = top.replace(re, function(matched){
  return mapObj[matched.toLowerCase()];
});

headerRupture =  "\n\n" +"Rupture:" + "\n";
if (derive)
{
 translatedDerive = derive.replace(re, function(matched){
  return mapObj[matched.toLowerCase()];
});
}
else
{
  translatedDerive = "\n";
}

headerDerive = "\n\n" +"Derive:" + "\n";
if(rupture)
{  
  translatedRupture = rupture.replace(re, function(matched){
    return mapObj[matched.toLowerCase()];
  });
}
else
{
  translatedRupture="\n";
}
 var DailyAlerts = headerTop + translatedTop + headerRupture + translatedRupture + headerDerive + translatedDerive;
 var writeStream = fs.createWriteStream(path.join(__dirname,'../','reportings','jour','CANOE_AlerteQuotidienne_'+ today.toLocaleDateString() +'.xls'));
  // console.log(top);
  // console.log(translatedTop);
  // console.log(DailyAlerts);

 writeStream.write(DailyAlerts);
 writeStream.close();
}

function createTopTable(headers,weeklyCodedata)
{
  let TopTableHeader=`<table><thead><tr><th>Code </th>`;

    const h=Object.values(headers[0])
   // console.log(h);                                      
      for (var i in h)
      {
        TopTableHeader += `<th>${h[i]}</th>`;
      }                
      TopTableHeader += '<th>Stock</th><th>Moyenne</th></tr></thead>'
     // console.log(TopTableHeader);

    let TopTableBody=`<tbody>`;
      for (var Codedata of weeklyCodedata)
      {
        TopTableBody +=`<tr>`;
          const wkdata=Object.values(Codedata)
          for (var data in wkdata)
          {
            TopTableBody +=`<td>${wkdata[data]}</td>`;
          }
          TopTableBody +=`</tr>`;
      }                 
      TopTableBody +=`</table>`; 

      return TopTableHeader + TopTableBody;
}

function createRuptureTable(headers,weeklyCodedata)
{
  let RuptureTableHeader=`<table><thead><tr><th>Code </th>`;

    const h=Object.values(headers[0])
    //console.log(h);                                      
      for (var i in h)
      {
        RuptureTableHeader += `<th>${h[i]}</th>`;
      }                
      RuptureTableHeader += '<th>Moyenne</th><th>Ecart-Type</th></tr></thead>'
     // console.log(RuptureTableHeader);

    let RuptureTableBody=`<tbody>`;
      for (var Codedata of weeklyCodedata)
      {
        RuptureTableBody +=`<tr>`;
          const wkdata=Object.values(Codedata)
          RuptureTableBody +=`<td>${wkdata[0]}</td>`;
          RuptureTableBody +=`<td>${wkdata[4]}</td>`;
          RuptureTableBody +=`<td>${wkdata[5]}</td>`;
          RuptureTableBody +=`<td>${wkdata[6]}</td>`;
          RuptureTableBody +=`<td>${wkdata[7]}</td>`;
          RuptureTableBody +=`<td>${wkdata[8]}</td>`;
          RuptureTableBody +=`<td>${wkdata[9]}</td>`;
          RuptureTableBody +=`<td>${wkdata[10]}</td>`;
          RuptureTableBody +=`<td>${wkdata[1]}</td>`;
          RuptureTableBody +=`<td>${wkdata[2]}</td>`;
          // for (var data in wkdata)
          // {
          //   RuptureTableBody +=`<td>${wkdata[data]}</td>`;
          // }
          RuptureTableBody +=`</tr>`;
      }                 
      RuptureTableBody +=`</table>`; 

      return RuptureTableHeader + RuptureTableBody;
}

function createDeriveTable(headers,Derive)
{
  let DeriveTableHeader=`<table><thead><tr><th>Code </th>`;

    const h=Object.values(headers[0])
    //console.log(h);                                      
      for (var i in h)
      {
        DeriveTableHeader += `<th>${h[i]}</th>`;
      }
      DeriveTableHeader += `<th>${Derive[0].dt_comparaison}</th>`;                
      DeriveTableHeader += '<th>Derive</th></tr></thead>'
     // console.log(TopTableHeader);

    let DeriveTableBody=`<tbody>`;
      for (var Codedata of Derive)
      {
        DeriveTableBody +=`<tr>`;
          const wkdata=Object.values(Codedata)
          DeriveTableBody +=`<td>${wkdata[0]}</td>`;
          DeriveTableBody +=`<td>${wkdata[5]}</td>`;
          DeriveTableBody +=`<td>${wkdata[6]}</td>`;
          DeriveTableBody +=`<td>${wkdata[7]}</td>`;
          DeriveTableBody +=`<td>${wkdata[8]}</td>`;
          DeriveTableBody +=`<td>${wkdata[9]}</td>`;
          DeriveTableBody +=`<td>${wkdata[10]}</td>`;
          DeriveTableBody +=`<td>${wkdata[11]}</td>`;
          DeriveTableBody +=`<td>${wkdata[3]}</td>`;
          DeriveTableBody +=`<td>${wkdata[4]}</td>`;
          // for (var data in wkdata)
          // {
          //   TopTableBody +=`<td>${wkdata[data]}</td>`;
          // }
          DeriveTableBody +=`</tr>`;
      }                 
      DeriveTableBody +=`</table>`; 
      console.log(DeriveTableBody);
      return DeriveTableHeader + DeriveTableBody;
}

exports.dailyAlarmReporting =(req,res,next)=>{
  //console.log(process.cwd());
  ParamModel.getMaxDataInsertionDate(maxdt =>{
    ParamModel.getParamsList(params=>{  
      const profondeur=params.filter(param=>param.param =='reporting_prof_histo')[0].value; 
      const seuil_rupture=params.filter(param=>param.param =='seuil_min_rupture')[0].value; 
      const profondeur_rupture=params.filter(param=>param.param =='profondeur_rupture')[0].value; 
      const ecart_type_rupture=params.filter(param=>param.param =='nb_ecart_type_rupture')[0].value; 
      const profondeur_derive=params.filter(param=>param.param =='profondeur_derive')[0].value; 
      const pourcentage_min_derive=params.filter(param=>param.param =='pourcentage_min_derive')[0].value; 
      const dest=params.filter(param=>param.param =='liste_diff_reporting_std')[0].value; 
      const dailyMailTemplate = params.filter(param=>param.param =='template_reporting_jour')[0].value; 

      reportingModel.getCodesData4pastweek(maxdt,profondeur,weeklyCodedata =>{

        reportingModel.getAlarmesDaysHeaders(maxdt,headers =>{

            reportingModel.getRupture(maxdt,params,rupture =>{
              if (rupture.length > 0 )
              {
                for (var r of rupture)
                {
                  reportingModel.insertAlarm(r.ERR_CODE,'Rupture',r.ecart,maxdt[0].dt_insertion,insertedAlarm =>{})
                  for (var w of weeklyCodedata)
                  {
                    if (w.ERR_CODE == r.ERR_CODE)
                    {
                    Object.assign(r,w);
                    }
                  }
                }
                RuptureHTMLTable=createRuptureTable(headers,rupture);
                //console.log(RuptureHTMLTable);
              }
              else
              {
                console.log('pas de rupture');
                RuptureHTMLTable='';
              }

              reportingModel.getDerive(maxdt,params,derive =>{
                if (derive.length > 0 )
                {             
                  for (var d of derive)
                  {
                    reportingModel.insertAlarm(d.ERR_CODE,'Dérive',d.derive,maxdt[0].dt_insertion,insertedAlarm =>{

                    })
                    for (var w of weeklyCodedata)
                    {
                      if (w.ERR_CODE == d.ERR_CODE)
                      {
                      Object.assign(d,w);
                      }
                    }
                  }
                  DeriveHTMLTable=createDeriveTable(headers,derive);
                  //console.log(DeriveHTMLTable);                  
                }
                else
                {
                  console.log('pas de derive');
                   DeriveHTMLTable='';                  
                }                

                // creation du tableau HTML du TOP pour reporting mail
                const TopHTMLTable=createTopTable(headers,weeklyCodedata)

               //creation de la PJ  Xl basée sur les tableaux HTML 
               var today = new Date();
               createXLReport(today,TopHTMLTable,DeriveHTMLTable,RuptureHTMLTable);

               var htmlTable = TopHTMLTable + RuptureHTMLTable + DeriveHTMLTable
               var pj=path.join(__dirname,'../','reportings','jour','CANOE_AlerteQuotidienne_'+ today.toLocaleDateString() +'.xls').replace(/\\/g,"/");
               
               console.log(pj);
               let message = {
                        from: 'supportTest@sfr.com',
                        to: dest,
                        subject: 'DailyReport Canoe',
                        html: dailyMailTemplate + htmlTable,
                        attachements:[
                          {
                            filename:'CANOE_AlerteQuotidienne_'+ today.toLocaleDateString() +'.xls',
                            content:fs.createReadStream(pj)
                          }
                        ]
                      };
              
              transporter.sendMail(message,(err,info)=>{
                if (err)
                {
                  console.log(err);
                }
              });
                
                });
              });
            });          
          }) ;
        });
      });
    };  
