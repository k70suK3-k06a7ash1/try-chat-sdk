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
make ollama
```

### 5. 開発サーバーの起動

```sh
# dev サーバーと ngrok を同時に起動
make start

# または別々のターミナルで個別に起動
make dev      # ターミナル1: Next.js dev サーバー
make tunnel   # ターミナル2: ngrok トンネル
```

> ngrok が未インストールの場合は `brew install ngrok` で導入し、初回のみ認証トークンを設定:
> ```sh
> ngrok config add-authtoken <your-authtoken>
> ```
> アカウントは https://ngrok.com から無料で作成できる。

### 6. Slack App の Request URL を更新

ngrok 起動後に表示される Forwarding URL を確認し、Slack App に設定する。

1. https://api.slack.com/apps でアプリを開く
2. **Event Subscriptions** → Request URL に ngrok URL + パスを入力:
   ```
   https://xxxx-xx-xx.ngrok-free.dev/api/webhooks/slack
   ```
   **注意**: ドメインだけでなく `/api/webhooks/slack` のパスまで含めること。「Verified」と表示されれば成功。
3. **Interactivity & Shortcuts** → Request URL も同じ URL に変更
4. それぞれ **Save Changes** を押す

> ngrok を再起動すると URL が変わるので、その都度 Slack 側も更新が必要。

## Make コマンド一覧

| コマンド | 説明 |
|---|---|
| `make start` | dev サーバー + ngrok を同時起動 |
| `make dev` | Next.js 開発サーバーのみ起動 |
| `make tunnel` | ngrok トンネルのみ起動 |
| `make build` | プロダクションビルド |
| `make ollama` | Ollama サーバー起動 |
| `make push` | git commit & push |

## 使い方

1. ボットをチャンネルに招待
2. `@ollama-bot` でメンションすると AI が返答
3. 同じスレッド内で会話を継続可能（自動購読）
