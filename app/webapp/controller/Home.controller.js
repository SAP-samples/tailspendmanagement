sap.ui.define([
	'./BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/Device',
	'com/sap/pgp/dev/AutoRFQApp/model/formatter',
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, Device, formatter,Fragment,MessageToast,Filter,FilterOperator) {
	"use strict";
	return BaseController.extend("com.sap.tailspend.controller.Home", {
		formatter: formatter,

		onInit: function () {

			// var sDataPath = sap.ui.require.toUrl("sap/suite/ui/commons/demo/tutorial/model/data/News.json");
			// var oModel = new JSONModel(sDataPath);
			// this.getView().setModel(oModel, "news");

			var oViewModel = new JSONModel({
				isPhone : Device.system.phone
			});
			this.setModel(oViewModel, "view");
			this._oGlobalFilter = null;
			this._oPriceFilter = null;

		},

		formatJSONDate: function(date) {
			var oDate = new Date(Date.parse(date));
			return oDate.toLocaleDateString();
		},


		onNavToProcessFlow: function() {
			this.getRouter().navTo("Statistics");
		},

		onNavToAriba: function() {
			var sUrl = "http://AribaRealm.procurement.ariba.com"
			window.open(sUrl,"_blank");
		},

		onNavToNews: function(event) {
			debugger;
			if (event.getSource().getId() === "container-AutoRFQApp---home--tile-__tile3-0") {
				var sUrl = "https://www.youtube.com/watch?v=1cgtYJIrJRI"
				window.open(sUrl,"_blank");
			}
			if (event.getSource().getId() === "container-AutoRFQApp---home--tile-__tile3-1") {
				var sUrl = "https://www.youtube.com/watch?v=gn9QD0ibI30"
				window.open(sUrl,"_blank");
			}
			if (event.getSource().getId() === "container-AutoRFQApp---home--tile-__tile3-2") {
				var sUrl = "https://blogs.sap.com/2022/07/13/guided-sourcing-a-simple-solution-for-complex-sourcing/"
				window.open(sUrl,"_blank");
			}
			if (event.getSource().getId() === "container-AutoRFQApp---home--tile-__tile3-3") {
				var sUrl = "https://www.youtube.com/watch?v=KQ_DC_81TMY"
				window.open(sUrl,"_blank");
			}
		},
		onNavToERP: function() {
			var sUrl = "https://c00000000549-l000372-44202.da-euw4.demo-education.cloud.sap"
			window.open(sUrl,"_blank");
		},

		filterGlobally : function(oEvent) {
			var sQuery = oEvent.getParameter("query");
			this._oGlobalFilter = null;

			if (sQuery) {
				this._oGlobalFilter = new Filter([
					new Filter("Name", FilterOperator.Contains, sQuery),
					new Filter("Category", FilterOperator.Contains, sQuery),
					new Filter("Location", FilterOperator.Contains, sQuery),
					new Filter("AssetID", FilterOperator.Contains, sQuery)
				], false);
			}

			this._filter();
		},

		_filter : function() {
			var oFilter = null;

			if (this._oGlobalFilter && this._oPriceFilter) {
				oFilter = new Filter([this._oGlobalFilter, this._oPriceFilter], true);
			} else if (this._oGlobalFilter) {
				oFilter = this._oGlobalFilter;
			} else if (this._oPriceFilter) {
				oFilter = this._oPriceFilter;
			}

			this.byId("assettable").getBinding().filter(oFilter, "Application");
		},
		onDetailsPress : function(oEvent) {
			// var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2),
			// 	supplierPath = oEvent.getSource().getBindingContext("products").getPath(),
			// 	supplier = supplierPath.split("/").slice(-1).pop();
			// 	supplier = supplier.substring(21, supplier.length - 2);

			// 	this.oRouter.navTo("InventoryDetailDetail", {layout: oNextUIState.layout, product: this._product, supplier: supplier});
			// // MessageToast.show("Details for product with id " + this.getView().getModel().getProperty("ProductId", oEvent.getSource().getBindingContext()));

		//	var oItem= this.getView().byId("assettable").getSelectedItem();
		//	var oEntry = oItem.getBindingContext("products").getObject();
		    var selectedindex = this.getView().byId("assettable").getSelectedIndex();
			if ( selectedindex >= 0 )
			{
			// var productPath = oEvent.getSource().getBindingContext("assettable").getPath();
			// var oEntry = oEvent.getSource().getBindingContext("products").getObject();
			// var oItem= this.getView().byId("assettable");

			var oModel = this.getView().getModel("QuickViewAsset");
			this.openQuickView(oEvent, oModel);
			}
			else
			{
				MessageToast.show("Please select an Asset to see the Details");
			}

		},
		openQuickView: function (oEvent, oModel) {
			var oButton = oEvent.getSource(),
				oView = this.getView();

			if (!this._pQuickView) {
				this._pQuickView = Fragment.load({
					id: oView.getId(),
					name: "com.sap.tailspend.view.QuickViewDialog",
					controller: this
				}).then(function (oQuickView) {
					oView.addDependent(oQuickView);
					return oQuickView;
				});
			}
			this._pQuickView.then(function (oQuickView){
				oQuickView.setModel(oModel);
				oQuickView.openBy(oButton);
			});
		}

	});
});