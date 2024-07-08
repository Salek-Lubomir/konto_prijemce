sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/base/security/encodeURL",
	"sap/ui/core/CalendarType",
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/FilterProcessor"
], (Controller, MessageToast, JSONModel, encodeURL, CalendarType, DateFormat, FilterProcessor) => {
	"use strict";

	return Controller.extend("ui5.kp.controller.MainOs", {

		onInit: function () {
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLSD_SUBJOS_CDS/");
			this.getView().setModel(oModel);
		},

		initView: true,

		onBeforeRebindTable: function (oEvent) {

			function createWhereParams(vFilter, oMetadata, oEntityType) {
				var that = this,
					oFilter = Array.isArray(vFilter) ? FilterProcessor.groupFilters(vFilter) : vFilter;

				function convertLegacyFilter(oFilter) {
					// check if sap.ui.model.odata.Filter is used. If yes, convert it to sap.ui.model.Filter
					if (oFilter && typeof oFilter.convert === "function") {
						oFilter = oFilter.convert();
					}
					return oFilter;
				};

				function create(oFilter, bOmitBrackets) {
					oFilter = convertLegacyFilter(oFilter);

					if (oFilter.aFilters) {
						return createMulti(oFilter, bOmitBrackets);
					}
					return createWhereSegment(oFilter.sPath, oMetadata, oEntityType, oFilter.sOperator, oFilter.oValue1, oFilter.oValue2, oFilter.bCaseSensitive);
				}

				function createMulti(oMultiFilter, bOmitBrackets) {
					var aFilters = oMultiFilter.aFilters,
						bAnd = !!oMultiFilter.bAnd,
						sFilter = "";

					if (aFilters.length === 0) {
						return bAnd ? "true" : "false";
					}

					if (aFilters.length === 1) {
						if (aFilters[0]._bMultiFilter) {
							return create(aFilters[0]);
						}
						return create(aFilters[0], true);
					}

					if (!bOmitBrackets) {
						sFilter += "(";
					}
					sFilter += create(aFilters[0]);
					for (var i = 1; i < aFilters.length; i++) {
						sFilter += bAnd ? " AND " : " OR ";
						sFilter += create(aFilters[i]);
					}
					if (!bOmitBrackets) {
						sFilter += ")";
					}
					return sFilter;
				}

				function createWhereSegment(sPath, oMetadata, oEntityType, sOperator, oValue1, oValue2, bCaseSensitive) {

					var oPropertyMetadata, sType;
					var sapDisplayFormat;
					var charEscape = '@';
					var bEscape = false;

					if (bCaseSensitive === undefined) {
						bCaseSensitive = true;
					}

					if (oEntityType) {
						oPropertyMetadata = oMetadata._getPropertyMetadata(oEntityType, sPath);
						sType = oPropertyMetadata && oPropertyMetadata.type;
						// OData V2 neznaji Date a Time		
						switch (oMetadata.getServiceMetadata().dataServices.dataServiceVersion) {
							case "2.0":
								for (let i = 0; i < oPropertyMetadata.extensions.length; i++) {
									if (oPropertyMetadata.extensions[i].name === "display-format") {
										sapDisplayFormat = oPropertyMetadata.extensions[i].value;
										break;
									}
								}
						}
					}

					switch (sType) {
						case "Edm.String":
							switch (sOperator) {
								case "Contains":
								case "NotContains":
								case "StartsWith":
								case "NotStartsWith":
								case "EndsWith":
								case "NotEndsWith":
									//		
									//      ABAP tyto podminky umoznuje SmartFilterBar ne		
									//
									// 		if (oValue1.includes("@")) {
									// 			bEscape = true;
									// 			oValue1 = oValue1.replaceAll("@", charEscape + "@");
									// 		}
									// 		if (oValue1.includes("_")) {
									// 			bEscape = true;
									// 			oValue1 = oValue1.replaceAll("_", charEscape + "_");
									// 		}
									if (oValue1.includes("%")) {
										bEscape = true;
										oValue1 = oValue1.replaceAll("%", charEscape + "%");
									}
									//		oValue1 = oValue1.replaceAll("*", "%");
									// 		oValue1 = oValue1.replaceAll("+", "_");
									break;
							}
							switch (sOperator) {
								case "Contains":
								case "NotContains":
									oValue1 = "%" + oValue1 + "%";
									break;
								case "StartsWith":
								case "NotStartsWith":
									oValue1 = oValue1 + "%";
									break;
								case "EndsWith":
								case "NotEndsWith":
									oValue1 = "%" + oValue1;
									break;
							}
							break;
					}

					oValue1 = formatValue(oValue1, sType, sapDisplayFormat, bCaseSensitive);
					oValue2 = (oValue2 != null) ? formatValue(oValue2, sType, sapDisplayFormat, bCaseSensitive) : null;

					sPath = sPath.toUpperCase();
					sPath = sPath.replaceAll("/", ".");

					switch (sOperator) {
						case "EQ":
							if (oValue1 == "null") {
								sPath = sPath + " IS NULL"
							} else {
								sPath = sPath + " = " + oValue1
							}
							break;
						case "NE":
							if (oValue1 == "null") {
								sPath = sPath + " IS NOT NULL"
							} else {
								sPath = sPath + " <> " + oValue1;
							}
							break;
						case "GT":
							sPath = sPath + " > " + oValue1;
							break;
						case "GE":
							sPath = sPath + " >= " + oValue1;
							break;
						case "LT":
							sPath = sPath + " < " + oValue1;
							break;
						case "LE":
							sPath = sPath + " <= " + oValue1;
							break;
						case "BT":
							sPath = sPath + " BETWEEN " + oValue1 + " AND " + oValue2;
							break;
						case "NB":
							sPath = sPath + " NOT BETWEEN " + oValue1 + " AND " + oValue2;
							break;
						case "Contains":
						case "StartsWith":
						case "EndsWith":
							sPath = sPath + " LIKE " + oValue1;
							if (bEscape) { sPath = sPath + " ESCAPE '" + charEscape + "'" }
							break;
						case "NotContains":
						case "NotStartsWith":
						case "NotEndsWith":
							sPath = sPath + " NOT LIKE " + oValue1;
							if (bEscape) { sPath = sPath + " ESCAPE '" + charEscape + "'" }
							break;
						default:
							Log.error("Unknown filter operator " + sOperator);
							sPath = "true";
					}
					return sPath;
				};

				var oDateTimeFormat,
					oDateTimeFormatMs,
					oDateTimeOffsetFormat,
					rDecimal = /^([-+]?)0*(\d+)(\.\d+|)$/,
					// URL might be encoded, "(" becomes %28
					rSegmentAfterCatalogService = /\/(Annotations|ServiceNames|ServiceCollection)(\(|%28)/,
					oTimeFormat,
					rTrailingDecimal = /\.$/,
					rTrailingZeroes = /0+$/;

				function setDateTimeFormatter() {
					// Lazy creation of format objects
					if (!oDateTimeFormat) {
						oDateTimeFormat = DateFormat.getDateInstance({
							//	pattern: "'datetime'''yyyy-MM-dd'T'HH:mm:ss''",
							pattern: "yyyy-MM-ddTHH:mm:ss",
							calendarType: CalendarType.Gregorian
						});
						oDateTimeFormatMs = DateFormat.getDateInstance({
							pattern: "yyyy-MM-ddTHH:mm:ss.SSS",
							calendarType: CalendarType.Gregorian
						});
						oDateTimeOffsetFormat = DateFormat.getDateInstance({
							pattern: "yyyy-MM-ddTHH:mm:ssZ",
							calendarType: CalendarType.Gregorian
						});
						oTimeFormat = DateFormat.getTimeInstance({
							pattern: "'time''PT'HH'H'mm'M'ss'S'''",
							calendarType: CalendarType.Gregorian
						});
					}
				}

				function formatValue(vValue, sType, sapDisplayFormat, bCaseSensitive) {
					var oDate, sValue, grp;

					if (bCaseSensitive === undefined) {
						bCaseSensitive = true;
					}

					// null values should return the null literal
					if (vValue === null || vValue === undefined) {
						switch (sType) {
							case "Edm.Time":
								switch (sapDisplayFormat) {
									case "Time":
										return "'000000'";
									default:
										return "0";
								}
							case "Edm.DateTime":
								switch (sapDisplayFormat) {
									case "Date":
										return "'00000000'";
									default:
										return "0";
								}
							default:
								return "null";
						}
					}

					setDateTimeFormatter();

					// Format according to the given type
					switch (sType) {
						case "Edm.String":
							// quote
							vValue = bCaseSensitive ? vValue : vValue.toUpperCase();
							sValue = "'" + String(vValue).replace(/'/g, "''") + "'";
							break;
						case "Edm.Time":
							if (typeof vValue === "object") {
								sValue = oTimeFormat.format(new Date(vValue.ms), true);
							} else {
								sValue = "'" + vValue + "'";
							}
							break;
						case "Edm.DateTime":
							oDate = vValue instanceof Date ? vValue : new Date(vValue);
							if (oDate.getMilliseconds() > 0) {
								sValue = oDateTimeFormatMs.format(oDate, true);
							} else {
								sValue = oDateTimeFormat.format(oDate, true);
							}
							switch (sapDisplayFormat) {
								case "Date":
									// source: ABAP /IWCOR/CL_DS_EDM_DATE_TIME=>PARSE_TIMESTAMP
									let dateTimeRegexp = /(?<year>[0-9]{1,4})-(?<month>[0-9]{1,2})-(?<day>[0-9]{1,2})T(?<hour>[0-9]{1,2}):(?<min>[0-9]{1,2})(?::(?<sec>[0-9]{1,2})(\.[0-9]{1,7})?)?/;
									grp = sValue.match(dateTimeRegexp).groups;
									if (grp) {
										sValue = "'" + grp.year + grp.month + grp.day + "'";
									}
									break;
							}
							break;
						case "Edm.DateTimeOffset":
							oDate = vValue instanceof Date ? vValue : new Date(vValue);
							sValue = oDateTimeOffsetFormat.format(oDate, true);
							break;
						case "Edm.Guid":
							// source: /IWCOR/CL_DS_EDM_GUID=>VALUE_OF
							sValue = String(vValue);
							let guidRegexp = /(?<g1>[0-9A-Fa-f]{8})-(?<g2>[0-9A-Fa-f]{4})-(?<g3>[0-9A-Fa-f]{4})-(?<g4>[0-9A-Fa-f]{4})-(?<g5>[0-9A-Fa-f]{12})/;
							grp = sValue.match(guidRegexp).groups;
							if (grp) {
								sValue = grp.g1 + grp.g2 + grp.g3 + grp.g4 + grp.g5;
								sValue = sValue.toUpperCase();
								sValue = "0x" + sValue;
							}
							break;
						// case "Edm.Decimal":
						// 	sValue = vValue + "m";
						// 	break;
						// case "Edm.Int64":
						// 	sValue = vValue + "l";
						// 	break;
						// case "Edm.Double":
						// 	sValue = vValue + "d";
						// 	break;
						// case "Edm.Float":
						// case "Edm.Single":
						// 	sValue = vValue + "f";
						// 	break;
						// case "Edm.Binary":
						// 	sValue = "binary'" + vValue + "'";
						// 	break;
						default:
							sValue = String(vValue);
							break;
					}
					return sValue;
				};

				if (!oFilter) {
					return undefined;
				}

				return create(oFilter, true);
			};

			var oSFB = this.byId("idSmartFilterBar");
			// var filters = oSFB.getFilters();
			// var filtersValues = oSFB.getFiltersWithValues();
			// var filterData = oSFB.getFilterData();
			// var filterDataString = oSFB.getFilterDataAsString();
			// const oSelTab = new SelTab();
			// var where = oSelTab.combineSelTabs(oSFB.getFilters());
			var oModel = this.getView().getModel();
			debugger;
			var where = createWhereParams(oSFB.getFilters(), oModel.oMetadata, oModel.oMetadata._getEntityTypeByPath("/ZLSD_SubjOs"));
			debugger;
			var oSmartTable = oEvent.getSource();
			var mBindingParams = oEvent.getParameter("bindingParams");

			if (this.initView) {
				// to prevent applying the initial sort all times 
				this.initView = false;
				// to apply the sort
				mBindingParams.sorter = [
					new sap.ui.model.Sorter({ path: "Prjosb", descending: false }),
					new sap.ui.model.Sorter({ path: "Jmnosb", descending: false }),
					new sap.ui.model.Sorter({ path: "Rdncsl", descending: false }),
				];
				// to short the sorted column in P13N dialog
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

				// var oTable = this.byId("idSmartTable").getTable(); //sap.m.table
				// oTable.onAfterRendering = function(){
				// 	sap.ui.table.Table.prototype.onAfterRendering.apply(this);
				// 	var trs = document.querySelectorAll("tr");
				// 	for(var i = 0; i < trs.length; i++){
				// 		trs[i].addEventListener("click", this.onTest );
				// 	}


				// };

			}

		},

		onTest: function () {
			alert("test");
		},

		onSelectionChange: function (oEvent) {
			var sPath = oEvent.getParameter("listItem").getBindingContextPath();
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("rt_detail_os", {
				"sPath": window.encodeURIComponent(sPath)
			});
		},

		onUpdateFinished: function () {

			var trs = document.querySelectorAll("tr");
			for (var i = 0; i < trs.length; i++) {
				trs[i].addEventListener("click", this.onTest);
			}

			//             var tTable = this.byId("idSmartTable");
			//             var oTable = this.byId("idSmartTable").getTable(); //sap.m.table

			//  //           console.log(oTable.getMetadata().getName());

			//  //           oTable.setMode(sap.m.ListMode.SingleSelectMaster);

			//   //          oTable.onAfterRendering = function(){

			//                 // console.log("OnAfterRendering");

			//                 // this.attachItemPress(function(oEvent){
			//                 //     console.log("Pressed!!");
			//                 // });

		}



	});
});
