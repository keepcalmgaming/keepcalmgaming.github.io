using System.Collections.Generic;
using UnityEngine;

namespace Game2048
{
    /// <summary>
    /// Loads pre-generated, guaranteed-solvable starting boards from Resources/Levels/levelN.txt.
    /// Each line is 16 exponent digits (row-major): '0' = empty, otherwise the tile value is 2^digit.
    /// Levels without a pool fall back to procedural generation (see <see cref="Grid2048.StartLevel"/>).
    /// </summary>
    public static class LevelLibrary
    {
        static Dictionary<int, List<int[]>> _pools;

        // Levels that ship with a hand-verified solvable pool.
        static readonly int[] PooledLevels = { 6, 7 };

        static void EnsureLoaded()
        {
            if (_pools != null) return;
            _pools = new Dictionary<int, List<int[]>>();
            foreach (int level in PooledLevels) Load(level);
        }

        static void Load(int level)
        {
            var asset = Resources.Load<TextAsset>($"Levels/level{level}");
            if (asset == null) return;

            var boards = new List<int[]>();
            foreach (var raw in asset.text.Split('\n'))
            {
                var line = raw.Trim();
                if (line.Length < 16) continue;
                var flat = new int[16];
                for (int i = 0; i < 16; i++)
                {
                    int e = line[i] - '0';
                    flat[i] = e <= 0 ? 0 : (1 << e);
                }
                boards.Add(flat);
            }
            if (boards.Count > 0) _pools[level] = boards;
        }

        /// <summary>True if this level has a pre-generated pool; fills <paramref name="board"/> with a random one.</summary>
        public static bool TryPick(int level, out int[,] board)
        {
            EnsureLoaded();
            board = null;
            if (!_pools.TryGetValue(level, out var boards) || boards.Count == 0) return false;

            var flat = boards[Random.Range(0, boards.Count)];
            board = new int[4, 4];
            for (int i = 0; i < 16; i++) board[i / 4, i % 4] = flat[i];
            return true;
        }
    }
}
