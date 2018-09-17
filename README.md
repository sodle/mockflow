# Mockflow
Mockflow lets you send mock requests to your Dialogflow fulfillment code, for offline unit testing.

## Installation
The following command will install the mockflow package to your project:

```npm install mockflow```

## The Basics
Connect to your fulfillment code and send a mock intent request
```javascript
const Mockflow = require('mockflow');
// Import the Firebase Functions code for your Dialogflow Fulfillment Webhook
// This assumes that the file is in the same directory as index.js - change as necessary
const app = require('.');

// Initialize Mockflow with your Dialogflow project's name and the webhook handler
// Change app.handler if you exported your handler with a custom name
const mock = new Mockflow('my-voice-app', app.handler);

// Send an intent request and check results
it("Enter a description of what should happen here", async function () {
    let result = await mock.intent('My Intent Name').send()
    
    // Provide the result and a string array with keywords/phrases to look for in in the response
    return mock.existsAndMatches(result, ['words','to','look for'])
});
```

## Further customization
The above example creates a simple intent request using sensible defaults for Dialogflow's [many](https://dialogflow.com/docs/fulfillment#request) parameters. However, you can use the request builder's `with...()` methods to set the other parameters.
```javascript
it("Should respond by saying that my favorite color is blue", async function () {
    // Send an intent request
    let result = await mock.intent('Favorite Color Intent')
        .withParameter('Color', 'blue')
        .withQueryText('i like blue')
        .send()

    return mock.existsAndMatches(result, ['favorite','color','blue'])
});
```

### Available Overrides
* withQueryText(queryText)
* withParameter(name, value)
* withAllRequiredParamsPresent(allRequiredParamsPresent)
* withFulfillmentText(fulfillmentText)
* withFulfillmentMessage(fulfillmentMessage)
* withOutputContext(outputContext)
* withIntentDetectionConfidence(intentDetectionConfidence)
* withDiagnosticInfo(name, value)
* withLanguageCode(languageCode)
* withOriginalDetectIntentRequest(originalDetectIntentRequest)

## Limitations
* Only Dialogflow v2 fulfillments are supported. v1 has not been tested and probably won't work.

## Acknowledgements
* [Carter Kwon](https://github.com/CarterKwon) - Chai integration