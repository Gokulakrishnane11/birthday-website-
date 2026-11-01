# Soundtrack Audio Assets Guide

This folder holds the background audio tracks for Deepa Dharshini's website. The system features an automatic section observer that smoothly transitions (~2-second crossfade) between tracks as the visitor scrolls through the story.

---

## Required Track Filenames & Mood Specifications

Place your legal audio files in this directory with these exact filenames:

| Filename | Section | Intended Emotional Mood & Instrumentation | Recommended Royalty-Free Search Styles |
|---|---|---|---|
| `experience.mp3` | Normal Landing | Gentle, repetitive neoclassical piano building gradually with warmth; anticipation of an upcoming celebration. | Minimalist neoclassical piano, warm ambient strings, cinematic crescendo. |
| `cornfield-chase.mp3` | Cinematic Intro | Mysterious, cosmic, ticking arpeggio building tension before the surprise opens. | Fast pipe organ / synthesizer arpeggio, cinematic space theme, orchestral swell. |
| `a-sky-full-of-stars.mp3` | Birthday Hero | Upbeat, euphoric, celebratory pop-dance piano rhythm celebrating her special day. | Uplifting piano house, cheerful acoustic pop, euphoric celebration anthem. |
| `new-york-nagaram.mp3` | Story Timeline | Nostalgic, soulful acoustic guitar and flute evoking shared memories from college days. | South Asian acoustic guitar melody, gentle bansuri flute, reflective narrative. |
| `comptine-dun-autre-ete.mp3` | Truth or Dare | Whimsical, playful, French-accordion or flowing accordion/piano evoking intimate curiosity. | Flowing waltz piano, playful Paris cafe accordion, quirky intimate storytelling. |
| `vaan-varuvaan.mp3` | Photo Gallery | Romantic, sweeping strings and gentle orchestral melody as polaroid photos are explored. | Sweeping romantic strings, cinematic ambient harp, lyrical orchestral melody. |
| `nuvole-bianche.mp3` | Birthday Letter | Emotional, heartfelt, deeply moving solo piano piece accompanying the handwritten letter. | Deep emotional solo piano, melancholic but tender ballad, contemplative keys. |
| `arrival-of-the-birds.mp3` | Grand Finale | Grand, soaring, triumphant orchestral crescendo with celebratory energy and confetti. | Post-rock cinematic crescendo, triumphant strings & piano, soaring emotional climax. |

---

## Legitimate & Royalty-Free Sources

You can download legally cleared, high-quality audio tracks matching these moods from any of the following platforms:

1. **Pixabay Music (pixabay.com/music):** Free for personal & commercial use with no copyright strikes. Great for "cinematic piano", "emotional crescendo", and "uplifting acoustic".
2. **Free Music Archive (freemusicarchive.org):** Creative Commons licensed original compositions by independent artists.
3. **YouTube Audio Library (studio.youtube.com):** Vast collection of free, high-quality instrumental scores searchable by mood (e.g. "Dramatic", "Romantic", "Uplifting", "Inspirational").
4. **Musopen (musopen.org):** Public domain and royalty-free classical and neoclassical instrumental recordings.
5. **Incompetech (incompetech.com):** Kevin MacLeod's renowned CC-BY royalty-free compositions.

---

## Separate Asset Note

- `our-song.mp3` is kept as a separate baseline audio asset.
- The player will **never** silently substitute `our-song.mp3` for any missing section tracks.
- Missing tracks will display an honest `Missing: <filename>.mp3` warning in the UI until the corresponding file is placed here.
