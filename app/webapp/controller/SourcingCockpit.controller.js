sap.ui.define([
	'./BaseController',
	'sap/ui/model/json/JSONModel',
	"sap/ui/VersionInfo",
	"sap/ui/core/mvc/XMLView",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Core"
], function (BaseController, JSONModel, VersionInfo, XMLView,  Filter, FilterOperator, oCore) {
	"use strict";
	return BaseController.extend("com.sap.tailspend.controller.SourcingCockpit", {

		onInit: function () {

			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.attachRoutePatternMatched(this._handleRouteMatched, this);

			// var oDataModel = this.getOwnerComponent().getModel("SourcingMo");
			// var _this = this;
			
			//   oDataModel.read("/RFPEvent", {
			// 	success: function(oData, response) {
			// 			  var oModel = new sap.ui.model.json.JSONModel();
			// 			  _this.getView().setModel(oModel,"RFPModel");
			// 			  oModel.setData(oData);
			// 				   },
			// 				error : function(oError) {
			// 					//no entries available.. new insert
				
			// 				} 
			// 		});

		},

		_handleRouteMatched: function(oEvent) { 
			if(oEvent.getParameter("name") == "SourcingCockpit")
			{
				var oDataModel = this.getOwnerComponent().getModel("SourcingMo");
				var _this = this;
				
				  oDataModel.read("/RFPEvent", {
					success: function(oData, response) {
							  var oModel = new sap.ui.model.json.JSONModel();
							  _this.getView().setModel(oModel,"RFPModel");
							  oModel.setData(oData);
								   },
								error : function(oError) {
									//no entries available.. new insert
					
								} 
						});

				this.getView().byId("rfpitemform").setVisible(false);						
			}
		},

		onClose: function(oEvent)
		{
			this.getView().byId("rfpitemform").setVisible(false);
		},

		onDetailsPress : function(oEvent) {
			debugger;
			var	  ExportEventObject = oEvent.getSource().getBindingContext("RFPModel").getObject();
			var   DocumentID = ExportEventObject.DOCID;
			var oDataModel = this.getView().getModel("SourcingMo");
			var _this = this;

		
			oDataModel.read("/RFPItems", {
				 filters: [new Filter("parent_DOCID", FilterOperator.EQ, DocumentID)],
				success: function(oData, response) {
						debugger;
						var oModel = new sap.ui.model.json.JSONModel();
						_this.getView().setModel(oModel,"RFPItemModel");
						oModel.setData(oData);
					 	_this.getView().byId("rfpitemform").setVisible(true);

							},
							error : function(oError) {
								alert("Failure");
							} 
					});
	   },

		onRefresh: function () {

		}

	});
});