"use strict";

//libraries
const cds = require("@sap/cds");
const cloudSDK = require("@sap-cloud-sdk/core");
const { default: axios } = require("axios");
const {AutoRFPRules} = cds.entities('com.sap.tailspend');

async function createEvent (oPayload) {
        // debugger;
        let realm = 'AribaRealm';
        let oDestination;
        oDestination = await cloudSDK.getDestination("Event-Sourcing-AribaRealm");
        let EventEndpoint = "/events";
        
        //Destination validation 
        if(!(oDestination) || !(oDestination.originalProperties.destinationConfiguration.apikey)) {
            logger.error(`Destination does not exist or is incorrectly configured`);
            throw Error("Destination does not exist or is incorrectly configured");
        }

        //building request  
        let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);
        oRequestConfig.baseURL = oRequestConfig.baseURL + EventEndpoint;
        oRequestConfig.method = "post";
        
        oRequestConfig.params = {
                                 realm:realm ,
                                 user:'I511XXX',
                                 passwordAdapter:'PasswordAdapter1',
                                 inheritTerms:'True',
                                 inheritCommodityAndRegion:'True',
                                 removeEmptyOwnerTerms:'True',
                                 $expand:'all'
                                };
   
        oRequestConfig.headers["Accept"]=oRequestConfig.headers["Content-Type"]="application/json";
        oRequestConfig.headers["apikey"]=oDestination.originalProperties.destinationConfiguration.apikey;
        
        oRequestConfig.data = oPayload;

                try{
                    // debugger;
                    let response = await axios.request(oRequestConfig);
                    return JSON.stringify(response.data.payload);
                }
                catch(error){
             
                    console.log(`Error while processing API call createEvent : ${error} `);
                    return `Error  ${error}`
                      
                }
             
            
}

async function createItemforEvent (oPayload,DocID) {
    // debugger;
    let realm = 'AribaRealm';
    let oDestination;
    oDestination = await cloudSDK.getDestination("Event-Sourcing-AribaRealm");
    let EventEndpoint = `/events/${DocID}/items`;
    
    //Destination validation 
    if(!(oDestination) || !(oDestination.originalProperties.destinationConfiguration.apikey)) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    //building request  
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);
    oRequestConfig.baseURL = oRequestConfig.baseURL + EventEndpoint;
    oRequestConfig.method = "post";
    
    oRequestConfig.params = {
                             realm:realm ,
                             user:'I511XXX',
                             passwordAdapter:'PasswordAdapter1',
                             inheritTerms:'True',
                             inheritCommodityAndRegion:'True',
                             removeEmptyOwnerTerms:'True',
                             showTotal:'True'
                            };

    oRequestConfig.headers["Accept"]=oRequestConfig.headers["Content-Type"]="application/json";
    oRequestConfig.headers["apikey"]=oDestination.originalProperties.destinationConfiguration.apikey;
    
    // const myItemObject = oPayload.reduce((acc, curr , index) => {
    //     acc[index] = curr;
    //     return acc;
    // }, {});
    // oRequestConfig.data = myItemObject;

    // const JSONEntity = JSON.parse(decodedString);
    
    oRequestConfig.data = JSON.stringify(oPayload);
    console.log(`Request URL ${oRequestConfig.baseURL}`);

    console.log(`Request Body ${oRequestConfig.data}`);

            try{
                // debugger;
                let response = await axios.request(oRequestConfig);
                return JSON.stringify(response.data);
            }
            catch(error){
         
                console.log(`Error while processing API call createItemforEvent : ${error} `);
                return `Error  ${error}`
                  
            }
         
        
}

async function GetAwardScenarios(DocID) {

    let realm = 'AribaRealm';
    let oDestination;
    oDestination = await cloudSDK.getDestination("Event-Sourcing-AribaRealm");
    let EventEndpoint = `/events/${DocID}/scenarios`;
    
    //Destination validation 
    if(!(oDestination) || !(oDestination.originalProperties.destinationConfiguration.apikey)) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    //building request  
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);
    oRequestConfig.baseURL = oRequestConfig.baseURL + EventEndpoint;
    oRequestConfig.method = "get";
    
    oRequestConfig.params = {
                             realm:realm ,
                             user:'I511XXX',
                             passwordAdapter:'PasswordAdapter1'
                            };

    oRequestConfig.headers["Accept"]=oRequestConfig.headers["Content-Type"]="application/json";
    oRequestConfig.headers["apikey"]=oDestination.originalProperties.destinationConfiguration.apikey;
    
            try{
                // debugger;
                let response = await axios.request(oRequestConfig);
                // console.log(response.data);
                return JSON.stringify(response.data);
            }
            catch(error){
         
                console.log(`Error while processing API call GetAwardScenarios : ${error} `);
                return `Error  ${error}`
                  
            }
         



}

