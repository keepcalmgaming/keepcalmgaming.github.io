using UnityEngine;
using UnityEngine.UI;

namespace Game2048
{
    /// <summary>
    /// Drives Reversed 2048: reads input, applies it to the model, animates the result,
    /// tracks the "remaining" countdown + move count, and shows the win (cleared) / lose (stuck) overlays.
    /// </summary>
    public sealed class GameManager : MonoBehaviour
    {
        public int Size = 4;

        // Wired up by GameBootstrap.
        public Text LevelText;
        public Text MinStepsText;
        public Text RemainingText;
        public Text MovesText;
        public Text SolutionText;
        public GameObject WinPanel;
        public GameObject LosePanel;
        public Text WinInfoText;

        Grid2048 _grid;
        BoardView _board;
        int _level = 1;
        int _moves;
        bool _showSolution; // spoiler toggle for the solution arrow row

        Vector2 _pointerDown;
        bool _pointerTracking;
        const float SwipeThreshold = 40f;

        static string BestKey(int level) => $"reversed2048_best_L{level}";

        public void Setup(BoardView board)
        {
            _board = board;
            _grid = new Grid2048(Size);
            _level = 1;
            StartLevel();
        }

        void StartLevel()
        {
            if (LevelLibrary.TryPick(_level, out var board))
                _grid.LoadState(board);       // pre-generated, guaranteed-solvable board
            else
                _grid.StartLevel(_level);     // procedural (levels without a pool)
            _board.ShowState(_grid);
            _moves = 0;
            if (WinPanel != null) WinPanel.SetActive(false);
            if (LosePanel != null) LosePanel.SetActive(false);
            UpdateHUD();
            RefreshSolution();
        }

        // Compute the clearing sequence for the current board; drive the hero counter (its length,
        // or ∞ if none) always, and the solution arrow row only when revealed.
        void RefreshSolution()
        {
            var sol = Solver2048.Solve(_grid);

            if (MinStepsText != null)
                MinStepsText.text = sol == null ? "X" : sol.Count.ToString();

            if (SolutionText == null) return;

            if (!_showSolution)
            {
                SolutionText.text = "tap to show solution";
                return;
            }

            if (sol == null) SolutionText.text = "no solution from here   (tap to hide)";
            else if (sol.Count == 0) SolutionText.text = "cleared!   (tap to hide)";
            else SolutionText.text = "solution   (tap to hide)\n" + Solver2048.ToArrows(sol);
        }

        /// <summary>Restart the current level with a fresh tile placement.</summary>
        public void RestartLevel() => StartLevel();

        /// <summary>Advance to the next level.</summary>
        public void NextLevel()
        {
            _level++;
            StartLevel();
        }

        /// <summary>Toggle the debug solution arrow row (the hero counter stays visible).</summary>
        public void ToggleSolution()
        {
            _showSolution = !_showSolution;
            RefreshSolution();
        }

        void Update()
        {
            if (_board == null || _board.Animating) return;

            var dir = ReadDirection();
            if (dir.HasValue) DoMove(dir.Value);
        }

        MoveDirection? ReadDirection()
        {
            if (Input.GetKeyDown(KeyCode.LeftArrow) || Input.GetKeyDown(KeyCode.A)) return MoveDirection.Left;
            if (Input.GetKeyDown(KeyCode.RightArrow) || Input.GetKeyDown(KeyCode.D)) return MoveDirection.Right;
            if (Input.GetKeyDown(KeyCode.UpArrow) || Input.GetKeyDown(KeyCode.W)) return MoveDirection.Up;
            if (Input.GetKeyDown(KeyCode.DownArrow) || Input.GetKeyDown(KeyCode.S)) return MoveDirection.Down;

            if (Input.GetMouseButtonDown(0))
            {
                _pointerDown = Input.mousePosition;
                _pointerTracking = true;
            }
            else if (Input.GetMouseButtonUp(0) && _pointerTracking)
            {
                _pointerTracking = false;
                Vector2 delta = (Vector2)Input.mousePosition - _pointerDown;
                if (delta.magnitude >= SwipeThreshold)
                {
                    if (Mathf.Abs(delta.x) > Mathf.Abs(delta.y))
                        return delta.x > 0 ? MoveDirection.Right : MoveDirection.Left;
                    return delta.y > 0 ? MoveDirection.Up : MoveDirection.Down;
                }
            }

            return null;
        }

        void DoMove(MoveDirection dir)
        {
            var result = _grid.Move(dir);
            if (!result.Moved) return;

            _moves++;
            _board.ApplyMove(result, OnMoveComplete);
            UpdateHUD();
            RefreshSolution();
        }

        void OnMoveComplete()
        {
            if (_grid.IsEmpty())
            {
                int best = PlayerPrefs.GetInt(BestKey(_level), 0);
                if (best == 0 || _moves < best)
                {
                    best = _moves;
                    PlayerPrefs.SetInt(BestKey(_level), best);
                }
                if (WinInfoText != null)
                    WinInfoText.text = $"Level {_level} cleared in {_moves} moves\nBest: {best}";
                if (WinPanel != null) WinPanel.SetActive(true);
            }
            else if (!_grid.CanMove())
            {
                if (LosePanel != null) LosePanel.SetActive(true);
            }
        }

        void UpdateHUD()
        {
            if (LevelText != null) LevelText.text = $"LEVEL {_level}";
            if (RemainingText != null) RemainingText.text = _grid.TotalSum().ToString();
            if (MovesText != null) MovesText.text = _moves.ToString();
            // MinStepsText (the hero counter) is driven by RefreshSolution — the real solution length.
        }
    }
}
