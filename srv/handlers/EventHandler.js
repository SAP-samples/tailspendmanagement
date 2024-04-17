"use strict";

//libraries
const cds = require("@sap/cds");
const {v4: uuidv4} = require('uuid');
const cloudSDK = require("@sap-cloud-sdk/core");
const { TailSpendSuppliers , AutoRFPRules, PurchaseRequisition  , SupplierOrganization2Users, RFPItems, RFPEvent , RFPHandle, Plant2ShipToAddress, Country2Region, MaterialGroup2Commodity } = cds.entities('com.sap.tailspend');
const AribaHandler = require('../util/AribaHandler');
const DatalakeHandler = require('../handlers/DatalakeHandler');


async function doUpsertRequisition(req){
  debugger;
  const entities = req.data.entities;
  const tx = cds.transaction(req);

  const promises = [];

  for (const entity of entities )
  {
  const keyFilter = [];
    for (const key in entity) {
      if (key.startsWith('PRID')) {
        keyFilter.push(`${key} = '${entity[key]}'`);
      }
      if (key.startsWith('PRITEM')) {
          keyFilter.push(`${key} = '${entity[key]}'`);
        }
    }
    const query = `SELECT * FROM com.sap.tailspend.PurchaseRequisition WHERE ${keyFilter.join(' AND ')}`;
    const selectq = await tx.run(query)

    if ( selectq.length === 0)
    {
      try {
      await tx.run(INSERT.into("com.sap.tailspend.PurchaseRequisition").entries(entity));
      console.log('Successfully Inserted data into PR DB Schema');
      }
      catch (error) {
        console.log(`Error inserting Purchase Requisition ${error.message}`);
      }
    }
    else
    {
      try {
     
      await  tx.run(UPDATE("com.sap.tailspend.PurchaseRequisition").set(entity).where(keyFilter.join(' AND ')));
      console.log('Successfully Updated data into PR DB Schema');
      }
      catch(error)
      {
        console.log(`Error Updating Purchase Requisition ${error.message}`);
      }
    }
    

    }

  await Promise.all(promises);
  
}

async function doInsertafterFormat(decodedString){
  
  debugger;
  // const entities = req.data.entities;
  var status;
  const JSONEntity = JSON.parse(decodedString);
  if (JSONEntity.entities.length == 0 )
  { status = "Success"; }

  for (const entity of JSONEntity.entities )
  {

    const selectq = await SELECT.from("com.sap.tailspend.PurchaseRequisition").where({PRID : entity.PRID, PRITEM: entity.PRITEM }); 

    if ( selectq.length === 0)
    {
      try {
      await INSERT.into("com.sap.tailspend.PurchaseRequisition").entries(entity);
      console.log('Successfully Inserted data into PR DB Schema');
      status = "Success";
      }
      catch (error) {
        console.log(`Error inserting Purchase Requisition ${error.message}`);
        status = "Error";
      }
    }
    else
    {
      try {
     
      await UPDATE("com.sap.tailspend.PurchaseRequisition").set(entity).where({PRID : entity.PRID, PRITEM: entity.PRITEM });
      console.log('Successfully Updated data into PR DB Schema');
      status = "Success";
      }
      catch(error)
      {
        console.log(`Error Updating Purchase Requisition ${error.message}`);
        status = "Error";
      }
    }

}

  return status;
}

async function doFormatRequisition(req){
  debugger;
  const reqbase64 = req.data.reqdata;
  var newreqbody = `{"entities":[`;
  const decodedString = Buffer.from(reqbase64, 'base64').toString('utf8');
  
  const parsedJson = JSON.parse(decodedString);

  let prDataO = parsedJson.PRDATASet.PRDATA;

  if (!Array.isArray(prDataO))
  {
    prDataO = [prDataO];
  }


const currentDate = new Date();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 to get 1-indexed month and pad with 0 if single digit
const day = String(currentDate.getDate()).padStart(2, '0');
const year = currentDate.getFullYear();

const formattedDate = `${month}-${day}-${year}`;

  for (let i = 0; i < prDataO.length; i++) {
    // Check if the Requisition has Event Already Created if so dont update.... 
      ///** Make Sure to check the PR --> RFP Handle . If Event handle Created.. Dont update the PR Table. */

    const EventPRs = await SELECT.from("com.sap.tailspend.RFPHandle").where({PRID : `${prDataO[i].Prid}` , PRITEM:`${prDataO[i].Pritemno}`}); 
    if ( EventPRs.length !== 0 )
    {
      continue;
    }
    newreqbody = newreqbody + `{`;
    // console.log(`REQID ${prDataO[i].Prid}, PR Description: ${prDataO[i].Workspacetitle}`);
   
    newreqbody = newreqbody + `"PRID": "${prDataO[i].Prid}",`;
    newreqbody = newreqbody + `"PRITEM": "${prDataO[i].Pritemno}",`;
    newreqbody = newreqbody + `"BusinessSystem": "HE4CLNT400",`;
    newreqbody = newreqbody + `"PRTitle": "${prDataO[i].Workspacetitle}",`;
    newreqbody = newreqbody + `"ItemDesc": "${prDataO[i].Itemdescription}",`;
    newreqbody = newreqbody + `"CreatedDate": "${formattedDate}",`;
    newreqbody = newreqbody + `"CategoryID": "${prDataO[i].Commodity}",`;
    newreqbody = newreqbody + `"PlantID": "${prDataO[i].Plant}",`;

    const formattedPrice = formatPrice(prDataO[i].Price);
    console.log(formattedPrice); 

    newreqbody = newreqbody + `"UnitPrice": "${formattedPrice}",`;

    const cextendedprice = compactString(prDataO[i].Extendedprice);
    newreqbody = newreqbody + `"ExtendedPrice": "${cextendedprice}",`;

    newreqbody = newreqbody + `"Currency": "${prDataO[i].Currency}",`;

    const cquantity = compactString(prDataO[i].Quantity);
    newreqbody = newreqbody + `"Quantity": "${cquantity}",`;

    newreqbody = newreqbody + `"UOM": "${prDataO[i].Quantityuom}",`;
    newreqbody = newreqbody + `"PurchaseOrg": "${prDataO[i].Purchaseorg}",`;
    newreqbody = newreqbody + `"CompanyCode": "${prDataO[i].Companycode}",`;
    newreqbody = newreqbody + `"PurchasingGroup": "${prDataO[i].Purchasinggroup}",`;
    newreqbody = newreqbody + `"ShipTo": "${prDataO[i].Plant}",`;
    newreqbody = newreqbody + `"MaterialCode": "${prDataO[i].Materialcode}",`;
    newreqbody = newreqbody + `"SupplierID": "${prDataO[i].Supplierno}",`;
    newreqbody = newreqbody + `"SupplierName": "${prDataO[i].Organizationname}",`;
    newreqbody = newreqbody + `"Status": "Sourcing Operations – Review"`;

    if ( i == prDataO.length-1 )
    {
      newreqbody = newreqbody + `}`; //final entry
    }
    else
    {
      newreqbody = newreqbody + `},`;
    }
    
  }
  newreqbody = newreqbody + `]}`;

  const buffer = Buffer.from(newreqbody);



  var upsertoper = await doInsertafterFormat(newreqbody);
  if ( upsertoper == 'Success' )
  {
    return "Success";
  }
  else
  {
    return "Error";
  }
 
}

const compactString = (str) => {
  return str.replace(/\s+/g, ' ').trim();
};

