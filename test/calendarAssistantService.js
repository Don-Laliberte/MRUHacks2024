import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import ical from 'node-ical';
import { DateTime } from 'luxon'; // Add luxon for time zone conversion

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
        // tools: [{ type: "code_interpreter" }],
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
      const messageContent = `Here is my calendar data in JSON format:

${JSON.stringify(eventsData, null, 2)}

${prompt}`;

      //console.log(JSON.stringify(eventsData, null, 2))
      await this.addMessageToThread(this.thread.id, { role: 'user', content: messageContent });
      await this.streamRun(this.thread.id, this.assistant.id);

      const secondPrompt = "Please provide JavaScript arrays of the free slots for assignment deadlines based on the calendar data. It should be safe times and not immediately before assignments. It should be ideal time for the assignment.";
      await this.addMessageToThread(this.thread.id, { role: 'user', content: secondPrompt });
      await this.streamRun(this.thread.id, this.assistant.id);
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
        start: this.convertToMST(event.start), // Convert UTC to MST
        end: this.convertToMST(event.end),     // Convert UTC to MST
        description: event.description,
        location: event.location,
      }));
  }

  // Function to convert UTC time to MST using Luxon
  convertToMST(utcTime) {
    return DateTime.fromJSDate(utcTime, { zone: 'utc' })
      .setZone('America/Denver') // MST zone
      .toISO(); // Convert to ISO string with time zone adjustments
  }

  async addMessageToThread(threadId, message) {
    try {
      await openai.beta.threads.messages.create(threadId, message);
    } catch (error) {
      console.error("Error adding message to thread:", error);
      throw error;
    }
  }

  async streamRun(threadId, assistantId) {
    return new Promise((resolve, reject) => {
      openai.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId,
      })
        .on('textCreated', (text) => {
          if (text) {
            console.log('assistant > ');
          }
        })
        .on('textDelta', (textDelta) => {
          if (textDelta && textDelta.value) {
            process.stdout.write(textDelta.value);
          }
        })
        .on('error', (error) => {
          console.error('Stream error:', error);
          reject(error);
        })
        .on('end', () => {
          console.log('\nStream run completed');
          resolve();
        });
    });
  }
}

// Instantiate the service
const calendarAssistant = new CalendarAssistantService();

// Initialize and process the .ics file directly
(async () => {
  try {
    await calendarAssistant.initialize();

    // Provide the file path to the .ics file
    const filePath = path.resolve('./calendar.ics');  // Replace with the actual path to your .ics file
    const prompt = "Provide the free times for working on the assignment according to the schedule as well as course difficulty (dependent on course number as well as subject) accordingly. It should not clash with my times already booked. It should be done before the deadline and should be on the safe side and not at the end before the deadline directly. Optimize my schedule accordingly. Do not clash with my classes or any other event. Maximum of 2 free slots should be assigned per assignment judge accordingly. Assumptions: Computer science assignments are relatively easy Math assignments are time consuming because you do it by hand.";

    // Process the request using the .ics file and prompt
    await calendarAssistant.processUserRequest(filePath, prompt);
  } catch (error) {
    console.error('Error:', error);
  }
})();









// import express from 'express';
// import multer from 'multer';
// import OpenAI from 'openai';
// import dotenv from 'dotenv';
// import fs from 'fs/promises';
// import path from 'path';
// import ical from 'node-ical';

// dotenv.config();

// const app = express();
// const upload = multer({ dest: 'uploads/' });

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// class CalendarAssistantService {
//   constructor() {
//     this.assistant = null;
//     this.thread = null;
//   }

//   async initialize() {
//     try {
//       this.assistant = await openai.beta.assistants.create({
//         name: "Calendar Assistant",
//         instructions: "You are a helpful assistant for managing calendars and scheduling.",
//         tools: [{ type: "code_interpreter" }],
//         model: "gpt-4",
//       });
//       this.thread = await openai.beta.threads.create();
//       console.log('CalendarAssistantService initialized successfully');
//     } catch (error) {
//       console.error(`Error initializing CalendarAssistantService: ${error.message}`);
//       throw new Error('Failed to initialize CalendarAssistantService');
//     }
//   }

//   async processUserRequest(filePath, prompt) {
//     try {
//       const events = await this.parseICSFile(filePath);
//       const eventsData = this.formatEventsData(events);
//       const messageContent = `Here is my calendar data in JSON format:

// ${JSON.stringify(eventsData, null, 2)}

// ${prompt}`;

//       await this.addMessageToThread(this.thread.id, { role: 'user', content: messageContent });
//       await this.streamRun(this.thread.id, this.assistant.id);

//       const secondPrompt = "Please provide JavaScript arrays for the eventTimes and the free slots for assignment deadlines based on the calendar data.";
//       await this.addMessageToThread(this.thread.id, { role: 'user', content: secondPrompt });
//       await this.streamRun(this.thread.id, this.assistant.id);
//     } catch (error) {
//       console.error(`Error processing user request: ${error.message}`);
//       throw error;
//     }
//   }

//   async parseICSFile(filePath) {
//     try {
//       const data = await fs.readFile(filePath, 'utf8');
//       return ical.parseICS(data);
//     } catch (error) {
//       console.error(`Error parsing ICS file: ${error.message}`);
//       throw error;
//     }
//   }

//   formatEventsData(events) {
//     return Object.values(events)
//       .filter(event => event.type === 'VEVENT')
//       .map(event => ({
//         summary: event.summary,
//         start: event.start,
//         end: event.end,
//         description: event.description,
//         location: event.location,
//       }));
//   }

//   async addMessageToThread(threadId, message) {
//     try {
//       await openai.beta.threads.messages.create(threadId, message);
//     } catch (error) {
//       console.error("Error adding message to thread:", error);
//       throw error;
//     }
//   }

//   async streamRun(threadId, assistantId) {
//     return new Promise((resolve, reject) => {
//       openai.beta.threads.runs.stream(threadId, {
//         assistant_id: assistantId,
//       })
//         .on('textCreated', (text) => {
//           if (text) {
//             console.log('assistant > ');
//           }
//         })
//         .on('textDelta', (textDelta) => {
//           if (textDelta && textDelta.value) {
//             process.stdout.write(textDelta.value);
//           }
//         })
//         .on('error', (error) => {
//           console.error('Stream error:', error);
//           reject(error);
//         })
//         .on('end', () => {
//           console.log('\nStream run completed');
//           resolve();
//         });
//     });
//   }
// }

// const calendarAssistant = new CalendarAssistantService();

// app.post('/process-calendar', upload.single('icsFile'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   try {
//     await calendarAssistant.initialize();
//     const filePath = req.file.path;
//     const prompt = "Provide the free times for working on the assignment according to the schedule as well as course difficulty (dependent on course number as well as subject) accordingly. It should not clash with my times already booked. It should be done before the deadline and should be on the safe side and not at the end before the deadline directly. Optimize my schedule accordingly. Convert this into Mountain standard time accordingly. Do not clash with my classes or any other event. Maximum of 2 free slots should be assigned per assignment judge accordingly. Assumptions: Computer science assignments are relatively easy Math assignments are time consuming because you do it by hand";

//     await calendarAssistant.processUserRequest(filePath, prompt);
//     res.status(200).send('Calendar processed successfully.');
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('An error occurred while processing the calendar.');
//   }
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });