const { assert } = require("chai");
const { mergeFileLinesWithChangedFiles } = require("../src/coverage");

describe("coverage", () => {
  describe("mergeFileLinesWithChangedFiles", () => {
    it("should return file lines along with sha", () => {
      const fileLines = [
        {
          file: "src/lcov.js",
          lines: [4, [6, 8], 10, [14, 15], 19]
        }
      ];
      const changedFiles = [
        {
          filename: "src/some-file.js",
          sha: "1-2-4"
        },
        {
          filename: "src/lcov.js",
          sha: "5-6-7"
        }
      ];

      const res = mergeFileLinesWithChangedFiles(fileLines, changedFiles);

      assert.deepEqual(res, [
        {
          file: "src/lcov.js",
          lines: [4, [6, 8], 10, [14, 15], 19],
          github: { sha: "5-6-7", filename: "src/lcov.js" }
        }
      ]);
    });
  });
});
