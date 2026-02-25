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

1. https://api.slack.com/apps を開き **Create New App** をクリック
2. **From a manifest** を選択
3. アプリをインストールするワークスペースを選択
4. 以下の YAML を貼り付けて作成（`request_url` は手順 6 で差し替え）:

```yaml
display_information:
  name: Ollama Bot
  description: Ollama-powered bot built with chat-sdk

features:
  bot_user:
    display_name: ollama-bot
    always_online: true

oauth_config:
  scopes:
    bot:
      - app_mentions:read
      - channels:history
      - channels:read
      - chat:write
      - groups:history
      - groups:read
      - im:history
      - im:read
      - mpim:history
      - mpim:read
      - reactions:read
      - reactions:write
      - users:read

settings:
  event_subscriptions:
    request_url: https://your-domain.com/api/webhooks/slack
    bot_events:
      - app_mention
      - message.channels
      - message.groups
      - message.im
      - message.mpim
  interactivity:
    is_enabled: true
    request_url: https://your-domain.com/api/webhooks/slack
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```

5. 作成後 **Install to Workspace** でワークスペースにインストール
6. サイドバーの **OAuth & Permissions** から `Bot User OAuth Token` (`xoxb-...`) をコピー
7. サイドバーの **Basic Information** から `Signing Secret` をコピー

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
