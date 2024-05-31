sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], (Controller, JSONModel, MessageToast) => {
	"use strict";

	return Controller.extend("ui5.kp.controller.SubjectList", {

		onInit: function () {
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("sbjlst").attachPatternMatched(this.onObjectMatched, this);
		},

		onObjectMatched(oEvent) {
			const oJsonModel = new sap.ui.model.json.JSONModel();
			const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLSD_SRV/");
			var sRc = window.decodeURIComponent(oEvent.getParameter("arguments").Rc);
			var sJmeno = window.decodeURIComponent(oEvent.getParameter("arguments").Jmeno);
			var sPrijmeni = window.decodeURIComponent(oEvent.getParameter("arguments").Prijmeni);

			oModel.read("/SubjOss", {
				filters: [
					new sap.ui.model.Filter({
						path: "JmnOsb",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: sJmeno
					}),
					new sap.ui.model.Filter({
						path: "PrjOsb",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: sPrijmeni
					})
				],
				success: function (oData, oResponse) {
					oJsonModel.setData(oData);
				},
				error: function (oError) {
					console.error(oError);
				}
			});
		},

		onShowHello() {
			// read msg from i18n model
			const oBundle = this.getView().getModel("i18n").getResourceBundle();
			const sRecipient = this.getView().getModel().getProperty("/recipient/name");
			const sMsg = oBundle.getText("helloMsg", [sRecipient]);

			// show message
			MessageToast.show(sMsg);
		},


	});
});
