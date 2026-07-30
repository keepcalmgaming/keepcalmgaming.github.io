using System;
using System.Collections.Generic;

namespace Game2048
{
    public enum MoveDirection { Left, Right, Up, Down }

    /// <summary>What happens to an existing tile during a move.</summary>
    public enum TileFate { Slide, Split, Pop }

    /// <summary>The motion + fate of one pre-existing tile, for the view to animate.</summary>
    public struct TileMove
    {
        public int FromRow, FromCol;
        public int ToRow, ToCol;
        public int EndValue;   // value shown at the destination after the move (halved when Split)
        public TileFate Fate;  // Slide = keep value; Split = halved + emitted a sibling; Pop = removed on arrival
    }

    /// <summary>A new half-tile created by a split.</summary>
    public struct SplitSpawn
    {
        public int Row, Col, Value;
    }

    public sealed class MoveResult
    {
        public bool Moved;
        public int Pops;
        public readonly List<TileMove> Moves = new List<TileMove>();
        public readonly List<SplitSpawn> Spawns = new List<SplitSpawn>();
    }

    /// <summary>
    /// Pure, Unity-independent "Reversed 2048" board model.
    /// Move = slide toward a wall, then the wall-most tile of each line SPLITS in two (value &gt; 2)
    /// or POPS out of existence (value == 2). Splitting conserves total value; popping removes 2.
    /// No merging, no random spawns. Deterministic when seeded, so it is unit-testable.
    /// </summary>
    public sealed class Grid2048
    {
        public const int Floor = 2; // smallest tile; a Floor tile at the wall pops instead of splitting

        public int Size { get; }
        readonly int[,] _cells;
        readonly Random _rng;

        public Grid2048(int size = 4, int? seed = null)
        {
            Size = size;
            _cells = new int[size, size];
            _rng = seed.HasValue ? new Random(seed.Value) : new Random();
        }

        public int Get(int row, int col) => _cells[row, col];

        public void Reset() => Array.Clear(_cells, 0, _cells.Length);

        public void LoadState(int[,] state)
        {
            for (int r = 0; r < Size; r++)
                for (int c = 0; c < Size; c++)
                    _cells[r, c] = state[r, c];
        }

        public int TotalSum()
        {
            int sum = 0;
            foreach (var v in _cells) sum += v;
            return sum;
        }

        public bool IsEmpty() => TotalSum() == 0;

        /// <summary>
        /// Admissible lower bound on the moves still needed to clear the board: every unit of value
        /// must leave as a Floor pop, each move pops at most one Floor tile per line (Size lines).
        /// So minMoves ≥ ceil( (sum / Floor) / Size ). This is the fewest moves it could possibly take.
        /// </summary>
        public int MinStepsToClear()
        {
            int popsNeeded = TotalSum() / Floor;          // splits conserve value; only pops remove it
            return (popsNeeded + Size - 1) / Size;         // ceil(popsNeeded / Size)
        }

        // Maps a position along a line (row or column) to grid coordinates, where pos 0 is always
        // the cell against the wall the tiles travel toward. One algorithm then serves all 4 directions.
        void Map(MoveDirection dir, int line, int pos, out int row, out int col)
        {
            switch (dir)
            {
                case MoveDirection.Left:  row = line; col = pos; break;
                case MoveDirection.Right: row = line; col = Size - 1 - pos; break;
                case MoveDirection.Up:    col = line; row = pos; break;
                default:                  col = line; row = Size - 1 - pos; break; // Down
            }
        }

