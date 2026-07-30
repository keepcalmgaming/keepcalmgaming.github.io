using UnityEngine;
using UnityEngine.UI;

namespace Game2048
{
    /// <summary>Small helpers for building uGUI elements entirely from code.</summary>
    public static class UIFactory
    {
        public static Font DefaultFont()
        {
            var f = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            if (f == null) f = Font.CreateDynamicFontFromOSFont("Arial", 16);
            return f;
        }

        /// <summary>Sets anchors, pivot, size and position in one call (for non-stretched rects).</summary>
        public static void Anchor(RectTransform rt, Vector2 min, Vector2 max, Vector2 pivot, Vector2 pos, Vector2 size)
        {
            rt.anchorMin = min;
            rt.anchorMax = max;
            rt.pivot = pivot;
            rt.sizeDelta = size;
            rt.anchoredPosition = pos;
        }

        public static void Fill(RectTransform rt)
        {
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;
        }

        public static GameObject Panel(string name, Transform parent, Color color)
        {
            var go = new GameObject(name);
            go.AddComponent<RectTransform>().SetParent(parent, false);
            var img = go.AddComponent<Image>();
            img.color = color;
            return go;
        }

        public static Text Label(string name, Transform parent, Font font, string text, int fontSize,
                                 Color color, TextAnchor anchor = TextAnchor.MiddleCenter)
        {
            var go = new GameObject(name);
            go.AddComponent<RectTransform>().SetParent(parent, false);
            var t = go.AddComponent<Text>();
            t.font = font;
            t.text = text;
            t.fontSize = fontSize;
            t.color = color;
            t.alignment = anchor;
            t.fontStyle = FontStyle.Bold;
            t.horizontalOverflow = HorizontalWrapMode.Wrap;
            t.verticalOverflow = VerticalWrapMode.Overflow;
            t.raycastTarget = false;
            return t;
        }

        public static Button Button(string name, Transform parent, Font font, string label, Color bg, Color fg)
        {
            var go = new GameObject(name);
            go.AddComponent<RectTransform>().SetParent(parent, false);
            var img = go.AddComponent<Image>();
            img.color = bg;
            var btn = go.AddComponent<Button>();

            var text = Label("Label", go.transform, font, label, 40, fg);
            Fill(text.GetComponent<RectTransform>());
            return btn;
        }
    }
}
