sap.ui.define([
    "sap/m/library",
	"./BaseController",
    "sap/m/Dialog",
    "sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"sap/m/MessageToast",
    "sap/m/Text",
	"sap/m/TextArea",
    "sap/m/ComboBox",
    "sap/ui/layout/HorizontalLayout",
	"sap/ui/layout/VerticalLayout",
    "sap/ui/core/Core",
    "sap/ui/core/format/DateFormat"
   
], function (mobileLibrary,Controller, Dialog, JSONModel, Button, MessageToast, Text, TextArea,ComboBox,HorizontalLayout, VerticalLayout,Core,DateFormat) {
	"use strict";
   
  	return Controller.extend("com.sap.tailspend.controller.AutoEventRules", {

 		onInit: function () {
			var oDataModel = this.getOwnerComponent().getModel("SourcingMo");
			var _this = this;
			debugger;
			this.setModel(new JSONModel({
				dataavailable: false
			}), "RulesView");

			  oDataModel.read("/AutoRFPRules", {
				success: function(oData, response) {
					      var vdataavailable = false;
						  var oModel = new sap.ui.model.json.JSONModel();
						  _this.getView().setModel(oModel,"RulesModel");
						 
						 var oRadioButtonGroup1 = _this.getView().byId("G001");
						 if  ( oData.results[0].AwardScenario == "Best Bid")
						 {
						  oRadioButtonGroup1.setSelectedButton(oRadioButtonGroup1.getButtons()[0]);
						 }
						 else if ( oData.results[0].AwardScenario == "Best Bid with Limited Number of Suppliers")
						 {
							oRadioButtonGroup1.setSelectedButton(oRadioButtonGroup1.getButtons()[1]);
						 }
 						 else if ( oData.results[0].AwardScenario == "Best Savings")
						 {
							oRadioButtonGroup1.setSelectedButton(oRadioButtonGroup1.getButtons()[2]);
						 }


						 var oRadioButtonGroup2 = _this.getView().byId("G006");
						 if  ( oData.results[0].EventCreationOption == "One Event per Requisition")
						 {
							oRadioButtonGroup2.setSelectedButton(oRadioButtonGroup2.getButtons()[0]);
						 }
						 else if ( oData.results[0].EventCreationOption == "Event per Category and Region")
						 {
							oRadioButtonGroup2.setSelectedButton(oRadioButtonGroup2.getButtons()[1]);
						 }
 						 



						 oModel.setData(oData.results[0]);
						  
						  if (oData.results.length != 0)
						  {
							vdataavailable = true;
						  }
						  _this.setModel(new JSONModel({
							dataavailable: vdataavailable,
							cuid: oData.results[0].ID
						}), "RulesView");
														
							   },
							error : function(oError) {
								_this.setModel(new JSONModel({
									dataavailable: false
								}), "RulesView");
				
							} 
					});

		},
		OnPressSave : function (oEvent) {

			var oRadioAwardButtonGroup = this.byId("G001");
			var iSelectedIndex = oRadioAwardButtonGroup.getSelectedIndex();
			var aRadioButtons  =  oRadioAwardButtonGroup.getButtons();
			var oSelectedRadioButton = aRadioButtons[iSelectedIndex];
			var AwardScenario = oSelectedRadioButton.getText();
			console.log("Selected RadioButton",AwardScenario)

			var BiddingPeriodEnd = this.getView().byId("G002").getValue();
			var InvitePrefSupplier = this.getView().byId("102").getState();
			var AutoPublish = this.getView().byId("G003").getState();
			var AutoAward = this.getView().byId("G004").getState();
			var WorkflowTemplate = this.getView().byId("G005").getValue();
			
			var oRadioAutoEventButtonGroup = this.byId("G006");
			var iSelectedIndex1 = oRadioAutoEventButtonGroup.getSelectedIndex();
			var aRadioButtons1  =  oRadioAutoEventButtonGroup.getButtons();
			var oSelectedRadioButton1 = aRadioButtons1[iSelectedIndex1];
			var AutoEventCreationApproach = oSelectedRadioButton1.getText();
			console.log("Selected RadioButton1",AutoEventCreationApproach)

			var AutoEventCreation = this.getView().byId("G007").getState();

			var PlaceBidsPreview = this.getView().byId("19").getState();
			var DeclineReason = this.getView().byId("98").getState();
			var BidbyEmail = this.getView().byId("126").getState();
			var SupplierAddItem = this.getView().byId("156").getState("102");
		
			var oAutoRFPRules = {
				AwardScenario: AwardScenario,
				BiddingPeriod  : BiddingPeriodEnd,
				InvitePreferredSupplier : InvitePrefSupplier,
				AutoPublish: AutoPublish,
				AutoAward : AutoAward,
				WorkflowTemplate : WorkflowTemplate,
				EventCreationOption: AutoEventCreationApproach,
				AutoEventCreation : AutoEventCreation,
				PlaceBidsPreviewPeriod : PlaceBidsPreview,
				ReasontoDeclineBid : DeclineReason,
				SubmitbyEmail : BidbyEmail,
				SupplierAddItems : SupplierAddItem
				}
   
			var EventsModel = this.getView().getModel("SourcingMo");
			debugger;
			var Eventparameter = '/AutoRFPRules';

			var RulesViewModel = this.getView().getModel("RulesView");
			if ( RulesViewModel.oData.dataavailable == true)
			{
		    // get the CUID from Init Function
			var cuid = RulesViewModel.oData.cuid;
			Eventparameter = Eventparameter + '(ID=' +  cuid + ')';

			EventsModel.update(Eventparameter, oAutoRFPRules, 
			{method: "PUT", success: mySuccessHandler, error: myErrorHandler});
			
			function mySuccessHandler(oRetrievedResult){
						MessageToast.show("Auto RFP Event Configuration Update Successfully Saved");
						// debugger;
						}
						function myErrorHandler(oError){
							MessageToast.show("Auto RFP Event: Failed to Update Configuration");
						// debugger;
						}
			}
			else
			{
			
		    debugger;
			EventsModel.create(Eventparameter, oAutoRFPRules, 
				{success: mySuccessHandler, error: myErrorHandler});
				
				function mySuccessHandler(oRetrievedResult){
							MessageToast.show("Auto RFP Event Configuration Successfully Saved");
							// debugger;
							}
							function myErrorHandler(oError){
								MessageToast.show("Auto RFP Event: Failed to save Configuration");
							// debugger;
							}
			} // end of else
		}       

	});
});