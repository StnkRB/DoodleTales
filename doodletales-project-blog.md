# 🎨 Bringing Art to Life: How We Built DoodleTales with Google AI

*This blog post was created for the purposes of entering the Google Gemini Hackathon.*

---

## The Dream: Waking Up the Canvas

Every parent knows the magic of a child's drawing. It’s not just a sketch; it’s a story waiting to be told. But once the crayon hits the paper, the story often stops there. We wanted to change that. 

With **DoodleTales**, we set out to build a "Magical Storytelling Scout"—an AI companion that doesn't just look at a drawing, but enters it, talks to the characters, and expands the world while keeping the child's unique artistic style intact.

## The Engine: Google Cloud & Gemini

Building a real-time, multimodal experience requires a stack that is both powerful and incredibly fast. We chose **Google Cloud** and the **Gemini** family of models to power every layer of DoodleTales.

### 1. Seeing the World with Gemini 3 Flash
The first step is understanding the art. When a child uploads a photo of their drawing, we use **Gemini 3 Flash** to perform high-precision character segmentation. 
- **The Nuance**: It doesn't just label "a cat." It identifies "a blue cat with a top hat" and provides normalized bounding boxes.
- **The Result**: We use these coordinates to create "Magical Halos" on our React canvas, making the characters feel alive before the conversation even starts.

### 2. Talking in Real-Time with Gemini 2.5 Flash (Native Audio)
The heart of DoodleTales is the **Storytelling Scout**. We used the **Gemini 2.5 Flash Native Audio** model to create a sub-second latency voice experience.
- **Multimodal Magic**: The Scout can "see" the image while "hearing" the child's voice. 
- **Agentic Tools**: We implemented custom tool calls like `highlight_character(id)`. When the Scout says, "Tell me about this brave knight!", the app automatically glows around that specific character.

### 3. Expanding the Story with Gemini 2.5 Flash (Image)
As the child tells the Scout about their characters, the story moves to new scenes. This is where most AI fails—it tries to make the art "better" or "more professional."
- **Style Reference**: We use Gemini 2.5 Flash's image generation capabilities with the original drawing as a **Style Reference**.
- **The Result**: If the child drew a stick figure with a purple cape, the generated scene will feature that *exact* stick figure in that *exact* style. It preserves the child's creative identity.

## Scalability on Google Cloud Run

To ensure DoodleTales is ready for the world, we deployed the entire full-stack application (Express + Vite) to **Google Cloud Run**.
- **Containerization**: Using a lightweight Docker setup, we can scale from zero to hundreds of users instantly.
- **CI/CD**: With **Google Cloud Build**, every update to our code is automatically tested and deployed, allowing us to iterate fast during the hackathon.

## The Future of Interactive Play

DoodleTales isn't just an app; it's a demonstration of how multimodal AI can foster creativity rather than replace it. By using Google's cutting-edge models, we've turned a static piece of paper into a living, breathing dialogue.

We are thrilled to submit this project to the **Google Gemini Hackathon** and can't wait to see how many more stories we can help children tell!

---
**Try DoodleTales today and let the adventure begin!** 🚀🎨✨
