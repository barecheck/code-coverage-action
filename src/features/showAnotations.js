const core = require("@actions/core");
const getChangedFiles = require("../github/getChangedFiles");
const { uncoveredFileLinesByFileNames } = require("../lcov");
const { mergeFileLinesWithChangedFiles } = require("../coverage");
const { getShowAnotations } = require("../input");

const showAnotations = async (compareFileData) => {
  const showAnotationsInput = getShowAnotations();

  if (showAnotationsInput) {
    core.info("Show anotations feature enabled");
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

      // TODO: compare lines that added in this PR to be sure we not mentioning old ones
      const message = `file=${file}::${formattedLines} lines are not covered with tests`;

      // NOTE: consider an option to show lines directly by attaching 'line' param
      // Need to fix the issue where we consider 'empty line' as covered line
      // Empty lines should not interapt uncovered interval
      core.info(`::${showAnotationsInput} ${message}`);
    });
  }
};

module.exports = {
  showAnotations
};
