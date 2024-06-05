sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], (Controller, MessageToast, JSONModel) => {
	"use strict";

	return Controller.extend("ui5.kp.controller.MainOr", {

		onInit: function () {
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLSD_SUBJOR_CDS/");
			this.getView().setModel(oModel);
		},

		initView: true,

		onBeforeRebindTable: function (oEvent) {
			var mBindingParams = oEvent.getParameter("bindingParams");
			if (this.initView) {
				// to apply the sort
				mBindingParams.sorter = [ 
					new sap.ui.model.Sorter({ path: "Nzvorg", descending: false }),
					new sap.ui.model.Sorter({ path: "Icoorg", descending: false })
				];
				// to short the sorted column in P13N dialog
				var oSmartTable = oEvent.getSource();
				oSmartTable.applyVariant({
					sort: {
						sortItems: [{
							columnKey: "Nzvorg",
							operation: "Ascending"
						},
						{
							columnKey: "Icoorg",
							operation: "Ascending"
						}]
					}
				});
				// to prevent applying the initial sort all times 
				this.initView = false;
			}
		},

		onSelectionChange : function (oEvent) {
			var sPath = oEvent.getParameter("listItem").getBindingContextPath();
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("rt_detail_or", {
				"sPath":  window.encodeURIComponent(sPath)
			});
		}		
		
	});	
});
