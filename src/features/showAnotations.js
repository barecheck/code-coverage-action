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

      // line=${line[0]}
      const message = `file=${file}::Lines ${formattedLines} are not covered with tests`;

      // eslint-disable-next-line no-console
      console.log(message);

      core.info(`::${showAnotationsInput} ${message}`);
    });
  }
};

module.exports = {
  showAnotations
};
