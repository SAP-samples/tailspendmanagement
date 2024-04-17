"use strict";

//libraries
const cds = require("@sap/cds");
const cloudSDK = require("@sap-cloud-sdk/core");

async function generateBigDecimalTemplate(oPayload) {
    // debugger;
    const {
        title,
        parentItem,
        invitationIds = [],
        participantInitialValues = []
    } = oPayload;

    return {
        "title": `${title}`,
        "terms": [
            {
                "title": `${title}`,
                "fieldId": "RQABIGDEC",
                "valueTypeName": "DecimalNumber",
                "isMultiValue": false,
                "acceptableValues": "AnyValue",
                "precision": 2,
                "isRequirement": false,
                "requiredType": 8,
                "enableParticipantComments": false,
                "rollup": false,
                "historicValueProperty": 0,
                "reserveValueProperty": 0,
                "participantVisibility": 1,
                "isFormula": false,
                "formulaCurrentAlias": `${title}`,
                "references": [],
                "participantInitialValues":participantInitialValues ,
                "isEditable": true,
                "isDeleteable": true,
                "canChangeValidValues": true,
                "columnDisplay": true,
                "rankOrder": 0,
                "sourceType": 3,
                "externalFieldMapping": "",
                "requiredTypeValidChoices": {
                    "Yes, Owner Required": 2,
                    "No, Owner Optional - Participant Cannot Respond": 8,
                    "Yes, Owner Required - Participant Optional": 6,
                    "Not Required": 0,
                    "Yes, Participant Required": 1
                },
                "prerequisiteReviewStatus": 0,
                "hasParticipantSpecificValues": true,
                "allowParticipantOtherValue": false,
                "hideResponseFromEachOther": true,
                "teamAccessControl": [],
                "additionalEditorGroups": []
            }
        ],
        "supplierDisplayNumber": "4.0",
        "buyerDisplayNumber": "2.0",
        "description": "",
        "itemType": 3,
        "parentItem": parentItem,
        "numbering": 4,
        "isCompetitiveTermEditable": true,
        "externalSystemCorrelationId": "",
        "currency": {
            "uniqueName": "USD",
            "name": "US Dollar"
        },
        "teamAccessControl": [],
        "additionalEditorGroups": [],
        "invitationIds": invitationIds,
        "hasItemInvitees": false,
        "question": true,
        "bidOnUnit": true
    };
    

}



async function generateIntegerTemplate(oPayload) {
    // debugger;
    const {
        title,
        parentItem,
        invitationIds = [],
        participantInitialValues = []
    } = oPayload;

    return {
        "title": `${title}`,
        "terms": [
            {
                "title": `${title}`,
                "fieldId": "RQAINTEGER",
                "valueTypeName": "WholeNumber",
                "isMultiValue": false,
                "acceptableValues": "AnyValue",
                "precision": 2,
                "isRequirement": false,
                "requiredType": 8,
                "enableParticipantComments": false,
                "rollup": false,
                "historicValueProperty": 0,
                "reserveValueProperty": 0,
                "participantVisibility": 1,
                "isFormula": false,
                "formulaCurrentAlias": `${title}`,
                "references": [],
                "participantInitialValues":participantInitialValues ,
                "isEditable": true,
                "isDeleteable": true,
                "canChangeValidValues": true,
                "columnDisplay": true,
                "rankOrder": 0,
                "sourceType": 3,
                "externalFieldMapping": "",
                "requiredTypeValidChoices": {
                    "Yes, Owner Required": 2,
                    "No, Owner Optional - Participant Cannot Respond": 8,
                    "Yes, Owner Required - Participant Optional": 6,
                    "Not Required": 0,
                    "Yes, Participant Required": 1
                },
                "prerequisiteReviewStatus": 0,
                "hasParticipantSpecificValues": true,
                "allowParticipantOtherValue": false,
                "hideResponseFromEachOther": true,
                "teamAccessControl": [],
                "additionalEditorGroups": []
            }
        ],
        "supplierDisplayNumber": "4.0",
        "buyerDisplayNumber": "2.0",
        "description": "",
        "itemType": 3,
        "parentItem": parentItem,
        "numbering": 4,
        "isCompetitiveTermEditable": true,
        "externalSystemCorrelationId": "",
        "currency": {
            "uniqueName": "USD",
            "name": "US Dollar"
        },
        "teamAccessControl": [],
        "additionalEditorGroups": [],
        "invitationIds": invitationIds,
        "hasItemInvitees": false,
        "question": true,
        "bidOnUnit": true
    };
    

}

async function generateTextTemplate(oPayload) {
    // debugger;
    const {
        title,
        parentItem,
        invitationIds = [],
        participantInitialValues = []
    } = oPayload;

    return {
        "title": `${title}`,
        "terms": [
            {
                "title": `${title}`,
                "fieldId": "RQAINTEGER",
                "valueTypeName": "WholeNumber",
                "isMultiValue": false,
                "acceptableValues": "AnyValue",
                "precision": 2,
                "isRequirement": false,
                "requiredType": 8,
                "enableParticipantComments": false,
                "rollup": false,
                "historicValueProperty": 0,
                "reserveValueProperty": 0,
                "participantVisibility": 1,
                "isFormula": false,
                "formulaCurrentAlias": `${title}`,
                "references": [],
                "participantInitialValues":participantInitialValues ,
                "isEditable": true,
                "isDeleteable": true,
                "canChangeValidValues": true,
                "columnDisplay": true,
                "rankOrder": 0,
                "sourceType": 3,
                "externalFieldMapping": "",
                "requiredTypeValidChoices": {
                    "Yes, Owner Required": 2,
                    "No, Owner Optional - Participant Cannot Respond": 8,
                    "Yes, Owner Required - Participant Optional": 6,
                    "Not Required": 0,
                    "Yes, Participant Required": 1
                },
                "prerequisiteReviewStatus": 0,
                "hasParticipantSpecificValues": true,
                "allowParticipantOtherValue": false,
                "hideResponseFromEachOther": true,
                "teamAccessControl": [],
                "additionalEditorGroups": []
            }
        ],
        "supplierDisplayNumber": "4.0",
        "buyerDisplayNumber": "2.0",
        "description": "",
        "itemType": 3,
        "parentItem": parentItem,
        "numbering": 4,
        "isCompetitiveTermEditable": true,
        "externalSystemCorrelationId": "",
        "currency": {
            "uniqueName": "USD",
            "name": "US Dollar"
        },
        "teamAccessControl": [],
        "additionalEditorGroups": [],
        "invitationIds": invitationIds,
        "hasItemInvitees": false,
        "question": true,
        "bidOnUnit": true
    };
    

}

