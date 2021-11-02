const core = require("@actions/core");
const github = require("@actions/github");

const getChangedFiles = require("../github/getChangedFiles");
const { uncoveredFileLinesByFileNames } = require("../lcov");
const { mergeFileLinesWithChangedFiles } = require("../coverage");
const { getShowAnnotations } = require("../input");

const showAnnotations = async (compareFileData) => {
  const showAnnotationsInput = getShowAnnotations();

  if (showAnnotationsInput && github.context.payload.pull_request) {
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
      lines.forEach((line) => {
        const message = () => {
          if (Array.isArray(line)) {
            return `file=${file},line=${line[0]},endLine=${
              line[line.length - 1]
            }::${line.join("-")} lines are not covered with tests`;
          }
          return `file=${file},line=${line}::${line} line is not covered with tests`;
        };
        // NOTE: consider an option to show lines directly by attaching 'line' param
        // Need to fix the issue where we consider 'empty line' as covered line
        // Empty lines should not interapt uncovered interval
        core.info(`::${showAnnotationsInput} ${message()}`);
      });
    });
  }
};

module.exports = {
  showAnnotations
};
