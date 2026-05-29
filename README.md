# pointclick-kit

A tiny, dependency-free engine for **Monkey Island 2-style point-and-click
adventures** — 320×200 VGA look, Bayer dithering, a hand-built bitmap font,
the classic 9-verb SCUMM interface, a Web Audio soundtrack, save games, and
mobile/PWA support. Everything is **code-drawn** — no image or audio asset
files to manage.

It's the framework extracted from *El Secreto de Montjuïc*, generalised so you
can spin off a new game from a story in an afternoon.

```
npm install
npm run dev      # play at http://localhost:5173 (or the printed port)
npm run build    # production build into dist/
```

## What you edit to make a new game

The **engine** (`src/engine`, `src/art`, `src/scumm`, `src/audio`, `src/main.ts`)
is generic — you rarely touch it. A new game is almost entirely **content**:

| File | What it holds |
|------|---------------|
| `src/config.ts` | Title text, credit, About/legal box, per-room music, save key |
| `src/rooms/*.ts` | One file per scene: the painted background + hotspots, NPCs, exits |
| `src/rooms/index.ts` | Registers all rooms and the start room |
| `src/content/items.ts` | Inventory items + their 20×20 icons |
| `src/content/dialogues.ts` | Branching dialogue trees |
| `src/art/actor.ts` | The player sprite + your NPC sprites |
| `src/screens/title.ts` | The title-screen background art |
| `index.html` | App title + PWA meta (in-game text lives in `config.ts`) |

The shipped example is a 2-room game (a **plaza** and a **posada**): pick up a
coin, give it to the innkeeper for a key, open the chest — win. It's
deliberately small so it reads as a template. Open `src/rooms/plaza.ts` and
`src/rooms/posada.ts` first; they're commented as walkthroughs.

## The puzzle model in one breath

Rooms contain **hotspots** (look-at / pick-up / locked things), **NPCs** (talk,
give items to), and **exits**. A hotspot can require items (`needs`) before it
opens; picking one up grants an item; giving an item to an NPC (`accepts`) can
return another item or raise a flag. Chain those and you have a puzzle. The
data model is documented inline in `src/engine/types.ts`.

## Building this with Claude

This kit is paired with the **`pointclick-adventure` skill**. Give Claude a
story (and optional reference images for mood) and it will design the rooms and
puzzle chain, write the content files, draw the sprites and backgrounds in
code, verify the game is winnable, and deploy it. See that skill for the full
workflow.

## Deploy (GitHub Pages)

Push to a GitHub repo with Pages set to "GitHub Actions". The included
`.github/workflows/deploy.yml` builds and publishes on every push to `main`,
and sets the base path to your repo name automatically. For a user/root site
(`<user>.github.io`), set `BASE_PATH=/` instead.

## Credits & licence

Original code, art and music. This is a **fan-made homage** to the LucasArts
SCUMM adventures and *Monkey Island* — not an official product, not affiliated
with or endorsed by Lucasfilm/Disney. If your game references those works, keep
a disclaimer in the About box (see `src/config.ts`). The engine itself is yours
to reuse.
