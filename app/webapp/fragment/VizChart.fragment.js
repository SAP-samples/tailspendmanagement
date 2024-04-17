sap.ui.define([
	"jquery.sap.global",
	"sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/viz/ui5/data/DimensionDefinition",
	"sap/viz/ui5/data/MeasureDefinition",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/ui/model/json/JSONModel"
], function(jQuery, VizFrame, FlattenedDataset, DimensionDefinition, MeasureDefinition, FeedItem, JSONModel) {
	"use strict";

	return sap.ui.jsfragment("com.sap.tailspend.fragment.VizChart", {
		createContent: function(controller) {

			var oVizFrame = new VizFrame({
				height: "700px",
				width: "100%",
				vizType: "vertical_bullet",
				uiConfig: {
					applicationSet: 'fiori'
				}
			});

			var oDataset = new FlattenedDataset({
				dimensions: new DimensionDefinition({
					name: "Fiscal Year",
					value: "{id}"
				}),
				measures: [
					new MeasureDefinition({
						name: "ERPDemand",
						value: "{temperature}"
					}),
					new MeasureDefinition({
						name: "Target ERPDemand",
						value: "{target}"
					})
				],
				data: "{/Temperatures}"
			});

			oVizFrame.setDataset(oDataset);

			oVizFrame.addFeed(new FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: [
					"ERPDemand"
				]
			}));

			oVizFrame.addFeed(new FeedItem({
				uid: "targetValues",
				type: "Measure",
				values: [
					"Target ERPDemand"
				]
			}));

			oVizFrame.addFeed(new FeedItem({
				uid: "categoryAxis",
				type: "Dimension",
				values: [ "Fiscal Year" ]
			}));

			oVizFrame.setVizProperties({
				plotArea: {
					showGap: true
				},
				title: {
					visible: false
				},
				valueAxis: {
					title: {
						// text: controller.getOwnerComponent().getModel("i18n").getResourceBundle().getText("chartContainerTemperature")
                        text: "ERP Demand"
					}
				}
			});

			// var sDataPath = sap.ui.require.toUrl("sap/suite/ui/commons/demo/tutorial/model/data/IceCreamTestData.json");
			var oModel = new JSONModel("model/data/Reports.json");
			controller.getView().setModel(oModel);

			return oVizFrame;
		}
	});
});
