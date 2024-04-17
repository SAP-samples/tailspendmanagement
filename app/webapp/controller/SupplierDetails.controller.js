// @ts-nocheck
sap.ui.define([
    "./BaseController",
    "sap/f/LayoutType",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     * @param {typeof sap.f.LayoutType} LayoutType 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {sap.m.MessageBox} MessageBox 
     * @param {sap.m.MessageToast} MessageToast 
     * @returns 
     */
    function (BaseController, LayoutType, JSONModel, MessageBox, MessageToast) {
        "use strict";

        return BaseController.extend("com.sap.tailspend.controller.SupplierDetails", {


         
            onInit : function () {
                // var oViewModel = new JSONModel({
                //     busy: true,
                //     delay: 0,
                //     editable: false
                // });

                this.getRouter().getRoute("SupplierByCategory").attachPatternMatched(this._onObjectMatched, this);
                // Store original busy indicator delay, so it can be restored later on
                var oTableID = this.byId("idSupplierTable");
				oTableID.setBusy(true);

                // this.setModel(oViewModel, "SupplierDetailView");

                // this.getOwnerComponent().getModel().metadataLoaded().then(function () {
                //     // Restore original busy indicator delay for the object view
                //     oViewModel.setProperty("/delay", iOriginalBusyDelay);
                // });
            },

            /* =========================================================== */
            /* event handlers                                              */
            /* =========================================================== */

            /**
             * Event handler for navigating back.
             * We navigate back in the browser history
             * @public
             */
            onNavBack : function () {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            },

            /**
             * Evento chamado ao clicar em fechar
             * @public
             * @param {sap.ui.base.Event} oEvent 
             */
            onClose : function (oEvent) {
                this.onCancel(oEvent);
            },

            /**
             * Evento chamado ao clicar em Editar
             * @public
             * @param {sap.ui.base.Event} oEvent 
             */
            onEdit : function (oEvent) {
                this._toggleEdit();
            },

            /**
             * Evento chamado ao clicar em Adicionar Usuário
             * @public
             * @param {sap.ui.base.Event} oEvent 
             */
            onAddUser : function (oEvent) {
                var sCurrentBindingPath = this.getView().getBindingContext().getPath();
                var sCurrentFileId = this.getModel().getProperty(sCurrentBindingPath + "/Id");
                var oContext = this.getModel().createEntry("/FilesUsers", {
                    properties: {
                        FileId: sCurrentFileId
                    },
                    refreshAfterChange: false,
                    groupId: 'changes'
                });
                var oNewColumnListItem = this.byId("idFilesUsersColumnListItem").clone();
                oNewColumnListItem.bindElement(oContext.getPath());
                this.byId("idFilesUsersTable").addItem(oNewColumnListItem);

            },

            /**
             * Evento chamado ao clicar em Excluir usuário
             * @public
             * @param {sap.ui.base.Event} oEvent 
             */
            onDeleteUser : function (oEvent) {
                var sPath = oEvent.getParameter("listItem").getBindingContext().getPath();
                this.getModel().setProperty(sPath + "/Level", this.DELETED_LEVEL);
                this.getModel().remove(sPath, {
                    groupId: 'changes'
                });
            },

            /**
             * Evento chamado ao clicar em Exibir Mensagens
             * @public
             * @param {sap.ui.base.Event} oEvent
             */
            onShowMessages : function (oEvent) {
                var oShowMessagesButton = oEvent.getSource();
                this.openFragment("dev.vinibar.portal.settings.view.MessagePopover", {
                    id: "idMessagePopover",
                    openBy: oShowMessagesButton,
                });
            },

            /**
             * Evento chamado ao cliacr em Cancelar edição
             * @public
             * @param {sap.ui.base.Event} oEvent 
             */
            onCancel : function (oEvent) {

                if (!this.getModel().hasPendingChanges()) {
                    this.onConfirm(oEvent);
                    return
                }

                var oCancelButton = oEvent.getSource();
                this.openFragment("dev.vinibar.portal.settings.view.ConfirmationPopover", {
                    id: "idConfirmationPopover",
                    openBy: oCancelButton,
                    title: "As modificações serão perdidas. Deseja continuar?"
                });

            },

            /**
             * Evento chamado ao clicar em confirmar (tanto fechamento ou cancelamento)
             * @public
             * @param {sap.ui.base.Event} oEvent 
             */
            onConfirm : function (oEvent) {
                this.getModel().resetChanges();
                sap.ui.getCore().getMessageManager().removeAllMessages();
                var oConfirmationPopover = this.byId("idConfirmationPopover");
                var oOpenedBy;
                if (oConfirmationPopover) {
                    oConfirmationPopover.close();
                    oOpenedBy = oConfirmationPopover.getOpenedBy();
                }

                this.getModel("SupplierDetailView").setProperty("/editable", false);
                // @ts-ignore
                var sId = oOpenedBy ? oOpenedBy.getId() : oEvent.getSource().getId();
                if (sId.includes("idCloseButton")) {
                    this.getModel("CategoryView").setProperty("/layout", LayoutType.OneColumn);
                    this.getRouter().navTo("files");
                }
            },


            showSupplierDetail: function (oEvent) {


                var CategoryID= this.getView().byId("categoryid").getText();;

                var regionID= this.getView().byId("region").getText();
               

                // var oEntry = oEvent.getParameter("listItem").getBindingContext("SupplierDetailMo");

                // var SMID = oEvent.getParameter("listItem").getBindingContext("SupplierDetailMo").getPath();

                var SMID = oEvent.getParameter("listItem").getBindingContext("SupplierDetailMo").getProperty("SLPSupplier/SMVendorId");


               // var SMID = oEntry.SLPSupplier.SMVendorId;
                //var SMID = oEvent.getParameter("listItem").getBindingContext("SupplierDetailMo").getProperty("SupplierDetailMo>SLPSupplier.SMVendorId");

				//console.log("binding context - get path" ,  oEvent.getParameter("listItem").getBindingContext("CategoryAgg").getPath()); 
                var sID = null;
			
                if ( SMID != null )
                {
                    sID =  CategoryID +'-'+regionID + '-' + SMID;
                }
                else
                {
                    sID = CategoryID +'-'+regionID;
                }

				// sID = CategoryID +'-'+regionID;

				// console.log("Value of Category ID" ,  oEvent.getParameter("listItem").getBindingContext("CategoryAgg").getProperty("Category")); 

				// console.log("Value of regionID" ,  regionID); 

					// this.getModel().resetChanges();
					this.getRouter().navTo("SupplierByCategory", {
						objectId: sID
					});
			},

            /**
             * Evento chamado ao clicar em Salvar
             * @public
             * @param {sap.ui.base.Event} oEvent 
             */
            onSave : function (oEvent) {
                if (!this.isValid("fileUser")) {
                    MessageBox.error("Verifique os erros e tente novamente");
                    return
                }

                // Atualiza data de modificação
                this.getModel().setProperty(this.getView().getBindingContext().getPath() + "/ModifiedAt", new Date());

                this.getModel().submitChanges({
                    success: function (oData) {
                        if (!this.getModel().hasPendingChanges()) {
                            MessageToast.show("Atualizado com sucesso");
                            this._toggleEdit();
                        }
                    }.bind(this)
                });
            },

            getSupplierData: function (CategoryID,RegionID) {
                var _this = this;

                var oTableID = this.byId("idSupplierTable");
				oTableID.setBusy(true);
                
				var fnSuccess = function (data) {
					
					var jsonobj = JSON.parse(data.d.doGetSupplierData);

                    // var oViewModel = new JSONModel();

                    // _this.setModel(oViewModel, "SupplierDetailMo");

                    // oViewModel.setData(jsonobj);

                    var DetailModel = new sap.ui.model.json.JSONModel();
                    DetailModel.setData(jsonobj);
                    _this.getOwnerComponent().setModel(DetailModel, "SupplierDetailMo");

                    var oTableID = this.byId("idSupplierTable");
                    oTableID.setBusy(false);

                // var oSupplierDetailPanel = _this.getView().byId("idSupplierTable");

                // console.log("value of supplierdetailpanel", oSupplierDetailPanel);
			
                // oSupplierDetailPanel.bindElement({
                //     model: "SupplierDetailMo",
                //     path: "/SLPSupplier"
                // });

					
				}.bind(this);
	
				var fnError = function (data) {
					console.log("inside success functino");
					// this.getView().getModel("oViewModel").setProperty("/smbusy", false);
					MessageToast.show("Could not fetch SM Data Information. " + data.responseJSON.error.message.value);
				}.bind(this);
				
				var jdata = {
					realm: "AribaRealm",
                    Category: CategoryID,
                    Region: RegionID
				};

				$.ajax({
					type: "POST",
					url: "/backend/v2/sourcing/doGetSupplierData",
					headers: {
						"Content-Type": "application/json"
					},
					data: JSON.stringify(jdata),
					success: fnSuccess,
					error: fnError
				});
	
	
	
			},

            _onObjectMatched : function (oEvent) {
                var sObjectId = oEvent.getParameter("arguments").objectId;

                var sLayout = sObjectId ? LayoutType.TwoColumnsBeginExpanded : LayoutType.OneColumn;
                this.getModel("CategoryView").setProperty("/layout", sLayout);
                
             //   this.getModel("SupplierDetailView").setProperty("/editable", false);

               if (!sObjectId) return;

               console.log("sObjectId in Detail page is" , sObjectId);
            //    var isSMID = sObjectId.substr(0,1);
            //    if ( isSMID == 'S')
            //    {
            //     //We already went till third layout.. so get the second one as category
            //    }
               var nameArr = sObjectId.split('-');
               var CategoryID = nameArr[0];
               var RegionID = nameArr[1];
               console.log("CategoryID in Detail page is" , CategoryID);
               console.log("RegionID in Detail page is" , RegionID);

                var oViewModel = new JSONModel({
                    RegionID: RegionID,
                    CategoryID: CategoryID,
                    editable: false
                });

                this.getSupplierData(CategoryID,RegionID);

                this.setModel(oViewModel, "SupplierDetailView");


                // var oSupplierDetailPanel = this.getView().byId("idSupplierTable");

                // console.log("value of supplierdetailpanel", oSupplierDetailPanel);
			
                // oSupplierDetailPanel.bindElement({
                //     model: "SupplierMo",
                //     path: "/Categories2Suppliers"
                // });
                



            },

            /**
             * Validações realizadas ao trocar o bind da view
             * @private
             * @returns 
             */
            _onBindingChange : function () {
                var oViewModel = this.getModel("SupplierDetailView");
                var oElementBinding = this.getView().getElementBinding();

                // No data for the binding
                if (!oElementBinding.getBoundContext()) {
                    this.getRouter().getTargets().display("notFound");
                    return;
                }

                oViewModel.setProperty("/busy", false);
            },

            /**
             * Alterna modo de edição
             * @private
             */
            _toggleEdit : function () {
                var oModel = this.getModel("SupplierDetailView");
                var bEditable = !oModel.getProperty("/editable");
                oModel.setProperty("/editable", bEditable);
            },

        });

    });