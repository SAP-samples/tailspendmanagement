"use strict";

//libraries
const cds = require("@sap/cds");
const cloudSDK = require("@sap-cloud-sdk/core");
const { default: axios } = require("axios");
const {MaterialGroup2Commodity , SupplierOrganization2User} = cds.entities('com.sap.tailspend');

async function doCreateMaterialGroupMapping (req) {
    debugger;
    const entities = req.data.entities;
    const srv = cds.transaction(req);
  
    const results = await Promise.all(entities.map(async (entity) => {
     return await srv.create('com.sap.tailspend.MaterialGroup2Commodity',entity)
    }));
     
    return "Successfully updated Material Group Mapping"
          
        
}

async function ACM2ERPMapping (req) {
    debugger;
    const entities = req.data.entities;
    const srv = cds.transaction(req);
  
    const results = await Promise.all(entities.map(async (entity) => {
     return await srv.create('com.sap.tailspend.ACM2ERPMapping',entity)
    }));
     
    return "Successfully updated ACM2ERP Mapping"
          
        
}

async function doPlantAddressMapping (req) {
    debugger;
    const entities = req.data.entities;
    const srv = cds.transaction(req);
  
    const results = await Promise.all(entities.map(async (entity) => {
     return await srv.create('com.sap.tailspend.Plant2ShipToAddress',entity)
    }));
     
    return "Successfully updated Plant Address Mapping"
          
        
}

async function doCountrytoRegionMapping (req) {
    debugger;
    const entities = req.data.entities;
    const srv = cds.transaction(req);
  
    const results = await Promise.all(entities.map(async (entity) => {
     return await srv.create('com.sap.tailspend.Country2Region',entity)
    }));
     
    return "Successfully updated Country to Region Mapping"
          
        
}

async function Org2UserMapping (req) {
    debugger;
    const entities = req.data.entities;
    const srv = cds.transaction(req);
  
    const results = await Promise.all(entities.map(async (entity) => {
     return await srv.create('com.sap.tailspend.SupplierOrganization2Users',entity)
    }));
     
    return "Successfully updated Supplier to User Org. Mapping"
          
        
}


async function doUpdateAribaHandler (req) {

    debugger;
    const entities = req.data.entities;
    const tx = cds.transaction(req);

    for (const entity of entities )
    {


            const query = await SELECT.from("com.sap.tailspend.PRApprovalHandler").where({PRID : entity.PRID, ApprovalHandler: entity.ApprovalHandler }); 

            // const query = `SELECT * FROM com.sap.tailspend.PRApprovalHandler WHERE ${keyFilter.join(' AND ')}`;
            // const selectq = await tx.run(query)

            if ( query.length === 0)
            {
            try {
                await INSERT.into("com.sap.tailspend.PRApprovalHandler").entries(entity);
                console.log('Successfully Inserted data into PR Handler DB Schema');
            }
            catch (error) {
                console.log(`Error inserting Purchase Requisition Handler ${error.message}`);
            }
            }
            else
            {
            try {
            
                await UPDATE("com.sap.tailspend.PRApprovalHandler").set(entity).where({PRID : entity.PRID, ApprovalHandler: entity.ApprovalHandler });

                console.log('Successfully Updated data into PR Handler DB Schema');
            }
            catch(error)
            {
                console.log(`Error Updating Purchase Requisition Handler ${error.message}`);
            }
            }

}

}

async function doLoadQuestionnaire (req) {
    debugger;
    const entities = req.data.entities;
    const srv = cds.transaction(req);
  
    const results = await Promise.all(entities.map(async (entity) => {
     return await srv.create('com.sap.tailspend.SMQuestionnairev1',entity)
    }));
     
    return "Successfully updated Questionnaire Information"
          
        
}

async function doLoadRFPTemplate (req) {
    debugger;
    const entities = req.data.entities;
    const srv = cds.transaction(req);
  
    const results = await Promise.all(entities.map(async (entity) => {
     return await srv.create('com.sap.tailspend.RFPTemplate',entity)
    }));
     
    return "Successfully updated RFPTemplate Information"
          
        
}

async function doLoadTemplateQA (req) {
    debugger;
    const entities = req.data.entities;
    const srv = cds.transaction(req);
  
    const results = await Promise.all(entities.map(async (entity) => {
     return await srv.create('com.sap.tailspend.TemplateQA',entity)
    }));
     
    return "Successfully updated Template QA Details Mapping"
          
        
}

async function doLoadSupplierQA (req) {
    debugger;
    const entities = req.data.entities;
    const srv = cds.transaction(req);
  
    const results = await Promise.all(entities.map(async (entity) => {
     return await srv.create('com.sap.tailspend.SupplierQA',entity)
    }));
     
    return "Successfully updated SupplierQA Mapping"
          
        
}


module.exports = {
    doCreateMaterialGroupMapping,
    doPlantAddressMapping,
    doCountrytoRegionMapping,
    ACM2ERPMapping,
    Org2UserMapping,
    doUpdateAribaHandler,
    doLoadSupplierQA,
    doLoadTemplateQA,
    doLoadRFPTemplate,
    doLoadQuestionnaire
};