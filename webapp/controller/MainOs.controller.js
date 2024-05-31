sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], (Controller, MessageToast, JSONModel) => {
	"use strict";

	return Controller.extend("ui5.kp.controller.MainOs", {

		onInit: function () {
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLSD_SUBJOS_CDS/");
			this.getView().setModel(oModel);
		},

		onFilterBarInitialized: function (oEvent) {
 			 var oSmartFilterBar = this.byId("idSmartFilterBar");
// 			 var aGrpConf = oSmartFilterBar.getGroupConfiguration();
// 			 var oData = oSmartFilterBar.getFilters("to_Subjekt.Oidsbj");
 			 if (oSmartFilterBar.isInitialised()) {
			 	oSmartFilterBar.getControlByKey("Idnsbj").setEnabled(false);
 			 }
			// var oVariant = oSmartFilterBar.fetchVariant();
			// var oFilters = oSmartFilterBar.getFilters();
			// var oControlConf = oSmartFilterBar.getControlConfiguration();
		},

		initView: true,

		onBeforeRebindTable: function (oEvent) {
			var mBindingParams = oEvent.getParameter("bindingParams");
			if (this.initView) {
				// to apply the sort
				mBindingParams.sorter = [
					new sap.ui.model.Sorter({ path: "Prjosb", descending: false }),
					new sap.ui.model.Sorter({ path: "Jmnosb", descending: false }),
					new sap.ui.model.Sorter({ path: "Rdncsl", descending: false }),
				];
				// to short the sorted column in P13N dialog
				var oSmartTable = oEvent.getSource();
				oSmartTable.applyVariant({
					sort: {
						sortItems: [{
							columnKey: "Prjosb",
							operation: "Ascending"
						},
						{
							columnKey: "Jmnosb",
							operation: "Ascending"
						},
						{
							columnKey: "Rdncsl",
							operation: "Ascending"
						}]
					}
				});
				// to prevent applying the initial sort all times 
				this.initView = false;
			}

			// var oSmartTable = oEvent.getSource();
			// if (this._isOnInit == null) this._isOnInit = true; //To set this initial sorter only when view start
			// if (this._isOnInit) {
			// oSmartTable.applyVariant({
			// 	sort: {
			// 		sortItems: [{
			// 				columnKey: "Prjosb",
			// 				operation: "Ascending"
			// 			},
			// 			{
			// 				columnKey: "Jmnosb",
			// 				operation: "Ascending"
			// 			},
			// 			{
			// 				columnKey: "Rdncsl",
			// 				operation: "Ascending"
			// 			}
			// 		]
			// 	}
			// });
			// 	this._isOnInit = false;
			// }		
		}
	});
});
