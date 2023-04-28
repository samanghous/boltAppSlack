## Introduction
This is a Node.js application built with the @slack/bolt library and the Airtable API. The purpose of the application is to accept a ‘formInput’ event in Slack, float a form to the user, and then process the user's response by storing it in an Airtable database using the Airtable API.

## Prerequisites
Before you can run this application, you need to have the following:
1.	A Slack workspace with the appropriate permissions to create and install Slack apps
2.	An Airtable account and API key
3.	Node.js and npm installed on your local machine

## Installation
To install and run this application, follow these steps:

Clone the repository and navigate to the project directory:
git clone https://github.com/samanghous/boltAppSlack.git 
cd your_repo

Install the dependencies:
npm install

Create a .env file in the project directory and add the following environment variables:
SLACK_BOT_TOKEN=your_slack_bot_token_starts_with_xoxb (create a bot in basic info section and also give it bot scope in oauth and permissions. Token is in install app section.)
SLACK_SIGNING_SECRET=your_slack_signing_secret  (get it from slack setting,basic info section)
SLACK_APP_TOKEN=your_slack_app_token_starts_with_xapp (create a token in app level token section)
AIRTABLE_TOKEN=your_airtable_api_key (in airtable settings)
AIRTABLE_BASE=your_airtable_base_id (find in airtable settings)

Also in slack setting, enable socket mode.



## Start the application:
npm start

## Usage
Once the application is running, you can use it in Slack by sending a ‘ formInput’ event to the bot. The bot will respond by floating a form to the user with fields for FirstName, LastName, Email, Date, and Gender.
Once the user fills out the form and clicks the Submit button, the bot will process the response and store it in an Airtable database. The bot will also send a confirmation message to the user in Slack.

## Code Explanation

Import the required libraries:
const { App } = require('@slack/bolt');
require('dotenv').config();
var Airtable = require('airtable');
var base = new Airtable({apiKey:process.env.AIRTABLE_TOKEN}).base(process.env.AIRTABLE_BASE);

Create a new App instance:
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN
});

Set up a message listener for the formInput event:
app.message('formInput', async ({ message, say }) => {
    // Form blocks go here
});

Define the form blocks:
await say({
    "blocks": [
        // Form blocks go here
    ]
});

Create a block i.e form to float to user :
You can use this to make a code: of block Block Kit Builder - Slack
Following block was created:
"blocks": [
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "plain_text_input-action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "FirstName",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "plain_text_input-action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "LastName",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "plain_text_input-action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Email",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "datepicker",
                    "initial_date": "1990-04-28",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select a date",
                        "emoji": true
                    },
                    "action_id": "datepicker-action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Date",
                    "emoji": true
                }
            },
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "This is a header block",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "radio_buttons",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Male",
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Female",
                                "emoji": true
                            },
                            "value": "value-1"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Not Mention",
                                "emoji": true
                            },
                            "value": "value-2"
                        }
                    ],
                    "action_id": "radio_buttons-action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Gender",
                    "emoji": true
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Click on submit !!!"
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Submit"
                    },
                    "action_id": "button_click"
                }
            }
        ]

Set up an action listener for the button_click event:
app.action('button_click', async ({ body, ack, say }) => {
    // Form data processing and Airtable API call go here
});

Acknowledge the action and process the form data:
await ack();
let formData = body.state.values;
let formValues = [];
for(let elem in formData){
    formValues.push(formData[elem]);
}

Create an array of Airtable records to be added:
let addList=[];
addList.push({"fields":{
        "FirstName":formValues[0]['plain_text_input-action'].value,
        "LastName":formValues[1]['plain_text_input-action'].value,
        "Email":formValues[2]['plain_text_input-action'].value,
        "Date":formValues[3]['datepicker-action'].selected_date,
        "Gender":formValues[4]['radio_buttons-action'].selected_option.text.text
  }})

Save the response data in airtable using its api:
base('Table1').create(addList, function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        console.log("success");
      })

Acknowledge the user that form is submitted 
await say(`Hi <@${body.user.id}>, sucessfully submitted your response`);

## Note:
Add this Bolt app in your slack workspace.
