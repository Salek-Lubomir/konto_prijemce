sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], (Controller, MessageToast) => {
	"use strict";

	return Controller.extend("ui5.kp.controller.App", {

		onShowHello() {
			// read msg from i18n model
			const oBundle = this.getView().getModel("i18n").getResourceBundle();
			const sRecipient = this.getView().getModel().getProperty("/recipient/name");
			const sMsg = oBundle.getText("helloMsg", [sRecipient]);

			// show message
			MessageToast.show(sMsg);
		},
		
		onSelectData() {

//			var oDtaSubjList = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z_MATERIAL_LIST_SRV/", true);

			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("sbjlst");
			
		}		
	});
});
