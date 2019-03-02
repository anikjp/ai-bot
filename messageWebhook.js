// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://anik-bot.firebaseio.com'
});

const db = admin.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);
const {
    WebhookClient
} = require('dialogflow-fulfillment');
const {
    Card,
    Suggestion
} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    
    const agent = new WebhookClient({
        request,
        response,
    });


    function welcome(agent) {
    const databaseEntry = {
    date_of_birth: "June 23, 1912",
    full_name: "Alan Turing"
  };
    // Get the database collection 'dialogflow' and document 'agent' and store
    // the document  {entry: "<value of database entry>"} in the 'agent' document
    const dialogflowAgentRef = db.collection('dialogflow').doc('agent');
    const time = Date.now();
    return db.runTransaction(t => {
      t.set(dialogflowAgentRef, { "${time}" : databaseEntry});
      return Promise.resolve('Write complete');
    }).then(doc => {
      agent.add(`Wrote "${databaseEntry}" to the Firestore database.`);
    }).catch(err => {
      console.log(`Error writing to Firestore: ${err}`);
      agent.add(`Failed to write "${databaseEntry}" to the Firestore database.`);
    });
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
    //   intentMap.set('your intent name here', yourFunctionHandler);
    //   intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
});
