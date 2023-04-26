const { App } = require('@slack/bolt');
require('dotenv').config();
var Airtable = require('airtable');
var base = new Airtable({apiKey:process.env.AIRTABLE_TOKEN}).base(process.env.AIRTABLE_BASE);

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true, // add this
    appToken: process.env.SLACK_APP_TOKEN // add this
});
app.message('formInput', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say({
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
    });

});

app.action('button_click', async ({ body, ack, say }) => {
    // Acknowledge the action
    await ack();
    let formData = body.state.values;
    let formValues = [];
    for(let elem in formData){
        formValues.push(formData[elem]);
    }
    
    let addList=[];
    addList.push({"fields":{
        "FirstName":formValues[0]['plain_text_input-action'].value,
        "LastName":formValues[1]['plain_text_input-action'].value,
        "Email":formValues[2]['plain_text_input-action'].value,
        "Date":formValues[3]['datepicker-action'].selected_date,
        "Gender":formValues[4]['radio_buttons-action'].selected_option.text.text
    }})
    base('Table1').create(addList, function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        console.log("success");
      })
 

    await say(`Hi <@${body.user.id}>, sucessfully submitted your response`);
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();