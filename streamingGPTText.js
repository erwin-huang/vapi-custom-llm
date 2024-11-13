import { Readable } from 'node:stream';

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const created = Math.floor(Date.now() / 1000);

function createChatCompletionChunk(data) {
  let content;
  let role;
  let finishReason;

  if (data.initial) {
    content = '';
    role = 'assistant';
  } else if (data.hasDone) {
    content = null;
    finishReason = 'stop';
  } else {
    content = data.content || '';
  }
  return {
    id: "msg_01KAzxVD1BoJDjsStAKHokJr", // random string, for testing purpose;
    choices: [
      {
        delta: {
          content,
          refusal: null,
          role,
        },
        finish_reason: finishReason,
        index: 0,
        logprobs: null,
      },
    ],
    created,
    model: "claude-3-5-haiku-latest",
    object: 'chat.completion.chunk',
    service_tier: null,
  };
}


export async function streamResponse1() {
  async function* createStream() {

    // Initial Chunk
    const initialResponse = createChatCompletionChunk({ initial: true });
    yield `data: ${JSON.stringify(initialResponse)}\n\n`;

    // Response 1 Chunk
    const response1 = createChatCompletionChunk({ content: "Thanks. I've noted that you were born in 1996. <flush />" });
    console.log("STREAMING: ", "Thanks. I've noted that you were born in 1996. <flush />");
    yield `data: ${JSON.stringify(response1)}\n\n`;

    // Delay Response
    await sleep(4000);

    // Response 2 Chunk
    const response2 = createChatCompletionChunk({ content: "Where did you grow up?" });
    console.log('STREAMING: ', "Where did you grow up?");
    yield `data: ${JSON.stringify(response2)}\n\n`;

    // Final Chunk
    const finalResponse = createChatCompletionChunk({ hasDone: true });
    yield `data: ${JSON.stringify(finalResponse)}\n\n`;
    yield `data: [DONE]`;
  }

  const stream = Readable.from(createStream());

  return stream;
}

export async function streamResponse2() {
  async function* createStream() {

    // Initial Chunk
    const initialResponse = createChatCompletionChunk({ initial: true });
    yield `data: ${JSON.stringify(initialResponse)}\n\n`;

    // Response 1 Chunk
    const response1 = createChatCompletionChunk({ content: "Thanks <flush />" });
    console.log("STREAMING: ", "Thanks <flush />");
    yield `data: ${JSON.stringify(response1)}\n\n`;

    const response2 = createChatCompletionChunk({ content: ". I've noted that you were born in 1996. <flush />" });
    console.log("STREAMING: ", ". I've noted that you were born in 1996. <flush />");
    yield `data: ${JSON.stringify(response2)}\n\n`;

    // Delay Response
    await sleep(4000);

    // Response 3 Chunk
    const response3 = createChatCompletionChunk({ content: "Where did you grow up?" });
    console.log('STREAMING: ', "Where did you grow up?");
    yield `data: ${JSON.stringify(response3)}\n\n`;

    // Final Chunk
    const finalResponse = createChatCompletionChunk({ hasDone: true });
    yield `data: ${JSON.stringify(finalResponse)}\n\n`;
    yield `data: [DONE]`;
  }

  const stream = Readable.from(createStream());

  return stream;
}