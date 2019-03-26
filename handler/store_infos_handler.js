// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const dbHandler = require('../models/execution-db');
const {
	Card,
	Suggestion,
	Payload
} = require('dialogflow-fulfillment');

module.exports = {
	
	index: function (agent)
	{
		const facebookPayload = {
			attachment: {
				type: 'template',
				payload: {
					template_type: 'generic',
					elements: []
				}
			}
		};
		
		return dbHandler.getStores().then(function (result) {
			let elements = [];
			result.forEach(function(item) {
				let ctx = {
					"store_id": item._id,
					"store_name": item.name
				};
				const element = {
					"title": item.name,
					"image_url": item.feature_image,
					"subtitle": item.subtitle,
					"default_action": {
						"type": 'web_url',
						"url": item.web_url,
					},
					"buttons": [
						{
							type: 'web_url',
							url: item.web_url,
							title: 'Show Websites'
						},
						{
							type: 'phone_number',
							title: 'Call Phone Number',
							payload: item.contact_number
						},
						{
							"type": 'postback',
							"title": 'start shopping',
							"payload": 'start shopping' + JSON.stringify(ctx)
						}
					]
				};
				elements.push(element);
			});
			facebookPayload.attachment.payload.elements = elements;
			return new Payload(agent.FACEBOOK, facebookPayload);
		}).catch(e => {
			console.error(e);
			return Promise.reject(e);
		});
	}
	
};