        public MoveResult Move(MoveDirection dir)
        {
            var result = new MoveResult();
            var values = new List<int>(Size);
            var origins = new List<int>(Size);

            for (int line = 0; line < Size; line++)
            {
                // Collect non-empty tiles in travel order (pos 0 = nearest the wall after sliding).
                values.Clear();
                origins.Clear();
                for (int pos = 0; pos < Size; pos++)
                {
                    Map(dir, line, pos, out int r, out int c);
                    if (_cells[r, c] != 0) { values.Add(_cells[r, c]); origins.Add(pos); }
                }

                int k = values.Count;
                if (k == 0) continue;

                // Clear the line; we rewrite it below.
                for (int pos = 0; pos < Size; pos++)
                {
                    Map(dir, line, pos, out int r, out int c);
                    _cells[r, c] = 0;
                }

                // Settle tiles from the wall outward. A tile only ACTS (splits / pops) if it actually
                // MOVES this turn; a tile already aligned where it settles just stays put.
                int next = 0;
                bool poppedInLine = false; // at most one Floor tile may pop per line per move
                bool splitInLine = false;  // at most one tile may split per line per move
                for (int i = 0; i < k; i++)
                {
                    int val = values[i];
                    int tilesRemaining = k - i;
                    bool moved = origins[i] != next;
                    bool roomToGrow = (Size - next) - tilesRemaining >= 1;

                    if (moved && val == Floor && !poppedInLine)
                    {
                        // POP: a moving Floor tile hits the wall/stack and vanishes. Only the first
                        // one in the line pops; later Floor tiles just slide up against it.
                        AddMove(result, dir, line, origins[i], next, val, TileFate.Pop);
                        result.Pops++;
                        result.Moved = true;
                        poppedInLine = true;
                        // next unchanged — the popped tile leaves no cell behind.
                    }
                    else if (moved && val > Floor && roomToGrow && !splitInLine)
                    {
                        // SPLIT: a moving tile halves into its landing cell + the next cell outward.
                        // Only the first (wall-most) moving tile in the line splits; the rest slide.
                        int half = val / 2;
                        WriteCell(dir, line, next, half);
                        WriteCell(dir, line, next + 1, half);
                        AddMove(result, dir, line, origins[i], next, half, TileFate.Split);
                        AddSpawn(result, dir, line, next + 1, half);
                        next += 2;
                        result.Moved = true;
                        splitInLine = true;
                    }
                    else
                    {
                        // SLIDE: settle without acting (didn't move, wall-aligned, or no room to split).
                        WriteCell(dir, line, next, val);
                        AddMove(result, dir, line, origins[i], next, val, TileFate.Slide);
                        if (origins[i] != next) result.Moved = true;
                        next += 1;
                    }
                }
            }

            return result;
        }

        void WriteCell(MoveDirection dir, int line, int pos, int value)
        {
            Map(dir, line, pos, out int r, out int c);
            _cells[r, c] = value;
        }

        void AddMove(MoveResult result, MoveDirection dir, int line, int fromPos, int toPos, int endValue, TileFate fate)
        {
            Map(dir, line, fromPos, out int fr, out int fc);
            Map(dir, line, toPos, out int tr, out int tc);
            result.Moves.Add(new TileMove
            {
                FromRow = fr, FromCol = fc, ToRow = tr, ToCol = tc, EndValue = endValue, Fate = fate
            });
        }

        void AddSpawn(MoveResult result, MoveDirection dir, int line, int pos, int value)
        {
            Map(dir, line, pos, out int r, out int c);
            result.Spawns.Add(new SplitSpawn { Row = r, Col = c, Value = value });
        }

        static readonly MoveDirection[] AllDirections =
            { MoveDirection.Left, MoveDirection.Right, MoveDirection.Up, MoveDirection.Down };

        /// <summary>True while at least one direction would change the board.</summary>
        public bool CanMove()
        {
            var snapshot = (int[,])_cells.Clone();
            foreach (var dir in AllDirections)
            {
                bool moved = Move(dir).Moved; // Move never spawns or uses RNG, so this is a pure probe
                LoadState(snapshot);          // restore the board
                if (moved) return true;
            }
            return false;
        }

        // ---- Starting board ------------------------------------------------------

        /// <summary>
        /// The tile multiset that seeds a given 1-based level:
        ///   L1 = {2}; L2 = {4,2}; L≥3 = one of each power from 2^L down to 4, plus two 2s.
        /// Each higher level adds the next power of two on top of the previous set.
        /// </summary>
        public static int[] StartTilesForLevel(int level)
        {
            if (level <= 1) return new[] { 2 };
            if (level == 2) return new[] { 4, 2 };

            var tiles = new List<int>();
            for (int k = level; k >= 2; k--) tiles.Add(1 << k); // 2^level .. 4
            tiles.Add(2);
            tiles.Add(2);
            return tiles.ToArray();
        }

        /// <summary>Seed the board with the given level's tiles at random empty cells.</summary>
        public void StartLevel(int level)
        {
            Reset();
            foreach (var value in StartTilesForLevel(level))
                PlaceRandom(value);
        }

        bool PlaceRandom(int value)
        {
            int empties = 0;
            foreach (var v in _cells) if (v == 0) empties++;
            if (empties == 0) return false;

            int pick = _rng.Next(empties);
            int idx = 0;
            for (int r = 0; r < Size; r++)
                for (int c = 0; c < Size; c++)
                {
                    if (_cells[r, c] != 0) continue;
                    if (idx == pick) { _cells[r, c] = value; return true; }
                    idx++;
                }
            return false;
        }
    }
}
