using System.IO;
using System.Text;
using Game2048;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace Game2048Editor
{
    /// <summary>
    /// Editor-only utilities invoked from the command line via -executeMethod:
    /// runs headless self-tests on the pure game logic and (re)generates the playable scene.
    /// </summary>
    public static class BuildTools
    {
        // Entry point: Unity -batchmode -executeMethod Game2048Editor.BuildTools.SetupAndTest -quit
        public static void SetupAndTest()
        {
            int failures = RunLogicTests();
            BuildScene();
            AssetDatabase.SaveAssets();

            if (failures > 0)
            {
                Debug.LogError($"[2048] Self-tests FAILED ({failures} case(s)).");
                EditorApplication.Exit(2);
            }
            else
            {
                Debug.Log("[2048] Self-tests PASSED. Scene generated at Assets/Scenes/Game.unity.");
            }
        }

        [MenuItem("2048/Rebuild Scene")]
        public static void BuildScene()
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);

            var game = new GameObject("Game");
            game.AddComponent<GameBootstrap>();

            Directory.CreateDirectory("Assets/Scenes");
            EditorSceneManager.SaveScene(scene, "Assets/Scenes/Game.unity");

            EditorBuildSettings.scenes = new[]
            {
                new EditorBuildSettingsScene("Assets/Scenes/Game.unity", true)
            };
        }

        // Builds a standalone macOS player: Unity -batchmode -executeMethod Game2048Editor.BuildTools.BuildMac -quit
        public static void BuildMac()
        {
            BuildScene();
            Directory.CreateDirectory("Build/Mac");
            var opts = new BuildPlayerOptions
            {
                scenes = new[] { "Assets/Scenes/Game.unity" },
                locationPathName = "Build/Mac/2048.app",
                target = BuildTarget.StandaloneOSX,
                options = BuildOptions.None
            };
            var report = BuildPipeline.BuildPlayer(opts);
            var summary = report.summary;
            Debug.Log($"[2048] Mac build result: {summary.result}, output: {summary.outputPath}");
            if (summary.result != UnityEditor.Build.Reporting.BuildResult.Succeeded)
                EditorApplication.Exit(3);
        }

        // ---- Headless logic tests -------------------------------------------------

        static int RunLogicTests()
        {
            int fail = 0;
            var log = new StringBuilder("[Reversed2048] Logic tests:\n");

            fail += Check(log, "moving tile splits at the wall (left)",
                new[,] { { 0, 0, 0, 8 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } },
                MoveDirection.Left,
                new[,] { { 4, 4, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } }, true);

            fail += Check(log, "only the wall-most moving tile splits (left)",
                new[,] { { 0, 0, 4, 8 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } },
                MoveDirection.Left,
                new[,] { { 2, 2, 8, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } }, true);

            fail += Check(log, "wall-aligned tile does NOT split -> no-op (left)",
                new[,] { { 4, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } },
                MoveDirection.Left,
                new[,] { { 4, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } }, false);

            fail += Check(log, "wall-aligned 2 does NOT pop (must move to act) (left)",
                new[,] { { 2, 4, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } },
                MoveDirection.Left,
                new[,] { { 2, 4, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } }, false);

            fail += Check(log, "a moving 2 pops; its neighbor splits (left)",
                new[,] { { 0, 2, 4, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } },
                MoveDirection.Left,
                new[,] { { 2, 2, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } }, true);

            fail += Check(log, "slide then single split (left)",
                new[,] { { 0, 8, 0, 4 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } },
                MoveDirection.Left,
                new[,] { { 4, 4, 4, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } }, true);

            fail += Check(log, "full packed line is inert (left)",
                new[,] { { 4, 8, 16, 32 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } },
                MoveDirection.Left,
                new[,] { { 4, 8, 16, 32 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } }, false);

            fail += Check(log, "single split up a column",
                new[,] { { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 4, 0, 0, 0 }, { 8, 0, 0, 0 } },
                MoveDirection.Up,
                new[,] { { 2, 0, 0, 0 }, { 2, 0, 0, 0 }, { 8, 0, 0, 0 }, { 0, 0, 0, 0 } }, true);

            fail += Check(log, "single split down a column",
                new[,] { { 0, 0, 0, 4 }, { 0, 0, 0, 8 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } },
                MoveDirection.Down,
                new[,] { { 0, 0, 0, 0 }, { 0, 0, 0, 4 }, { 0, 0, 0, 4 }, { 0, 0, 0, 4 } }, true);

            fail += Check(log, "two lines act at once: split + pop (left)",
                new[,] { { 0, 0, 0, 4 }, { 0, 0, 2, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } },
                MoveDirection.Left,
                new[,] { { 2, 2, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } }, true);

            fail += Check(log, "only one 2 pops per line; rest slide (left)",
                new[,] { { 0, 2, 2, 2 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } },
                MoveDirection.Left,
                new[,] { { 2, 2, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } }, true);

            log.Append(fail == 0 ? "  ALL PASSED" : $"  {fail} FAILED");
            Debug.Log(log.ToString());
            return fail;
        }

        static int Check(StringBuilder log, string name, int[,] start, MoveDirection dir,
                         int[,] expected, bool expectedMoved)
        {
            var grid = new Grid2048(4, seed: 1);
            grid.LoadState(start);
            var result = grid.Move(dir);

            bool ok = result.Moved == expectedMoved;
            for (int r = 0; r < 4 && ok; r++)
                for (int c = 0; c < 4 && ok; c++)
                    if (grid.Get(r, c) != expected[r, c]) ok = false;

            log.AppendLine(ok
                ? $"  [PASS] {name}"
                : $"  [FAIL] {name} (moved={result.Moved} exp {expectedMoved}, board mismatch possible)");
            return ok ? 0 : 1;
        }
    }
}
