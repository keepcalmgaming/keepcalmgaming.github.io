using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace Game2048
{
    /// <summary>
    /// Builds the board background + empty cells and owns the live tiles, animating them
    /// in response to <see cref="MoveResult"/>s produced by <see cref="Grid2048"/>.
    /// </summary>
    public sealed class BoardView : MonoBehaviour
    {
        public float MoveDuration = 0.12f;
        public float PopDuration = 0.10f;

        int _size;
        float _padding, _gap, _cellSize;
        RectTransform _tileLayer;
        Font _font;
        TileView[,] _tiles;

        public bool Animating { get; private set; }

        public void Build(RectTransform boardRoot, int size, float boardPixelSize, Font font)
        {
            _size = size;
            _font = font;
            _padding = boardPixelSize * 0.03f;
            _gap = boardPixelSize * 0.025f;
            _cellSize = (boardPixelSize - 2f * _padding - (size - 1) * _gap) / size;
            _tiles = new TileView[size, size];

            var bg = boardRoot.GetComponent<Image>();
            if (bg == null) bg = boardRoot.gameObject.AddComponent<Image>();
            bg.color = Theme.BoardBg;
            bg.raycastTarget = false;

            for (int r = 0; r < size; r++)
                for (int c = 0; c < size; c++)
                {
                    var cell = new GameObject($"Cell_{r}_{c}");
                    var crt = cell.AddComponent<RectTransform>();
                    crt.SetParent(boardRoot, false);
                    crt.anchorMin = new Vector2(0f, 1f);
                    crt.anchorMax = new Vector2(0f, 1f);
                    crt.pivot = new Vector2(0.5f, 0.5f);
                    crt.sizeDelta = new Vector2(_cellSize, _cellSize);
                    crt.anchoredPosition = CellCenter(r, c);
                    var img = cell.AddComponent<Image>();
                    img.color = Theme.EmptyCell;
                    img.raycastTarget = false;
                }

            var layer = new GameObject("Tiles");
            _tileLayer = layer.AddComponent<RectTransform>();
            _tileLayer.SetParent(boardRoot, false);
            _tileLayer.anchorMin = new Vector2(0f, 1f);
            _tileLayer.anchorMax = new Vector2(0f, 1f);
            _tileLayer.pivot = new Vector2(0f, 1f);
            _tileLayer.anchoredPosition = Vector2.zero;
            _tileLayer.sizeDelta = new Vector2(boardPixelSize, boardPixelSize);
        }

        Vector2 CellCenter(int row, int col)
        {
            float x = _padding + col * (_cellSize + _gap) + _cellSize * 0.5f;
            float y = _padding + row * (_cellSize + _gap) + _cellSize * 0.5f;
            return new Vector2(x, -y); // rows count downward from the top
        }

        TileView NewTile(int row, int col, int value)
        {
            var go = new GameObject("Tile");
            var tv = go.AddComponent<TileView>();
            tv.Init(_tileLayer, _cellSize, _font);
            tv.SetValue(value);
            tv.SetAnchoredPosition(CellCenter(row, col));
            return tv;
        }

        public void Clear()
        {
            StopAllCoroutines();
            Animating = false;
            if (_tiles == null) return;
            foreach (var t in _tiles)
                if (t != null) t.Remove();
            _tiles = new TileView[_size, _size];
        }

        /// <summary>Rebuild the tiles to match an explicit grid state (no animation). Handy for testing/demos.</summary>
        public void ShowState(Grid2048 grid)
        {
            Clear();
            for (int r = 0; r < _size; r++)
                for (int c = 0; c < _size; c++)
                {
                    int v = grid.Get(r, c);
                    if (v != 0) _tiles[r, c] = NewTile(r, c, v);
                }
        }

        public void ApplyMove(MoveResult result, Action onComplete)
        {
            StartCoroutine(ApplyMoveRoutine(result, onComplete));
        }

        IEnumerator ApplyMoveRoutine(MoveResult result, Action onComplete)
        {
            Animating = true;

            var newTiles = new TileView[_size, _size];
            var toPop = new List<TileView>();
            var toHalve = new List<KeyValuePair<TileView, int>>();

            // Phase 1: slide every existing tile toward its destination.
            foreach (var m in result.Moves)
            {
                var tile = _tiles[m.FromRow, m.FromCol];
                if (tile == null) continue;

                tile.MoveTo(CellCenter(m.ToRow, m.ToCol), MoveDuration);

                switch (m.Fate)
                {
                    case TileFate.Pop:
                        toPop.Add(tile);
                        break;
                    case TileFate.Split:
                        newTiles[m.ToRow, m.ToCol] = tile;
                        toHalve.Add(new KeyValuePair<TileView, int>(tile, m.EndValue));
                        break;
                    default: // Slide
                        newTiles[m.ToRow, m.ToCol] = tile;
                        break;
                }
            }

            yield return new WaitForSeconds(MoveDuration);

            // Phase 2: resolve wall actions once tiles have arrived.
            foreach (var t in toPop)
                if (t != null) t.PopOut(PopDuration);

            foreach (var kv in toHalve)
            {
                kv.Key.SetValue(kv.Value);
                kv.Key.PopMerge(PopDuration);
            }

            foreach (var s in result.Spawns)
            {
                var tv = NewTile(s.Row, s.Col, s.Value);
                tv.PopSpawn(PopDuration);
                newTiles[s.Row, s.Col] = tv;
            }

            // Safety net: destroy any previous tile that isn't carried forward and isn't popping,
            // so a logic/view mismatch can never leave an orphaned sprite on the board.
            var kept = new HashSet<TileView>();
            foreach (var t in newTiles) if (t != null) kept.Add(t);
            foreach (var t in toPop) if (t != null) kept.Add(t);
            foreach (var t in _tiles)
                if (t != null && !kept.Contains(t)) t.Remove();

            _tiles = newTiles;

            Animating = false;
            onComplete?.Invoke();
        }
    }
}
