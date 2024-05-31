sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], (UIComponent, JSONModel, Log) => {
	"use strict";

	return UIComponent.extend("ui5.kp.Component", {
		metadata: {
			interfaces: ["sap.ui.core.IAsyncContentCreation"],
			manifest: "json"
		},

		init() {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			Log.setLevel(Log.Level.WARNING);
			Log.info("Log info");
			Log.debug("Log debug");
			Log.warning("Log warning");
			Log.error("Log error");
			Log.fatal("Log fatal");

			// set data model on view
			// const oData = {
			// 	soKP: {
			// 		Rc:       undefined,
			// 		Jmeno:    "Jan",
			// 		Prijmeni: "Novák"
			// 	},
			// 	recipient: {
			// 		name: "World"
			// 	}
			// };
			// const oModel = new JSONModel(oData);
			// this.setModel(oModel);
			
			// create the views based on the url/hash
			this.getModel("ui").setData({ selectedRoute: "" });
			this.getRouter().initialize();	
		}
	});
});
