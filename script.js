// Dependencies
const { OpenAI } = require("langchain/llms/openai");
const inquirer = require("inquirer");
require("dotenv").config();
const { PromptTemplate } = require("langchain/prompts");
const { StructuredOutputParser } = require("langchain/output_parsers");

// Initialize the OpenAI model
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  model: "gpt-3.5-turbo",
});

// define a schema for the output.
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: "Answer to the user's coding question",
  explanation: "Explanation of the answer provided",
});

const formatInstructions = parser.getFormatInstructions();

const promptFunc = async (input) => {
  try {
    const prompt = new PromptTemplate({
      template:
        "You are a coding tutor. You will help users with their coding questions.\n{format_instructions}\n{question}",
      inputVariables: ["question"],
      partialVariables: { format_instructions: formatInstructions },
    });

    // Format the prompt with the user input
    const promptInput = await prompt.format({
      question: input,
    });

    // Call the model with the formatted prompt
    const res = await model.call(promptInput);
    console.log(await parser.parse(res));
  } catch (err) {
    console.log(err);
  }
};

// Initialization function
const init = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Ask a coding question:",
      },
    ])
    .then((inquirerResponse) => {
      promptFunc(inquirerResponse.name);
    });
};

// Calls the init function and starts the script
init();
