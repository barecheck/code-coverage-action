const fs = require("fs");

const lcov = require("../lcov");

const getCoverageFromFile = async (coverageFilePath) => {
  const fileRaw = fs.readFileSync(coverageFilePath, "utf8");

  if (!fileRaw) {
    throw new Error(
      `No coverage report found at '${coverageFilePath}', exiting...`
    );
  }
  const data = await lcov.parse(fileRaw);

  const percentage = lcov.percentage(data);

  return { data, percentage };
};

module.exports = {
  getCoverageFromFile
};
