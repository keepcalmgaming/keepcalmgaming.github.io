using UnityEngine;
using UnityEngine.UI;

namespace Game2048
{
    /// <summary>Visual for one numbered tile: a colored square with centered text, plus slide and pop animation.</summary>
    public sealed class TileView : MonoBehaviour
    {
        RectTransform _rt;
        Image _bg;
        Text _text;

        public int Value { get; private set; }
        public RectTransform Rect => _rt;

        Vector2 _moveStart, _moveTarget;
        float _moveElapsed, _moveDuration;
        bool _moving;

        float _popFrom, _popTo, _popElapsed, _popDuration;
        bool _popping;

        float _popOutElapsed, _popOutDuration;
        bool _popOut;

        public void Init(RectTransform parent, float size, Font font)
        {
            _rt = GetComponent<RectTransform>();
            if (_rt == null) _rt = gameObject.AddComponent<RectTransform>();
            _rt.SetParent(parent, false);
            _rt.anchorMin = new Vector2(0f, 1f);
            _rt.anchorMax = new Vector2(0f, 1f);
            _rt.pivot = new Vector2(0.5f, 0.5f);
            _rt.sizeDelta = new Vector2(size, size);

            _bg = gameObject.AddComponent<Image>();
            _bg.raycastTarget = false;

            var textGo = new GameObject("Value");
            var trt = textGo.AddComponent<RectTransform>();
            trt.SetParent(_rt, false);
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
            _text = textGo.AddComponent<Text>();
            _text.font = font;
            _text.alignment = TextAnchor.MiddleCenter;
            _text.fontStyle = FontStyle.Bold;
            _text.horizontalOverflow = HorizontalWrapMode.Overflow;
            _text.verticalOverflow = VerticalWrapMode.Overflow;
            _text.raycastTarget = false;
        }

        public void SetValue(int value)
        {
            Value = value;
            _bg.color = Theme.TileColor(value);
            _text.color = Theme.TextColor(value);
            _text.text = value.ToString();

            int digits = _text.text.Length;
            float scale = digits <= 2 ? 0.5f : digits == 3 ? 0.38f : digits == 4 ? 0.30f : 0.24f;
            _text.fontSize = Mathf.RoundToInt(_rt.sizeDelta.x * scale);
        }

        public void SetAnchoredPosition(Vector2 pos)
        {
            _rt.anchoredPosition = pos;
            _moveTarget = pos;
            _moving = false;
        }

        public void MoveTo(Vector2 target, float duration)
        {
            if (duration <= 0f) { SetAnchoredPosition(target); return; }
            _moveStart = _rt.anchoredPosition;
            _moveTarget = target;
            _moveElapsed = 0f;
            _moveDuration = duration;
            _moving = true;
        }

        public void PopSpawn(float duration)
        {
            _popFrom = 0f; _popTo = 1f;
            _popElapsed = 0f; _popDuration = duration; _popping = true;
            _rt.localScale = Vector3.zero;
        }

        public void PopMerge(float duration)
        {
            _popFrom = 1.2f; _popTo = 1f;
            _popElapsed = 0f; _popDuration = duration; _popping = true;
            _rt.localScale = Vector3.one * _popFrom;
        }

        /// <summary>Shrink to nothing, then self-destruct (used when a Floor tile pops out).</summary>
        public void PopOut(float duration)
        {
            _popOut = true;
            _popOutElapsed = 0f;
            _popOutDuration = Mathf.Max(0.01f, duration);
            _popping = false;
        }

        void Update()
        {
            if (_moving)
            {
                _moveElapsed += Time.deltaTime;
                float t = Mathf.Clamp01(_moveElapsed / _moveDuration);
                float e = t * t * (3f - 2f * t); // smoothstep easing
                _rt.anchoredPosition = Vector2.LerpUnclamped(_moveStart, _moveTarget, e);
                if (t >= 1f) { _moving = false; _rt.anchoredPosition = _moveTarget; }
            }

            if (_popping)
            {
                _popElapsed += Time.deltaTime;
                float t = Mathf.Clamp01(_popElapsed / _popDuration);
                float s = Mathf.Lerp(_popFrom, _popTo, t);
                _rt.localScale = new Vector3(s, s, 1f);
                if (t >= 1f) { _popping = false; _rt.localScale = Vector3.one; }
            }

            if (_popOut)
            {
                _popOutElapsed += Time.deltaTime;
                float t = Mathf.Clamp01(_popOutElapsed / _popOutDuration);
                float s = Mathf.Lerp(1f, 0f, t);
                _rt.localScale = new Vector3(s, s, 1f);
                if (t >= 1f) { _popOut = false; Destroy(gameObject); }
            }
        }

        public void Remove() => Destroy(gameObject);
    }
}
