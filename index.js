const uuid = require('uuid/v4');

class MockflowRequest {
    constructor(agentName, fulfillment, intentName) {
        this.fulfillment = fulfillment;
        this.request = {
            responseId: uuid(),
            session: `projects/${agentName}/agent/sessions/${uuid()}`,
            queryResult: {
                queryText: '',
                parameters: {},
                allRequiredParamsPresent: true,
                fulfillmentText: '',
                fulfillmentMessages: [],
                outputContexts: [],
                intent: {
                    name: `projects/${agentName}/agent/intents/${uuid()}`,
                    displayName: intentName
                },
                intentDetectionConfidence: 1,
                diagnosticInfo: {},
                languageCode: 'en'
            },
            originalDetectIntentRequest: {}
        }
    }
    withQueryText(queryText) {
        this.request.queryResult.queryText = queryText;
        return this;
    }
    withParameter(name, value) {
        this.request.queryResult.parameters[name] = value;
        return this;
    }
    withAllRequiredParamsPresent(allRequiredParamsPresent) {
        this.request.queryResult.allRequiredParamsPresent = allRequiredParamsPresent;
        return this;
    }
    withFulfillmentText(fulfillmentText) {
        this.request.queryResult.fulfillmentText = fulfillmentText;
        return this;
    }
    withFulfillmentMessage(fulfillmentMessage) {
        this.request.queryResult.fulfillmentMessages.push(fulfillmentMessage);
        return this;
    }
    withOutputContext(outputContext) {
        this.request.queryResult.outputContexts.push(outputContext);
        return this;
    }
    withIntentDetectionConfidence(intentDetectionConfidence) {
        this.request.queryResult.intentDetectionConfidence = intentDetectionConfidence;
        return this;
    }
    withDiagnosticInfo(name, value) {
        this.request.queryResult.diagnosticInfo[name] = value;
        return this;
    }
    withLanguageCode(languageCode) {
        this.request.queryResult.languageCode = languageCode;
        return this;
    }
    withOriginalDetectIntentRequest(originalDetectIntentRequest) {
        this.request.originalDetectIntentRequest = originalDetectIntentRequest;
        return this;
    }
    async json() {
        return new Promise((resolve, reject) => {
            let req = {body: this.request};
            let res = {json: resolve};
            try {
                this.fulfillment(req, res);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = class MockflowAgent {
    constructor(agentName, fulfillment) {
        this.agentName = agentName;
        this.fulfillment = fulfillment;
    }
    intent(intentName) {
        return new MockflowRequest(this.agentName, this.fulfillment, intentName);
    }
};