.PHONY: dev tunnel build ollama push

# Next.js 開発サーバー起動
dev:
	npm run dev

# ngrok トンネル起動
tunnel:
	ngrok http 3000

# dev + tunnel を同時起動
start:
	@echo "Starting dev server and ngrok tunnel..."
	@npm run dev & ngrok http 3000

# プロダクションビルド
build:
	npm run build

# Ollama 起動
ollama:
	ollama serve

push:
	git add . && git commit -m 'chore' && git push origin main
