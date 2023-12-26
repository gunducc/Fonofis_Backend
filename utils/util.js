function removeExtension(filename) {
    return (
      filename.substring(0, filename.lastIndexOf('.')) || filename
    );
  }

  module.exports = removeExtension;