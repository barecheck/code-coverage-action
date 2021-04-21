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
      lines.forEach((line) => {
        const message = Array.isArray(line)
          ? `::${showAnotationsInput} file=${file},line=${line[0]}::Lines ${line[0]}-${line[1]} are not covered`
          : `::${showAnotationsInput} file=${file},line=${line}::Line ${line} is not covered`;

        core.info(message);
      });
    });
  }
};

module.exports = {
  showAnotations
};
