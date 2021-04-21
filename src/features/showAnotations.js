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

    // eslint-disable-next-line no-console
    console.log(changedFiles);

    const uncoveredFileLines = uncoveredFileLinesByFileNames(
      changedFiles.map(({ filename }) => filename),
      compareFileData
    );

    const fileLinesWithChangedFiles = mergeFileLinesWithChangedFiles(
      uncoveredFileLines,
      changedFiles
    );
    fileLinesWithChangedFiles.forEach((element) => {
      // eslint-disable-next-line no-console
      console.log(element);
    });
  }
};

module.exports = {
  showAnotations
};
