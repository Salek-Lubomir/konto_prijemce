sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], (Controller, UIComponent, MessageToast, JSONModel) => {
	"use strict";

	return Controller.extend("ui5.kp.controller.MainSel", {

		onInit: function () {
			const router = UIComponent.getRouterFor(this);
			router.attachRoutePatternMatched(this.onPatternMatched, this);
		},

		onPatternMatched: function(event) {
			const oRouter = this.getOwnerComponent().getRouter();
			const name = event.getParameter("name");
			const uiModel = this.getOwnerComponent().getModel("ui");
			if (name === "rt_default") {
				uiModel.setProperty("/selectedRoute", "rt_main_os");
				oRouter.navTo("rt_main_os");
			} else {
				uiModel.setProperty("/selectedRoute", name);
			}
		},

		onSegmentedButtonSelectionChange: function(event) {
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo(event.getParameter("item").getKey());
		},		
		
		onSelectedRouteBindingChange: function(event) {
//			this.navTo(event.getSource().getValue());
		}

	});
});
