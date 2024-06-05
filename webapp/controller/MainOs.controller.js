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
		},

		onSelectionChange : function (oEvent) {
//			var obj = oEvent.getSource().getBindingContext();
			var sPath = oEvent.getParameter("listItem").getBindingContextPath();
			// var sPath = oEvent.getParameter("listItem").getBindingContext().getPath();
			// var oModel = oEvent.getParameter("listItem").getBindingContext().getModel();
//			var idnSbj = oEvent.getParameter("listItem").getBindingContext().getProperty("Idnsbj");
//				"sPath": window.encodeURIComponent(sPath)
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("rt_detail_os", {
				"sPath":  window.encodeURIComponent(sPath)
			});
		}

	});
});
