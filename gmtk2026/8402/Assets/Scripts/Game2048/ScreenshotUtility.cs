using System;
using System.IO;
using UnityEngine;

namespace Game2048
{
    /// <summary>
    /// Press F12 to save a screenshot to the persistent data path. Also supports headless
    /// verification: launching the player with `-autoscreenshot [-screenshotPath ABS.png]`
    /// captures once after a short delay and quits.
    /// </summary>
    public sealed class ScreenshotUtility : MonoBehaviour
    {
        float _autoDelay = -1f;
        string _autoPath;
        float _elapsed;
        bool _fired;

        void Start()
        {
            var args = Environment.GetCommandLineArgs();
            for (int i = 0; i < args.Length; i++)
            {
                if (args[i] == "-autoscreenshot") _autoDelay = 1.5f;
                else if (args[i] == "-screenshotPath" && i + 1 < args.Length) _autoPath = args[i + 1];
            }
        }

        void Update()
        {
            if (Input.GetKeyDown(KeyCode.F12))
                Capture(DefaultPath());

            if (_autoDelay > 0f && !_fired)
            {
                _elapsed += Time.unscaledDeltaTime;
                if (_elapsed >= _autoDelay)
                {
                    _fired = true;
                    Capture(string.IsNullOrEmpty(_autoPath) ? DefaultPath() : _autoPath);
                    Invoke(nameof(QuitNow), 1.0f);
                }
            }
        }

        void QuitNow() => Application.Quit();

        static string DefaultPath()
        {
            string dir = Path.Combine(Application.persistentDataPath, "Screenshots");
            Directory.CreateDirectory(dir);
            return Path.Combine(dir, $"2048_{DateTime.Now:yyyyMMdd_HHmmss}.png");
        }

        static void Capture(string path)
        {
            ScreenCapture.CaptureScreenshot(path);
            Debug.Log($"[2048] Screenshot -> {path}");
        }
    }
}
