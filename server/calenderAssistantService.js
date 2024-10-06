const OpenAI = require('openai');
const dotenv = require('dotenv');
const fs = require('fs/promises');
const path = require('path');
const ical = require('node-ical');
const { DateTime } = require('luxon');
const { type } = require('os');
dotenv.config();

module.exports = async function gptSender(filePath, res, oneortwo) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log(oneortwo)


  class CalendarAssistantService {
    constructor() {
      this.assistant = null;
      this.thread = null;
    }

    async initialize() {
      try {
        this.assistant = await openai.beta.assistants.create({
          name: "Calendar Assistant",
          instructions: "You are a helpful assistant for managing calendars and scheduling.",
          model: "gpt-4o",
        });
        this.thread = await openai.beta.threads.create();
        console.log('CalendarAssistantService initialized successfully');
      } catch (error) {
        console.error(`Error initializing CalendarAssistantService: ${error.message}`);
        throw new Error('Failed to initialize CalendarAssistantService');
      }
    }

    async processUserRequest(filePath, prompt) {
      try {
        const events = await this.parseICSFile(filePath);
        const eventsData = this.formatEventsData(events);
        console.log(oneortwo, "AYYAAYYAYAYAYYAAA TESTTTT ")
        if (oneortwo === 2) {
          console.log("made ittt!!!", oneortwo)
          res.send(eventsData)
        }
        const messageContent = `Here is my calendar data in JSON format:\n\n${JSON.stringify(eventsData, null, 2)}\n\n${prompt}`;

        await this.addMessageToThread(this.thread.id, { role: 'user', content: messageContent });
        let result2 = await this.streamRun(this.thread.id, this.assistant.id);
        console.log(result2)
        console.log()
        // // const secondPrompt = "Please provide JavaScript single array of the free slots for assignment deadlines based on the calendar data.";
        const secondPrompt = "Please provide only the time slots where I can work on the assignments, add subject name, start datetime and end datetime to it. It should not be code";

        await this.addMessageToThread(this.thread.id, { role: 'user', content: secondPrompt });
        let result1 = await this.streamRun(this.thread.id, this.assistant.id);
        console.log(result1)

        // result1 = result1.split('[object Object]')[1];
        // const regex = /\[([\s\S]*?)\]/;
        // const match = result1.match(regex);
        // if (match) {
        //   const arrayContent = match[1];
        //   console.log('Extracted array content:', `[${arrayContent}]`);
        //   // If you need the array as a JavaScript object:
        // const arrayObject = JSON.parse(`[${arrayContent}]`);
        // console.log('Array as object:', arrayObject);

        //const arrayObject = stringToArray(arrayContent);
        //console.log('Array as object:', arrayObject);

      } catch (error) {
        console.error(`Error processing user request: ${error.message}`);
        throw error;
      }
    }


    async parseICSFile(filePath) {
      try {
        const data = await fs.readFile(filePath, 'utf8');
        return ical.parseICS(data);
      } catch (error) {
        console.error(`Error parsing ICS file: ${error.message}`);
        throw error;
      }
    }

    formatEventsData(events) {
      return Object.values(events)
        .filter(event => event.type === 'VEVENT')
        .map(event => ({
          summary: event.summary,
          start: this.convertToMST(event.start),
          end: this.convertToMST(event.end),
          description: event.description,
          location: event.location,
        }));
    }

    convertToMST(utcTime) {
      return DateTime.fromJSDate(utcTime, { zone: 'utc' })
        .setZone('America/Denver')
        .toISO();
    }

    async addMessageToThread(threadId, message) {
      try {
        await openai.beta.threads.messages.create(threadId, message);
      } catch (error) {
        console.error("Error adding message to thread:", error);
        throw error;
      }
    }

    // Inside streamRun method
    async streamRun(threadId, assistantId) {
      let result = '';  // Capture result here

      return new Promise((resolve, reject) => {
        openai.beta.threads.runs.stream(threadId, {
          assistant_id: assistantId,
        })
          .on('textCreated', (text) => {
            if (text) {
              console.log('assistant > ');
              result += text;  // Append the generated text to result
            }
          })
          .on('textDelta', (textDelta) => {
            if (textDelta && textDelta.value) {
              process.stdout.write(textDelta.value);
              result += textDelta.value;  // Append each delta to result
            }
          })
          .on('error', (error) => {
            console.error('Stream error:', error);
            reject(error);
          })
          .on('end', () => {
            if (oneortwo === 1) {
              try {
                console.log('modified')
                result = result.replace(/\[object Object\]/g, "")
                res.send(result)
              } catch (e) {

              }

              // Here, send the result to the frontend or handle it as needed
            }

            // You can now return this result or send it to the frontend as needed
            resolve(result);
            console.log('\nStream run completed');
            //console.log('Generated JavaScript array of free time slots:', result);

          });
      });
    }
  }

  const calendarAssistant = new CalendarAssistantService();

  (async () => {
    try {
      await calendarAssistant.initialize();
      const prompt = "Provide the free times for working on the assignment according to the schedule as well as course difficulty (dependent on course number as well as subject) accordingly. It should not clash with my times already booked. It should be done before the deadline and should be on the safe side and not at the end before the deadline directly. Optimize my schedule accordingly. Do not clash with my classes or any other event. Assumptions: Computer science assignments are relatively easy Math assignments are time consuming because you do it by hand. Try to be straight forward and concise";


      await calendarAssistant.processUserRequest(filePath, prompt);
    } catch (error) {
      console.error('Error:', error);
    }
  })();

};
