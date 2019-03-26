// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const dbHandler = require('../models/execution-db');
const storeInfoHandler = require('../handler/store_infos_handler');
const categoryListHandler = require('../handler/category_lists_handler');
const productListHandler = require('../handler/product_lists_handler');
const addToCartHandler = require('../handler/add_to_cart_handler');
const {
    WebhookClient
} = require('dialogflow-fulfillment');
const {
    Card,
    Suggestion,
    Payload
} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

var realChat = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({request, response});
	
	
	function showCart(agent) {
		
		return addToCartHandler.getCart(agent).then(function (result) {
			agent.add("Will you want to know more");
		}).catch(e => {
			console.error(e);
			return Promise.reject(e);
		});
	}
	
	function addToCart(agent) {
	
	    return addToCartHandler.index(agent).then(function (result) {
		    agent.add(result);
	    }).catch(e => {
		    console.error(e);
		    return Promise.reject(e);
	    });
    }

    function product_lists(agent) {
	
	    return productListHandler.index(agent).then(function (result) {
		    agent.add("Please select a category from below");
		    agent.add(result);
	    }).catch(e => {
		    console.error(e);
		    return Promise.reject(e);
	    });

    }

    function categoryLists(agent) {
	    return categoryListHandler.index(agent).then(function (result) {
		    agent.add("Please select a category from below");
		    agent.add(result);
	    }).catch(e => {
		    console.error(e);
		    return Promise.reject(e);
	    });

    }

    function storeInfo(agent) {
        return storeInfoHandler.index(agent).then(function (result) {
	        agent.add("Please select a category from below");
            agent.add(result);
        }).catch(e => {
	        console.error(e);
	        return Promise.reject(e);
        });
    }


    function welcome(agent) {
        console.log(agent.originalDetectIntentRequest);
        agent.add("Welcome to my agent!");
    }

    function fallback(agent) {
        agent.add("I didn't understand");
        agent.add("I'm sorry, can you try again?");
    }

    
    
    
    // Run the proper function handler based on the matched Dialogflow intent name
    
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('store.list.view', storeInfo);
    intentMap.set('store.list.view - custom', categoryLists);
    intentMap.set('items.list.view', product_lists);
    intentMap.set('Cart.list.add', addToCart);
	intentMap.set('Cart.list.all', showCart);
    agent.handleRequest(intentMap);
});

module.exports = {
	dialogFlowAgent: realChat,
}
