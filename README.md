# Mockflow
Mockflow lets you send mock requests to your Dialogflow fulfillment code, for offline unit testing.

## The Basics
Connect to your fulfillment code and send a mock intent request
```javascript
const Mockflow = require('mockflow');
// Import the Firebase Functions code for your Dialogflow Fulfillment Webhook
const app = require('.');

// Initialize Mockflow with your Dialogflow project's name and the webhook handler
const mock = new Mockflow('my-voice-app', app.handler);

// Send an intent request
mock.intent('My Intent').send().then(json => {
    // send() returns a Promise of your webhook's JSON response
    // You can run assertions against the response using, e.g., Chai
    assert.include(json, 'fulfillmentText');
    assert.include(json.fulfillmentText, 'Welcome to my voice app!');
    done();
});
```

## Further customization
The above example creates a simple intent request using sensible defaults for Dialogflow's [many](https://dialogflow.com/docs/fulfillment#request) parameters. However, you can use the builder's `with...()` functions to set the other parameters.
```javascript
mock.intent('Favorite Color Intent')
    .withParameter('Color', 'blue')
    .withQueryText('i like blue')
    .withFulfillmentText('Your favorite color')
    .send()
    .then(json => {
        assert.include(json, 'fulfillmentText');
        assert.equal(json.fulfillmentText, 'Your favorite color is blue!');
        done();
    });
```

## Limitations
* Only Dialogflow v2 fulfillments are supported. v1 has not been tested and probably won't work.