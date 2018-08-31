const uuid = require('uuid/v4');

/**
 * MockflowRequest builds a request to send to your agent's fulfillment code.
 * All "with..." methods return the modified MockflowRequest object, allowing
 * chaining.
 */
class MockflowRequest {
    /**
     * Create a MockflowRequest
     * @param {string} agentName        Name of your agent within the Dialogflow Console
     * @param {Function} fulfillment    The function that fulfills your Dialogflow Webhook
     * @param {string} intentName       Name of the intent to invoke
     */
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
    /**
     * Set the queryText element of the request
     * @param {string} queryText 
     * @returns {MockflowRequest}   The modified request
     */
    withQueryText(queryText) {
        this.request.queryResult.queryText = queryText;
        return this;
    }
    /**
     * Add a parameter to the request
     * @param {string} name 
     * @param {string} value 
     * @returns {MockflowRequest}   The modified request
     */
    withParameter(name, value) {
        this.request.queryResult.parameters[name] = value;
        return this;
    }
    /**
     * Specify whether all required parameters are provided (default: true)
     * @param {boolean} allRequiredParamsPresent 
     * @returns {MockflowRequest}   The modified request
     */
    withAllRequiredParamsPresent(allRequiredParamsPresent) {
        this.request.queryResult.allRequiredParamsPresent = allRequiredParamsPresent;
        return this;
    }
    /**
     * Set the fulfillmentText element of the request
     * @param {string} fulfillmentText 
     * @returns {MockflowRequest}   The modified request
     */
    withFulfillmentText(fulfillmentText) {
        this.request.queryResult.fulfillmentText = fulfillmentText;
        return this;
    }
    /**
     * Set the fulfillmentMessage element of the request
     * @param {string} fulfillmentMessage 
     * @returns {MockflowRequest}   The modified request
     */
    withFulfillmentMessage(fulfillmentMessage) {
        this.request.queryResult.fulfillmentMessages.push(fulfillmentMessage);
        return this;
    }
    /**
     * Add an outputContext to the request
     * @param {Object} outputContext 
     * @returns {MockflowRequest}   The modified request
     */
    withOutputContext(outputContext) {
        this.request.queryResult.outputContexts.push(outputContext);
        return this;
    }
    /**
     * Set the confidence value of the detected intent (default: 1)
     * @param {number} intentDetectionConfidence    Must be between 0 and 1
     * @returns {MockflowRequest}                   The modified request
     */
    withIntentDetectionConfidence(intentDetectionConfidence) {
        this.request.queryResult.intentDetectionConfidence = intentDetectionConfidence;
        return this;
    }
    /**
     * Add freeform diagnostic info to the request
     * @param {string} name 
     * @param {Object} value 
     * @returns {MockflowRequest}   The modified request
     */
    withDiagnosticInfo(name, value) {
        this.request.queryResult.diagnosticInfo[name] = value;
        return this;
    }
    /**
     * Set the language of the request (default: "en")
     * @param {string} languageCode 
     * @returns {MockflowRequest}   The modified request
     */
    withLanguageCode(languageCode) {
        this.request.queryResult.languageCode = languageCode;
        return this;
    }
    /**
     * Add a preliminary request to this one
     * @param {Object} originalDetectIntentRequest 
     * @returns {MockflowRequest}   The modified request
     */
    withOriginalDetectIntentRequest(originalDetectIntentRequest) {
        this.request.originalDetectIntentRequest = originalDetectIntentRequest;
        return this;
    }
    /**
     * Send the request
     * @returns {Promise}   A Promise for your webhook's response
     */
    async send() {
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

/**
 * MockflowAgent emulates the Dialogflow v2 service, to send mock requests to
 * your fulfillment code.
 */
module.exports = class MockflowAgent {
    /**
     * Create a MockflowAgent
     * @param {string} agentName        The name of your agent in the Dialogflow Console
     * @param {Function} fulfillment    The function that fulfills your Dialogflow Webhook
     */
    constructor(agentName, fulfillment) {
        this.agentName = agentName;
        this.fulfillment = fulfillment;
    }
    /**
     * Create a MockflowRequest to request a given intent from your agent.
     * @param {string} intentName   Name of the intent to invoke
     * @returns {MockflowRequest}   The request object
     */
    intent(intentName) {
        return new MockflowRequest(this.agentName, this.fulfillment, intentName);
    }
};