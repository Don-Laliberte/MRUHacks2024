const config = {
	nodeEnv: 'development',
	openaiApiKey: process.env.OPENAI_API_KEY,
	logLevel: 'info',
	kanbanTaskDir: './kanban-tasks',  // Directory to store Kanban task files
	instructionsFile: './instructions.txt',  // File to provide AI assistant instructions
    };
    
    export default config;
    