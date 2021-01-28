const mergeFileLinesWithChangedFiles = (uncoveredFileLines, changedFiles) => {
  return uncoveredFileLines.map((fileLines) => {
    const { sha } = changedFiles.find(
      ({ filename }) => filename === fileLines.file
    );
    return { ...fileLines, sha };
  });
};

module.exports = { mergeFileLinesWithChangedFiles };
