sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], (Controller, UIComponent, MessageToast, JSONModel) => {
	"use strict";

	return Controller.extend("ui5.kp.controller.DetailOs", {

		onInit: function () {
			const oRouter = UIComponent.getRouterFor(this);
			oRouter.getRoute("rt_detail_os").attachPatternMatched(this.onPatternMatched, this);
		},

		onPatternMatched: function (oEvent) {
			const name = oEvent.getParameter("name");
			var sPath = window.decodeURIComponent(oEvent.getParameter("arguments").sPath);					
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLSD_SUBJOS_CDS/");
			this.getView().setModel(oModel);
			this.getView().bindElement(sPath);
		}

	});
});
