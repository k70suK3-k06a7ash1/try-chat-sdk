# try-chat-sdk

Ollama + [Chat SDK](https://www.chat-sdk.dev/) で作る Slack チャットボット。

## 構成

- **Chat SDK** — マルチプラットフォーム対応チャットボット SDK
- **Ollama** (`gemma3:4b`) — ローカル LLM による AI 応答
- **Next.js** — Webhook エンドポイントのホスティング

## セットアップ

### 1. 依存関係のインストール

```sh
npm install
```

### 2. Slack App の作成

https://api.slack.com/apps で新しいアプリを作成し、以下の Bot Token Scopes を付与:

- `app_mentions:read`
- `channels:read`
- `channels:history`
- `chat:write`
- `im:read`

### 3. 環境変数の設定

`.env.local` に Slack の認証情報を記入:

```
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
```

### 4. Ollama の起動

```sh
ollama serve
```

### 5. 開発サーバーの起動

```sh
npm run dev
```

### 6. Webhook URL の公開

ngrok 等で localhost を公開し、Slack App の Request URL に設定:

```
https://<your-url>/api/webhooks/slack
```

## 使い方

1. ボットをチャンネルに招待
2. `@ollama-bot` でメンションすると AI が返答
3. 同じスレッド内で会話を継続可能（自動購読）
