//@ts-nocheck
sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/f/LayoutType",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType"
],

	function (BaseController, JSONModel, LayoutType, MessageBox, MessageToast, Filter, FilterOperator, FilterType) {
		"use strict";

		return BaseController.extend("com.sap.tailspend.controller.SupplierByCategory", {

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit: function () {
				this.setModel(new JSONModel({
					layout: LayoutType.OneColumn
				}), "CategoryView");
				var oTableID = this.byId("idCategoryTable");
				oTableID.setBusy(true);

				// setTimeout(function() {
				// 	oTableID.setBusy(false);
				// }, 2000);

				this.getAccData();
			},


			getAccData: function () {
				debugger;
				var _this = this;
				$.ajax({
					type: 'GET',
					url: '/backend/v2/sourcing',
					headers: {
						'x-csrf-token': 'Fetch'
					},
					success: function(data, textStatus, request){
						debugger;
						var csrfToken = request.getResponseHeader('X-Csrf-Token');

						var fnSuccess = function (data) {
					

							var CategoryArr1 = JSON.parse(data.d.doGetCategoriesData);
		
							var oCatDesModel = _this.getView().getModel("CategoryDesc");
							var CategoryArr2 = oCatDesModel.getProperty("/CategoryDesc");
		
							debugger;
							const CategFinArray = CategoryArr1.map(item1 => {
								const item2 = CategoryArr2.find(item => item.UniqueName === item1.Category);
								if (item2)
								{
									return {
									...item1,
									...item2
									};
								}
								return item1;
							});
							 
						var oSMModel = _this.getView().getModel("CategoryAgg");
						oSMModel.setData(CategFinArray);
						var oTableID = _this.byId("idCategoryTable");
						oTableID.setBusy(false);
		
						}.bind(_this);
			
						var fnError = function (data) {
							console.log("Error in getAcc", data.toString());
							_this.getView().getModel("oViewModel").setProperty("/smbusy", false);
							MessageToast.show("Could not fetch SM Data Information. " + data.responseJSON.error.message.value);
						}.bind(_this);
						
			//first call
						var jdata = {
							realm: "AribaRealm"
						};
		
						$.ajax({
							type: "POST",
							url: "/backend/v2/sourcing/doGetCategoriesData",
							headers: {
								'X-Csrf-Token': csrfToken,
								"Content-Type": "application/json"
							},
							data: JSON.stringify(jdata),
							success: fnSuccess,
							error: fnError
						});

					},
					error: function(data,request)
					{

					}
				});

			
	
	
	
			},
			

			showDetail: function (oEvent) {

				console.log("binding context - get path" ,  oEvent.getParameter("listItem").getBindingContext("CategoryAgg").getPath()); 

			    var CategoryID = oEvent.getParameter("listItem").getBindingContext("CategoryAgg").getProperty("Category");

				var regionID = oEvent.getParameter("listItem").getBindingContext("CategoryAgg").getProperty("Region");

				var sID = CategoryID +'-'+regionID;

				console.log("Value of Category ID" ,  oEvent.getParameter("listItem").getBindingContext("CategoryAgg").getProperty("Category")); 

				console.log("Value of regionID" ,  regionID); 

					// this.getModel().resetChanges();
					this.getRouter().navTo("SupplierByCategory", {
						objectId: sID
					});
			},


			onFilterCategory : function (oEvent) {
				var oFilter = [];
				var sValue = oEvent.getParameter("query");
				debugger;
				if (sValue)
				{
					var oFilter = new Filter("Region", FilterOperator.Contains, sValue);
				}
				this.byId("idCategoryTable").getBinding("items").filter(oFilter);

			}
		});

	});