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
			const key = event.getParameter("name");
			const uiModel = this.getOwnerComponent().getModel("ui");
			if (key === "rt_default") {
				uiModel.setProperty("/selectedRoute", "rt_os");
			} else {
				uiModel.setProperty("/selectedRoute", key);
			}
		},

		onSegmentedButtonSelectionChange: function(event) {
			this.navTo(event.getParameter("item").getKey());
		},		
		
		onSelectedRouteBindingChange: function(event) {
			this.navTo(event.getSource().getValue());
		},

		navTo: function(routeName) {
			if (routeName) {
				const router = this.getOwnerComponent().getRouter();
				router.navTo(routeName);
			}
		},
	});
});
