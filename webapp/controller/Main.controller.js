sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], (Controller, MessageToast, JSONModel) => {
	"use strict";

	return Controller.extend("ui5.kp.controller.Main", {

		onInit: function () {
			// set data model on view
			const oData = {
				soKP: {
					Rc: undefined,
					Jmeno: "Jan",
					Prijmeni: "Novák"
				},
				recipient: {
					name: "World"
				}
			};
			//			const oModel = new JSONModel(oData);

			var oGRPA = this.getView().byId("GRPA");
			var idx = oGRPA.getSelectedIndex();
			switch (idx) {
				case 0:
					var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLSD_SUBJOS_CDS/");
					break;
				case 1:
					var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLSD_SUBJOR_CDS/");
					break;
				default:
				// code block
			}
			this.getView().setModel(oModel);

			var oGRPABtn = oGRPA.getSelectedButton();

		},

		onSelectGRPA: function (oEvt) {
			const oRouter = this.getOwnerComponent().getRouter();
			var oSmartFilterBar = this.getView().byId("idSmartFilterBar");
			var idx = oEvt.getParameter("selectedIndex");
			switch (idx) {
				case 0:
					oRouter.navTo("os");
					break;
				case 1:
					oRouter.navTo("or");
					break;
				default:
				// code block
			}
		},

		onShowHello() {
			// read msg from i18n model
			const oBundle = this.getView().getModel("i18n").getResourceBundle();
			const sRecipient = this.getView().getModel().getProperty("/recipient/name");
			const sMsg = oBundle.getText("helloMsg", [sRecipient]);

			// show message
			MessageToast.show(sMsg);
		},

		onSelectData() {
			/*
						const oJsonModel = new sap.ui.model.json.JSONModel();
						const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLSD_SRV/");
						const sJmeno = window.encodeURIComponent(this.getView().getModel().getProperty("/soKP/Jmeno"));
						const sPrijmeni = window.encodeURIComponent(this.getView().getModel().getProperty("/soKP/Prijmeni"));
			*/
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("sbjlst");
			/*			oRouter.navTo("sbjlst", {
							"Rc": window.encodeURIComponent(this.getView().getModel().getProperty("/soKP/Rc")),
							"Jmeno": window.encodeURIComponent(this.getView().getModel().getProperty("/soKP/Jmeno")),
							"Prijmeni": window.encodeURIComponent(this.getView().getModel().getProperty("/soKP/Prijmeni"))
						});*/

		}
	});
});
