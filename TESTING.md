# 動作確認手順

## 前提条件

- Slack App の作成・インストールが完了していること（README 参照）
- `.env.local` に `SLACK_BOT_TOKEN` と `SLACK_SIGNING_SECRET` が設定済み
- Ollama がインストール済みで `gemma3:4b` モデルがダウンロード済み

モデルが未ダウンロードの場合:

```sh
ollama pull gemma3:4b
```

## 1. サービスの起動

ターミナルを 2 つ開く。

**ターミナル 1**: Ollama を起動

```sh
make ollama
```

**ターミナル 2**: dev サーバー + ngrok を同時起動

```sh
make start
```

> 個別に起動したい場合は `make dev` と `make tunnel` をそれぞれ別ターミナルで実行。

## 2. ngrok URL の確認

ngrok が起動すると以下のような出力が表示される:

```
Forwarding  https://xxxx-xxxx-xxxx.ngrok-free.dev -> http://localhost:3000
```

この `https://xxxx-xxxx-xxxx.ngrok-free.dev` を控える。

## 3. Slack App の Request URL を設定

1. https://api.slack.com/apps でアプリを開く
2. **Event Subscriptions** → Request URL:
   ```
   https://xxxx-xxxx-xxxx.ngrok-free.dev/api/webhooks/slack
   ```
   「Verified」と表示されることを確認 → **Save Changes**
3. **Interactivity & Shortcuts** → Request URL に同じ URL を設定 → **Save Changes**

## 4. ボットをチャンネルに招待

Slack で任意のチャンネルを開き:

```
/invite @Ollama Bot
```

## 5. メンションで動作確認

チャンネル内でボットにメンション:

```
@Ollama Bot こんにちは
```

**期待する動作**: ボットが Ollama (gemma3:4b) を使って日本語で返答する。レスポンスはストリーミングでリアルタイムに表示される。

## 6. スレッド内の会話継続を確認

ボットが返答したスレッドを開き、追加メッセージを送信:

```
もっと詳しく教えて
```

**期待する動作**: メンションなしでもスレッド内の会話履歴を踏まえて返答する（初回メンション時にスレッドを自動購読しているため）。

## トラブルシューティング

### Slack の Request URL が Verified にならない

- URL にパス `/api/webhooks/slack` まで含まれているか確認。ドメインだけでは不可:
  ```
  # NG
  https://xxxx.ngrok-free.dev
  # OK
  https://xxxx.ngrok-free.dev/api/webhooks/slack
  ```
- `make dev` が起動しているか確認:
  ```sh
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/webhooks/slack
  # 405 が返れば正常（POST のみ受付）
  ```
- ngrok が起動しているか確認
- ngrok を再起動した場合は URL が変わるので、Slack 側も再設定が必要

### ボットにメンションしても反応しない

1. **Event Subscriptions の Save Changes を押したか確認**
   - Request URL を設定して「Verified」が出ても、ページ下部の **Save Changes** を押さないとイベントは配信されない
2. **dev サーバーのログを確認**
   - メンション時に `POST /api/webhooks/slack` のログが表示されるか確認
   - ログが出ない場合は Slack からイベントが届いていない（上記 1 を確認）
   - `401` が出る場合は `.env.local` の `SLACK_SIGNING_SECRET` が間違っている
3. **bot events の設定を確認**
   - Event Subscriptions ページで `app_mention` が Subscribe to bot events に含まれているか確認
4. **デバッグログの有効化**
   - `lib/bot.ts` の Chat 初期化に `logger: "debug"` を追加すると詳細ログが出力される

### Ollama のレスポンスが返らない

- `ollama serve` が起動しているか確認
- `ollama list` で `gemma3:4b` が存在するか確認
- Ollama に直接リクエストして応答を確認:
  ```sh
  curl http://localhost:11434/api/generate -d '{"model":"gemma3:4b","prompt":"hello"}'
  ```
