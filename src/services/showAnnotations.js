const core = require("@actions/core");
const github = require("@actions/github");

// const { githubApi } = require("barecheck");

const { getShowAnnotations } = require("../input");

const showAnnotations = async (coverageData) => {
  const showAnnotationsInput = getShowAnnotations();

  if (showAnnotationsInput && github.context.payload.pull_request) {
    core.info("Show annotations feature enabled");
    // TODO: show annotation only for changed files
    // const changedFiles = await githubApi.getChangedFiles();

    coverageData.forEach(({ file, lines }) => {
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

module.exports = showAnnotations;
