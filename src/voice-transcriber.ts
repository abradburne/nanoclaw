import { proto, downloadMediaMessage, WAMessage } from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { STORE_DIR } from './config.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const VOICE_CACHE_DIR = path.join(STORE_DIR, '..', 'voice-cache');

/**
 * Check if a message contains audio/voice
 */
export function hasAudio(msg: proto.IWebMessageInfo): boolean {
  return !!(
    msg.message?.audioMessage
  );
}

/**
 * Download and transcribe a voice message
 */
export async function transcribeVoiceMessage(msg: proto.IWebMessageInfo): Promise<string | null> {
  try {
    // Ensure cache directory exists
    fs.mkdirSync(VOICE_CACHE_DIR, { recursive: true });

    if (!msg.key) {
      console.error('Message has no key');
      return null;
    }

    // Download the audio - cast to WAMessage for baileys compatibility
    const buffer = await downloadMediaMessage(
      msg as WAMessage,
      'buffer',
      {}
    );

    if (!buffer || buffer.length === 0) {
      console.error('Failed to download voice message');
      return null;
    }

    // Save to temporary file
    const msgId = msg.key.id || `${Date.now()}`;
    const tempPath = path.join(VOICE_CACHE_DIR, `${msgId}.ogg`);
    fs.writeFileSync(tempPath, buffer as Buffer);

    // Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: 'whisper-1',
    });

    // Clean up temp file
    fs.unlinkSync(tempPath);

    return transcription.text || null;
  } catch (err) {
    console.error('Error transcribing voice message:', err);
    return null;
  }
}
