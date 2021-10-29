const fs = require("fs");

const lcov = require("../lcov");

const getCoverageFromFile = async (coverageFile) => {
  const fileRaw = fs.readFileSync(coverageFile, "utf8");

  if (!fileRaw) {
    throw new Error(
      `No coverage report found at '${coverageFile}', exiting...`
    );
  }
  const data = await lcov.parse(fileRaw);

  const percentage = lcov.percentage(data);

  return { data, percentage };
};

module.exports = {
  getCoverageFromFile
};
