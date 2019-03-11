// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const {
    WebhookClient
} = require('dialogflow-fulfillment');
const {
    Card,
    Suggestion,
    Payload
} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://onixoni:q1w2e3r4@aniksandbox-6djkq.mongodb.net/admin";
const dbName = 'sandbox';

const mongoclient = new MongoClient(url, {
    useNewUrlParser: true
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({
        request,
        response,
    });

    function add_to_cart(agent) {
        const facebookPayload = {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: []
                }
            }
        };
        let elements = [];
        let item_info = agent.query.replace("add-to-list", "");
        item_info = JSON.parse(item_info);
        console.log(item_info);
        agent.add("You have selected item  [" + item_info.item_name + "]");
        // let originalRequest = agent.originalRequest;
        // let sender_user= "";
        // let db = null;
        // if (originalRequest.source == "facebook") {
        //     sender_user =  originalRequest.payload.data.sender.id;
        //     console.log(sender_user);
        // }
        // return MongoClient.connect(url, {
        //         useNewUrlParser: true
        //     })
        //     .then(function(client) {
        //         db=client.db(dbName);
        //         return Promise.resolve(client.db(dbName));
        //     }).then(function(db) {
        //         return db.collection('item_info');
        //     }).then(function(collection) {
        //         return collection.find({catagory_id:catagory_info.catagory_id}).toArray();
        //     }).then(function(docs) {
        //         docs.forEach(function(item) {
        //             let ctx = {
        //                 "item_id": item._id,
        //                 "catagory_id": item.catagory_id,
        //                 "store_owner_id": item.store_owner_id,
        //             };
        //             const element = {
        //                 "title": item.item_name,
        //                 "image_url": item.item_image,
        //                 "subtitle": item.item_short_desc,
        //                 "default_action": {
        //                     "type": 'web_url',
        //                     "url": item.item_image,
        //                 },
        //                 "buttons": [
        //                     {
        //                         "type": 'postback',
        //                         "title": 'Add To List',
        //                         "payload": 'add-to-list' + JSON.stringify(ctx)
        //                     }
        //                 ]
        //             };
        //             elements.push(element);
        //         });

        //         facebookPayload.attachment.payload.elements = elements;
        //         console.log('lists ' + JSON.stringify(facebookPayload));
        //         agent.add("Welcome to my product_lists agent!");
        //         agent.add(new Payload(agent.FACEBOOK, facebookPayload));
        //     }).catch(e => {
        //         console.error(e);
        //         return Promise.reject(e);
        //     });

    }

    function product_lists(agent) {
        const facebookPayload = {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: []
                }
            }
        };
        let elements = [];
        let catagory_info = agent.query.replace("show-products", "");
        catagory_info = JSON.parse(catagory_info);
        // console.log(catagory_info);
        agent.add("You have selected catagory to [" + catagory_info.catagory_name + "]");
        let originalRequest = agent.originalRequest;
        let sender_user= "";
        let db = null;
        if (originalRequest.source == "facebook") {
            sender_user =  originalRequest.payload.data.sender.id;
            console.log(sender_user);
        }
        return MongoClient.connect(url, {
                useNewUrlParser: true
            })
            .then(function(client) {
                db=client.db(dbName);
                return Promise.resolve(client.db(dbName));
            }).then(function(db) {
                return db.collection('item_info');
            }).then(function(collection) {
                return collection.find({catagory_id:catagory_info.catagory_id}).toArray();
            }).then(function(docs) {
                docs.forEach(function(item) {
                    let ctx = {
                        "item_id": item._id,
                        "item_name": item.item_name,
                        "catagory_id": item.catagory_id,
                        "store_owner_id": item.store_owner_id,
                    };
                    const element = {
                        "title": item.item_name,
                        "image_url": item.item_image,
                        "subtitle": item.item_short_desc,
                        "default_action": {
                            "type": 'web_url',
                            "url": item.item_image,
                        },
                        "buttons": [
                            {
                                "type": 'postback',
                                "title": 'Add To List',
                                "payload": 'add-to-list' + JSON.stringify(ctx)
                            }
                        ]
                    };
                    elements.push(element);
                });

                facebookPayload.attachment.payload.elements = elements;
                // console.log('lists ' + JSON.stringify(facebookPayload));
                agent.add("Welcome to my product_lists agent!");
                agent.add(new Payload(agent.FACEBOOK, facebookPayload));
            }).catch(e => {
                console.error(e);
                return Promise.reject(e);
            });

    }

    function catagory_lists(agent) {
        const facebookPayload = {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: []
                }
            }
        };
        let elements = [];
        let store_info = agent.query.replace("start shopping", "");
        store_info = JSON.parse(store_info);
        let originalRequest = agent.originalRequest;
        let sender_user= "";
        let db = null;
        if (originalRequest.source == "facebook") {
            sender_user =  originalRequest.payload.data.sender.id;
            console.log(sender_user);
        }
        return MongoClient.connect(url, {
                useNewUrlParser: true
            })
            .then(function(client) {
                db=client.db(dbName);
                return Promise.resolve(client.db(dbName));
            }).then(function(db) {
                return db.collection('user_info');
            }).then(function(collection) {
                return collection.updateOne({user_id: sender_user}, {$set:{selected_store:store_info.store_id}}, {upsert:true, w: 1});
            }).then(function(docs) {
                return db.collection('item_catagories');
            }).then(function(collection) {
                return collection.find().toArray();
            }).then(function(docs) {
                docs.forEach(function(item) {
                    let ctx = {
                        "catagory_id": item._id,
                        "catagory_name": item.catagory_name
                    };
                    const element = {
                        "title": item.catagory_name,
                        "image_url": item.catagory_image,
                        "subtitle": item.catagory_short_desc,
                        "default_action": {
                            "type": 'web_url',
                            "url": item.catagory_image,
                        },
                        "buttons": [
                            {
                                "type": 'postback',
                                "title": 'Show Products',
                                "payload": 'show-products' + JSON.stringify(ctx)
                            }
                        ]
                    };
                    elements.push(element);
                });

                facebookPayload.attachment.payload.elements = elements;
                console.log("You have selected your default store to [" + store_info.store_name + "]");
                agent.add("You have selected your default store to [" + store_info.store_name + "]");
                agent.add("Please select a catagory from below");
                agent.add(new Payload(agent.FACEBOOK, facebookPayload));
            }).catch(e => {
                console.error(e);
                return Promise.reject(e);
            });

    }

    function store_infos(agent) {
        const facebookPayload = {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: []
                }
            }
        };
        let elements = [];

        return MongoClient.connect(url, {
                useNewUrlParser: true
            })
            .then(function(client) {
                return Promise.resolve(client.db(dbName));
            }).then(function(db) {
                return db.collection('store_infos');
            }).then(function(collection) {
                return collection.find({}).toArray();
            }).then(function(docs) {
                docs.forEach(function(item) {
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
                        "buttons": [{
                                "type": 'web_url',
                                "url": item.web_url,
                                "title": 'Show Websites'
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
                agent.add(new Payload(agent.FACEBOOK, facebookPayload));
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


    function createBooking(agent) {
        let guests = agent.parameters.guests;
        let time = new Date(agent.parameters.time);
        let date = new Date(agent.parameters.date);
        console.log('createBooking guests : ' + JSON.stringify(guests));
        console.log('createBooking time: ' + JSON.stringify(time));
        console.log('createBooking date: ' + JSON.stringify(date));
        let bookingDate = new Date(date);
        bookingDate.setHours(time.getHours());
        bookingDate.setMinutes(time.getMinutes());
        console.log('bookingDate date1: ' + bookingDate);
        let now = new Date();

        if (guests < 1) {
            agent.add('This message is from Dialogflow\'s Cloud Functions for Firebase editor!');
        } else if (bookingDate < now) {
            agent.add("You can't make a reservation in the past. Please try again!");
        } else if (bookingDate.getFullYear() > now.getFullYear()) {
            agent.add("You can't make a reservation for ${bookingDate.getFullYear()} yet. Please choose a date in ${now.getFullYear()}.");
        } else {
            console.log('bookingDate date2: ' + bookingDate);
            agent.add('Have a wonderful day!');
            let timezone = parseInt(agent.parameters.time.toString().slice(19, 22));
            bookingDate.setHours(bookingDate.getHours() + timezone);
            console.log('bookingDate date3: ' + bookingDate);
            agent.add(`You have successfully booked a table for ${guests} guests on ${bookingDate.toString().slice(0,21)}`);
            agent.add('See you at the restaurant!');
            agent.add('Have a wonderful day!');
        }
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('restaurant.booking.create', createBooking);
    intentMap.set('store.list.view', store_infos);
    intentMap.set('store.list.view - custom', catagory_lists);
    intentMap.set('items.list.view', product_lists);
    intentMap.set('items.list.add.to.cart', add_to_cart);
    //   intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
});
