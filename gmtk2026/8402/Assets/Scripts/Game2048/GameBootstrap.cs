using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.Events;
using UnityEngine.UI;

namespace Game2048
{
    /// <summary>
    /// The single scene object. On Awake it builds the entire UI hierarchy (canvas, header,
    /// board, buttons, overlays) in code and starts the game. Building the UI programmatically
    /// keeps the project free of fragile hand-authored scene/prefab assets.
    /// </summary>
    public sealed class GameBootstrap : MonoBehaviour
    {
        const float RefW = 1080f, RefH = 1920f;
        const int Size = 4;
        const float BoardPixel = 860f;

        Font _font;

        void Awake()
        {
            _font = UIFactory.DefaultFont();

            var cam = Camera.main;
            if (cam != null) cam.backgroundColor = Theme.Background;

            var canvas = BuildCanvas();
            EnsureEventSystem();

            var bg = UIFactory.Panel("Background", canvas.transform, Theme.Background);
            bg.GetComponent<Image>().raycastTarget = false;
            UIFactory.Fill(bg.GetComponent<RectTransform>());

            var title = UIFactory.Label("Title", canvas.transform, _font, "2048", 108, Theme.DarkText, TextAnchor.MiddleLeft);
            UIFactory.Anchor(title.GetComponent<RectTransform>(),
                new Vector2(0f, 1f), new Vector2(0f, 1f), new Vector2(0f, 1f),
                new Vector2(60f, -50f), new Vector2(500f, 140f));

            var tag = UIFactory.Label("Tag", canvas.transform, _font, "REVERSED", 38, Theme.ButtonBg, TextAnchor.MiddleLeft);
            UIFactory.Anchor(tag.GetComponent<RectTransform>(),
                new Vector2(0f, 1f), new Vector2(0f, 1f), new Vector2(0f, 1f),
                new Vector2(64f, -168f), new Vector2(500f, 56f));

            var remainingText = BuildStatBox(canvas.transform, "REMAINING", new Vector2(-320f, -60f));
            var movesText = BuildStatBox(canvas.transform, "MOVES", new Vector2(-60f, -60f));

            // Hero block: current level, then the fewest moves it could possibly take to clear from here.
            var levelText = UIFactory.Label("Level", canvas.transform, _font, "LEVEL 1", 48, Theme.DarkText);
            UIFactory.Anchor(levelText.GetComponent<RectTransform>(),
                new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f),
                new Vector2(0f, -232f), new Vector2(560f, 56f));

            var minStepsText = UIFactory.Label("MinSteps", canvas.transform, _font, "0", 160, Theme.DarkText, TextAnchor.UpperCenter);
            UIFactory.Anchor(minStepsText.GetComponent<RectTransform>(),
                new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f),
                new Vector2(0f, -300f), new Vector2(600f, 190f));