async function SubmitAward(oPayload) {
 // debugger;
 let realm = 'AribaRealm';
 let oDestination;
 oDestination = await cloudSDK.getDestination("Event-Sourcing-AribaRealm");
 let EventEndpoint = `/jobs`;
 
 //Destination validation 
 if(!(oDestination) || !(oDestination.originalProperties.destinationConfiguration.apikey)) {
     logger.error(`Destination does not exist or is incorrectly configured`);
     throw Error("Destination does not exist or is incorrectly configured");
 }

 //building request  
 let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);
 oRequestConfig.baseURL = oRequestConfig.baseURL + EventEndpoint;
 oRequestConfig.method = "post";
 
 oRequestConfig.params = {
                          realm:realm ,
                          user:'I511XXX',
                          passwordAdapter:'PasswordAdapter1'
                         };

 oRequestConfig.headers["Accept"]=oRequestConfig.headers["Content-Type"]="application/json";
 oRequestConfig.headers["apikey"]=oDestination.originalProperties.destinationConfiguration.apikey;
 
 oRequestConfig.data = oPayload;
 console.log(`Request URL ${oRequestConfig.baseURL}`);

 console.log(`Request Body ${oRequestConfig.data}`);

         try{
             // debugger;
             console.log("Aribaeventhandler: Submitting the award");
             let response = await axios.request(oRequestConfig);
             return JSON.stringify(response.data);
         }
         catch(error){
      
             console.log(`Error while processing API call SubmitAward: ${error} `);
             return `Error`
         }
         



}

async function GetAwardDetails (DocID,AwardID) {

    let realm = 'AribaRealm';
    let oDestination;
    oDestination = await cloudSDK.getDestination("Event-Sourcing-AribaRealm");
    let EventEndpoint = `/events/${DocID}/awards/${AwardID}`;
    
    //Destination validation 
    if(!(oDestination) || !(oDestination.originalProperties.destinationConfiguration.apikey)) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    //building request  
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);
    oRequestConfig.baseURL = oRequestConfig.baseURL + EventEndpoint;
    oRequestConfig.method = "get";
    
    oRequestConfig.params = {
                             realm:realm ,
                             user:'I511XXX',
                             passwordAdapter:'PasswordAdapter1'
                            };

    oRequestConfig.headers["Accept"]=oRequestConfig.headers["Content-Type"]="application/json";
    oRequestConfig.headers["apikey"]=oDestination.originalProperties.destinationConfiguration.apikey;
    
            try{
                // debugger;
                let response = await axios.request(oRequestConfig);
                console.log(response.data);
                return JSON.stringify(response.data);
            }
            catch(error){
         
                console.log(`Error while processing API call GetAwardDetails: ${error} `);
                return `Error`
                  
            }

}


async function GetAwardStatus (DocID) {

    let realm = 'AribaRealm';
    let oDestination;
    oDestination = await cloudSDK.getDestination("Event-Sourcing-AribaRealm");
    let EventEndpoint = `/events/${DocID}/awards`;
    
    //Destination validation 
    if(!(oDestination) || !(oDestination.originalProperties.destinationConfiguration.apikey)) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    //building request  
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);
    oRequestConfig.baseURL = oRequestConfig.baseURL + EventEndpoint;
    oRequestConfig.method = "get";
    
    oRequestConfig.params = {
                             realm:realm ,
                             user:'I511XXX',
                             passwordAdapter:'PasswordAdapter1'
                            };

    oRequestConfig.headers["Accept"]=oRequestConfig.headers["Content-Type"]="application/json";
    oRequestConfig.headers["apikey"]=oDestination.originalProperties.destinationConfiguration.apikey;
    
            try{
                // debugger;
                let response = await axios.request(oRequestConfig);
                console.log(response.data);
                return JSON.stringify(response.data);
            }
            catch(error){
         
                console.log(`Error while processing API call GetAwardStatus : ${error} `);
                return `Error`
                  
            }
         
        
}

async function GetEventStatus (DocID) {

    let realm = 'AribaRealm';
    let oDestination;
    oDestination = await cloudSDK.getDestination("Event-Sourcing-AribaRealm");
    let EventEndpoint = `/events/${DocID}`;
    
    //Destination validation 
    if(!(oDestination) || !(oDestination.originalProperties.destinationConfiguration.apikey)) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    //building request  
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);
    oRequestConfig.baseURL = oRequestConfig.baseURL + EventEndpoint;
    oRequestConfig.method = "get";
    
    oRequestConfig.params = {
                             realm:realm ,
                             user:'I511XXX',
                             passwordAdapter:'PasswordAdapter1'
                            };

    oRequestConfig.headers["Accept"]=oRequestConfig.headers["Content-Type"]="application/json";
    oRequestConfig.headers["apikey"]=oDestination.originalProperties.destinationConfiguration.apikey;
    
            try{
                // debugger;
                let response = await axios.request(oRequestConfig);
                // console.log(response.data);
                return JSON.stringify(response.data);
            }
            catch(error){
         
                console.log(`Error while processing API call GetEventStatus : ${error} `);
                return `Error  ${error}`
                  
            }
         
        
}

