# 🎨 DoodleTales: The Magical Storytelling Scout

## Inspiration
Every child's drawing is a window into a vast, hidden world. However, once the drawing is finished, it often remains static on a piece of paper or a digital screen. We were inspired by the idea of "waking up" these drawings—giving the characters voices, personalities, and the ability to go on new adventures while staying true to the child's unique artistic vision. We wanted to turn the act of drawing into a collaborative, living dialogue between a child and an AI companion.

## What it does
DoodleTales is an interactive AI agent that brings children's art to life through three core pillars:
1.  **Vision & Recognition**: Using advanced computer vision, the app identifies and segments individual characters and objects within a drawing, mapping their precise locations with "magical halos."
2.  **Multimodal Live Adventure**: A voice-enabled "Storytelling Scout" engages the child in a real-time conversation. The Scout asks about the characters' names, ages, and roles, reacting dynamically to the child's voice and the drawing itself.
3.  **Style-Consistent Storytelling**: As the adventure unfolds, the AI generates new scenes for the story. Crucially, these new images use the original drawing as a "Style Reference," ensuring that the characters, colors, and "hand-drawn" aesthetic are perfectly preserved in every new frame.

## How we built it
DoodleTales is a full-stack application built with a focus on low-latency interaction and visual fidelity:
-   **Frontend**: Built with **React** and **Tailwind CSS**, using **Motion (Framer Motion)** for fluid UI transitions and **canvas-confetti** for celebratory moments.
-   **AI Intelligence (Google Gemini)**:
    -   `gemini-3-flash-preview`: Powers the high-precision character segmentation and bounding box detection.
    -   `gemini-2.5-flash-native-audio-preview`: Handles the real-time, multimodal live session, processing audio input/output and tool calls with sub-second latency.
    -   `gemini-2.5-flash-image`: Generates new story scenes using the original sketch as a style reference to maintain character identity.
-   **Tool Integration**: We implemented custom function declarations (`highlight_character`, `update_character_info`, `generate_story_image`) that allow the AI to interact directly with the frontend state.

## Challenges we ran into
-   **The "Too Perfect" Problem**: Modern image generators often try to "improve" a drawing, making it look like professional 3D art. We had to carefully engineer the system instructions to force the AI to respect the "rough sketch" and "crayon" aesthetic of the original child's drawing.
-   **Audio Synchronization**: Managing raw PCM audio streams in the browser required deep integration with the **Web Audio API** to ensure gapless playback and handle interruptions when the child speaks over the AI.
-   **Responsive Bounding Boxes**: Mapping normalized coordinates from the vision model (0-1000) to a responsive, object-fit image container required precise mathematical normalization to ensure the "magic halos" always landed exactly on the characters.

## Accomplishments that we're proud of
-   **Character Persistence**: We are incredibly proud of how well the AI maintains character identity. If a child draws a girl with three yellow hair spikes, the generated story scenes will consistently feature that exact same character.
-   **The "Magic Halo"**: The visual feedback loop where the AI says "Look at this friend!" and a golden glow appears around a specific part of the drawing feels truly magical.
-   **Zero-Latency Feel**: By using the Gemini Live API, we achieved a conversational flow that feels natural and unforced, which is critical for maintaining a child's engagement.

## What we learned
-   **Multimodal is the Future**: Combining vision, voice, and image generation into a single "agent" creates a much more powerful emotional connection than any single-modality app.
-   **Style as Data**: We learned that a user's "style" is just as important as the content itself. Preserving the "imperfections" of a child's drawing is what makes the experience feel personal and authentic.
-   **Agentic UX**: Designing a UI that responds to AI "tool calls" (like highlighting or updating metadata) creates a much more dynamic experience than traditional request-response patterns.

## What's next for DoodleTales
-   **Digital Storybooks**: A feature to export the entire adventure—the original drawing and all generated scenes—into a narrated digital PDF or video that the child can keep.
-   **Collaborative Drawing**: Allowing multiple children to upload drawings that the AI then "merges" into a single shared universe.
-   **Interactive Props**: Letting the child "draw" a new item (like a magic sword or a hat) during the conversation and having the AI immediately recognize and incorporate it into the next scene.
