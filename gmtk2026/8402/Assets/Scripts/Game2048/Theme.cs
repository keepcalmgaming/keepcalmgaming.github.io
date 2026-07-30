using System.Collections.Generic;
using UnityEngine;

namespace Game2048
{
    /// <summary>
    /// Central palette for the classic 2048 look. Tweak these to re-skin the game
    /// (e.g. for the "Countdown" jam theme) without touching any layout code.
    /// </summary>
    public static class Theme
    {
        public static Color Hex(string html)
        {
            ColorUtility.TryParseHtmlString(html, out var c);
            return c;
        }

        public static readonly Color Background = Hex("#FAF8EF");
        public static readonly Color BoardBg    = Hex("#BBADA0");
        public static readonly Color EmptyCell   = Hex("#CDC1B4");
        public static readonly Color DarkText    = Hex("#776E65");
        public static readonly Color LightText   = Hex("#F9F6F2");
        public static readonly Color ButtonBg    = Hex("#8F7A66");
        public static readonly Color Caption     = Hex("#EEE4DA");

        static readonly Dictionary<int, Color> TileColors = new Dictionary<int, Color>
        {
            { 2,    Hex("#EEE4DA") },
            { 4,    Hex("#EDE0C8") },
            { 8,    Hex("#F2B179") },
            { 16,   Hex("#F59563") },
            { 32,   Hex("#F67C5F") },
            { 64,   Hex("#F65E3B") },
            { 128,  Hex("#EDCF72") },
            { 256,  Hex("#EDCC61") },
            { 512,  Hex("#EDC850") },
            { 1024, Hex("#EDC53F") },
            { 2048, Hex("#EDC22E") },
        };

        static readonly Color HighTile = Hex("#3C3A32");

        public static Color TileColor(int value)
        {
            return TileColors.TryGetValue(value, out var c) ? c : HighTile;
        }

        public static Color TextColor(int value)
        {
            return value <= 4 ? DarkText : LightText;
        }
    }
}
