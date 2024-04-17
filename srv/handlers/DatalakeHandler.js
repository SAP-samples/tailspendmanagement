"use strict";

//libraries
const cds = require("@sap/cds");
const cloudSDK = require("@sap-cloud-sdk/core");
const { default: axios } = require("axios");
const { v4: uuidv4 } = require('uuid');
//     debugger;

const { TailSpendSuppliers , AutoRFPRules } = cds.entities('com.sap.tailspend');

async function doGetSupplierData(req){
    
    let oData = req.data;

    let sRealm = oData.realm;
    let Category = oData.Category;
    let Region = oData.Region;

    let sDestination = "Data-Extractor-Application";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

   // console.log(req);
    console.log("Category" , Category);
    console.log("Region" , Region);

    oRequestConfig.method = "get";
    oRequestConfig.url = `SLPSuppliers_Qualifications?$filter=(Category eq '${Category}' and SLPSupplier_Realm eq 'AribaRealm' and QualificationStatus eq 'Qualified' and Region eq '${Region}')&$expand=SLPSupplier($select=SupplierName,AddressPostalCode,AddressRegionCode,AddressCountryCode,AddressLine1,AddressCity)`;

    // oRequestConfig.url = `SLPSuppliers_Qualifications?$filter=(Category eq '${Category}' and QualificationStatus eq 'Qualified' and Region eq '${Region}')&$expand=SLPSupplier($select=SupplierName,AddressPostalCode,AddressRegionCode,AddressCountryCode,AddressLine1,AddressCity)`;
    oRequestConfig.headers["Content-Type"] = "application/json";
  
    let response = await axios.request(oRequestConfig)

    .catch(function (oError) {
        // logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });

    //console.log(response.data);

    // return response.data.value;

    return JSON.stringify(response.data.value);
}

async function doGetRules(req){
    
    debugger;
    var startbiddate = new Date().toISOString();
    var endbiddate; var previewvalue;
    var currentDate = new Date();
    
    let RFPRules = await SELECT.one.from("com.sap.tailspend.AutoRFPRules");
    let Minutes = parseInt(RFPRules.BiddingPeriod);
    if (RFPRules.BiddingPeriod)
    {
       currentDate.setMinutes(currentDate.getMinutes() + Minutes)
       endbiddate = currentDate.toISOString();
    }
    else
    {
        //Default Minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30)
        endbiddate = currentDate.toISOString();
    }
    
    if (RFPRules.PlaceBidsPreviewPeriod == true)
    {
      previewvalue = 'Allow prebids';
    }
    else
    {
      previewvalue = 'Do not allow prebids';
    }

    const RFPRulesJSON = 
       [
        {
            "id": 23,
            "label": "Bidding start time",
            "fieldName": "PlannedBeginDate",
            "valueType": 5,
           "ruleValue": {
                        "dateValue": `${startbiddate}`
                         },
            "property": 0,
            "ruleChoices": null,
            "validity": null
        },
        {
            "id": 26,
            "label": "Response end time",
            "fieldName": "PlannedEndDate",
            "valueType": 5,
           "ruleValue": {
                        "dateValue": `${endbiddate}`
                         },
            "property": 0,
            "ruleChoices": null,
            "validity": null
        },
		{
            "id": 19,
            "label": "Can participants place bids during preview period",
            "fieldName": "PreviewPeriodType",
            "valueType": 3,
            "ruleValue": {
                "stringValue": `${previewvalue}`
            },
            "property": 1,
            "ruleChoices": [
                {
                    "choiceName": "Do not allow prebids",
                    "choiceValue": 1,
                    "booleanValue": null
                },
                {
                    "choiceName": "Allow prebids",
                    "choiceValue": 2,
                    "booleanValue": null
                }

				],
            "validity": null
        },
		{
            "id": 98,
            "label": "Require participant to give a reason for declining to bid",
            "fieldName": "DeclineReasonForLotLineItem",
            "valueType": 7,
            "ruleValue": {
                "booleanValue": `${RFPRules.ReasontoDeclineBid}`
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
                "booleanValue": `${RFPRules.SubmitbyEmail}`
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
                "booleanValue": `${RFPRules.SupplierAddItems}`
            },
            "property": 1,
            "ruleChoices": null,
            "validity": null
        }
    ];

    return JSON.stringify(RFPRulesJSON);
}

async function doGetCustomAwardRules(req){
    
    debugger;
    let RFPRules = await SELECT.one.from("com.sap.tailspend.AutoRFPRules");

    return JSON.stringify("");
}

async function doGetSupplierDetailData(req){
    
    let oData = req.data;
    var Activeflag = false;
    let SMID = oData.SMID;
    let Region = oData.Region;
    let CategoryID = oData.Category;
    
    console.log(SMID ,Region , CategoryID);

    let sDestination = "Data-Extractor-Application";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    
    oRequestConfig.method = "get";
    oRequestConfig.url = `SLPSuppliers_Qualifications?$filter=(QualificationStatus eq 'Qualified' and SLPSupplier_Realm eq 'AribaRealm' and SLPSupplier_SMVendorId eq '${SMID}' and Region eq '${Region}' and Category eq '${CategoryID}')&$expand=SLPSupplier`;
    oRequestConfig.headers["Content-Type"] = "application/json";
    debugger;

    let response = await axios.request(oRequestConfig)   
    .catch(function (oError) {
            throw Error("There was an error when calling the API");
        });

    let PreferredSupplier = await SELECT.one.from("com.sap.tailspend.TailSpendSuppliers").where({SLPID : SMID, CategoryID: CategoryID,RegionID: Region});
    if (PreferredSupplier != null )
    {
        Activeflag = PreferredSupplier.AutoRFQEligble === 'X' ? true : false;
    }
    
    const result = await Promise.all([response,PreferredSupplier]);
    response.data.value[0].checked = Activeflag;
    return JSON.stringify(response.data.value[0]);
}

async function doGetERPSupplierData(ACMID){
    let sDestination = "Data-Extractor-Application";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    
    oRequestConfig.method = "get";
    oRequestConfig.url = `SLPSuppliers?$filter=( ACMId eq '${ACMID}' or SupplierId eq '${ACMID}') and Realm eq 'AribaRealm'`;
    oRequestConfig.headers["Content-Type"] = "application/json";

    let response = await axios.request(oRequestConfig)   
    .catch(function (oError) {
            throw Error("There was an error when calling the API");
        });

   
    const result = await Promise.all([response]);

    return JSON.stringify(response.data.value);
}

async function doGetSMID(ACMID){
    let sDestination = "Data-Extractor-Application";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    
    oRequestConfig.method = "get";
    oRequestConfig.url = `SLPSuppliers?$filter=( ACMId eq '${ACMID}') and Realm eq 'AribaRealm'`;
    oRequestConfig.headers["Content-Type"] = "application/json";

    let response = await axios.request(oRequestConfig)   
    .catch(function (oError) {
            return `Error`;
        });

   
    const result = await Promise.all([response]);
    console.log(JSON.stringify(response.data.value)) ;
    return JSON.stringify(response.data.value);
}

async function doGetCategoriesData(req){
    
     let sRealm = req.realm;
  
    let sDestination = "Data-Extractor-Application";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);
 
    oRequestConfig.method = "get";
    oRequestConfig.url = `SLPSuppliers_Qualifications?$filter=(QualificationStatus eq 'Qualified' and SLPSupplier_Realm eq 'AribaRealm')&$apply=groupby((Category,QualificationStatus,Region,SLPSupplier_Realm),aggregate($count as count))`;
    oRequestConfig.headers["Content-Type"] = "application/json";
  
    let response = await axios.request(oRequestConfig)

    .catch(function (oError) {
        throw Error("There was an error when calling the API");
    });


    return JSON.stringify(response.data.value);
}

module.exports = {
    doGetCategoriesData,
    doGetSupplierData,
    doGetSupplierDetailData,
    doGetCustomAwardRules,
    doGetERPSupplierData,
    doGetRules,
    doGetSMID
};

