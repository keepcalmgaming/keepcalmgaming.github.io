using System.Collections.Generic;

namespace Game2048
{
    /// <summary>
    /// Debug helper: guided best-first search over the exact move logic to find a sequence of moves
    /// that clears the board. The full reachable set is huge (~millions of states), so a breadth-first
    /// search is infeasible; a sum-driven heuristic reaches the empty board in a few thousand
    /// expansions, fast enough to recompute after every move. Returns an empty list if already clear,
    /// or null if unsolvable / the node cap is hit. The solution is valid but not guaranteed shortest.
    /// </summary>
    public static class Solver2048
    {
        static readonly MoveDirection[] Dirs =
            { MoveDirection.Left, MoveDirection.Right, MoveDirection.Up, MoveDirection.Down };

        public static List<MoveDirection> Solve(Grid2048 grid, int nodeCap = 300000)
        {
            int size = grid.Size;
            ulong start = Encode(grid);
            var path = new List<MoveDirection>();
            if (start == 0UL) return path; // already cleared

            var parent = new Dictionary<ulong, KeyValuePair<ulong, MoveDirection>>();
            var visited = new HashSet<ulong> { start };

            HeapClear();
            HeapPush(Heuristic(grid), start);

            var work = new Grid2048(size);
            var state = new int[size, size];
            int nodes = 0;

            while (_heapN > 0)
            {
                if (++nodes > nodeCap) return null;
                ulong key = HeapPop();
                Decode(key, size, state);

                foreach (var dir in Dirs)
                {
                    work.LoadState(state);
                    if (!work.Move(dir).Moved) continue;

                    ulong nk = Encode(work);
                    if (!visited.Add(nk)) continue;
                    parent[nk] = new KeyValuePair<ulong, MoveDirection>(key, dir);

                    if (nk == 0UL)
                    {
                        ulong cur = nk;
                        while (cur != start)
                        {
                            var step = parent[cur];
                            path.Add(step.Value);
                            cur = step.Key;
                        }
                        path.Reverse();
                        return path;
                    }
                    HeapPush(Heuristic(work), nk);
                }
            }
            return null; // fully explored (within cap) without reaching empty
        }

        static int Heuristic(Grid2048 g)
        {
            int sum = 0, cnt = 0, maxT = 0, c2 = 0;
            for (int r = 0; r < g.Size; r++)
                for (int c = 0; c < g.Size; c++)
                {
                    int v = g.Get(r, c);
                    if (v == 0) continue;
                    sum += v; cnt++;
                    if (v > maxT) maxT = v;
                    if (v == 2) c2++;
                }
            int full = cnt >= 14 ? 4000 * (cnt - 13) : 0; // steer away from filling the board
            return sum * 4 + maxT * 2 - c2 + full;
        }

        // ---- state encoding: 16 cells x 3-bit exponent -> 48-bit key ----
        static ulong Encode(Grid2048 g)
        {
            ulong key = 0; int shift = 0;
            for (int r = 0; r < g.Size; r++)
                for (int c = 0; c < g.Size; c++)
                {
                    int v = g.Get(r, c), e = 0;
                    while (v > 1) { v >>= 1; e++; }
                    key |= ((ulong)e) << shift;
                    shift += 3;
                }
            return key;
        }

        static void Decode(ulong key, int size, int[,] state)
        {
            int shift = 0;
            for (int r = 0; r < size; r++)
                for (int c = 0; c < size; c++)
                {
                    int e = (int)((key >> shift) & 7UL);
                    state[r, c] = e == 0 ? 0 : (1 << e);
                    shift += 3;
                }
        }

        // ---- min-heap keyed on heuristic priority ----
        static long[] _heapPr = new long[1 << 16];
        static ulong[] _heapKey = new ulong[1 << 16];
        static int _heapN;

        static void HeapClear() { _heapN = 0; }

        static void HeapPush(int pr, ulong key)
        {
            if (_heapN >= _heapPr.Length)
            {
                System.Array.Resize(ref _heapPr, _heapPr.Length * 2);
                System.Array.Resize(ref _heapKey, _heapKey.Length * 2);
            }
            int i = _heapN++;
            _heapPr[i] = pr; _heapKey[i] = key;
            while (i > 0)
            {
                int p = (i - 1) / 2;
                if (_heapPr[p] <= _heapPr[i]) break;
                Swap(p, i); i = p;
            }
        }

        static ulong HeapPop()
        {
            ulong top = _heapKey[0];
            _heapN--;
            _heapPr[0] = _heapPr[_heapN]; _heapKey[0] = _heapKey[_heapN];
            int i = 0;
            while (true)
            {
                int l = 2 * i + 1, r = l + 1, m = i;
                if (l < _heapN && _heapPr[l] < _heapPr[m]) m = l;
                if (r < _heapN && _heapPr[r] < _heapPr[m]) m = r;
                if (m == i) break;
                Swap(m, i); i = m;
            }
            return top;
        }

        static void Swap(int a, int b)
        {
            long tp = _heapPr[a]; _heapPr[a] = _heapPr[b]; _heapPr[b] = tp;
            ulong tk = _heapKey[a]; _heapKey[a] = _heapKey[b]; _heapKey[b] = tk;
        }

        // ASCII directions so they render in any font / on WebGL (built-in font lacks arrow glyphs).
        public static string ToArrows(List<MoveDirection> moves)
        {
            var sb = new System.Text.StringBuilder(moves.Count * 2);
            for (int i = 0; i < moves.Count; i++)
            {
                if (i > 0) sb.Append(' ');
                switch (moves[i])
                {
                    case MoveDirection.Left: sb.Append('<'); break;
                    case MoveDirection.Right: sb.Append('>'); break;
                    case MoveDirection.Up: sb.Append('^'); break;
                    default: sb.Append('v'); break;
                }
            }
            return sb.ToString();
        }
    }
}
