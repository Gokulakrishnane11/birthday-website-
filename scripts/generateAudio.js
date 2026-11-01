// Script to synthesize a warm, gentle, looping piano/music box melody into WAV
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sampleRate = 44100;
const bpm = 72;
const beatSec = 60 / bpm;

// Romantic gentle chord progression in C major / A minor
// Notes: [freq, duration in beats, velocity, octave]
const chords = [
  // C major: C4, E4, G4, B4, C5
  { root: 261.63, notes: [261.63, 329.63, 392.00, 493.88, 523.25] },
  // G major / B: G3, D4, G4, B4, D5
  { root: 196.00, notes: [196.00, 293.66, 392.00, 493.88, 587.33] },
  // A minor: A3, E4, A4, C5, E5
  { root: 220.00, notes: [220.00, 329.63, 440.00, 523.25, 659.25] },
  // F major: F3, C4, F4, A4, C5
  { root: 174.61, notes: [174.61, 261.63, 349.23, 440.00, 523.25] },
];

const totalBars = 4;
const totalDuration = totalBars * 4 * beatSec; // ~13.33 seconds
const totalSamples = Math.floor(sampleRate * totalDuration);

const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

function addNote(freq, startBeat, durationBeats, pan = 0, vol = 0.25) {
  const startSample = Math.floor(startBeat * beatSec * sampleRate);
  const noteDuration = durationBeats * beatSec * 2.5; // tail decay
  const numSamples = Math.floor(noteDuration * sampleRate);

  for (let i = 0; i < numSamples; i++) {
    const idx = startSample + i;
    if (idx >= totalSamples) break;

    const t = i / sampleRate;
    // Envelope: quick attack, natural exponential decay
    const attack = Math.min(1, i / (sampleRate * 0.02));
    const decay = Math.exp(-t * 2.2);
    const env = attack * decay * vol;

    // Harmonic blend: sine + soft 2nd & 3rd harmonic for music-box / bell-piano tone
    const wave =
      Math.sin(2 * Math.PI * freq * t) * 0.7 +
      Math.sin(2 * Math.PI * freq * 2 * t) * 0.2 +
      Math.sin(2 * Math.PI * freq * 3 * t) * 0.08 +
      Math.sin(2 * Math.PI * freq * 4 * t) * 0.02;

    const sampleVal = wave * env;
    const lGain = (1 - pan) * 0.5;
    const rGain = (1 + pan) * 0.5;

    left[idx] += sampleVal * lGain;
    right[idx] += sampleVal * rGain;
  }
}

// Build arpeggiated pattern for 4 chords
chords.forEach((chord, barIdx) => {
  const barStart = barIdx * 4;
  // Bass note
  addNote(chord.root, barStart, 3.5, -0.2, 0.35);

  // Arpeggio notes (music box / warm keys)
  const pattern = [0, 1, 2, 3, 4, 3, 2, 1];
  pattern.forEach((noteIdx, step) => {
    const noteTime = barStart + step * 0.5;
    const freq = chord.notes[noteIdx % chord.notes.length];
    const pan = ((step % 4) - 1.5) * 0.25;
    addNote(freq, noteTime, 1.2, pan, 0.22);
  });
});

// Soft master normalization
let maxPeak = 0;
for (let i = 0; i < totalSamples; i++) {
  maxPeak = Math.max(maxPeak, Math.abs(left[i]), Math.abs(right[i]));
}
const norm = maxPeak > 0 ? 0.85 / maxPeak : 1;

// Write to 16-bit PCM WAV
const numChannels = 2;
const bytesPerSample = 2;
const blockAlign = numChannels * bytesPerSample;
const byteRate = sampleRate * blockAlign;
const dataSize = totalSamples * blockAlign;
const buffer = Buffer.alloc(44 + dataSize);

// RIFF header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);

// fmt subchunk
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // subchunk1 size
buffer.writeUInt16LE(1, 20); // PCM format
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(bytesPerSample * 8, 34);

// data subchunk
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

let offset = 44;
for (let i = 0; i < totalSamples; i++) {
  const l = Math.max(-1, Math.min(1, left[i] * norm));
  const r = Math.max(-1, Math.min(1, right[i] * norm));
  buffer.writeInt16LE(Math.floor(l * 32767), offset);
  buffer.writeInt16LE(Math.floor(r * 32767), offset + 2);
  offset += 4;
}

const outWav = path.resolve(__dirname, '../public/audio/our-song.wav');
const outMp3 = path.resolve(__dirname, '../public/audio/our-song.mp3');

fs.writeFileSync(outWav, buffer);
// Also write to our-song.mp3 as fallback container
fs.writeFileSync(outMp3, buffer);

console.log('Successfully generated gentle soundtrack in public/audio/our-song.wav and our-song.mp3');
