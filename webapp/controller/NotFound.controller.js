sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History"
], (Controller,UIComponent,History) => {
	"use strict";

	return Controller.extend("ui5.kp.controller.NotFound", {

		onInit: function () {
		},

        onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
   			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
                const oRouter = UIComponent.getRouterFor(this);
    			oRouter.navTo("rt_default", {}, true /*no history*/);
			}
		}  

	});
});