            var boardGo = new GameObject("Board");
            var boardRt = boardGo.AddComponent<RectTransform>();
            boardRt.SetParent(canvas.transform, false);
            UIFactory.Anchor(boardRt,
                new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f),
                new Vector2(0f, -524f), new Vector2(BoardPixel, BoardPixel));
            var board = boardGo.AddComponent<BoardView>();
            board.Build(boardRt, Size, BoardPixel, _font);

            var gm = gameObject.AddComponent<GameManager>();
            gm.Size = Size;
            gm.LevelText = levelText;
            gm.MinStepsText = minStepsText;
            gm.RemainingText = remainingText;
            gm.MovesText = movesText;

            var newBtn = UIFactory.Button("RestartButton", canvas.transform, _font, "Restart", Theme.ButtonBg, Theme.LightText);
            UIFactory.Anchor(newBtn.GetComponent<RectTransform>(),
                new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f),
                new Vector2(0f, -1406f), new Vector2(360f, 100f));
            newBtn.onClick.AddListener(gm.RestartLevel);

            // Debug: clickable row that shows/hides the solver's clearing move sequence.
            var solRowGo = new GameObject("SolutionRow");
            var solRt = solRowGo.AddComponent<RectTransform>();
            solRt.SetParent(canvas.transform, false);
            UIFactory.Anchor(solRt,
                new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f),
                new Vector2(0f, -1520f), new Vector2(1000f, 360f));
            var solImg = solRowGo.AddComponent<Image>();
            solImg.color = new Color(0.74f, 0.68f, 0.63f, 0.22f); // subtle panel — signals it's tappable
            var solBtn = solRowGo.AddComponent<Button>();
            solBtn.targetGraphic = solImg;
            solBtn.onClick.AddListener(gm.ToggleSolution);

            var solutionText = UIFactory.Label("Solution", solRowGo.transform, _font,
                "tap to show solution", 38, Theme.DarkText, TextAnchor.UpperCenter);
            solutionText.fontStyle = FontStyle.Normal;
            var stRt = solutionText.GetComponent<RectTransform>();
            UIFactory.Fill(stRt);
            stRt.offsetMin = new Vector2(24f, 16f);
            stRt.offsetMax = new Vector2(-24f, -16f);
            gm.SolutionText = solutionText;

            gm.WinPanel = BuildOverlay(boardRt, "WinPanel", "Cleared!", Theme.LightText,
                new Color(0.929f, 0.761f, 0.180f, 0.60f), "Next Level >", gm.NextLevel, out var winInfo);
            gm.WinInfoText = winInfo;

            gm.LosePanel = BuildOverlay(boardRt, "LosePanel", "Stuck!", Theme.LightText,
                new Color(0.30f, 0.28f, 0.26f, 0.82f), "Retry", gm.RestartLevel, out _);

            gameObject.AddComponent<ScreenshotUtility>();

            gm.Setup(board);
        }

        Canvas BuildCanvas()
        {
            var go = new GameObject("Canvas");
            var canvas = go.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            var scaler = go.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(RefW, RefH);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 1f; // match height so nothing is clipped vertically on any aspect
            go.AddComponent<GraphicRaycaster>();
            return canvas;
        }

        static void EnsureEventSystem()
        {
            if (Object.FindFirstObjectByType<EventSystem>() != null) return;
            var es = new GameObject("EventSystem");
            es.AddComponent<EventSystem>();
            es.AddComponent<StandaloneInputModule>();
        }

        Text BuildStatBox(Transform parent, string caption, Vector2 pos)
        {
            var box = UIFactory.Panel(caption + "Box", parent, Theme.BoardBg);
            box.GetComponent<Image>().raycastTarget = false;
            UIFactory.Anchor(box.GetComponent<RectTransform>(),
                new Vector2(1f, 1f), new Vector2(1f, 1f), new Vector2(1f, 1f),
                pos, new Vector2(240f, 150f));

            var cap = UIFactory.Label("Caption", box.transform, _font, caption, 28, Theme.Caption, TextAnchor.UpperCenter);
            UIFactory.Anchor(cap.GetComponent<RectTransform>(),
                new Vector2(0f, 1f), new Vector2(1f, 1f), new Vector2(0.5f, 1f),
                new Vector2(0f, -16f), new Vector2(0f, 44f));

            var value = UIFactory.Label("Value", box.transform, _font, "0", 56, Theme.LightText, TextAnchor.LowerCenter);
            UIFactory.Anchor(value.GetComponent<RectTransform>(),
                new Vector2(0f, 0f), new Vector2(1f, 1f), new Vector2(0.5f, 0.5f),
                new Vector2(0f, -12f), Vector2.zero);
            return value;
        }

        GameObject BuildOverlay(RectTransform parent, string name, string message, Color msgColor,
                                Color bgColor, string buttonLabel, UnityAction onClick, out Text info)
        {
            var panel = UIFactory.Panel(name, parent, bgColor);
            UIFactory.Fill(panel.GetComponent<RectTransform>());

            var msg = UIFactory.Label("Message", panel.transform, _font, message, 120, msgColor);
            UIFactory.Anchor(msg.GetComponent<RectTransform>(),
                new Vector2(0f, 0.5f), new Vector2(1f, 0.9f), new Vector2(0.5f, 0.5f), Vector2.zero, Vector2.zero);

            info = UIFactory.Label("Info", panel.transform, _font, "", 40, msgColor);
            info.fontStyle = FontStyle.Normal;
            UIFactory.Anchor(info.GetComponent<RectTransform>(),
                new Vector2(0f, 0.32f), new Vector2(1f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, Vector2.zero);

            var btn = UIFactory.Button("Button", panel.transform, _font, buttonLabel, Theme.ButtonBg, Theme.LightText);
            UIFactory.Anchor(btn.GetComponent<RectTransform>(),
                new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0.5f, 0f),
                new Vector2(0f, 150f), new Vector2(360f, 110f));
            btn.onClick.AddListener(onClick);

            panel.SetActive(false);
            return panel;
        }
    }
}