function formatPrice(priceStr) {
  // Remove all non-numeric characters except the decimal point
  const cleanedPrice = priceStr.replace(/[^\d.]+/g, '');

  const priceNumber = parseFloat(cleanedPrice);
  const truncatedPrice = Math.floor(priceNumber * 100) / 100;
  return truncatedPrice.toFixed(2);
}

async function doUpsertRFPInternal(req){
    const reqjson = JSON.parse(req);
    const entities = reqjson.entities;
    const tx = cds.transaction(entities);

    for (const entity of entities )
    {

        let result = await SELECT.one.from("com.sap.tailspend.RFPEvent").where({DOCID : entity.DOCID});

        if (result != null)    
        {
            if (result.length === 0) 
            {
            await INSERT.into("com.sap.tailspend.RFPEvent").entries(entity);
            } else 
            {
            await UPDATE("com.sap.tailspend.RFPEvent").set(entity).where(DOCID = entity.DOCID);
            }
        }
        else
        {
           await INSERT.into("com.sap.tailspend.RFPEvent").entries(entity);
        }
    }
    return "Success";

  }


  async function doUpsertRFPItemInternal(req){
    const reqjson = JSON.parse(req);
    const entities = reqjson.entities;
    const tx = cds.transaction(entities);
    // debugger;
    for (const entity of entities )
    {

        let result = await SELECT.one.from("com.sap.tailspend.RFPItems").where({parent_DOCID : entity.parent_DOCID, ItemID: entity.ItemID});

        if (result != null)    
        {
            if (result.length === 0) 
            {
            await INSERT.into("com.sap.tailspend.RFPItems").entries(entity);
            } else 
            {
            await UPDATE("com.sap.tailspend.RFPItems").set(entity).where({parent_DOCID : entity.parent_DOCID, ItemID: entity.ItemID});
            }
        }
        else
        {
           await INSERT.into("com.sap.tailspend.RFPItems").entries(entity);
        }
    }
    return "Success";

  }


async function doUpsertRFP(req){
    debugger;
    const entities = req.data.entities;
    const tx = cds.transaction(req);
  
    const promises = [];
    entities.forEach(entity => {

        promises.push(tx.run( SELECT.one.from("com.sap.tailspend.RFPEvent").where({DOCID : entity.DOCID})).then(result => {
        if (result != null)    
        {
            if (result.length === 0) {
            tx.run(INSERT.into("com.sap.tailspend.RFPEvent").entries(entity));
            } else {
            tx.run(UPDATE("com.sap.tailspend.RFPEvent").set(entity).where(DOCID = entity.DOCID));
            }
        }
        else
        {
            tx.run(INSERT.into("com.sap.tailspend.RFPEvent").entries(entity));
        }
        }));

    });

    await Promise.all(promises);
    
}

async function docreateEventfromPR(req){
  debugger;
  let prlist;

  const prcreatedevents = {
    "PRID": "",
    "ApprovalHandler": ""
  };

  let RFPRules = await SELECT.one.from("com.sap.tailspend.AutoRFPRules");

  if ( RFPRules == null )
  {
    console.log("Auto Configuration Rules not set. Please configure first !!!");
    return "Auto Configuration Rules not set. Please configure first !!!"
  }

  if ( RFPRules.EventCreationOption == 'One Event per Requisition')
  {

     let createEventperPRmsg = await createEventperPR(req);
     return createEventperPRmsg;
     
     //Get PR's for the RFP Handle If available and then return PR and their handle's.

    // Loop through createEventperPRmsg : GRAM

    // for ( let i = 0;i<createEventperPRmsg.length; i++)
    // {
    //   console.log(`PR Numbers to update back: ${createEventperPRmsg[i]}`);
    //   const PRRFPHandleData =  await SELECT.from("com.sap.tailspend.RFPHandle").where({PRID : `${createEventperPRmsg[i]}`});  

    // }
  //   debugger;
  //   if (createEventperPRmsg)
  //   {
  //       const transformed = await Promise.all(
  //         createEventperPRmsg.map(async prhandle => {
  //             const handle = await getHandleForPRNumber(prhandle);
  //             return {
  //                 PRNumber: handle.PRID || '',
  //                 Handle: handle.ApprovalHandler || '' // Use '' if Handle not found
  //             };
  //         })
  //     );
  //     prlist = JSON.stringify(transformed);
  //   }

  // return prlist;
    
  }
  else
  {
    let createEventperRegionCommmsg = await createEventperRegionComm();
    return createEventperRegionCommmsg
  }

}

async function getHandleForPRNumber(RFPID) {
  debugger;
  let PRRFPHandle;
  const RFPHandler =  await SELECT.from("com.sap.tailspend.RFPHandle").where({RFPHandleID : `${RFPID}`});  
  if (RFPHandler.length != 0 )
  {
     PRRFPHandle =  await SELECT.from("com.sap.tailspend.PRApprovalHandler").where({PRID : `${RFPHandler[0].PRID}`});  //if there are multiple items just get the first item and PR number we will deal with itembased pr splitting later..
  }
  return PRRFPHandle ? PRRFPHandle[0] : null;
}

async function createEventperPR(req) {
// Read Requisition that is Sourcing Operations - Review
const AllPRs = await SELECT.from("com.sap.tailspend.PurchaseRequisition").where({Status : 'Sourcing Operations – Review' }); 

// Group by PR No and PR ID
const batchPRs = {}

AllPRs.forEach(element => {
const prid = element.PRID;

    if(prid in batchPRs)
    {
      batchPRs[prid].push(element)
    }
    else
    {
        batchPRs[prid] = [element]
    }
});

// Update "com.sap.tailspend.RFPHandle" with UUID and PRNo and PRID in groups.. 
// debugger;
for(const key of Object.keys(batchPRs))
{

  const val = batchPRs[key]
  console.log(`${key}`)
  const RFPhandleID = uuidv4();
  console.log(`RFP Handle ${RFPhandleID}`);

if (Array.isArray(val)) {
      for (const subObj of val)
      {

// Later..Use Select Query and check if there is PR ID and ITem already there.. if not skip insert.. otherwise it will create duplicate  

      const PRRFPHandle =  await SELECT.from("com.sap.tailspend.RFPHandle").where({PRID : `${subObj.PRID}` , PRITEM : `${subObj.PRITEM}`});  
      if ( PRRFPHandle.length != 0)
      {
        continue; // move to next record.
      }

        await cds.transaction(req).run(INSERT.into("com.sap.tailspend.RFPHandle").entries({
          RFPHandleID: RFPhandleID,
          PRID: key,
          PRITEM: subObj.PRITEM,
          RFPTitle: `RFP ${subObj.PRTitle}`
        }));

      }
    }
}

// Object.keys(batchPRs).forEach(key => {
//   var RFPHandleEntries = [];
//   const val = batchPRs[key]
//   console.log(`${key}`)
//   const RFPhandleID = uuidv4();
//   console.log(`RFP Handle ${RFPhandleID}`);

//   // RFPHandleEntries.RFPHandleID = RFPhandleID;
//   // RFPHandleEntries.PRID = key;

// if (Array.isArray(val)) {
//   val.forEach(subObj => {
//     cds.transaction(req).run(INSERT.into("com.sap.tailspend.RFPHandle").entries({
//       RFPHandleID: RFPhandleID,
//       PRID: key,
//       PRITEM: subObj.PRITEM,
//       RFPTitle: `RFP ${subObj.PRTitle}`
//     }));

//      })
//     }
// })


// Provide the RFP Handle Data in JSON format in encoded format back to CPI.. 

// await waitaSec("Wait a sec - RFP Event Item Added");

let eventprcreatemsg = await createEventinAribaperPR();

return eventprcreatemsg; //return list of PR's processed.



}

