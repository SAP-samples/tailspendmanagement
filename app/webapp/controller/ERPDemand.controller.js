sap.ui.define([
	'./BaseController',
	'sap/ui/model/json/JSONModel',
	"sap/ui/VersionInfo",
	"sap/ui/core/mvc/XMLView",
	"sap/ui/core/Core"
], function (BaseController, JSONModel, VersionInfo, XMLView, oCore) {
	"use strict";
	return BaseController.extend("com.sap.tailspend.controller.ERPDemand", {

		onInit: function () {

			var router = sap.ui.core.UIComponent.getRouterFor(this);
				router.attachRoutePatternMatched(this._handleRouteMatched, this);

		},

		_handleRouteMatched: function(oEvent) { 
			if(oEvent.getParameter("name") == "ERPDemand")
			{
				debugger;

				var oDataModel = this.getOwnerComponent().getModel("SourcingMo");

				var _this = this;
				var oFilter = new sap.ui.model.Filter( {
					path: "BusinessSystem",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "HE4CLNT400"
				}
				)
				var oFilter1 = new sap.ui.model.Filter(
				{
					path: "BusinessSystem",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "Ariba"
				}
				)
					oDataModel.read("/PurchaseRequisition", {
					filters: [oFilter , oFilter1],
					success: function(oData, response) {
					
								var oModel = new sap.ui.model.json.JSONModel();
								_this.getView().setModel(oModel,"TailSpendModel");
								oModel.setData(oData);

															
									},
								error : function(oError) {
									//no entries available.. new insert
					
								} 
						});

						this.getView().byId("processform").setVisible(false);
////////////////////
				// debugger;

				// var sDataPath = sap.ui.require.toUrl("sap/suite/ui/commons/sample/ProcessFlowMergedLanes/ProcessFlowNodes.json");
				// var oModel = new JSONModel("model/data/ProcessFlowData.json");
				// this.getView().setModel(oModel,"ProcessFlow");

				// this.oProcessFlow = this.getView().byId("processflow");
				// this.oProcessFlow.updateModel();


			}
		},

	
		onClose: function(oEvent)
		{
			this.getView().byId("processform").setVisible(false);
		},

		onDetailsPress : function(oEvent) {
			debugger;
			var	ExportEventObject = oEvent.getSource().getBindingContext("TailSpendModel").getObject();
			var   PRID = ExportEventObject.PRID;
			var   PRITEM = ExportEventObject.PRITEM;
			var   PRStatus = ExportEventObject.Status;

			this.getView().byId("processform").setVisible(true);

			if (PRStatus == 'ERP Export Completed')
			{
				var oModel = new JSONModel("model/data/ProcessFlowData4.json");
				this.getView().setModel(oModel,"ProcessFlow");
	
				this.oProcessFlow = this.getView().byId("processflow");
			}
			else if (PRStatus == 'Event Published' )
			{
				var oModel = new JSONModel("model/data/ProcessFlowData1.json");
				this.getView().setModel(oModel,"ProcessFlow");
	
				this.oProcessFlow = this.getView().byId("processflow");
			}
			else if ( PRStatus == 'Award Export Ready')
			{
				var oModel = new JSONModel("model/data/ProcessFlowData3.json");
				this.getView().setModel(oModel,"ProcessFlow");
	
				this.oProcessFlow = this.getView().byId("processflow");
			}
			else if (PRStatus == 'Event Awarded')
			{
				var oModel = new JSONModel("model/data/ProcessFlowData2.json");
				this.getView().setModel(oModel,"ProcessFlow");
	
				this.oProcessFlow = this.getView().byId("processflow");
			}
			else if ( PRStatus == 'Sourcing Operations – Review')
			{
				var oModel = new JSONModel("model/data/ProcessFlowData.json");
				this.getView().setModel(oModel,"ProcessFlow");
	
				this.oProcessFlow = this.getView().byId("processflow");
			}

		

			// var oDataModel = this.getView().getModel("ItkMo");

			// var _this = this;
		
			// oDataModel.read("/ExportEvents", {
			// 	 filters: [new Filter("Realm", FilterOperator.EQ, RealmID),
			// 			   new Filter("Eventname", FilterOperator.EQ, EventName)],
			// 	success: function(oData, response) {
							 
			// 			var InitialLoadDate = oData.results[0].InitialLoadDate === null ? '': oData.results[0].InitialLoadDate;
			// 			var LastLoadDate = oData.results[0].LastLoadDate === null ? '': oData.results[0].LastLoadDate;
			// 			var Activated = oData.results[0].Activated == 'X' ? true : false;;
						
			// 		 	_this.getView().byId("exporteventform").setVisible(true);
			// 			_this.byId("INPInitLoad").setValue(InitialLoadDate);
			// 			_this.byId("TXLastLoadDate").setText(LastLoadDate);
			// 			_this.byId("TXActivated").setSelected(Activated);
			// 			_this.byId("TXRealm").setText(RealmID);
			// 			_this.byId("TXEventName").setText(EventName);
			// 			_this.byId("TXProcess").setText(Process);
			// 			_this.getView().byId("saveevent").setVisible(true);

			// 				},
			// 				error : function(oError) {
			// 					alert("Failure");
			// 				} 
			// 		});
	   },

		onRefresh: function () {

		}

	});
});