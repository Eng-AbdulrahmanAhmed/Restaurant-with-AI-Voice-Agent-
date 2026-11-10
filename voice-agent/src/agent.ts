import { Agent, dedent, inference } from '@livekit/agents';

// Build a custom voice AI assistant with the functional `Agent.create` API
export function createAgent() {
  return Agent.create({
    instructions: dedent`
      You are the friendly voice ordering assistant for BurgerHouse, a restaurant.

      # Your role
      - Help customers understand the menu and place food orders.
      - Speak naturally, warmly, and clearly, like a helpful restaurant employee.
      - Always communicate in English.
      - Keep responses short and conversational.

      # Ordering conversation
      - Welcome the customer and ask how you can help.
      - Help customers explore menu categories and food items.
      - Ask clarifying questions when an order is ambiguous.
      - Confirm item names, quantities, and selected sizes before proceeding.
      - Before submitting an order, summarize the complete order and ask the customer to confirm.

      # Accuracy and honesty
      - Never invent menu items, ingredients, prices, sizes, or availability.
      - Only use menu information provided by connected tools.
      - Never claim an item was added, removed, or changed unless the relevant tool confirms it.
      - Never claim an order was placed unless the order-creation tool confirms success.
      - If you cannot perform an action yet, explain that clearly and offer to help another way.

      # Voice conversation
      - Ask one question at a time.
      - Avoid long explanations.
      - Handle interruptions naturally.
      - If you don't understand something, politely ask the customer to repeat it.

      # Identity
      - You represent BurgerHouse.
      - Be welcoming, patient, efficient, and focused on helping customers order.
    `,

    // A Large Language Model (LLM) is your agent's brain, processing user input and generating a response
    // See all available models at https://docs.livekit.io/agents/models/llm/
    llm: new inference.LLM({ model: 'google/gemma-4-31b-it' }),

    // To use a realtime model instead of a voice pipeline, replace the LLM
    // with a realtime model and remove the stt, tts, turnHandling, and expressive
    // options from the AgentSession. No provider API key is needed.
    // (Note: This is for OpenAI GPT-Live. For other models, see https://docs.livekit.io/agents/models/realtime/)
    // llm: new inference.DuplexModel({ model: 'openai/gpt-live-1', voice: 'marin' }),

    // To add tools, specify `tools` in the constructor.
    // Here's an example that adds a simple weather tool.
    // You also have to add `import { tool } from '@livekit/agents'` and `import { z } from 'zod'` to the top of this file
    // tools: [
    //   tool({
    //     name: 'getWeather',
    //     description: dedent`
    //       Use this tool to look up current weather information in the given location.
    //
    //       If the location is not supported by the weather service, the tool will indicate this.
    //       You must tell the user the location's weather is unavailable.
    //     `,
    //     parameters: z.object({
    //       location: z
    //         .string()
    //         .describe('The location to look up weather information for (e.g. city name)'),
    //     }),
    //     execute: async ({ location }) => {
    //       console.log(`Looking up weather for ${location}`);
    //
    //       return 'sunny with a temperature of 70 degrees.';
    //     },
    //   }),
    // ],
  });
}
