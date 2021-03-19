const mergeFileLinesWithChangedFiles = (uncoveredFileLines, changedFiles) =>
  uncoveredFileLines.map((fileLines) => {
    const github = changedFiles.find(
      ({ filename }) => filename === fileLines.file
    );
    return { ...fileLines, github };
  });

module.exports = { mergeFileLinesWithChangedFiles };
