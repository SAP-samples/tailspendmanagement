const cds = require('@sap/cds')
const DatalakeHandler = require('./handlers/DatalakeHandler');
const EventHandler = require('./handlers/EventHandler');
const AribaHandler = require('./util/AribaHandler');
const AdminHandler = require('./util/AdminHandler');


module.exports = cds.service.impl((srv) => {

  srv.on('test', async (req) => {
    return "Hello word";
  });

  srv.on('doGetCategoriesData', DatalakeHandler.doGetCategoriesData);

  srv.on('doGetSupplierData', DatalakeHandler.doGetSupplierData);

  srv.on('doGetSupplierDetailData', DatalakeHandler.doGetSupplierDetailData);
  
  srv.on('doGetRules', DatalakeHandler.doGetRules);
  
  srv.on('doGetCustomAwardRules', EventHandler.doGetCustomAwardRules);
  
  srv.on('doUpsertRequisition', EventHandler.doUpsertRequisition);

  srv.on('doUpsertRFP', EventHandler.doUpsertRFP);

  srv.on('doFormatRequisition', EventHandler.doFormatRequisition);

  srv.on('docreateEventfromPR', EventHandler.docreateEventfromPR);

  srv.on('createEvent', AribaHandler.createEvent);
  
  srv.on('createEventinAribaperPR', EventHandler.createEventinAribaperPR);

  srv.on('doCreateMaterialGroupMapping', AdminHandler.doCreateMaterialGroupMapping);

  srv.on('doPlantAddressMapping', AdminHandler.doPlantAddressMapping);

  srv.on('doCountrytoRegionMapping', AdminHandler.doCountrytoRegionMapping);

  srv.on('createAwardProcess', EventHandler.createAwardProcess);
  
  srv.on('TestProcess', EventHandler.TestProcess);

  srv.on('RetreiveAward', EventHandler.RetreiveAward);

  srv.on('ExtractPRtoERP', EventHandler.ExtractPRtoERP);
  
  srv.on('ExtractPRtoAriba', EventHandler.ExtractPRtoAriba);

  srv.on('ACM2ERPMapping', AdminHandler.ACM2ERPMapping);

  srv.on('Org2UserMapping', AdminHandler.Org2UserMapping);

  srv.on('ExtractPRDetails', EventHandler.ExtractPRDetails);
  
  srv.on('UpdateRFPandPRStatus', EventHandler.UpdateRFPandPRStatus);

  srv.on('doUpdateAribaHandler', AdminHandler.doUpdateAribaHandler);

  srv.on('ProcessMiscAwardUpdate', EventHandler.ProcessMiscAwardUpdate);
  
  srv.on('doGetPRComments', EventHandler.doGetPRComments);

  srv.on('doLoadSupplierQA',AdminHandler.doLoadSupplierQA);
  srv.on('doLoadTemplateQA',AdminHandler.doLoadTemplateQA);
  srv.on('doLoadRFPTemplate',AdminHandler.doLoadRFPTemplate);
  srv.on('doLoadQuestionnaire',AdminHandler.doLoadQuestionnaire);

})