async function AddSupplier4Event (oPayload,DocID) {
    let realm = 'AribaRealm';
    let oDestination;
    oDestination = await cloudSDK.getDestination("Event-Sourcing-AribaRealm");
    let EventEndpoint = `/events/${DocID}/supplierInvitations`;
    
    //Destination validation 
    if(!(oDestination) || !(oDestination.originalProperties.destinationConfiguration.apikey)) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    //building request  
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);
    oRequestConfig.baseURL = oRequestConfig.baseURL + EventEndpoint;
    oRequestConfig.method = "post";
    
    oRequestConfig.params = {
                             realm:realm ,
                             user:'I511XXX',
                             passwordAdapter:'PasswordAdapter1',
                             returnFullResponse:'True'                           
                            };

    oRequestConfig.headers["Accept"]=oRequestConfig.headers["Content-Type"]="application/json";
    oRequestConfig.headers["apikey"]=oDestination.originalProperties.destinationConfiguration.apikey;
    oRequestConfig.data = oPayload;
    // console.log(`Request URL ${oRequestConfig.baseURL}`);

    // console.log(`Request Body ${oRequestConfig.data}`);

            try{

                let response = await axios.request(oRequestConfig);
               // debugger;
                // return JSON.stringify(response.data);
                return "Success"
            }
            catch(error){
         
                console.log(`Error while processing API call AddSupplier4Event : ${error} `);
                return "Error"
                  
            }
         
        
}

async function AddEventRules(oPayload,DocID) {
   // debugger;
    let realm = 'AribaRealm';
    let oDestination;
    oDestination = await cloudSDK.getDestination("Event-Sourcing-AribaRealm");
    let EventEndpoint = `/events/${DocID}/rules`;
    
    //Destination validation 
    if(!(oDestination) || !(oDestination.originalProperties.destinationConfiguration.apikey)) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    //building request  
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);
    oRequestConfig.baseURL = oRequestConfig.baseURL + EventEndpoint;
    oRequestConfig.method = "put";
    
    oRequestConfig.params = {
                             realm:realm ,
                             user:'I511XXX',
                             passwordAdapter:'PasswordAdapter1'                                        
                            };

    oRequestConfig.headers["Accept"]=oRequestConfig.headers["Content-Type"]="application/json";
    oRequestConfig.headers["apikey"]=oDestination.originalProperties.destinationConfiguration.apikey;
    oRequestConfig.data = oPayload;
    // console.log(`Request URL ${oRequestConfig.baseURL}`);

    // console.log(`Request Body ${oRequestConfig.data}`);

            try{

                let response = await axios.request(oRequestConfig);
              //  debugger;
                return JSON.stringify(response.data);
                //return "Success"
            }
            catch(error){
         
                console.log(`Error while processing API call AddEventRules : ${error} `);
                return "Error"
                  
            }
         
        
}

async function PublishTemplate(oPayload) {
    // debugger;
    let realm = 'AribaRealm';
    let oDestination;
    oDestination = await cloudSDK.getDestination("Event-Sourcing-AribaRealm");
    let EventEndpoint = `/jobs`;
    
    //Destination validation 
    if(!(oDestination) || !(oDestination.originalProperties.destinationConfiguration.apikey)) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    //building request  
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);
    oRequestConfig.baseURL = oRequestConfig.baseURL + EventEndpoint;
    oRequestConfig.method = "post";
    
    oRequestConfig.params = {
                             realm:realm ,
                             user:'I511XXX',
                             passwordAdapter:'PasswordAdapter1'                                        
                            };

    oRequestConfig.headers["Accept"]=oRequestConfig.headers["Content-Type"]="application/json";
    oRequestConfig.headers["apikey"]=oDestination.originalProperties.destinationConfiguration.apikey;
    oRequestConfig.data = oPayload;
    console.log('Publishing the TEmplate:in Ariba Handler');
    console.log(`Request URL ${oRequestConfig.baseURL}`);

     console.log(`Request Body ${oRequestConfig.data}`);

            try{

                let response = await axios.request(oRequestConfig);
               // return JSON.stringify(response.data);
                return "Success"
            }
            catch(error){
         
                console.log(`Error while processing API call PublishTemplate : ${error} `);
                return "Error"
                  
            }
         
        
}

module.exports = {
    createEvent,
    createItemforEvent,
    AddSupplier4Event,
    AddEventRules,
    PublishTemplate,
    GetEventStatus,
    GetAwardStatus,
    GetAwardDetails,
    GetAwardScenarios,
    SubmitAward
};