async function createEventinAribaperPR(req){
  //loop at all RFP Handle PR and then start calling Ariba Handler
   debugger;
  let response;
  let DocumentID;
  let RFPHandleArray = [];
  let lv_status = "";

  const itemtemplate = {
    "title": "",
    "itemType": 4,            
    "terms": [ {
      "title": "Price",
      "historicValueProperty": 0,
      "reserverValueProperty": 0,
      "value": {
         "moneyValue": {
           "amount": "",
           "currency": ""
           }
       }
    },
    {
    "title": "Quantity",
    "value": {
      "quantityValue": {
        "amount": 0,
        "unitOfMeasureCode": ""
      } }
       }
        ]
  };

  const suppliertemplate = {
    "acceptedSupplierAgreement": 0,
    "contacts": [
      {
        "emailAddress": "",
        "passwordAdapter": "SourcingSupplierUser",
        "uniqueName": ""
      }
    ]
  };
  const PublishTemplate = {
    
      "resourceType": "EVENT",
      "actionName": "PUBLISH",
      "ids": {
          "eventId": ""
      },
    "actionBody": {
      "length": 0,
      "unit": 0,
      "adjustStartTime": true,
      "isFixed": true,
      "plannedPreviewBeginDate": ""
    }
    
  };

  const RulesTemplate = {
  "EventRules":    [
      {
          "id": 19,
          "label": "Can participants place bids during preview period",
          "fieldName": "PreviewPeriodType",
          "valueType": 3,
          "ruleValue": {
              "stringValue": "1"
          }
      },
      {
          "id": 98,
          "label": "Require participant to give a reason for declining to bid",
          "fieldName": "DeclineReasonForLotLineItem",
          "valueType": 7,
          "ruleValue": {
              "booleanValue": true
          },
          "property": 0,
          "ruleChoices": null,
          "validity": null
      },
      {
          "id": 126,
          "label": "Allow participants to submit bids by email",
          "fieldName": "AllowEmailBidding",
          "valueType": 7,
          "ruleValue": {
              "booleanValue": true
          },
          "property": 0,
          "ruleChoices": null,
          "validity": null
      },
      {
          "id": 156,
          "label": "Allow suppliers to add items",
          "fieldName": "AllowSupplierToAddItems",
          "valueType": 7,
          "ruleValue": {
              "booleanValue": true
          },
          "property": 1,
          "ruleChoices": null,
          "validity": null
      }
]
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear().toString();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  const currentDateTime = `${month}:${day}:${year} ${hours}:${minutes}:${seconds}`;
  // console.log(currentDateTime);

  const PendingPRs = await SELECT.from("com.sap.tailspend.RFPHandle").where({Processed : null }); 

  const RFPGroups = PendingPRs.reduce((RFPGroups,item)=>{

  const rfpgroup = RFPGroups[item.RFPHandleID] || [];
  rfpgroup.push(item);
  RFPGroups[item.RFPHandleID] = rfpgroup;
  return RFPGroups;

},{});


for (const rfphandleid in RFPGroups){

  // CHECK IF THE RFP Commodities have TAILSPEND suppliers.... IF NOT DONT CREATE EVENT - TBD
  console.log(`************************ START OF PROCESSING RFP HANDLE ID ${rfphandleid} *********************************`);
  //Create Event 
  //debugger;
  const RFPTemp = await SELECT.one.from("com.sap.tailspend.RFPHandle").where({RFPHandleID : `${rfphandleid}` }); 
  let RFPRules = await SELECT.one.from("com.sap.tailspend.AutoRFPRules");
  let RFPTitle = `${RFPTemp.RFPTitle}` + `-` + currentDateTime
  let EventEndDate = getUTCDate(1);
  // let oPayload = { "title": `${RFPTitle}`, "templateDocumentInternalId": `${RFPRules.WorkflowTemplate}`, "eventTypeName": "RFP" , "isTest": "true" };
  let oPayload = { "title": `${RFPTitle}`, "templateDocumentInternalId": `${RFPRules.WorkflowTemplate}`, "eventTypeName": "RFP" , "isTest": "false" , "currency": "USD", "baseLanguage": "en_US", "timingPublishType" : 0, "closeDate": `${EventEndDate}` };
  
  //Call Ariba Handlers to create event
  await waitaSec("Calling Ariba Handler: to create Event");
  response = await AribaHandler.createEvent(oPayload);
  if (response == 'Error')
  {
    continue;
  }
  await waitaSec("Calling Ariba Handler DONE: to create Event");
  

  let RFPEventArray = [];
  const rfpobject = JSON.parse(response); // Response from Create Event

  DocumentID = `${rfpobject.internalId}`;
  //debugger;
  if (DocumentID)
  {
    // Make the RFP Handle as processed as the rfp event is created.
    let rfpprocessupdate = await UPDATE("com.sap.tailspend.RFPHandle").set({Processed:'X'}).where({RFPHandleID : `${rfphandleid}`});

  }

  // make an entry into RFP Event Table
  // console.log(response);


  let RFPEventObject = {
      DOCID: rfpobject.internalId,
      Title: rfpobject.title,
      RFPHandleID: `${rfphandleid}`,
      Description: rfpobject.description,
      BaseLang: rfpobject.baseLanguage,
      eventStateName: rfpobject.eventStateName,
      templateProjectInternalId: rfpobject.templateProjectInternalId,
      templateEventInternalId: rfpobject.templateEventInternalId,
      parentProjectId: rfpobject.parentProjectId,
      webJumperURL: rfpobject.webJumperURL,
      webJumperURLForSupplier: rfpobject.webJumperURLForSupplier,
      createDate: rfpobject.createDate,
      awardApprovalRequired: `${rfpobject.awardApprovalRequired}`,
      Status: "Event Created"
  }
  DocumentID = `${rfpobject.internalId}`
  console.log(`WebJumper URL: ${rfpobject.webJumperURL}`);
  console.log(`Doc ID Created is ${rfpobject.internalId}`);
  RFPEventArray.push(RFPEventObject);
  const entities = { "entities": RFPEventArray } ;
  const rfppayload = JSON.stringify(entities);
  const rfpupsertresponse = await doUpsertRFPInternal(rfppayload);

  await waitaSec("Wait a sec - RFP Event Header Created");


   //Loop through the rfp handle id which has PR's and details to add as line items
   const items = [];
   let RFPItemEventDataArray = [];
    for (const group in RFPGroups[rfphandleid]){
  
      //Add Item ID to RFP Event
      // console.log(`Inside ITEM ID loop: ${RFPGroups[rfphandleid][group].PRID}-${RFPGroups[rfphandleid][group].PRITEM}`);
      //Try to get line items details from Requisition Table and 
      //debugger;
      let prid = RFPGroups[rfphandleid][group].PRID
      let pritem = RFPGroups[rfphandleid][group].PRITEM
      const selectprs = await SELECT.from("com.sap.tailspend.PurchaseRequisition").where({PRID : `${prid}`, PRITEM : `${pritem}`}); 
      for (let i = 0; i < selectprs.length; i ++)
        {

          const item = JSON.parse(JSON.stringify(itemtemplate));
          item.title = selectprs[i].ItemDesc; // set the title property
          item.terms[0].value.moneyValue.amount = selectprs[i].UnitPrice; // set the price amount
          item.terms[0].value.moneyValue.currency = selectprs[i].Currency; // set the price currency
          item.terms[1].value.quantityValue.amount = selectprs[i].Quantity; // set the quantity amount
          item.terms[1].value.quantityValue.unitOfMeasureCode = selectprs[i].UOM; // set the quantity UOM
          items.push(item); // add the item to the items array

          let RFPItemEventData = {
            parent_DOCID : rfpobject.internalId,
            ItemID : "",
            PRID : prid,
            PRItemID : selectprs[i].PRITEM,
            ItemEventTitle : "",
            PRItemTitle : item.title ,
            PRPrice : selectprs[i].UnitPrice,
            PRQuantity : selectprs[i].Quantity,
            PRExtendedPrice : selectprs[i].ExtendedPrice,
            PRCurrency : selectprs[i].Currency,
            PRUOM : selectprs[i].UOM
          }
          RFPItemEventDataArray.push(RFPItemEventData);

        }


      }


/* Add Item to RFP Event */
      if ( items.length == 0 )
      {
        console.log("RFP Item is empty");
        return JSON.stringify("RFP Item is empty"); 
      }

      await waitaSec("Calling Ariba Handler: to create Item for Event");
      let itemaddresult = await AribaHandler.createItemforEvent(items,DocumentID);
      if (itemaddresult == 'Error')
      {
        lv_status = "Error"
        continue;
      }
      let itemresponse = JSON.parse(itemaddresult);
      await waitaSec("Calling Ariba Handler Done: to create Item for Event");
      // Add additional data to the Item and then save it to the database. 

      for (let pritem = 0; pritem< RFPItemEventDataArray.length;pritem++)
      {

       //Match Against Item Description of PR and add additional details.. We dont have any other handle for now..
       let filteredArray = itemresponse.payload.filter(item => item.title  === RFPItemEventDataArray[pritem].PRItemTitle);

       RFPItemEventDataArray[pritem].ItemID = filteredArray[0].itemId;
       RFPItemEventDataArray[pritem].ItemEventTitle = filteredArray[0].title;

      }

      //debugger;

      const itementities = { "entities": RFPItemEventDataArray } ;
      const rfpitempayload = JSON.stringify(itementities);
      const rfpitemupsertresponse = await doUpsertRFPItemInternal(rfpitempayload);

     
     /* ADD SUPPLIER TO THE EVENT */

      await waitaSec("Wait a sec - RFP Event Item Added");

       const WA_RFPHandle = await SELECT.one.from("com.sap.tailspend.RFPHandle").where({RFPHandleID : `${rfphandleid}`});
       const SuppPRID = WA_RFPHandle.PRID;

       const WA_Requisition = await SELECT.one.from("com.sap.tailspend.PurchaseRequisition").where({PRID : `${SuppPRID}`}); // just pick any one line and get the Plant ID
       const plantcode = WA_Requisition.PlantID;

       //debugger;


       const WA_Plant = await SELECT.from("com.sap.tailspend.Plant2ShipToAddress").where({PlantID : `${plantcode}`});
       const Country = WA_Plant[0].Country;

       const WA_Region = await SELECT.one.from("com.sap.tailspend.Country2Region").where({CountryID : `${Country}`});
       if ( WA_Region != null )
       {
        const LVRegionID = WA_Region.RegionID;


        /* ********************ADD SUPPLIER TO THE EVENT**************************/
       // debugger;
        let cmappingavailable = 'X';

        let commoditydata = [];
        let supplieritems = [];

        const IT_TaiSpendsuppliers_Region = await SELECT.from("com.sap.tailspend.TailSpendSuppliers").where({RegionID : `${LVRegionID}` , AutoRFQEligble : `X`});
        if ( IT_TaiSpendsuppliers_Region.length == 0 )
        {
          console.log("No Preferred Tail Spend Mapping available. Manual Supplier assignment required !!!");
          return JSON.stringify("No Preferred Mapping. Manual Supplier Assignment Required!!!");
        }
        const WA_Commodity_PR = await SELECT.from("com.sap.tailspend.PurchaseRequisition").where({PRID : `${SuppPRID}`}); 

          for (let prcommd = 0; prcommd< WA_Commodity_PR.length;prcommd++)
          {
            const newCategoryID = {CategoryID: WA_Commodity_PR[prcommd].CategoryID}
            console.log(newCategoryID.CategoryID);
            const ACMCategoryID = await SELECT.from("com.sap.tailspend.MaterialGroup2Commodity").where({MaterialGroupID: newCategoryID.CategoryID});
            if ( ACMCategoryID.length != 0)
            {
            cmappingavailable = 'X';
            const newACMCatMapping = ACMCategoryID[0].CommodityID;
            commoditydata.push(newACMCatMapping);
            }
          }
         // debugger;

          if ( WA_Commodity_PR != null && cmappingavailable == 'X' )
          {
          
          for (let i=0;i< IT_TaiSpendsuppliers_Region.length;i++)
            {

              if (commoditydata.includes(IT_TaiSpendsuppliers_Region[i].CategoryID) )
                {
                    if ( IT_TaiSpendsuppliers_Region[i].ACMID != '')
                    {
                      let resultsupplieruser = await SELECT.one.from("com.sap.tailspend.SupplierOrganization2Users").where({ExternalOrganizationID : IT_TaiSpendsuppliers_Region[i].ACMID});
                      if ( resultsupplieruser != null )
                      {
                        const supplieritem = JSON.parse(JSON.stringify(suppliertemplate));
                        supplieritem.contacts[0].emailAddress = IT_TaiSpendsuppliers_Region[i].contactemail; 
                        supplieritem.contacts[0].uniqueName = resultsupplieruser.LoginID; 
                        // supplieritem.contacts[0].uniqueName = IT_TaiSpendsuppliers_Region[i].contactemail; 
                        supplieritems.push(supplieritem); 
                      }
                    }

                }

            }
          
            if ( supplieritems.length == 0)
            {
              console.log("No Supplier Organization profile mapping data available for preferred supplier.!!!");
              return JSON.stringify("No Supplier Organization profile mapping data available for preferred supplier.!!!"); 
            }
          
          }



/********************************************** */

      //   const IT_TaiSpendsuppliers = await SELECT.from("com.sap.tailspend.TailSpendSuppliers").where(
      //     {
      //     or: [
      //       {CategoryID: '43211503'},
      //       {CategoryID: '432115'},
      //       { and: [{RegionID : `${RegionID}` , AutoRFQEligble : `X`}]}   
      //   ] 
      // });
      //   const supplieritems = [];
      //   debugger;
        

      //   for (let i=0;i<IT_TaiSpendsuppliers.length;i++)
      //   {
      //     if ( IT_TaiSpendsuppliers[i].contactemail != '')
      //     {
      //       const supplieritem = JSON.parse(JSON.stringify(suppliertemplate));
      //       supplieritem.contacts[0].emailAddress = IT_TaiSpendsuppliers[i].contactemail; 
      //       supplieritem.contacts[0].uniqueName = IT_TaiSpendsuppliers[i].contactemail; 
      //       supplieritems.push(supplieritem); 
      //     }
          
      //   }
        await waitaSec("Calling Ariba Handler: to update Supplier to the Event");
        let SupplierAdd = await AribaHandler.AddSupplier4Event(JSON.stringify(supplieritems),DocumentID );
        if (SupplierAdd == 'Error')
        {
          lv_status="Error";
          continue;
        }
        await waitaSec("Calling Ariba Handler DONE: to update Supplier to the Event");


        let BidEndDay ; let BidBeginday;let PreviewDay;

          if ( SupplierAdd == 'Success')
            {
              await waitaSec("Wait a sec - Supplier Added");
               // Update Event Rules
               let WARFPRules = await SELECT.one.from("com.sap.tailspend.AutoRFPRules");
               let WABidDuration = WARFPRules.BiddingPeriod;
  
                   BidBeginday = getUTCDate(0);
                   console.log(`Begin Date ${BidBeginday}`);

               if (WABidDuration)
               {

                    // let days = 1;
                    BidEndDay = getUTCDate(WABidDuration);
                    console.log(`End Date ${BidEndDay}`);
               
               }
               
              //  let wapreviewBids = WARFPRules.PlaceBidsPreviewPeriod;
              //  let waReasontoDeclineBid = WARFPRules.ReasontoDeclineBid;
              //  let waSubmitbyEmail = WARFPRules.SubmitbyEmail;
              const RulesItem = JSON.parse(JSON.stringify(RulesTemplate));
              // RulesItem.EventRules[0].ruleValue.dateValue = BidBeginday;
              // RulesItem.EventRules[1].ruleValue.dateValue = BidEndDay;
              RulesItem.EventRules[0].ruleValue.stringValue = WARFPRules.PlaceBidsPreviewPeriod;
              RulesItem.EventRules[1].ruleValue.booleanValue = WARFPRules.ReasontoDeclineBid;
              RulesItem.EventRules[2].ruleValue.booleanValue = WARFPRules.SubmitbyEmail;
              RulesItem.EventRules[3].ruleValue.booleanValue = WARFPRules.SupplierAddItems;
              // debugger;
              let wrulesitems = RulesItem.EventRules;

              await waitaSec("Calling Ariba Handler: to Add Event Rules");
              let Ruleshandler = await AribaHandler.AddEventRules(JSON.stringify(wrulesitems),DocumentID );
              if (Ruleshandler == 'Error')
              {
                lv_status = "Error";
                continue;
              }
              
               // Publish Event

               await waitaSec("Calling Ariba Handler DONE: to Add Event Rules");

              //  const PrevDate = new Date(currenttime);
              //  PrevDate.setMinutes(PrevDate.getMinutes() + 50);
              //  let PrevBegTime = PrevDate.toISOString();

                const nowLocal2 = new Date();
                nowLocal2.setMinutes(nowLocal2.getMinutes() + 45);
                const utcOffset2 = nowLocal2.getTimezoneOffset();
                const nowUtc2 = new Date(nowLocal2.getTime() + (utcOffset2 * 60 * 1000));
                const laterUtcStr2 = nowUtc2.toISOString();
                console.log(laterUtcStr2);

                PublishTemplate.ids.eventId = DocumentID;
                // debugger;
                // let previewbegindate2 = previewbegindate1.replace("Z", "+0000") ;
                let PlannedBeginDate = getUTCDate(1);
                console.log(`End Date ${PlannedBeginDate}`);
               PublishTemplate.actionBody.plannedPreviewBeginDate = PlannedBeginDate;
              //  PublishTemplate.actionBody.plannedBeginDate = previewbegindate;

              console.log(`Calling Ariba Handler: to Publish Template`);

               let Publishhandler = await AribaHandler.PublishTemplate(JSON.stringify(PublishTemplate));
               if ( Publishhandler == 'Error')
               {
                lv_status = "Error";
                continue; // Lets not commit the status.. 
               }
               await waitaSec("Calling Ariba Handler DONE: to Publish Template");

                // Set the RFP Handle to processed

                await UPDATE("com.sap.tailspend.RFPEvent").set({Status:'Event Published'}).where({DOCID : DocumentID});
                //debugger;
                //0523 update PR status
                let prresult = await SELECT.one.from("com.sap.tailspend.RFPItems").where({parent_DOCID : DocumentID}); 
                // assumption is we are going one rfp per pr.. so we update all PR with the status ..later.. we have to do by rfp item and update pr item.
                await UPDATE("com.sap.tailspend.PurchaseRequisition").set({Status:'Event Published'}).where({PRID : prresult.PRID}); // update all line items


                console.log(`Publish Event ${DocumentID} and all process executed successfully`);

            }
          else
            {
              console.log("Error updating Supplier in RFP Event");
              return JSON.stringify("Error updating Supplier in RFP Event");

            }
       }
       else
       {
        console.log("Error Region to Country Mapping not maintained");
        return JSON.stringify("Error Region to Country Mapping not maintained");
       }


  //RFPHandle ID
  if ( lv_status != "Error")
  {
    RFPHandleArray.push(rfphandleid);    
  }
  
  lv_status = "";
  // break; // Temporary exit with 1st row
debugger;

console.log(`************************END OF PROCESSING RFP HANDLE ID ${rfphandleid} *********************************`);

} //go for next RFP Handles

// return JSON.stringify("Created Event");
return RFPHandleArray;

}

function getUTCDate(days)
{
  const nowUtc = new Date().toISOString();

  const nowDate = new Date(nowUtc);
  nowDate.setDate(nowDate.getDate() + days);

  const laterUtcStr = nowDate.toISOString();
  return laterUtcStr;

}

async function createEventperRegionComm() {

}
async function doGetCustomAwardRules(req){
   // debugger;
    let RFPRules = await SELECT.one.from("com.sap.tailspend.AutoRFPRules");
    return JSON.stringify("");
}

async function waitaSec(text) {
  await wait(2000);
  console.log(text);
  return "Wait Complete";

}

function wait(timeout)
{
  return new Promise(resolve => {
    setTimeout(resolve,timeout);
  });
}

async function doCreateEvent(req){
    
   // debugger;
    let RFPRules = await SELECT.one.from("com.sap.tailspend.AutoRFPRules");

    const RFPRulesJSON = 
    [
        {
            "title": "GR Landscaping Event 0413 C", //PR Title
            "templateDocumentInternalId": `${RFPRules.WorkflowTemplate}`,
            "eventTypeName": "RFP",
            "isTest": "true"
        }	
    ];

    return JSON.stringify(RFPRulesJSON);
}

async function RetreiveAward(req) {

// 1. Look at RFP EVent Table and pick up all rows that has Status - 'Event Awarded'. If Payload null.. there is an issue.. skip..
debugger;

const AllRFPs = await SELECT.from("com.sap.tailspend.RFPEvent").where({Status : 'Event Awarded' }); 

for ( let i = 0; i< AllRFPs.length; i++)
{
 const RFPAwardStatus = await AribaHandler.GetAwardStatus(AllRFPs[i].DOCID);
 if (RFPAwardStatus == 'Error')
 {
   continue;
 }
  
 const RFPAwardArray = JSON.parse(RFPAwardStatus);

 if ( RFPAwardArray.payload[0].awardStatus == 3 )
 {

  let AwardID = RFPAwardArray.payload[0].awardId;

  const RFPAwardDetails = await AribaHandler.GetAwardDetails(AllRFPs[i].DOCID, AwardID);

  if (RFPAwardDetails == 'Error')
  {
    continue;
  }

  const RFPAwardDetailsArray = JSON.parse(RFPAwardDetails);


  // debugger;

  let RFPItemData = await SELECT.from("com.sap.tailspend.RFPItems").where({parent_DOCID : AllRFPs[i].DOCID});

  for (let pritem = 0; pritem< RFPItemData.length;pritem++)
  {

   //Match Against Item Description of PR and add additional details.. We dont have any other handle for now..
   let filteredArray = RFPAwardDetailsArray.supplierBids.filter(item => item.itemId  === RFPItemData[pritem].ItemID);
  //  debugger;
   RFPItemData[pritem].AwardedSupplierName = filteredArray[0].invitationId;

   let bidawardterm = filteredArray[0].item.terms;

   for ( let term = 0; term < bidawardterm.length;term++)
   {

    if (bidawardterm[term].fieldId == 'PRICE' )
    {
      RFPItemData[pritem].AwardedPrice = bidawardterm[term].value.supplierValue.amount;  
      RFPItemData[pritem].AwardedCurrency = bidawardterm[term].value.supplierValue.currency;  
    }
    
    if (bidawardterm[term].fieldId == 'QUANTITY' )
    {
      RFPItemData[pritem].AwardedQuantity = bidawardterm[term].value.quantityValue.amount;  
      RFPItemData[pritem].AwardeditemUOM = bidawardterm[term].value.quantityValue.unitOfMeasureCode;  
    }

    if (bidawardterm[term].fieldId == 'EXTENDEDPRICE' )
    {
      RFPItemData[pritem].AwardedExtendedPrice = bidawardterm[term].value.supplierValue.amount;  
    }

    if (bidawardterm[term].fieldId == 'SAVINGS' )
    {
      RFPItemData[pritem].AwardedSavingsAmount = bidawardterm[term].value.moneyDifferenceValue.difference.amount;  
    }


   }

  }

  debugger;

  const itementities = { "entities": RFPItemData } ;
  const rfpitempayload = JSON.stringify(itementities);
  const rfpitemupsertresponse = await doUpsertRFPItemInternal(rfpitempayload);

  await UPDATE("com.sap.tailspend.RFPEvent").set({Status:'Award Export Ready'}).where({DOCID : AllRFPs[i].DOCID});
  //0523 update PR status
  let prresult = await SELECT.one.from("com.sap.tailspend.RFPItems").where({parent_DOCID : AllRFPs[i].DOCID}); 
  // assumption is we are going one rfp per pr.. so we update all PR with the status ..later.. we have to do by rfp item and update pr item.
  await UPDATE("com.sap.tailspend.PurchaseRequisition").set({Status:'Award Export Ready'}).where({PRID : prresult.PRID}) // update all line items
  console.log(`Successfully updated the Award Details in Sourcing Cockpit for ${AllRFPs[i].DOCID}`);
 }


}


}

async function ProcessMiscAwardUpdate(req)
{
  const AllRFPs = await SELECT.from("com.sap.tailspend.RFPEvent").where({Status : 'Event Published' }); 

  for ( let i = 0; i< AllRFPs.length; i++)
  {

    const RFPData = await AribaHandler.GetEventStatus(AllRFPs[i].DOCID);
   
    const RFPArray = JSON.parse(RFPData);

    if ( RFPArray.eventStateName == 'ClosedState' )
    {
      console.log("Updating RFP in SCT after Closed State")
      await UPDATE("com.sap.tailspend.RFPEvent").set({Status:'Event Awarded'}).where({DOCID : AllRFPs[i].DOCID});
  
      let prresult = await SELECT.one.from("com.sap.tailspend.RFPItems").where({parent_DOCID : AllRFPs[i].DOCID}); 
  
      await UPDATE("com.sap.tailspend.PurchaseRequisition").set({Status:'Event Awarded'}).where({PRID : prresult.PRID}); 
      console.log("Updating RFP in SCT after Closed State - Complete")

    }

  }

}

async function createAwardProcess(req){

  const AwardTemplate = {
    "resourceType": "SCENARIO",
    "actionName": "SUBMIT",
    "ids": {
        "eventId": "",
        "scenarioId": ""
    },
    "actionBody": {
       "notifyAwardedSuppliers": true,
       "notifyNonAwardedSuppliers": false 
    }
};

   let AwardScenarioselected ;
   debugger;
  // 1. Get all events published using table "com.sap.tailspend.RFPEvent"
  const AllRFPs = await SELECT.from("com.sap.tailspend.RFPEvent").where({Status : 'Event Published' }); 

  // 2. loop through that to see what is the status of Ariba Event. 

  for ( let i = 0; i< AllRFPs.length; i++)
  {

    console.log(`Processing Document ID for Award: ${AllRFPs[i].DOCID}`);

    const RFPData = await AribaHandler.GetEventStatus(AllRFPs[i].DOCID);
   
    const RFPArray = JSON.parse(RFPData);

    // 3. If the "eventStateName": "PendingSelectionState",
    if ( RFPArray.eventStateName == 'PendingSelectionState' )
    {

      // Pass the Document ID to Event Handler and try to run the award
      // Get the Award Scenario
      let RFPAwardRule = await SELECT.one.from("com.sap.tailspend.AutoRFPRules");
      let SelectAwardScenario = RFPAwardRule.AwardScenario;
     
      await waitaSec("Getting Awarding Secenario - Waiting a Second");

      let AwardScenarios = await AribaHandler.GetAwardScenarios(AllRFPs[i].DOCID);
      await waitaSec("Getting Awarding Secenario DONE: - Waiting a Second");

      const RFPAwardScenario = JSON.parse(AwardScenarios);
      debugger;
      // RFPAwardPayload = AwardScenarios.payload;

      for (let j = 0; j< RFPAwardScenario.payload.length;j++)
      {
// Check the title to match and then get the Scenario ID
      if (RFPAwardScenario.payload[j].title == SelectAwardScenario)
      {
        AwardScenarioselected = RFPAwardScenario.payload[j].scenarioId;
        //submit the award
        console.log(AwardScenarioselected);
        AwardTemplate.ids.eventId = AllRFPs[i].DOCID
        AwardTemplate.ids.scenarioId = AwardScenarioselected

        await waitaSec("Submitting Awarding Secenario - Waiting a Second");

        let AwardScenarios = await AribaHandler.SubmitAward(JSON.stringify(AwardTemplate));

        await waitaSec("Submitting Awarding Secenario DONE - Waiting a Second");
        if (AwardScenarios != 'Error' )
        {
        debugger;
        // console.log(AwardScenarios);
        // Update "com.sap.tailspend.RFPEvent" table with status 'Event Awarded'
        await UPDATE("com.sap.tailspend.RFPEvent").set({Status:'Event Awarded'}).where({DOCID : AllRFPs[i].DOCID});
        //0523 update PR status
        let prresult = await SELECT.one.from("com.sap.tailspend.RFPItems").where({parent_DOCID : AllRFPs[i].DOCID}); 
        // assumption is we are going one rfp per pr.. so we update all PR with the status ..later.. we have to do by rfp item and update pr item.
        await UPDATE("com.sap.tailspend.PurchaseRequisition").set({Status:'Event Awarded'}).where({PRID : prresult.PRID}); // update all line items
        break;
        }
      }


      }

  // let DocumentSceanrio = AwardScenarios.

    }

  }

  

  return "Success";
}

async function ExtractPRDetails(req){

  var RequisitionDataArray = [];
  var RequisitionArray = [];
  // itementities = { "entities": exporterpdata } ;
  const AllRFPs = await SELECT.from("com.sap.tailspend.RFPEvent").where({Status : 'Award Export Ready' }); 

  debugger;
  for ( let i = 0; i< AllRFPs.length; i++)
  {
  
    let RFPItemData = await SELECT.from("com.sap.tailspend.RFPItems").where({parent_DOCID : AllRFPs[i].DOCID});
    debugger;
    for (let pritem = 0; pritem< RFPItemData.length;pritem++)

    {
    
       console.log( RFPItemData[pritem].PRID );
       RequisitionDataArray.push(RFPItemData[pritem].PRID);
        //  exporterpdata.HeaderToItem.push(RFPAwardedData);

    }


  }
        let uniquePRs = [...new Set(RequisitionDataArray)];  

        for ( let i = 0; i< uniquePRs.length; i++)
        {
        let RFPAwardedPRs = {
          PRNUMBER: uniquePRs[i]
        }
        RequisitionArray.push(RFPAwardedPRs);
        }

        return JSON.stringify(RequisitionArray);

}

// async function ExtractPRtoERP(req){

//   // pull all data from "com.sap.tailspend.RFPEvent" Table where Status is 'Award Export Ready'
//   // Try to combine header and item together

//   const entities = req.data;

//   var RequisitionDataArray = [];
//   var itementities;
//   var lv_erpvendorid;
//   const AllRFPs = await SELECT.from("com.sap.tailspend.RFPEvent").where({Status : 'Award Export Ready' }); 

//   debugger;
//   for ( let i = 0; i< AllRFPs.length; i++)
//   {
  
//     var exporterpdata = {
//       "Prid": "",
//       "Prtitle": "",
//       "HeaderToItem": []
//     };

    
//     let RFPItemData = await SELECT.from("com.sap.tailspend.RFPItems").where({parent_DOCID : AllRFPs[i].DOCID});
//     debugger;
//     for (let pritem = 0; pritem< RFPItemData.length;pritem++)

//     {

//       var ACMIDResponse = await DatalakeHandler.doGetERPSupplierData(RFPItemData[pritem].AwardedSupplierName);
//       var ERPID = JSON.parse(ACMIDResponse);
//           exporterpdata.Prid =  RFPItemData[pritem].PRID;

//       debugger;

//       if ( ERPID[0].ACMId == 'ACM_163748781') //Arizona IT Solutions
//       {
//         lv_erpvendorid = 'USSU-CIG17'
//       }
//       if ( ERPID[0].ACMId == 'ACM_167553194') //Cirrus IT
//       {
//         lv_erpvendorid = 'USSU-CIG14'
//       }

//       if ( ERPID[0].ACMId == 'ACM_163748785') //InFocus, Inc
//       {
//         lv_erpvendorid = 'USSU-CIG13'
//       }


//       let RFPAwardedData = {
//         Prid: RFPItemData[pritem].PRID,
//         Pritemid: RFPItemData[pritem].PRItemID,
//         Pritemtitle: RFPItemData[pritem].PRItemTitle,
//         Prprice: RFPItemData[pritem].PRPrice,
//         Prquantity: RFPItemData[pritem].PRQuantity,
//         Prextendedprice: RFPItemData[pritem].PRExtendedPrice,
//         Prsavingsamount: `0`,
//         Prsavingspercentage: `0`,
//         Prcurrency : RFPItemData[pritem].PRCurrency,
//         Pruom: RFPItemData[pritem].PRUOM,
//         Awardedsuppliername: lv_erpvendorid,
//         Awardedprice: RFPItemData[pritem].AwardedPrice,
//         Awardedquantity: RFPItemData[pritem].AwardedQuantity,
//         Awardedextendedprice: RFPItemData[pritem].AwardedExtendedPrice,
//         Awardedsavingsamount: RFPItemData[pritem].AwardedSavingsAmount,
//         Awardedcurrency: RFPItemData[pritem].AwardedCurrency,
//         Awardeditemuom: RFPItemData[pritem].AwardeditemUOM
//       }
//        RequisitionDataArray.push(RFPAwardedData);
//         //  exporterpdata.HeaderToItem.push(RFPAwardedData);

//     }

//       //  itementities = { "entities": RequisitionDataArray } ;
    
//     // await UPDATE("com.sap.tailspend.RFPEvent").set({Status:'ERP Export Completed'}).where({DOCID : AllRFPs[i].DOCID});

//   }
  
//   // return JSON.stringify(exporterpdata);
//         return JSON.stringify(RequisitionDataArray);

// }

async function ExtractPRtoAriba(req){

  // pull all data from "com.sap.tailspend.RFPEvent" Table where Status is 'Award Export Ready'
  // Try to combine header and item together

  // const PRNumber = req.data.type;
  debugger;
  let PRNumber;
  var RequisitionDataArray = [];
  var itementities;
  var AribaPRData;
  var lv_erpvendorid;
  const AllRFPs = await SELECT.from("com.sap.tailspend.RFPEvent").where({Status : 'Award Export Ready' }); 

  debugger;

  var exporterpdata = {
    "uniqueName": "",
    "title": "",
    "LineItems": []
  };

  

  for ( let i = 0; i< AllRFPs.length; i++)
  {
  
    let RFPItemData = await SELECT.from("com.sap.tailspend.RFPItems").where({parent_DOCID : AllRFPs[i].DOCID});
    
    PRNumber = RFPItemData[0].PRID;

    let PRData = await SELECT.from("com.sap.tailspend.PurchaseRequisition").where({PRID : AllRFPs[i].DOCID , PRID: PRNumber});

    debugger;

    for (let pritem = 0; pritem< RFPItemData.length;pritem++)
    {

      var ACMID = RFPItemData[pritem].AwardedSupplierName;
          exporterpdata.uniqueName =  RFPItemData[pritem].PRID;
          exporterpdata.title =  PRData[0].PRTitle;

      debugger;

      if ( ACMID == 'ACM_163748781') //Arizona IT Solutions
      {
        lv_erpvendorid = 'ACM_9536237'
      }
      if ( ACMID == 'ACM_167553194') //Cirrus IT
      {
        lv_erpvendorid = 'ACM_18152912'
      }

      if ( ACMID == 'ACM_163748785') //InFocus, Inc
      {
        lv_erpvendorid = 'ACM_4597723'
      }


      if ( ACMID == 'ACM_60385133') //Wild Cat
      {
        lv_erpvendorid = 'ACM_4217065'
      }

      let RFPAwardedData = {
        amount_amount: RFPItemData[pritem].AwardedPrice,
        // supplier_uniqueName: RFPItemData[pritem].AwardedSupplierName,
        supplier_uniqueName: lv_erpvendorid,
        deliverTo: 'Ganesh Ramachandran',
        numberInCollection: RFPItemData[pritem].PRItemID
      }
       exporterpdata.LineItems.push(RFPAwardedData);

    }

     AribaPRData = { "reqdata": exporterpdata } ;
    

  }
  
  return "Completed Export of Data from SCT to Ariba"

        //  return JSON.stringify(AribaPRData);
        // return JSON.stringify(AribaPRData);
   

}

async function ExtractPRtoERP(req){

  // pull all data from "com.sap.tailspend.RFPEvent" Table where Status is 'Award Export Ready'
  // Try to combine header and item together

  const PRNumber = req.data.type;

  var RequisitionDataArray = [];
  var itementities;
  var lv_erpvendorid;
  const AllRFPs = await SELECT.from("com.sap.tailspend.RFPEvent").where({Status : 'Award Export Ready' }); 

  debugger;

  var exporterpdata = {
    "Prid": "",
    "Prtitle": "",
    "HeaderToItem": []
  };

  

  for ( let i = 0; i< AllRFPs.length; i++)
  {
  

    let RFPItemData = await SELECT.from("com.sap.tailspend.RFPItems").where({parent_DOCID : AllRFPs[i].DOCID , PRID: PRNumber});
    debugger;
    for (let pritem = 0; pritem< RFPItemData.length;pritem++)

    {

      var ACMIDResponse = await DatalakeHandler.doGetERPSupplierData(RFPItemData[pritem].AwardedSupplierName);
      var ERPID = JSON.parse(ACMIDResponse);
          exporterpdata.Prid =  RFPItemData[pritem].PRID;

      debugger;

      if ( ERPID[0].ACMId == 'ACM_163748781') //Arizona IT Solutions
      {
        lv_erpvendorid = 'USSU-CIG17'
      }
      if ( ERPID[0].ACMId == 'ACM_167553194') //Cirrus IT
      {
        lv_erpvendorid = 'USSU-CIG14'
      }

      if ( ERPID[0].ACMId == 'ACM_163748785') //InFocus, Inc
      {
        lv_erpvendorid = 'USSU-CIG13'
      }


      if ( ERPID[0].ACMId == 'ACM_60385133') //Wild Cat
      {
        lv_erpvendorid = 'USSU-CIG15'
      }

      let RFPAwardedData = {
        Prid: RFPItemData[pritem].PRID,
        Pritemid: RFPItemData[pritem].PRItemID,
        Pritemtitle: RFPItemData[pritem].PRItemTitle,
        Prprice: RFPItemData[pritem].PRPrice,
        Prquantity: RFPItemData[pritem].PRQuantity,
        Prextendedprice: RFPItemData[pritem].PRExtendedPrice,
        Prsavingsamount: `0`,
        Prsavingspercentage: `0`,
        Prcurrency : RFPItemData[pritem].PRCurrency,
        Pruom: RFPItemData[pritem].PRUOM,
        Awardedsuppliername: lv_erpvendorid,
        Awardedprice: RFPItemData[pritem].AwardedPrice,
        Awardedquantity: RFPItemData[pritem].AwardedQuantity,
        Awardedextendedprice: RFPItemData[pritem].AwardedExtendedPrice,
        Awardedsavingsamount: RFPItemData[pritem].AwardedSavingsAmount,
        Awardedcurrency: RFPItemData[pritem].AwardedCurrency,
        Awardeditemuom: RFPItemData[pritem].AwardeditemUOM
      }
    //   RequisitionDataArray.push(RFPAwardedData);
       exporterpdata.HeaderToItem.push(RFPAwardedData);

    }

      itementities = { "entities": exporterpdata } ;
    
    // await UPDATE("com.sap.tailspend.RFPEvent").set({Status:'ERP Export Completed'}).where({DOCID : AllRFPs[i].DOCID});

  }
  
  // return JSON.stringify(exporterpdata);
        return JSON.stringify(itementities);

}

async function UpdateRFPandPRStatus(req){
debugger;
let PRNumber = req.data.PRNumber;
console.log(PRNumber);

let prresult = await SELECT.one.from("com.sap.tailspend.RFPItems").where({PRID : PRNumber}); 

let DocNumber = prresult.parent_DOCID;

// Status Update

await UPDATE("com.sap.tailspend.RFPEvent").set({Status:'Sourcing Operations – Review'}).where({DOCID : DocNumber});

await UPDATE("com.sap.tailspend.PurchaseRequisition").set({Status:'Sourcing Operations – Review'}).where({PRID : PRNumber}); // update all line items

return "Success";


}

async function doGetPRComments(req){
  debugger;
  let PRNumber = req.data.PR;

  console.log(PRNumber);
  
  let RFPHandle = await SELECT.one.from("com.sap.tailspend.RFPHandle").where({PRID : PRNumber}); 
  
  let RFPEvent = await SELECT.one.from("com.sap.tailspend.RFPEvent").where({RFPHandleID : RFPHandle.RFPHandleID}); 

  // let comment = `Event Published in Guided Sourcing URL: ${RFPEvent.webJumperURL}`; 
  
  const commentresult = encodeToBase64Comment(`${RFPEvent.webJumperURL}`);

  return commentresult;
  
  
}

function encodeToBase64Comment(gburl) {
  const linkString = `<p>Guided Sourcing Event Published. <a href='${gburl}'>View the Event</a></p>`;
 
  // Convert to base64
  const base64String = Buffer.from(linkString).toString('base64');
 
  return base64String;
}

async function TestProcess(req){
  debugger;

  await UPDATE("com.sap.tailspend.PurchaseRequisition").set({Status:'PR Sourced and Updated in ERP'}).where({PRID : '10236706'}); // update all line items
  await UPDATE("com.sap.tailspend.RFPEvent").set({Status:'PR Sourced and Updated in ERP'}).where({DOCID : 'Doc4022764766'}); 

  // let lvRegionID = 'USA';
  // let cmappingavailable = 'X';

  // const commoditydata = [];

  // let prid = '10236706';

  // const IT_TaiSpendsuppliers_Region = await SELECT.from("com.sap.tailspend.TailSpendSuppliers").where({RegionID : `${lvRegionID}` , AutoRFQEligble : `X`});

  // const WA_Commodity_PR = await SELECT.from("com.sap.tailspend.PurchaseRequisition").where({PRID : prid}); 

  // for (let prcommd = 0; prcommd< WA_Commodity_PR.length;prcommd++)
  // {
  //   const newCategoryID = {CategoryID: WA_Commodity_PR[prcommd].CategoryID}
  //   console.log(newCategoryID.CategoryID);
  //   const ACMCategoryID = await SELECT.from("com.sap.tailspend.MaterialGroup2Commodity").where({MaterialGroupID: newCategoryID.CategoryID});
  //   if ( ACMCategoryID.length != 0)
  //   {
  //   cmappingavailable = 'X';
  //   const newACMCatMapping = ACMCategoryID[0].CommodityID;
  //   commoditydata.push(newACMCatMapping);
  //   }
  // }

  // if ( WA_Commodity_PR != null && cmappingavailable == 'X' )
  // {
  
  // for (let i=0;i< IT_TaiSpendsuppliers_Region.length;i++)
  //   {

  //     if (commoditydata.includes(IT_TaiSpendsuppliers_Region[i].CategoryID) )
  //       {
  //         // const supplieritem = JSON.parse(JSON.stringify(suppliertemplate));
  //         // supplieritem.contacts[0].emailAddress = IT_TaiSpendsuppliers[i].contactemail; 
  //         // supplieritem.contacts[0].uniqueName = IT_TaiSpendsuppliers[i].contactemail; 
  //         // supplieritems.push(supplieritem); 
  //         console.log("TEST");
  //       }

  //   }
  
  // }
  
  return "Success";

}

module.exports = {
    doGetCustomAwardRules,
    doUpsertRequisition,
    doFormatRequisition,
    doUpsertRFP,
    docreateEventfromPR,
    createEventinAribaperPR,
    createAwardProcess,
    RetreiveAward,
    ExtractPRtoERP,
    ExtractPRtoAriba,
    ExtractPRDetails,
    UpdateRFPandPRStatus,
    TestProcess,
    ProcessMiscAwardUpdate,
    doGetPRComments
};

