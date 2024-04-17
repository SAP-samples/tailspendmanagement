using { managed, sap, cuid } from '@sap/cds/common';
namespace com.sap.tailspend;

entity Categories : managed {
   key  CategoryID : String;
        CategoryDesc  : String;
        Categories2Suppliers : Association to many Categories2Suppliers on Categories2Suppliers.Categories =  $self; 
        Categories2Regions: Association to many Categories2Regions on Categories2Regions.Categories =  $self;
                           }

entity Suppliers: managed {
key SupplierID: String;
    SupplierName: String;
    Categories2Suppliers : Association to many Categories2Suppliers on Categories2Suppliers.Suppliers=$self;
    SupplierStreet: String;
    SupplierCity:String;
    SupplierRegion:String;
    SupplierCountry:String;
}

entity Regions: managed {
key RegionID: String;
    RegionName: String;
    Categories2Regions: Association to many Categories2Regions on Categories2Regions.Regions =  $self;
                    }

entity PRApprovalHandler: managed {
    key PRID: String;
    key ApprovalHandler: String;
        ApprovalUser: String;
        Active: String;
}

entity Categories2Suppliers: cuid {
   Categories : Association to Categories;
   Suppliers: Association to Suppliers;
 
}

entity Categories2Regions: cuid {
   Categories : Association to Categories;
   Regions: Association to Regions;
}

entity TailSpendSuppliers: managed {
    key SupplierID: String;
    key CategoryID : String;
    key RegionID: String;
    key SLPID: String;
    ACMID: String;
    SupplierName: String;
    contactfn: String;
    contactln: String;
    contactemail: String;
    City: String;
    Country: String;
    AutoRFQEligble : String;
}

entity SupplierOrganization2Users: managed {
    key ExternalOrganizationID: String;
        OrganizationName : String;
        IsManaged: String;
        IsSupplier: String;
        OrganizationTaxID: String;
        OrganizationStateTIN: String;
        OrganizationRegionalTIN: String;
        IsCustomer: String;
        OrganizationVatID: String;
        ExternalParentOrganizationID: String;
        IsOrgApproved : String;
        CorporatePhone: String;
        CorporateFax: String;
        CorporateEmailAddress: String;
        CompanyURL: String;
        Address: String;
        City: String;
        State: String;
        ZipCode: String;
        Country: String;
        OrganizationType: String;
        AddressName: String;
        LoginID: String;
        FullName: String;
        EmailAddress: String;
        Phone: String;
        IsUserApproved: String;
        DefaultCurrency: String;
        TimeZoneID: String;
        PreferredLocale: String;

}

entity RFPEvent: managed {
  key DOCID: String;
      Title: String;
      RFPHandleID: String;
      Description: String;
      BaseLang: String;
      eventStateName: String;
      templateProjectInternalId: String;
      templateEventInternalId: String;
      parentProjectId: String;
      webJumperURL: String;
      webJumperURLForSupplier: String;
      createDate: String;
      awardApprovalRequired: String;
      Status: String;
      Items : Composition of many RFPItems on Items.parent=$self;
}

entity RFPItems: managed {
key parent: Association to RFPEvent;
key ItemID: String;
    PRID: String;
    PRItemID: String;
    ItemEventTitle: String;
    PRItemTitle: String;
    PRPrice: String;
    PRQuantity: String;
    PRExtendedPrice: String;
    PRSavingsAmount: String;
    PRSavingsPercentage: String;
    PRCurrency : String;
    PRUOM: String;
    AwardedSupplierName: String;
    AwardedPrice: String; 
    AwardedQuantity: String;
    AwardedExtendedPrice: String;
    AwardedSavingsAmount: String;
    AwardedCurrency: String;
    AwardeditemUOM: String;
    AwardedDate: String;
      
}


entity AutoRFPRules: cuid {
    AwardScenario: String;
    BiddingPeriod : String;
    InvitePreferredSupplier: Boolean;
    AutoPublish: Boolean;
    AutoAward: Boolean;
    WorkflowTemplate: String;
    AutoEventCreation: Boolean;
    EventCreationOption: String;
    PlaceBidsPreviewPeriod: Boolean;
    ReasontoDeclineBid: Boolean;
    SubmitbyEmail: Boolean;
    SupplierAddItems : Boolean;
}

entity MaterialGroup2Commodity: managed {
key MaterialGroupID : String;
    MaterialGroupDesc: String;
    CommodityID: String;
    CommodityDesc: String;
}

entity ACM2ERPMapping: managed {
key ACMID : String;
    ERPID: String;
}



entity Plant2ShipToAddress: managed {
key PlantID: String;
    Street: String;
    City: String;
    State: String;
    PostalCode: String;
    Country: String;
}

entity Country2Region: managed {
key CountryID: String;
    RegionID: String;

}

entity PurchaseRequisition : managed {
    key PRID    : String;
    key PRITEM : String;
        BusinessSystem: String;
        PRTitle: String;
        ItemDesc: String;
        CreatedDate : String;
        CategoryID:String;
        PlantID: String;
        UnitPrice: String;
        ExtendedPrice: String;
        Currency:String;
        Quantity: String;
        UOM: String;
        PurchaseOrg: String;
        CompanyCode: String;
        PurchasingGroup: String;
        ShipTo: String;
        MaterialCode: String;
        SupplierID : String; 
        SupplierName: String;
        Status: String;
            }

entity PRProcessFlow : managed {
    key PRID    : String;
    key PRITEM : String;
    key ProcessID: String;
        DOCID : String;
        BusinessSystem: String;
        StatusID: String;
        StatusText: String;
                    }
entity RFPHandle : managed {
    key RFPHandleID: String;
    key PRID    : String;
    key PRITEM : String;
        RFPTitle: String;
        Processed: String;
                        }      
/* OLD TO DISCARD*/
entity Questionnaire: cuid {
      QuestionGroup: String;
      QuestionLabel: String; 
      AnswerType: String;   
}

/* OLD TO DISCARD*/
entity SMQuestionnaire: managed {
  key QuestionID: String;
      QuestionGroup: String;
      QuestionLabel: String; 
      QuestionSource: String;
      AnswerType: String;   
}

entity SMQuestionnairev1: managed {
  key QuestionID: String;
      QuestionGroup: String;
      QuestinoDesc: String; 
      QuestionSource: String;
      AnswerType: String;   
}


entity RFPTemplate: managed {
  key WorkspaceID: String;
      WorkspaceDesc: String;
}

entity TemplateQA: managed {
  key WorkspaceID: String;
  key QuestionID: String;
      QuestinoDesc: String;
      QuestionGroup: String;
      QuestionSource: String;
      AnswerType: String;  
      WorkspaceDesc: String;
      status: Boolean;

}

entity SupplierQA: managed {
  key ACMID: String;
      SMID: String;
      questionnaireLabel: String;
      questionLabel: String;
      answerType: String;
      externalSystemCorrelationId: String;
      WorkspaceDesc: String;
      templateDocumentId: String;
      workspaceType: String;
      questionnaireId: String;
      type: String;
      answer: String;
      active: String;
}