async function generateQuantityTemplate(oPayload) {
    // debugger;
    const {
        title,
        parentItem,
        invitationIds = [],
        participantInitialValues = []
    } = oPayload;

    return {
        "title": `${title}`,
        "terms": [
            {
                "title": `${title}`,
                "fieldId": "RQAQTY",
                "valueTypeName": "Quantity",
                "isMultiValue": false,
                "acceptableValues": "AnyValue",
                "precision": 2,
                "isRequirement": false,
                "requiredType": 8,
                "enableParticipantComments": false,
                "rollup": false,
                "historicValueProperty": 0,
                "reserveValueProperty": 0,
                "participantVisibility": 1,
                "isFormula": false,
                "formulaCurrentAlias": `${title}`,
                "references": [],
                "participantInitialValues":participantInitialValues ,
                "isEditable": true,
                "isDeleteable": true,
                "canChangeValidValues": true,
                "columnDisplay": true,
                "rankOrder": 0,
                "sourceType": 3,
                "externalFieldMapping": "",
                "requiredTypeValidChoices": {
                    "Yes, Owner Required": 2,
                    "No, Owner Optional - Participant Cannot Respond": 8,
                    "Yes, Owner Required - Participant Optional": 6,
                    "Not Required": 0,
                    "Yes, Participant Required": 1
                },
                "prerequisiteReviewStatus": 0,
                "hasParticipantSpecificValues": true,
                "allowParticipantOtherValue": false,
                "hideResponseFromEachOther": true,
                "teamAccessControl": [],
                "additionalEditorGroups": []
            }
        ],
        "supplierDisplayNumber": "4.0",
        "buyerDisplayNumber": "2.0",
        "description": "",
        "itemType": 3,
        "parentItem": parentItem,
        "numbering": 4,
        "isCompetitiveTermEditable": true,
        "externalSystemCorrelationId": "",
        "currency": {
            "uniqueName": "USD",
            "name": "US Dollar"
        },
        "teamAccessControl": [],
        "additionalEditorGroups": [],
        "invitationIds": invitationIds,
        "hasItemInvitees": false,
        "question": true,
        "bidOnUnit": true
    };
    

}
async function generateYesNoTemplate(oPayload) {
    // debugger;
        const {
            title,
            parentItem,
            invitationIds = [],
            participantInitialValues = []
        } = oPayload;
    
        return {
            "title": `${title}`,
            "terms": [
                {
                    "title": `${title}`,
                    "fieldId": "RQABOOLEAN",
                    "valueTypeName": "YesNo",
                    "isMultiValue": false,
                    "acceptableValues": "AnyValue",
                    "precision": 2,
                    "isRequirement": false,
                    "requiredType": 8,
                    "enableParticipantComments": false,
                    "rollup": false,
                    "historicValueProperty": 0,
                    "reserveValueProperty": 0,
                    "participantVisibility": 1,
                    "isFormula": false,
                    "formulaCurrentAlias": `${title}`,
                    "references": [],
                    "value": {
                        "simpleValue": "false"
                    },
                    "isEditable": true,
                    "isDeleteable": true,
                    "canChangeValidValues": true,
                    "columnDisplay": true,
                    "rankOrder": 0,
                    "sourceType": 3,
                    "externalFieldMapping": "",
                    "requiredTypeValidChoices": {
                        "Yes, Owner Required": 2,
                        "No, Owner Optional - Participant Cannot Respond": 8,
                        "Yes, Owner Required - Participant Optional": 6,
                        "Not Required": 0,
                        "Yes, Participant Required": 1
                    },
                    "prerequisiteReviewStatus": 0,
                    "hasParticipantSpecificValues": true,
                    "participantInitialValues": participantInitialValues,
                    "allowParticipantOtherValue": false,
                    "hideResponseFromEachOther": true,
                    "teamAccessControl": [],
                    "additionalEditorGroups": []
                }
            ],
            "supplierDisplayNumber": "4.0",
            "buyerDisplayNumber": "1.0",
            "description": "",
            "itemType": 3,
            "parentItem": parentItem,
            "numbering": 4,
            "competitiveTermFieldId": "",
            "isCompetitiveTermEditable": true,
            "externalSystemCorrelationId": "",
            "currency": {
                "uniqueName": "USD",
                "name": "US Dollar"
            },
            "teamAccessControl": [],
            "additionalEditorGroups": [],
            "invitationIds": invitationIds,
            "hasItemInvitees": false,
            "question": true,
            "bidOnUnit": true
        };
        
}

module.exports = {
    generateYesNoTemplate,
    generateIntegerTemplate,
    generateBigDecimalTemplate,
    generateTextTemplate,
    generateQuantityTemplate
};