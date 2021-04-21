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

    // eslint-disable-next-line no-console
    console.log(fileLinesWithChangedFiles);

    fileLinesWithChangedFiles.forEach(({ file, lines }) => {
      lines.forEach((line) => {
        const message = Array.isArray(line)
          ? `file=${file},line=${line[0]}::Lines ${line[0]}-${line[1]} are not covered with tests`
          : `file=${file},line=${line}::Line ${line} is not covered with tests`;
        console.log(message);

        core.info(`::${showAnotationsInput} ${message}`);
      });
    });
  }
};

module.exports = {
  showAnotations
};
