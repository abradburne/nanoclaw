# Voice Message Transcription

Voice messages sent in WhatsApp are now automatically transcribed using OpenAI's Whisper API.

## Setup

1. **Get an OpenAI API Key**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Copy it

2. **Add the API key to your .env file**
   ```bash
   echo "OPENAI_API_KEY=your-key-here" >> /workspace/project/.env
   ```

3. **Restart the service**
   ```bash
   # If running with launchd:
   launchctl bootout gui/$(id -u)/com.nanoclaw.whatsapp
   launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.nanoclaw.whatsapp.plist

   # Or if running manually:
   # Stop the current process and restart with: npm start
   ```

## How It Works

1. When a voice message is received in a registered group:
   - The audio file is automatically downloaded
   - It's transcribed using OpenAI Whisper
   - The transcription is stored in the database
   - Milly sees the transcription instead of "[Voice message]"

2. Voice messages are stored with:
   - `message_type`: "voice"
   - `content`: The transcription text
   - `transcription`: The full transcription

3. Cost: ~$0.006 per minute of audio (Whisper API pricing)

## Database Changes

Added two new columns to the `messages` table:
- `message_type`: "text" or "voice"
- `transcription`: Stores the voice transcription

## Files Modified

- `src/voice-transcriber.ts` - New module for voice handling
- `src/db.ts` - Updated to store voice message metadata
- `src/index.ts` - Added voice transcription to message handler
- `package.json` - Added OpenAI dependency

## Testing

Send a voice message to any registered group and check:
1. Logs will show "Transcribing voice message..."
2. You should see "Voice message transcribed" with the text
3. Milly will be able to respond to the voice content

## Troubleshooting

- **"Failed to download voice message"** - Check WhatsApp connection
- **"Voice transcription failed"** - Check OpenAI API key is set correctly
- **No transcription happening** - Verify `.env` file has `OPENAI_API_KEY` set

## Privacy Note

Voice files are:
- Downloaded temporarily to `/workspace/project/voice-cache/`
- Deleted immediately after transcription
- Transcriptions are stored in the local SQLite database only
