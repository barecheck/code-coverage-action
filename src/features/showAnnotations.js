const core = require("@actions/core");
const getChangedFiles = require("../github/getChangedFiles");
const { uncoveredFileLinesByFileNames } = require("../lcov");
const { mergeFileLinesWithChangedFiles } = require("../coverage");
const { getShowAnnotations } = require("../input");

const showAnnotations = async (compareFileData) => {
  const showAnnotationsInput = getShowAnnotations();

  if (showAnnotationsInput) {
    core.info("Show annotations feature enabled");
    const changedFiles = await getChangedFiles();

    const uncoveredFileLines = uncoveredFileLinesByFileNames(
      changedFiles.map(({ filename }) => filename),
      compareFileData
    );

    const fileLinesWithChangedFiles = mergeFileLinesWithChangedFiles(
      uncoveredFileLines,
      changedFiles
    );

    fileLinesWithChangedFiles.forEach(({ file, lines }) => {
      const formattedLines = lines
        .map((line) => (Array.isArray(line) ? line.join("-") : line))
        .join(", ");

      const message = `file=${file}::${formattedLines} lines are not covered with tests`;

      // NOTE: consider an option to show lines directly by attaching 'line' param
      // Need to fix the issue where we consider 'empty line' as covered line
      // Empty lines should not interapt uncovered interval
      core.info(`::${showAnnotationsInput} ${message}`);
    });
  }
};

module.exports = {
  showAnnotations
};
