# Reversed 2048 — Design Spec (v1)

GMTK 2026 jam entry. Theme: **Countdown**.

## Concept
Classic 2048 builds numbers *up* by merging. **Reversed 2048** breaks them *down* by
**splitting**. You take a small board of tiles and count it all the way down to an empty
board — the "countdown to zero."

## Board
- 4×4 grid.
- Values are powers of two: `2, 4, 8, … 2048`. **`2` is the floor — there are no `1` tiles.**
- **Start:** determined by the current **level** (see below), placed at random empty cells.
- **No random spawns.** The board is fully deterministic; it grows as you split and drains as you pop.

## Input
Unchanged from classic: **swipe / arrow keys / WASD** slide the whole board one direction.
All four lines in the swipe axis react at once (like classic 2048 processes every row/column).

## The move (per line, in the swipe direction)
Core principle: **a tile only *acts* if it actually MOVES this turn** ("collides with the wall").
A tile that is already settled where it lands stays put and does nothing.

Settling each line from the wall outward:
1. **Slide:** tiles move toward the wall, order preserved, gaps removed. *(No merging, ever.)*
2. Each tile that **moved**:
   - **value > 2 → SPLIT:** halves into its landing cell + the next cell outward. **At most one tile
     splits per line per move** — the wall-most moving tile; any further movers just slide.
   - **value == 2 → POP:** a `2` can't halve, so on colliding it **vanishes** (a tile finishing its countdown).
     **At most one `2` pops per line per move** — any further moving `2`s just slide up against it.
3. A tile that **did not move** (already wall-aligned / settled) is left untouched — no split, no pop.

A move is **legal** if at least one tile moved / split / popped. Illegal moves are ignored (no-op).

### Worked examples (swiping ◀ LEFT, wall = left edge)
```
[ _ _ _ 8 ] → 8 moves → split →            [ 4 4 _ _ ]
[ _ _ 4 8 ] → 4 splits, 8 slides →         [ 2 2 8 _ ]   (one split per line)
[ _ 8 _ 4 ] → 8 splits, 4 slides →         [ 4 4 4 _ ]
[ 4 _ _ _ ] → nothing moves →              [ 4 _ _ _ ]   (no-op: wall-aligned tile can't split)
[ _ 2 4 _ ] → 2 moves→pops, 4 moves→splits [ 2 2 _ _ ]
[ 2 4 _ _ ] → nothing moves →              [ 2 4 _ _ ]   (no-op: to pop a 2, slide it into a wall)
```
*Consequence to note:* since acting requires movement, a `2` resting against a wall no longer
auto-pops — you pop it by sliding it into a wall from elsewhere (or swiping a different direction).

## Key invariant
Splitting **conserves total value** (`8 → 4+4`). The only way value leaves the board is a **pop**,
which removes exactly `2`. Therefore `pops-to-clear = startingSum / 2`. Keep starting sums small.

## Levels
Progressive difficulty; each level's tile set is bigger than the last.
- **L1** = `{2}` · **L2** = `{4, 2}` · **L3** = `{8, 4, 2, 2}`
- **L≥3 (procedural)** = one of each power from `2^L` down to `4`, plus two `2`s.
- Clearing a level shows **Cleared!** → **Next Level ▶**. Getting stuck shows **Stuck!** → **Retry**.
  The **Restart** button re-rolls the current level. Fewest-moves best is tracked per level (PlayerPrefs).

### Solvability & pre-generated pools
Random placement does **not** guarantee a clearable board — an exact full-reachability solver
(over the real move logic) measured, per 100k random placements: L1–L4 = 100%, **L5 = 98.65%,
L6 = ~34%, L7+ ≈ 0.1%**. Large lone tiles on a 16×1 line jam the board faster than one-split /
one-pop-per-line can drain it; consecutive high powers (e.g. `64`+`32`) are the worst offenders.

Fix: levels listed in `LevelLibrary.PooledLevels` load a random **pre-generated, solver-verified
board** from `Assets/Resources/Levels/levelN.txt` (16 exponent digits/line) instead of random placement.
- **L6** ships a pool of **1000** distinct solvable boards, structure `{64,32,16,8,4,4,2,2}` (sum 132,
  the friendliest of the tested top-heavy sets at ~42% raw solvable). Regenerate with the scratchpad
  solver: `mono solver.exe gen 1000 Assets/Resources/Levels/level6.txt`.
- L5 (rare failures) and L7+ (near-impossible) still need pools or a gentler tile curve — follow-up.

## Win / Lose
- **Win:** board is empty — everything counted down to zero. → "Counted Down!" overlay.
- **Lose:** gridlock — no direction produces a legal move. → "Stuck!" overlay.
  (Happens when the board is jammed with tiles all `> 2` on every edge so nothing can slide, split, or pop.)

## HUD (the Countdown)
- **Hero counter = MINIMUM STEPS TO FINISH** — the fewest moves it could *possibly* take to clear from
  the current board: `ceil( (sum / 2) / lines )`. It's an admissible **lower bound** (you can never
  beat it; a real solve takes more, since you also spend moves splitting). Ticks down as the sum falls.
- **REMAINING** = sum of all tile values, ticking down toward 0 as you pop. **MOVES** counts up.
  Track fewest-moves-to-clear as "best" (PlayerPrefs).
- **New Game** button; win/lose overlays with restart.

## Tunables / open follow-ups
- Exact starting layouts. v1 uses a small random-but-modest set (values `4/8/16`); occasional
  unsolvable boards are acceptable with easy restart. **Follow-up:** guaranteed-solvable level
  generation (e.g. reverse-simulation) and/or hand-authored levels.
- Board size, starting sum, and the split/pop feel (animation timing) are all knobs.

## Reuse from the current 2048 base
- Keep: input reading, tile visuals/colors/animation (`TileView`), board layout (`BoardView`),
  score/best/overlay UI scaffolding, the code-built UI, screenshot util.
- Replace: the merge logic in `Grid2048` with slide + wall-split/pop logic. `MoveResult` gains
  "split" (one tile → two) and "pop" (tile removed) events for the view to animate.
