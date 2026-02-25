import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createMemoryState } from "@chat-adapter/state-memory";
import { streamText } from "ai";
import { ollama } from "ollama-ai-provider-v2";

const model = ollama("gemma3:4b");

export const bot = new Chat({
  userName: "ollama-bot",
  adapters: {
    slack: createSlackAdapter(),
  },
  state: createMemoryState(),
  logger: "debug",
});

// メンション時: スレッドを購読して AI で返答
bot.onNewMention(async (thread, message) => {
  await thread.subscribe();

  const result = streamText({
    model,
    system: "あなたは親切なアシスタントです。簡潔に日本語で回答してください。",
    prompt: message.text,
  });

  await thread.post(result.textStream);
});

// 購読済みスレッドの新メッセージに対して会話を継続
bot.onSubscribedMessage(async (thread, message) => {
  // recentMessages からコンテキストを構築（新しい順なので reverse）
  const history = [...thread.recentMessages].reverse();

  const messages = history.map((msg) => ({
    role: msg.author.isBot ? ("assistant" as const) : ("user" as const),
    content: msg.text,
  }));

  const result = streamText({
    model,
    system: "あなたは親切なアシスタントです。簡潔に日本語で回答してください。",
    messages,
  });

  await thread.post(result.textStream);
});
