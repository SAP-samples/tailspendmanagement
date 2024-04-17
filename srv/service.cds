using { com.sap.tailspend as my } from '../db/schema';
using { managed, sap } from '@sap/cds/common';

service SourcingService @(path:'/sourcing') 
{
    entity Categories as projection on my.Categories;
    entity Suppliers as projection on my.Suppliers;
    entity Regions as projection on my.Regions;

    entity Categories2Suppliers as projection on my.Categories2Suppliers
    {
     *,
     Categories.CategoryID as CategoryID,
     Categories.CategoryDesc as CategoryDesc,
     Suppliers.SupplierID as SupplierID,
     Suppliers.SupplierName as SupplierName,
     Suppliers.SupplierStreet as SupplierStreet,
     Suppliers.SupplierCity as SupplierCity,
     Suppliers.SupplierRegion as SupplierRegion,
     Suppliers.SupplierCountry as SupplierCountry,

    };

    entity Categories2Regions as projection on my.Categories2Regions
    {
     *,
     Categories.CategoryID as CategoryID,
     Categories.CategoryDesc as CategoryDesc,
     Regions.RegionID as RegionID,
     Regions.RegionName as RegionName
    };

   entity TailSpendSuppliers as projection on my.TailSpendSuppliers;
   
   entity PRApprovalHandler as projection on my.PRApprovalHandler;

   entity AutoRFPRules as projection on my.AutoRFPRules;

   entity SupplierOrganization2Users as projection on my.SupplierOrganization2Users;

    entity ACM2ERPMapping as projection on my.ACM2ERPMapping;

    entity RFPEvent as projection on my.RFPEvent;

    entity RFPItems as projection on my.RFPItems;

    entity Plant2ShipToAddress as projection on my.Plant2ShipToAddress;

    entity PurchaseRequisition as projection on my.PurchaseRequisition;

    entity MaterialGroup2Commodity as projection on my.MaterialGroup2Commodity;
    
    entity Country2Region as projection on my.Country2Region;
    
    entity RFPHandle as projection on my.RFPHandle;

    entity SMQuestionnairev1 as projection on my.SMQuestionnairev1;

    entity RFPTemplate as projection on my.RFPTemplate;

    entity TemplateQA as projection on my.TemplateQA;

    entity SupplierQA as projection on my.SupplierQA;





    action doGetCategoriesData (realm: String)  returns String;

    action doGetSupplierData (realm: String,Category: String,Region: String)  returns String;

    action doGetSupplierDetailData (realm: String, SMID: String, Region: String, Category: String) returns String;

    action doGetRules (realm: String)  returns String;

    action doGetCustomAwardRules (realm: String)  returns String;
    
    action doUpsertRequisition (entities: array of PurchaseRequisition)  returns String;

    action doUpsertRFP (entities: array of RFPEvent)  returns String;

    action doFormatRequisition (reqdata: String)  returns String;

    action docreateEventfromPR (type: String)  returns String;

    action createEvent (type: String)  returns String;
    
    action createEventinAribaperPR (type: String)  returns String;

    action doCreateMaterialGroupMapping (entities: array of MaterialGroup2Commodity)  returns String;

    action doPlantAddressMapping (entities: array of Plant2ShipToAddress)  returns String;

    action doCountrytoRegionMapping (entities: array of Country2Region)  returns String;

    action createAwardProcess (type: String)  returns String;

    action TestProcess (type: String)  returns String;

    action RetreiveAward (type: String)  returns String;

    action ExtractPRtoERP (type: String)  returns String;

    action ExtractPRtoAriba (type: String)  returns String;

    action Org2UserMapping (entities: array of SupplierOrganization2Users)  returns String;

    action ExtractPRDetails (type: String)  returns String;

    action UpdateRFPandPRStatus (PRNumber: String)  returns String;

     action doInsertAribaRequisition (reqdata: String)  returns String;

    action doUpdateAribaHandler(entities: array of PRApprovalHandler) returns String;

    action ProcessMiscAwardUpdate(type: String) returns String;

    action doGetPRComments(PR: String) returns String;

    action doLoadSupplierQA(entities: array of SupplierQA) returns String;

    action doLoadTemplateQA(entities: array of TemplateQA) returns String;

    action doLoadRFPTemplate(entities: array of RFPTemplate) returns String;

    action doLoadQuestionnaire(entities: array of SMQuestionnairev1) returns String;



}