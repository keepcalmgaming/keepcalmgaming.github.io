# GMTK 2026 — 2048 base (Unity 6)

A clean, from-scratch **2048** implementation in Unity `6000.5.5f1`, built as the foundation
for a GMTK Game Jam entry (theme: **Countdown**).

## Running it
1. Open the project in Unity Hub (`6000.5.5f1`).
2. Open `Assets/Scenes/Game.unity`.
3. Press **Play**.

Controls: **Arrow keys / WASD**, or **swipe** (mouse drag / touch).

## How it's structured
The whole game is code-driven — there are no hand-authored prefabs, and the scene contains a
single `Game` object with a `GameBootstrap` component that builds the entire UI at runtime.

| Script | Responsibility |
| --- | --- |
| `Assets/Scripts/Game2048/Grid2048.cs` | Pure, Unity-free game logic (move/merge/spawn/score). Unit-testable. |
| `Assets/Scripts/Game2048/BoardView.cs` | Board layout + tile animation from move results. |
| `Assets/Scripts/Game2048/TileView.cs` | One tile: color, number, slide & pop tweens. |
| `Assets/Scripts/Game2048/GameManager.cs` | Input → model → view; score, best, win/lose. |
| `Assets/Scripts/Game2048/GameBootstrap.cs` | Builds the canvas, header, board and overlays in code. |
| `Assets/Scripts/Game2048/UIFactory.cs` | uGUI construction helpers. |
| `Assets/Scripts/Game2048/Theme.cs` | Colors/palette — re-skin here for the jam theme. |
| `Assets/Editor/BuildTools.cs` | Headless logic self-tests + scene generator (`2048 ▸ Rebuild Scene`). |

## Notes / choices
- Uses the **legacy Input Manager** and **legacy uGUI `Text`** (built-in font) to avoid any
  package/TMP import friction. Easy to upgrade to TextMeshPro / the Input System later.
- `Grid2048` is deterministic when seeded, so the logic is covered by self-tests you can run
  from the menu **2048 ▸ Rebuild Scene** or headlessly via `BuildTools.SetupAndTest`.
- Best score persists via `PlayerPrefs`.
