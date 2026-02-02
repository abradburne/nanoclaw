# Environment Variables

NanoClaw uses environment variables loaded from `.env` in the project root.

## Required Variables

### ANTHROPIC_API_KEY
Your Claude API authentication token.

**How to get:**
1. Log in to Claude.ai
2. Open browser developer tools (F12)
3. Go to Application → Cookies → claude.ai
4. Copy the `sessionKey` cookie value

**Format:** `sk-ant-...`

## Optional Variables

### OPENAI_API_KEY
OpenAI API key for voice message transcription.

**How to get:** https://platform.openai.com/api-keys

**Format:** `sk-...`

**Cost:** ~$0.006 per minute of audio (Whisper API)

### ASSISTANT_NAME
The trigger word for your assistant (default: `@Andy`)

**Example:** `ASSISTANT_NAME=@YourName`

## Loading Environment Variables

The `.env` file is loaded automatically when NanoClaw starts via `dotenv/config` import.

**Example .env file:**
```
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx
ASSISTANT_NAME=@Andy
```

## Security

- Never commit `.env` to git (it's in `.gitignore`)
- Store sensitive keys in `.env`, not in plist files
- Use separate API keys for development and production
