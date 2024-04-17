sap.ui.define([
	'com/sap/pgp/dev/AutoRFQApp/controller/BaseController',
	'sap/m/MessageToast',
	'sap/ui/model/json/JSONModel',
	'com/sap/pgp/dev/AutoRFQApp/model/formatter',
	"sap/m/MessageBox",
	"sap/ui/export/Spreadsheet",
	"sap/ui/model/odata/v2/ODataModel",
	'sap/ui/export/library',
], function (BaseController, MessageToast, JSONModel, formatter,MessageBox,Spreadsheet,ODataModel,exportLibrary) {
	"use strict";
	var EdmType = exportLibrary.EdmType;

	return BaseController.extend("com.sap.tailspend.controller.settings.FileExport", {
		formatter: formatter,

		onInit: function () {
			// var oViewModel = new JSONModel({
			// 		currentUser: "Administrator",
			// 		lastLogin: new Date(Date.now() - 86400000)
			// 	});

			// this.setModel(oViewModel, "view");
		},
		onExit: function() {
			this._oMockServer.stop();
		},
		createColumnConfig: function() {
			var aCols = [];

			aCols.push({
				property: 'Name',
				type: EdmType.String
			});

			aCols.push({
				property: 'Category',
				type: EdmType.String
			});

			aCols.push({
				property: 'Firstname',
				type: EdmType.String
			});

			aCols.push({
				property: 'AssetID',
				type: EdmType.String
			});

			aCols.push({
				property: 'Location',
				type: EdmType.String
			});

			aCols.push({
				property: 'Description',
				type: EdmType.String
			});

			
			return aCols;
		},
		onDetailsPress : function(oEvent) {

			var oTable = this.getView().byId("assetexporttable"),
            oRowBinding, aCols, oSettings, oSheet;
            
			oRowBinding = oTable.getBinding("rows");
			aCols = this.createColumnConfig();
			
			oSettings = {
				workbook: {
					columns: aCols
					//hierarchyLevel: 'Level'
				},
				dataSource: oRowBinding,
				fileName: "AssetProducts.xlsx"
				//worker: false // We need to disable worker because we are using a MockServer as OData Service
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function() {
				oSheet.destroy();
			});


		},
		onMasterPressed: function (oEvent) {
			var oContext = oEvent.getParameter("listItem").getBindingContext("side");
			var sPath = oContext.getPath() + "/selected";
			oContext.getModel().setProperty(sPath, true);
			var sKey = oContext.getProperty("key");
			switch (sKey) {
				case "systemSettings": {
					this.getRouter().navTo(sKey);
					break;
				}
				default: {
					this.getBundleText(oContext.getProperty("titleI18nKey")).then(function(sMasterElementText){
						this.getBundleText("clickHandlerMessage", [sMasterElementText]).then(function(sMessageText){
							MessageToast.show(sMessageText);
						});
					}.bind(this));
					break;
				}
			}
		},

		handleUploadComplete: function(oEvent) {
			breakpoint;
			var sResponse = oEvent.getParameter("response"),
				iHttpStatusCode = parseInt(/\d{3}/.exec(sResponse)[0]),
				sMessage;

			if (sResponse) {
				sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
				MessageToast.show(sMessage);
			}
		},

		handleUploadPress: function() {
			breakpoint;
			var oFileUploader = this.byId("fileUploader");
			oFileUploader.checkFileReadable().then(function() {
				oFileUploader.upload();
			}, function(error) {
				MessageToast.show("The file cannot be read. It may have changed.");
			}).then(function() {
				oFileUploader.clear();
			});
		},

		onSavePressed: function (oEvent) {
			this.onGeneralButtonPress(oEvent);
		},

		onCancelPressed: function (oEvent) {
			this.onGeneralButtonPress(oEvent);
		},

		onGeneralButtonPress: function(oEvent){
			var sButtonText = oEvent.getSource().getText();
			this.getBundleText("clickHandlerMessage", [sButtonText]).then(function(sMessageText){
				MessageToast.show(sMessageText);
			});
		},

		onNavButtonPress: function  () {
			this.getOwnerComponent().myNavBack();
		},
		onStartUpload: function(oEvent) {
		
			var oUploadCollection = this.byId("UploadCollection");
		//	var oTextArea = this.byId("TextArea");
			var cFiles = oUploadCollection.getItems().length;
			var uploadInfo = cFiles + " file(s)";
			if (cFiles == 1) {
				oUploadCollection.upload();

				// if (oTextArea.getValue().length === 0) {
				// 	uploadInfo = uploadInfo + " without notes";
				// } else {
				// 	uploadInfo = uploadInfo + " with notes";
				// }

			//	MessageToast.show("Method Upload is called (" + uploadInfo + ")");
				MessageBox.information("Uploaded " + uploadInfo);
			//	oTextArea.setValue("");
			}
			else {
				MessageBox.error("Please select an asset file from your desktop to start import process");
			}
		},
		/**
		 * Returns a promises which resolves with the resource bundle value of the given key <code>sI18nKey</code>
		 *
		 * @public
		 * @param {string} sI18nKey The key
		 * @param {string[]} [aPlaceholderValues] The values which will repalce the placeholders in the i18n value
		 * @returns {Promise<string>} The promise
		 */
		getBundleText: function(sI18nKey, aPlaceholderValues){
			return this.getBundleTextByModel(sI18nKey, this.getModel("i18n"), aPlaceholderValues);
		}
	});
});